create table if not exists plans (
    id serial primary key,
    slug text unique,
    name text not null,
    monthly_price numeric(10, 2) not null,
    description text not null,
    active boolean not null default true,
    created_at timestamptz not null default now()
);

create table if not exists customers (
    id serial primary key,
    name text not null,
    email text unique,
    phone text,
    city text default 'Brotas',
    address_line text,
    address_reference text,
    created_at timestamptz not null default now()
);

alter table customers add column if not exists delivery_day text;
alter table customers add column if not exists delivery_window text;
alter table customers add column if not exists basket_profile text;
alter table customers add column if not exists is_admin boolean not null default false;

create table if not exists subscriptions (
    id serial primary key,
    customer_id integer not null references customers(id) on delete cascade,
    plan_id integer not null references plans(id),
    status text not null default 'Ativa',
    basket_profile text,
    delivery_day text,
    delivery_window text,
    next_delivery_date date,
    created_at timestamptz not null default now()
);

create table if not exists subscription_items (
    id serial primary key,
    subscription_id integer not null references subscriptions(id) on delete cascade,
    item_name text not null,
    note text,
    sort_order integer not null default 0
);

create table if not exists payments (
    id serial primary key,
    subscription_id integer not null references subscriptions(id) on delete cascade,
    reference_month text not null,
    amount numeric(10, 2) not null,
    method text,
    status text not null default 'Aberto',
    due_date date,
    paid_at timestamptz,
    created_at timestamptz not null default now()
);

create table if not exists cards (
    id serial primary key,
    customer_id integer not null references customers(id) on delete cascade,
    brand text not null,
    last4 text not null,
    exp_month integer not null,
    exp_year integer not null,
    is_primary boolean not null default false,
    created_at timestamptz not null default now()
);

create table if not exists coupons (
    id serial primary key,
    code text not null unique,
    status text not null default 'Ativo',
    usage_count integer not null default 0,
    discount_text text not null,
    created_at timestamptz not null default now()
);
