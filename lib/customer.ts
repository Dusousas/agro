import { getDb, isDatabaseConfigured } from './db';

export type CustomerOnboardingData = {
    name: string;
    email: string;
    city: string;
    addressLine: string;
    addressReference: string;
    deliveryDay: string;
    deliveryWindow: string;
    basketProfile: string;
    complete: boolean;
    hasSubscription: boolean;
    selectedPlanName?: string;
};

export type SubscriptionPlanOption = {
    id: number;
    slug: string;
    name: string;
    monthlyPrice: number;
    weeklyPrice: number;
    description: string;
    badge: string;
    items: string[];
};

type PersistedPlanInput = {
    slug: string;
    name: string;
    monthlyPrice: number;
    description: string;
};

export type CustomerDashboardUpdateInput = {
    city: string;
    addressLine: string;
    addressReference: string;
    deliveryDay: string;
    deliveryWindow: string;
    basketProfile: string;
};

export async function getCustomerByEmail(email: string): Promise<CustomerOnboardingData | null> {
    if (!email || !isDatabaseConfigured()) return null;

    const db = getDb();
    const result = await db.query(
        `
        select
            c.name,
            c.email,
            coalesce(c.city, '') as city,
            coalesce(c.address_line, '') as address_line,
            coalesce(c.address_reference, '') as address_reference,
            coalesce(c.delivery_day, '') as delivery_day,
            coalesce(c.delivery_window, '') as delivery_window,
            coalesce(c.basket_profile, '') as basket_profile,
            s.id as subscription_id,
            p.name as plan_name
        from customers c
        left join subscriptions s on s.customer_id = c.id
        left join plans p on p.id = s.plan_id
        where c.email = $1
        order by s.id desc nulls last
        limit 1
        `,
        [email]
    );

    if (!result.rows.length) return null;

    const row = result.rows[0];

    return {
        name: row.name ?? '',
        email: row.email ?? email,
        city: row.city,
        addressLine: row.address_line,
        addressReference: row.address_reference,
        deliveryDay: row.delivery_day,
        deliveryWindow: row.delivery_window,
        basketProfile: row.basket_profile,
        complete: Boolean(row.city && row.address_line && row.delivery_day && row.delivery_window && row.basket_profile),
        hasSubscription: Boolean(row.subscription_id),
        selectedPlanName: row.plan_name ?? '',
    };
}

export async function saveCustomerOnboarding(email: string, payload: Omit<CustomerOnboardingData, 'email' | 'complete' | 'hasSubscription' | 'selectedPlanName'>) {
    if (!email || !isDatabaseConfigured()) return;

    const db = getDb();

    const customerResult = await db.query(
        `
        update customers
        set
            name = $2,
            city = $3,
            address_line = $4,
            address_reference = $5,
            delivery_day = $6,
            delivery_window = $7,
            basket_profile = $8
        where email = $1
        returning id
        `,
        [
            email,
            payload.name,
            payload.city,
            payload.addressLine,
            payload.addressReference,
            payload.deliveryDay,
            payload.deliveryWindow,
            payload.basketProfile,
        ]
    );

    const customerId = customerResult.rows[0]?.id;
    if (!customerId) return;

    const existingSubscription = await db.query(
        `select id from subscriptions where customer_id = $1 order by id desc limit 1`,
        [customerId]
    );

    const subscriptionId = existingSubscription.rows[0]?.id;

    if (subscriptionId) {
        await db.query(
            `
            update subscriptions
            set
                basket_profile = $2,
                delivery_day = $3,
                delivery_window = $4
            where id = $1
            `,
            [subscriptionId, payload.basketProfile, payload.deliveryDay, payload.deliveryWindow]
        );
    }
}

