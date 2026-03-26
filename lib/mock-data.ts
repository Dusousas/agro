import { AdminDashboardData, CustomerDashboardData } from './types';

export const customerDashboardMock: CustomerDashboardData = {
    availablePlans: [
        {
            id: 1,
            slug: 'cesta-broto',
            name: 'Cesta Broto',
            monthlyPriceValue: 143.64,
            monthlyPrice: 'R$ 143,64',
            description: 'Plano leve para rotinas menores, com selecao essencial da semana.',
            active: true,
        },
        {
            id: 2,
            slug: 'cesta-colheita',
            name: 'Cesta Colheita',
            monthlyPriceValue: 215.64,
            monthlyPrice: 'R$ 215,64',
            description: 'Plano atual com mais variedade para familias e rotina de cozinha ativa.',
            active: true,
        },
        {
            id: 3,
            slug: 'cesta-santa-cruz',
            name: 'Cesta Santa Cruz',
            monthlyPriceValue: 305.64,
            monthlyPrice: 'R$ 305,64',
            description: 'Plano mais completo, com maior volume e itens sazonais especiais.',
            active: true,
        },
    ],
    selectedPlanName: 'Cesta Colheita',
    nextBasket: ['Alface crespa', 'Rucula', 'Couve', 'Tomate', 'Cenoura', 'Cheiro-verde'],
    paymentHistory: [
        { month: 'Janeiro', status: 'Pago', amount: 'R$ 215,64', method: 'PIX' },
        { month: 'Fevereiro', status: 'Pago', amount: 'R$ 215,64', method: 'Cartao' },
        { month: 'Marco', status: 'Pago', amount: 'R$ 215,64', method: 'PIX' },
        { month: 'Abril', status: 'Aberto', amount: 'R$ 215,64', method: 'Agendado' },
    ],
    appliedCoupon: {
        code: 'HORTA5',
        description: 'Aplicado para reduzir a proxima renovacao em 5%.',
    },
    customer: {
        name: 'Maria Oliveira',
        city: 'Brotas - SP',
        addressLine: 'Rua exemplo, 120',
        addressReference: 'Portao branco ao lado da padaria',
    },
    subscription: {
        status: 'Assinatura ativa',
        deliveryStatus: 'Em separacao',
        nextDeliveryDate: '30 de marco',
        deliveryWindow: '8h as 12h',
        deliveryDay: 'Segunda-feira',
        basketProfile: 'Mais folhas',
    },
    paymentSummary: {
        latestStatus: 'Aberto',
        latestAmount: 'R$ 215,64',
        latestMethod: 'Agendado',
        nextDueDate: '30/03/2026',
        openPayments: 1,
    },
    customerSummary: {
        since: 'Jan/2026',
        deliveriesCompleted: '12 cestas entregues',
        lastUpdate: 'Perfil revisado hoje',
    },
};

