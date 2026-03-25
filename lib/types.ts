export type PlanRecord = {
    name: string;
    monthlyPrice: string;
    description: string;
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
    code: string;
    status: string;
    usage: string;
    discount: string;
};

export type ClientRecord = {
    name: string;
    plan: string;
    status: string;
    city: string;
};

export type SubscriptionSummaryRecord = {
    plan: string;
    subscribers: string;
    renewals: string;
};

export type FinanceRow = {
    label: string;
    value: string;
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
    overviewAlerts: string[];
    shortcuts: string[];
};