export async function getActivePlans(): Promise<SubscriptionPlanOption[]> {
    if (!isDatabaseConfigured()) return getDefaultPlans();

    const db = getDb();
    const result = await db.query(
        `
        select id, slug, name, monthly_price, description
        from plans
        where active = true
        order by monthly_price asc, id asc
        `
    );

    if (!result.rows.length) {
        return getDefaultPlans();
    }

    return result.rows.slice(0, 3).map((row, index) => ({
        id: row.id,
        slug: row.slug ?? `plano-${row.id}`,
        name: row.name,
        monthlyPrice: Number(row.monthly_price ?? 0),
        weeklyPrice: Number((Number(row.monthly_price ?? 0) / 4).toFixed(2)),
        description: row.description,
        badge: index === 0 ? 'Entrada mais leve' : index === 1 ? 'Mais escolhido' : 'Plano mais completo',
        items: getPlanItemsByName(row.name),
    }));
}

export async function saveCustomerPlan(email: string, planInput: PersistedPlanInput) {
    if (!email || !planInput.slug || !isDatabaseConfigured()) return false;

    const db = getDb();

    let planId: number | undefined;

    const existingPlanResult = await db.query(
        `
        select id
        from plans
        where slug = $1
        limit 1
        `,
        [planInput.slug]
    );

    if (existingPlanResult.rows.length) {
        planId = existingPlanResult.rows[0]?.id;

        await db.query(
            `
            update plans
            set
                name = $2,
                monthly_price = $3,
                description = $4,
                active = true
            where id = $1
            `,
            [planId, planInput.name, planInput.monthlyPrice, planInput.description]
        );
    } else {
        const insertPlanResult = await db.query(
            `
            insert into plans (slug, name, monthly_price, description, active)
            values ($1, $2, $3, $4, true)
            returning id
            `,
            [planInput.slug, planInput.name, planInput.monthlyPrice, planInput.description]
        );

        planId = insertPlanResult.rows[0]?.id;
    }

    if (!planId) return false;

    const customerResult = await db.query(
        `
        select id, delivery_day, delivery_window, basket_profile
        from customers
        where email = $1
        limit 1
        `,
        [email]
    );

    const customer = customerResult.rows[0];
    const customerId = customer?.id;
    if (!customerId) return false;

    const preferenceResult = await db.query(
        `
        select id
        from subscriptions
        where customer_id = $1
        order by id desc
        limit 1
        `,
        [customerId]
    );

    let subscriptionId = preferenceResult.rows[0]?.id;

    if (subscriptionId) {
        await db.query(
            `
            update subscriptions
            set
                plan_id = $2,
                status = 'Ativa',
                next_delivery_date = current_date + interval '7 day'
            where id = $1
            `,
            [subscriptionId, planId]
        );
    } else {
        const insertResult = await db.query(
            `
            insert into subscriptions (customer_id, plan_id, status, basket_profile, delivery_day, delivery_window, next_delivery_date)
            values ($1, $2, 'Ativa', $3, $4, $5, current_date + interval '7 day')
            returning id
            `,
            [
                customerId,
                planId,
                customer.basket_profile || 'Selecao da estacao',
                customer.delivery_day || 'Segunda-feira',
                customer.delivery_window || '8h as 12h',
            ]
        );

        subscriptionId = insertResult.rows[0]?.id;
    }

    if (!subscriptionId) return false;

    await db.query(
        `
        update subscriptions
        set
            basket_profile = $2,
            delivery_day = $3,
            delivery_window = $4
        where id = $1
        `,
        [
            subscriptionId,
            customer.basket_profile || 'Selecao da estacao',
            customer.delivery_day || 'Segunda-feira',
            customer.delivery_window || '8h as 12h',
        ]
    );

    const planResult = await db.query(
        `
        select name, monthly_price
        from plans
        where id = $1
        limit 1
        `,
        [planId]
    );

    const plan = planResult.rows[0];

    await db.query(`delete from subscription_items where subscription_id = $1`, [subscriptionId]);

    const items = getPlanItemsByName(plan?.name);
    for (let index = 0; index < items.length; index += 1) {
        await db.query(
            `
            insert into subscription_items (subscription_id, item_name, sort_order)
            values ($1, $2, $3)
            `,
            [subscriptionId, items[index], index + 1]
        );
    }

    const paymentCheck = await db.query(
        `
        select id
        from payments
        where subscription_id = $1
          and reference_month = to_char(current_date, 'TMMonth')
        limit 1
        `,
        [subscriptionId]
    );

    if (!paymentCheck.rows.length) {
        await db.query(
            `
            insert into payments (subscription_id, reference_month, amount, method, status, due_date, paid_at)
            values ($1, to_char(current_date, 'TMMonth'), $2, 'Cartao', 'Pago', current_date, now())
            `,
            [subscriptionId, Number(plan?.monthly_price ?? 0)]
        );
    }

    return true;
}

