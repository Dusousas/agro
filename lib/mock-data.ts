import { AdminDashboardData, CustomerDashboardData } from './types';

export const customerDashboardMock: CustomerDashboardData = {
    availablePlans: [
        {
            name: 'Cesta Broto',
            monthlyPrice: 'R$ 143,64',
            description: 'Plano leve para rotinas menores, com seleção essencial da semana.',
        },
        {
            name: 'Cesta Colheita',
            monthlyPrice: 'R$ 215,64',
            description: 'Plano atual com mais variedade para famílias e rotina de cozinha ativa.',
        },
        {
            name: 'Cesta Santa Cruz',
            monthlyPrice: 'R$ 305,64',
            description: 'Plano mais completo, com maior volume e itens sazonais especiais.',
        },
    ],
    selectedPlanName: 'Cesta Colheita',
    nextBasket: ['Alface crespa', 'Rúcula', 'Couve', 'Tomate', 'Cenoura', 'Cheiro-verde'],
    paymentHistory: [
        { month: 'Janeiro', status: 'Pago', amount: 'R$ 215,64', method: 'PIX' },
        { month: 'Fevereiro', status: 'Pago', amount: 'R$ 215,64', method: 'Cartão' },
        { month: 'Março', status: 'Pago', amount: 'R$ 215,64', method: 'PIX' },
        { month: 'Abril', status: 'Aberto', amount: 'R$ 215,64', method: 'Agendado' },
    ],
    cards: [
        { brand: 'Visa', last4: '4587', expMonth: '09', expYear: '28', isPrimary: true },
        { brand: 'Mastercard', last4: '0321', expMonth: '01', expYear: '29', isPrimary: false },
    ],
    appliedCoupon: {
        code: 'HORTA5',
        description: 'Aplicado para reduzir a próxima renovação em 5%.',
    },
    customer: {
        name: 'Maria Oliveira',
        city: 'Brotas - SP',
        addressLine: 'Rua exemplo, 120',
        addressReference: 'Portão branco ao lado da padaria',
    },
    subscription: {
        status: 'Assinatura ativa',
        nextDeliveryDate: '30 de março',
        deliveryWindow: '8h às 12h',
        deliveryDay: 'Segunda-feira',
        basketProfile: 'Mais folhas',
    },
    customerSummary: {
        since: 'Jan/2026',
        deliveriesCompleted: '12 cestas entregues',
        lastUpdate: 'Perfil revisado hoje',
    },
};

export const adminDashboardMock: AdminDashboardData = {
    registeredClients: [
        { name: 'Maria Oliveira', plan: 'Cesta Colheita', status: 'Ativa', city: 'Brotas' },
        { name: 'Lucas Ferreira', plan: 'Cesta Broto', status: 'Ativa', city: 'Brotas' },
        { name: 'Carla Mendes', plan: 'Cesta Santa Cruz', status: 'Pendente', city: 'Brotas' },
        { name: 'Rafael Costa', plan: 'Cesta Colheita', status: 'Ativa', city: 'Brotas' },
    ],
    financeRows: [
        { label: 'Receita confirmada do mês', value: 'R$ 5.430,00' },
        { label: 'Pagamentos pendentes', value: 'R$ 431,28' },
        { label: 'Ticket médio', value: 'R$ 226,25' },
    ],
    couponRows: [
        { code: 'BROTAS10', status: 'Ativo', usage: '12 usos', discount: '10% off' },
        { code: 'HORTA5', status: 'Ativo', usage: '8 usos', discount: '5% off' },
        { code: 'FRESCOR15', status: 'Rascunho', usage: '0 usos', discount: '15% off' },
    ],
    subscriptionRows: [
        { plan: 'Cesta Broto', subscribers: '7 clientes', renewals: '3 hoje' },
        { plan: 'Cesta Colheita', subscribers: '12 clientes', renewals: '5 hoje' },
        { plan: 'Cesta Santa Cruz', subscribers: '5 clientes', renewals: '2 hoje' },
    ],
    overviewAlerts: [
        '3 clientes aguardando confirmação de pagamento',
        '2 cupons tiveram uso acima da média hoje',
        '5 renovações da Cesta Colheita programadas',
        '1 cliente pediu alteração de endereço',
    ],
    shortcuts: [
        'Consultar cliente',
        'Criar cupom promocional',
        'Revisar cobranças pendentes',
        'Atualizar composição das cestas',
    ],
};
