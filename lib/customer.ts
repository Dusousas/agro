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
            coalesce(s.delivery_day, '') as delivery_day,
            coalesce(s.delivery_window, '') as delivery_window,
            coalesce(s.basket_profile, '') as basket_profile
        from customers c
        left join subscriptions s on s.customer_id = c.id
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
    };
}

export async function saveCustomerOnboarding(email: string, payload: Omit<CustomerOnboardingData, 'email' | 'complete'>) {
    if (!email || !isDatabaseConfigured()) return;

    const db = getDb();

    const customerResult = await db.query(
        `
        update customers
        set
            name = $2,
            city = $3,
            address_line = $4,
            address_reference = $5
        where email = $1
        returning id
        `,
        [email, payload.name, payload.city, payload.addressLine, payload.addressReference]
    );

    const customerId = customerResult.rows[0]?.id;
    if (!customerId) return;

    const existingSubscription = await db.query(
        `select id from subscriptions where customer_id = $1 order by id desc limit 1`,
        [customerId]
    );

    let subscriptionId = existingSubscription.rows[0]?.id;

    if (!subscriptionId) {
        const defaultPlan = await db.query(`select id from plans where active = true order by monthly_price asc limit 1`);
        const planId = defaultPlan.rows[0]?.id;

        if (planId) {
            const insertSubscription = await db.query(
                `
                insert into subscriptions (customer_id, plan_id, status, basket_profile, delivery_day, delivery_window, next_delivery_date)
                values ($1, $2, 'Ativa', $3, $4, $5, current_date + interval '7 day')
                returning id
                `,
                [customerId, planId, payload.basketProfile, payload.deliveryDay, payload.deliveryWindow]
            );

            subscriptionId = insertSubscription.rows[0]?.id;
        }
    } else {
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
