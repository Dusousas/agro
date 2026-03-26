export type PlanRecord = {
    id: number;
    slug: string;
    name: string;
    monthlyPriceValue: number;
    monthlyPrice: string;
    description: string;
    active: boolean;
};

export type PaymentRecord = {
    month: string;
    status: string;
    amount: string;
    method: string;
};

export type CardRecord = {
    brand: string;
    last4: string;
    expMonth: string;
    expYear: string;
    isPrimary: boolean;
};

export type CouponRecord = {
    id: number;
    code: string;
    status: string;
    usageCount: number;
    usage: string;
    discount: string;
};

export type ClientRecord = {
    id?: number;
    name: string;
    email?: string;
    plan: string;
    status: string;
    city: string;
    addressLine?: string;
    addressReference?: string;
    deliveryDay?: string;
    deliveryWindow?: string;
    basketProfile?: string;
    nextDeliveryDate?: string;
    paymentStatus?: string;
};

export type SubscriptionSummaryRecord = {
    id: number;
    slug: string;
    plan: string;
    badge?: string;
    monthlyPriceValue?: number;
    monthlyPrice?: string;
    description?: string;
    items?: string[];
    subscribers: string;
    renewals: string;
};

export type FinanceRow = {
    label: string;
    value: string;
};

export type DeliveryRecord = {
    id: number;
    customerName: string;
    email: string;
    city: string;
    addressLine: string;
    addressReference: string;
    planName: string;
    basketProfile: string;
    deliveryDate: string;
    deliveryDateRaw: string;
    deliveryWindow: string;
    deliveryDay: string;
    status: string;
};

export type CustomerDashboardData = {
    availablePlans: PlanRecord[];
    selectedPlanName: string;
    nextBasket: string[];
    paymentHistory: PaymentRecord[];
    cards: CardRecord[];
    appliedCoupon: {
        code: string;
        description: string;
    };
    customer: {
        name: string;
        city: string;
        addressLine: string;
        addressReference: string;
    };
    subscription: {
        status: string;
        nextDeliveryDate: string;
        deliveryWindow: string;
        deliveryDay: string;
        basketProfile: string;
    };
    customerSummary: {
        since: string;
        deliveriesCompleted: string;
        lastUpdate: string;
    };
};

export type AdminDashboardData = {
    registeredClients: ClientRecord[];
    financeRows: FinanceRow[];
    couponRows: CouponRecord[];
    subscriptionRows: SubscriptionSummaryRecord[];
    deliveryRows: DeliveryRecord[];
    overviewAlerts: string[];
};
