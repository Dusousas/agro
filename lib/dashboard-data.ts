import { adminDashboardMock, customerDashboardMock } from './mock-data';
import { getDb, isDatabaseConfigured } from './db';
import { AdminDashboardData, CustomerDashboardData } from './types';

function formatMoney(value: number | string | null | undefined) {
    const amount = Number(value ?? 0);
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(amount);
}

export async function getCustomerDashboardData(email?: string): Promise<CustomerDashboardData> {
    if (!isDatabaseConfigured()) {
        return customerDashboardMock;
    }

    try {
        const db = getDb();

        const plansResult = await db.query(`
            select id, slug, name, monthly_price, description, active
            from plans
            where active = true
            order by monthly_price asc
        `);

        const subscriptionResult = await db.query(`
            select
                s.id,
                s.status,
                coalesce(s.delivery_status, 'Pendente') as delivery_status,
                s.next_delivery_date,
                s.delivery_window,
                s.delivery_day,
                s.basket_profile,
                c.id as customer_id,
                c.name,
                c.city,
                c.address_line,
                c.address_reference,
                c.created_at,
                p.name as plan_name
            from subscriptions s
            join customers c on c.id = s.customer_id
            join plans p on p.id = s.plan_id
            where ($1::text is null or c.email = $1)
            order by s.created_at desc
            limit 1
        `, [email ?? null]);

        if (!subscriptionResult.rows.length) {
            return customerDashboardMock;
        }

        const subscription = subscriptionResult.rows[0];

        const itemsResult = await db.query(`
            select item_name
            from subscription_items
            where subscription_id = $1
            order by sort_order asc, id asc
        `, [subscription.id]);

        const paymentsResult = await db.query(`
            select reference_month, status, amount, method, due_date
            from payments
            where subscription_id = $1
            order by due_date desc nulls last, id desc
            limit 4
        `, [subscription.id]);

        const couponResult = await db.query(`
            select code, discount_text
            from coupons
            where status = 'Ativo'
            order by id asc
            limit 1
        `);

        return {
            availablePlans: plansResult.rows.map((row) => ({
                id: row.id,
                slug: row.slug ?? '',
                name: row.name,
                monthlyPriceValue: Number(row.monthly_price ?? 0),
                monthlyPrice: formatMoney(row.monthly_price),
                description: row.description,
                active: Boolean(row.active),
            })),
            selectedPlanName: subscription.plan_name,
            nextBasket: itemsResult.rows.length
                ? itemsResult.rows.map((row) => row.item_name)
                : customerDashboardMock.nextBasket,
            paymentHistory: paymentsResult.rows.length
                ? paymentsResult.rows.map((row) => ({
                    month: row.reference_month,
                    status: row.status,
                    amount: formatMoney(row.amount),
                    method: row.method,
                }))
                : customerDashboardMock.paymentHistory,
            appliedCoupon: couponResult.rows[0]
                ? {
                    code: couponResult.rows[0].code,
                    description: couponResult.rows[0].discount_text ?? 'Cupom ativo no sistema.',
                }
                : customerDashboardMock.appliedCoupon,
            customer: {
                name: subscription.name,
                city: subscription.city ?? 'Brotas - SP',
                addressLine: subscription.address_line ?? customerDashboardMock.customer.addressLine,
                addressReference: subscription.address_reference ?? customerDashboardMock.customer.addressReference,
            },
            subscription: {
                status: subscription.status ?? customerDashboardMock.subscription.status,
                deliveryStatus: subscription.delivery_status ?? customerDashboardMock.subscription.deliveryStatus,
                nextDeliveryDate: subscription.next_delivery_date
                    ? new Date(subscription.next_delivery_date).toLocaleDateString('pt-BR')
                    : customerDashboardMock.subscription.nextDeliveryDate,
                deliveryWindow: subscription.delivery_window ?? customerDashboardMock.subscription.deliveryWindow,
                deliveryDay: subscription.delivery_day ?? customerDashboardMock.subscription.deliveryDay,
                basketProfile: subscription.basket_profile ?? customerDashboardMock.subscription.basketProfile,
            },
            paymentSummary: {
                latestStatus: paymentsResult.rows[0]?.status ?? customerDashboardMock.paymentSummary.latestStatus,
                latestAmount: paymentsResult.rows[0] ? formatMoney(paymentsResult.rows[0].amount) : customerDashboardMock.paymentSummary.latestAmount,
                latestMethod: paymentsResult.rows[0]?.method ?? customerDashboardMock.paymentSummary.latestMethod,
                nextDueDate: paymentsResult.rows[0]?.due_date
                    ? new Date(paymentsResult.rows[0].due_date).toLocaleDateString('pt-BR')
                    : customerDashboardMock.paymentSummary.nextDueDate,
                openPayments: paymentsResult.rows.filter((row) => row.status !== 'Pago').length,
            },
            customerSummary: {
                since: subscription.created_at
                    ? new Date(subscription.created_at).toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' }).replace('/', '/')
                    : customerDashboardMock.customerSummary.since,
                deliveriesCompleted: `${paymentsResult.rows.filter((row) => row.status === 'Pago').length} entregas registradas`,
                lastUpdate: new Date().toLocaleDateString('pt-BR'),
            },
        };
    } catch {
        return customerDashboardMock;
    }
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
    if (!isDatabaseConfigured()) {
        return adminDashboardMock;
    }

    try {
        const db = getDb();

        await db.query(`alter table subscriptions add column if not exists delivery_status text not null default 'Pendente'`);
        await db.query(`alter table subscriptions add column if not exists last_delivery_update timestamptz`);

        await db.query(`alter table plans add column if not exists badge text`);
        await db.query(`
            create table if not exists plan_items (
                id serial primary key,
                plan_id integer not null references plans(id) on delete cascade,
                item_name text not null,
                sort_order integer not null default 0
            )
        `);

        const [clientsResult, plansResult, couponsResult, financeResult, deliveriesResult, planItemsResult] = await Promise.all([
            db.query(`
                select
                    c.id,
                    c.name,
                    c.email,
                    c.city,
                    c.address_line,
                    c.address_reference,
                    p.name as plan,
                    s.status,
                    coalesce(s.delivery_day, c.delivery_day, '') as delivery_day,
                    coalesce(s.delivery_window, c.delivery_window, '') as delivery_window,
                    coalesce(s.basket_profile, c.basket_profile, '') as basket_profile,
                    s.next_delivery_date,
                    (
                        select py.status
                        from payments py
                        where py.subscription_id = s.id
                        order by py.due_date desc nulls last, py.id desc
                        limit 1
                    ) as payment_status
                from customers c
                left join subscriptions s on s.customer_id = c.id
                left join plans p on p.id = s.plan_id
                where coalesce(c.is_admin, false) = false
                order by c.id desc
                limit 20
            `),
            db.query(`
                select p.id, p.slug, p.name, p.badge, p.monthly_price, p.description,
                    count(s.id) as subscribers,
                    count(*) filter (where s.next_delivery_date = current_date) as renewals
                from plans p
                left join subscriptions s on s.plan_id = p.id
                left join customers c on c.id = s.customer_id
                where c.id is null or coalesce(c.is_admin, false) = false
                group by p.id
                order by p.monthly_price asc
            `),
            db.query(`
                select id, code, status, usage_count, discount_text
                from coupons
                order by id desc
                limit 10
            `),
            db.query(`
                select
                    coalesce(sum(case when py.status = 'Pago' then py.amount end), 0) as confirmed_revenue,
                    coalesce(sum(case when py.status <> 'Pago' then py.amount end), 0) as pending_revenue,
                    coalesce(avg(py.amount), 0) as average_ticket
                from payments py
                join subscriptions s on s.id = py.subscription_id
                join customers c on c.id = s.customer_id
                where coalesce(c.is_admin, false) = false
            `),
            db.query(`
                select
                    s.id,
                    c.name,
                    c.email,
                    coalesce(c.city, 'Brotas') as city,
                    coalesce(c.address_line, '') as address_line,
                    coalesce(c.address_reference, '') as address_reference,
                    p.name as plan_name,
                    coalesce(s.basket_profile, c.basket_profile, 'Selecao da estacao') as basket_profile,
                    s.next_delivery_date,
                    coalesce(s.delivery_window, c.delivery_window, '8h as 12h') as delivery_window,
                    coalesce(s.delivery_day, c.delivery_day, 'Segunda-feira') as delivery_day,
                    coalesce(s.delivery_status, 'Pendente') as delivery_status
                from subscriptions s
                join customers c on c.id = s.customer_id
                join plans p on p.id = s.plan_id
                where coalesce(c.is_admin, false) = false
                  and s.next_delivery_date is not null
                order by s.next_delivery_date asc, c.name asc
                limit 100
            `),
            db.query(`
                select plan_id, item_name
                from plan_items
                order by sort_order asc, id asc
            `),
        ]);

        const registeredClients = clientsResult.rows.length
            ? clientsResult.rows.map((row) => ({
                id: row.id,
                name: row.name,
                email: row.email,
                plan: row.plan ?? 'Sem plano',
                status: row.status ?? 'Pendente',
                city: row.city ?? 'Brotas',
                addressLine: row.address_line ?? '',
                addressReference: row.address_reference ?? '',
                deliveryDay: row.delivery_day ?? '',
                deliveryWindow: row.delivery_window ?? '',
                basketProfile: row.basket_profile ?? '',
                nextDeliveryDate: row.next_delivery_date
                    ? new Date(row.next_delivery_date).toLocaleDateString('pt-BR')
                    : '',
                paymentStatus: row.payment_status ?? 'Sem registro',
            }))
            : adminDashboardMock.registeredClients;

        const financeRows = [
            { label: 'Receita confirmada do mês', value: formatMoney(financeResult.rows[0]?.confirmed_revenue) },
            { label: 'Pagamentos pendentes', value: formatMoney(financeResult.rows[0]?.pending_revenue) },
            { label: 'Ticket médio', value: formatMoney(financeResult.rows[0]?.average_ticket) },
        ];

        const couponRows = couponsResult.rows.length
            ? couponsResult.rows.map((row) => ({
                id: row.id,
                code: row.code,
                status: row.status,
                usageCount: Number(row.usage_count ?? 0),
                usage: `${row.usage_count ?? 0} usos`,
                discount: row.discount_text ?? 'Desconto',
            }))
            : adminDashboardMock.couponRows;

        const planItemsMap = new Map<number, string[]>();
        for (const row of planItemsResult.rows) {
            const items = planItemsMap.get(row.plan_id) ?? [];
            items.push(row.item_name);
            planItemsMap.set(row.plan_id, items);
        }

        const subscriptionRows = plansResult.rows.length
            ? plansResult.rows.map((row) => ({
                id: row.id,
                slug: row.slug ?? '',
                plan: row.name,
                badge: row.badge ?? '',
                monthlyPriceValue: Number(row.monthly_price ?? 0),
                monthlyPrice: formatMoney(row.monthly_price),
                description: row.description ?? '',
                items: planItemsMap.get(row.id) ?? [],
                subscribers: `${row.subscribers ?? 0} clientes`,
                renewals: `${row.renewals ?? 0} hoje`,
            }))
            : adminDashboardMock.subscriptionRows;

        const deliveryRows = deliveriesResult.rows.length
            ? deliveriesResult.rows.map((row) => ({
                id: row.id,
                customerName: row.name,
                email: row.email ?? '',
                city: row.city ?? 'Brotas',
                addressLine: row.address_line ?? '',
                addressReference: row.address_reference ?? '',
                planName: row.plan_name ?? 'Sem plano',
                basketProfile: row.basket_profile ?? 'Selecao da estacao',
                deliveryDate: row.next_delivery_date
                    ? new Date(row.next_delivery_date).toLocaleDateString('pt-BR')
                    : '',
                deliveryDateRaw: row.next_delivery_date
                    ? new Date(row.next_delivery_date).toISOString().slice(0, 10)
                    : '',
                deliveryWindow: row.delivery_window ?? '8h as 12h',
                deliveryDay: row.delivery_day ?? '',
                status: row.delivery_status ?? 'Pendente',
            }))
            : adminDashboardMock.deliveryRows;

        const activeClients = registeredClients.filter((client) => client.status === 'Ativa').length;
        const activeCoupons = couponRows.filter((coupon) => coupon.status === 'Ativo').length;

        return {
            registeredClients,
            financeRows,
            couponRows,
            subscriptionRows,
            deliveryRows,
            overviewAlerts: [
                `${registeredClients.filter((client) => client.status !== 'Ativa').length} clientes aguardando ajuste de status`,
                `${activeCoupons} cupons ativos no sistema`,
                `${subscriptionRows.reduce((acc, row) => acc + Number(row.subscribers.split(' ')[0] || 0), 0)} assinaturas mapeadas`,
                `${activeClients} clientes ativos carregados do banco`,
            ],
        };
    } catch {
        return adminDashboardMock;
    }
}