export async function updateCustomerDashboardProfile(email: string, payload: CustomerDashboardUpdateInput) {
    if (!email || !isDatabaseConfigured()) return false;

    const db = getDb();

    const customerResult = await db.query(
        `
        update customers
        set
            city = $2,
            address_line = $3,
            address_reference = $4,
            delivery_day = $5,
            delivery_window = $6,
            basket_profile = $7
        where email = $1
        returning id
        `,
        [
            email,
            payload.city,
            payload.addressLine,
            payload.addressReference,
            payload.deliveryDay,
            payload.deliveryWindow,
            payload.basketProfile,
        ]
    );

    const customerId = customerResult.rows[0]?.id;
    if (!customerId) return false;

    await db.query(
        `
        update subscriptions
        set
            basket_profile = $2,
            delivery_day = $3,
            delivery_window = $4
        where customer_id = $1
        `,
        [customerId, payload.basketProfile, payload.deliveryDay, payload.deliveryWindow]
    );

    return true;
}

function getPlanItemsByName(planName?: string): string[] {
    if ((planName ?? '').toLowerCase().includes('broto')) {
        return ['Alface crespa', 'Rucula', 'Tomate', 'Cheiro-verde'];
    }

    if ((planName ?? '').toLowerCase().includes('colheita')) {
        return ['Alface crespa', 'Rucula', 'Couve', 'Tomate', 'Cenoura', 'Cheiro-verde'];
    }

    return ['Alface americana', 'Rucula', 'Couve', 'Brocolis', 'Tomate', 'Cenoura', 'Beterraba', 'Cheiro-verde'];
}

function getDefaultPlans(): SubscriptionPlanOption[] {
    return [
        {
            id: 1,
            slug: 'cesta-broto',
            name: 'Cesta Broto',
            monthlyPrice: 143.64,
            weeklyPrice: 35.91,
            description: 'Plano leve para quem quer comecar com uma selecao pratica de hortalias frescas toda semana.',
            badge: 'Entrada mais leve',
            items: ['Alface crespa', 'Rucula', 'Tomate', 'Cheiro-verde'],
        },
        {
            id: 2,
            slug: 'cesta-colheita',
            name: 'Cesta Colheita',
            monthlyPrice: 215.64,
            weeklyPrice: 53.91,
            description: 'Plano mais equilibrado para casas que cozinham com frequencia e querem variedade na semana.',
            badge: 'Mais escolhido',
            items: ['Alface crespa', 'Rucula', 'Couve', 'Tomate', 'Cenoura', 'Cheiro-verde'],
        },
        {
            id: 3,
            slug: 'cesta-santa-cruz',
            name: 'Cesta Santa Cruz',
            monthlyPrice: 305.64,
            weeklyPrice: 76.41,
            description: 'Plano mais completo, com volume reforcado e selecao especial para abastecer melhor a rotina.',
            badge: 'Plano mais completo',
            items: ['Alface americana', 'Rucula', 'Couve', 'Brocolis', 'Tomate', 'Cenoura', 'Beterraba', 'Cheiro-verde'],
        },
    ];
}