export const adminDashboardMock: AdminDashboardData = {
    registeredClients: [
        { id: 1, name: 'Maria Oliveira', email: 'maria@exemplo.com', plan: 'Cesta Colheita', status: 'Ativa', city: 'Brotas', addressLine: 'Rua exemplo, 120', addressReference: 'Portao branco', deliveryDay: 'Sabado', deliveryWindow: '8h as 12h', basketProfile: 'Mais folhas', nextDeliveryDate: '28/03/2026', paymentStatus: 'Pago' },
        { id: 2, name: 'Lucas Ferreira', email: 'lucas@exemplo.com', plan: 'Cesta Broto', status: 'Ativa', city: 'Brotas', addressLine: 'Avenida central, 58', addressReference: 'Casa azul', deliveryDay: 'Sabado', deliveryWindow: '12h as 16h', basketProfile: 'Selecao da estacao', nextDeliveryDate: '28/03/2026', paymentStatus: 'Pendente' },
        { id: 3, name: 'Carla Mendes', email: 'carla@exemplo.com', plan: 'Cesta Santa Cruz', status: 'Pendente', city: 'Brotas', addressLine: 'Rua do pomar, 15', addressReference: 'Chacara', deliveryDay: 'Segunda-feira', deliveryWindow: '8h as 12h', basketProfile: 'Mais variedade', nextDeliveryDate: '31/03/2026', paymentStatus: 'Pendente' },
        { id: 4, name: 'Rafael Costa', email: 'rafael@exemplo.com', plan: 'Cesta Colheita', status: 'Ativa', city: 'Brotas', addressLine: 'Rua das Palmeiras, 300', addressReference: 'Apto 14', deliveryDay: 'Domingo', deliveryWindow: '8h as 12h', basketProfile: 'Mais legumes', nextDeliveryDate: '29/03/2026', paymentStatus: 'Pago' },
    ],
    financeRows: [
        { label: 'Receita confirmada do mes', value: 'R$ 5.430,00' },
        { label: 'Pagamentos pendentes', value: 'R$ 431,28' },
        { label: 'Ticket medio', value: 'R$ 226,25' },
    ],
    financeChart: [
        { label: 'Nov', paid: 4120, pending: 280 },
        { label: 'Dez', paid: 4650, pending: 120 },
        { label: 'Jan', paid: 4890, pending: 340 },
        { label: 'Fev', paid: 5210, pending: 180 },
        { label: 'Mar', paid: 5430, pending: 431.28 },
        { label: 'Abr', paid: 3880, pending: 620 },
    ],
    financeTransactions: [
        { id: 1, customerName: 'Maria Oliveira', planName: 'Cesta Colheita', referenceMonth: 'Marco', amount: 'R$ 215,64', method: 'PIX', status: 'Pago', dueDate: '25/03/2026' },
        { id: 2, customerName: 'Lucas Ferreira', planName: 'Cesta Broto', referenceMonth: 'Marco', amount: 'R$ 143,64', method: 'Cartao', status: 'Pendente', dueDate: '26/03/2026' },
        { id: 3, customerName: 'Rafael Costa', planName: 'Cesta Santa Cruz', referenceMonth: 'Marco', amount: 'R$ 305,64', method: 'Cartao', status: 'Pago', dueDate: '24/03/2026' },
        { id: 4, customerName: 'Carla Mendes', planName: 'Cesta Santa Cruz', referenceMonth: 'Marco', amount: 'R$ 305,64', method: 'PIX', status: 'Pendente', dueDate: '28/03/2026' },
    ],
    couponRows: [
        { id: 1, code: 'BROTAS10', status: 'Ativo', usageCount: 12, usage: '12 usos', discount: '10% off' },
        { id: 2, code: 'HORTA5', status: 'Ativo', usageCount: 8, usage: '8 usos', discount: '5% off' },
        { id: 3, code: 'FRESCOR15', status: 'Rascunho', usageCount: 0, usage: '0 usos', discount: '15% off' },
    ],
    subscriptionRows: [
        { id: 1, slug: 'cesta-broto', badge: 'Entrada mais leve', plan: 'Cesta Broto', monthlyPriceValue: 143.64, monthlyPrice: 'R$ 143,64', description: 'Plano leve para rotinas menores.', items: ['Alface crespa', 'Rucula', 'Tomate', 'Cheiro-verde'], subscribers: '7 clientes', renewals: '3 hoje' },
        { id: 2, slug: 'cesta-colheita', badge: 'Mais escolhido', plan: 'Cesta Colheita', monthlyPriceValue: 215.64, monthlyPrice: 'R$ 215,64', description: 'Plano com mais variedade e alta recorrencia.', items: ['Alface crespa', 'Rucula', 'Couve', 'Tomate', 'Cenoura', 'Cheiro-verde'], subscribers: '12 clientes', renewals: '5 hoje' },
        { id: 3, slug: 'cesta-santa-cruz', badge: 'Plano mais completo', plan: 'Cesta Santa Cruz', monthlyPriceValue: 305.64, monthlyPrice: 'R$ 305,64', description: 'Plano premium com maior volume.', items: ['Alface americana', 'Rucula', 'Couve', 'Brocolis', 'Tomate', 'Cenoura', 'Beterraba', 'Cheiro-verde'], subscribers: '5 clientes', renewals: '2 hoje' },
    ],
    deliveryRows: [
        { id: 1, customerName: 'Maria Oliveira', email: 'maria@exemplo.com', city: 'Brotas', addressLine: 'Rua exemplo, 120', addressReference: 'Portao branco', planName: 'Cesta Colheita', basketProfile: 'Mais folhas', deliveryDate: '28/03/2026', deliveryDateRaw: '2026-03-28', deliveryWindow: '8h as 12h', deliveryDay: 'Sabado', status: 'Em separacao' },
        { id: 2, customerName: 'Lucas Ferreira', email: 'lucas@exemplo.com', city: 'Brotas', addressLine: 'Avenida central, 58', addressReference: 'Casa azul', planName: 'Cesta Broto', basketProfile: 'Selecao da estacao', deliveryDate: '28/03/2026', deliveryDateRaw: '2026-03-28', deliveryWindow: '12h as 16h', deliveryDay: 'Sabado', status: 'Pendente' },
        { id: 3, customerName: 'Rafael Costa', email: 'rafael@exemplo.com', city: 'Sao Carlos', addressLine: 'Rua das Palmeiras, 300', addressReference: 'Apto 14', planName: 'Cesta Santa Cruz', basketProfile: 'Mais variedade', deliveryDate: '29/03/2026', deliveryDateRaw: '2026-03-29', deliveryWindow: '8h as 12h', deliveryDay: 'Domingo', status: 'Enviado' },
    ],
    overviewAlerts: [
        '3 clientes aguardando confirmacao de pagamento',
        '2 cupons tiveram uso acima da media hoje',
        '5 renovacoes da Cesta Colheita programadas',
        '1 cliente pediu alteracao de endereco',
    ],
};
