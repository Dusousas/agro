import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FiBarChart2,
    FiCreditCard,
    FiGift,
    FiGrid,
    FiPackage,
    FiShoppingBag,
    FiTruck,
    FiUsers,
} from 'react-icons/fi';
import PainelModal from '../Painel/PainelModal';
import AdminMetricCard from './AdminMetricCard';
import AdminSidebar from './AdminSidebar';

type AdminModalKey =
    | 'clienteDetalhe'
    | 'financeiro'
    | 'cupom'
    | 'plano'
    | 'overview'
    | null;

const sidebarItems = [
    { id: 'overview', label: 'Visão geral', icon: FiGrid },
    { id: 'clientes', label: 'Clientes', icon: FiUsers },
    { id: 'financeiro', label: 'Financeiro', icon: FiCreditCard },
    { id: 'cupons', label: 'Cupons', icon: FiGift },
    { id: 'assinaturas', label: 'Assinaturas', icon: FiShoppingBag },
];

const registeredClients = [
    { name: 'Maria Oliveira', plan: 'Cesta Colheita', status: 'Ativa', city: 'Brotas' },
    { name: 'Lucas Ferreira', plan: 'Cesta Broto', status: 'Ativa', city: 'Brotas' },
    { name: 'Carla Mendes', plan: 'Cesta Santa Cruz', status: 'Pendente', city: 'Brotas' },
    { name: 'Rafael Costa', plan: 'Cesta Colheita', status: 'Ativa', city: 'Brotas' },
];

const financeRows = [
    { label: 'Receita confirmada do mês', value: 'R$ 5.430,00' },
    { label: 'Pagamentos pendentes', value: 'R$ 431,28' },
    { label: 'Ticket médio', value: 'R$ 226,25' },
];

const couponRows = [
    { code: 'BROTAS10', status: 'Ativo', usage: '12 usos', discount: '10% off' },
    { code: 'HORTA5', status: 'Ativo', usage: '8 usos', discount: '5% off' },
    { code: 'FRESCOR15', status: 'Rascunho', usage: '0 usos', discount: '15% off' },
];

const subscriptionRows = [
    { plan: 'Cesta Broto', subscribers: '7 clientes', renewals: '3 hoje' },
    { plan: 'Cesta Colheita', subscribers: '12 clientes', renewals: '5 hoje' },
    { plan: 'Cesta Santa Cruz', subscribers: '5 clientes', renewals: '2 hoje' },
];

const overviewAlerts = [
    '3 clientes aguardando confirmação de pagamento',
    '2 cupons tiveram uso acima da média hoje',
    '5 renovações da Cesta Colheita programadas',
    '1 cliente pediu alteração de endereço',
];

const shortcuts = [
    'Consultar cliente',
    'Criar cupom promocional',
    'Revisar cobranças pendentes',
    'Atualizar composição das cestas',
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [clientSearch, setClientSearch] = useState('');
    const [activeModal, setActiveModal] = useState<AdminModalKey>(null);
    const [selectedClient, setSelectedClient] = useState(registeredClients[0]);
    const [selectedCoupon, setSelectedCoupon] = useState(couponRows[0]);
    const [selectedPlan, setSelectedPlan] = useState(subscriptionRows[1]);

    const content = useMemo(() => {
        if (activeTab === 'clientes') {
            const filteredClients = registeredClients.filter((client) =>
                `${client.name} ${client.plan} ${client.status} ${client.city}`
                    .toLowerCase()
                    .includes(clientSearch.toLowerCase())
            );

            return (
                <section className='bg-white rounded-[32px] shadow-md p-6 lg:p-8'>
                    <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
                        <div>
                            <h2 className='text-3xl font-bold'>Clientes registrados</h2>
                            <p className='mt-2'>Acompanhe quem entrou no sistema pelas assinaturas pagas e consulte plano, status e localização.</p>
                        </div>
                        <div className='w-full lg:max-w-sm'>
                            <label className='sr-only' htmlFor='client-search'>Pesquisar cliente</label>
                            <input
                                id='client-search'
                                className='w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0'
                                placeholder='Pesquisar cliente por nome, plano ou cidade'
                                type='text'
                                value={clientSearch}
                                onChange={(event) => setClientSearch(event.target.value)}
                            />
                        </div>
                    </div>

                    <div className='grid gap-4 mt-8'>
                        {filteredClients.map((client) => (
                            <button
                                key={client.name}
                                type='button'
                                onClick={() => {
                                    setSelectedClient(client);
                                    setActiveModal('clienteDetalhe');
                                }}
                                className='grid gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left md:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_auto] md:items-center'
                            >
                                <div>
                                    <p className='text-sm'>Cliente</p>
                                    <p className='font-Manrope font-semibold text-BlackH1'>{client.name}</p>
                                </div>
                                <div>
                                    <p className='text-sm'>Plano</p>
                                    <p className='font-Manrope font-semibold text-BlackH1'>{client.plan}</p>
                                </div>
                                <div>
                                    <p className='text-sm'>Status</p>
                                    <span className={`inline-flex mt-1 rounded-full px-4 py-2 text-sm font-Manrope ${
                                        client.status === 'Ativa' ? 'bg-GreenP/15 text-GreenP' : 'bg-YellowP/35 text-BlackH1'
                                    }`}>
                                        {client.status}
                                    </span>
                                </div>
                                <div>
                                    <p className='text-sm'>Cidade</p>
                                    <p className='font-Manrope font-semibold text-BlackH1'>{client.city}</p>
                                </div>
                                <span className='font-Manrope text-GreenP'>Abrir</span>
                            </button>
                        ))}

                        {filteredClients.length === 0 ? (
                            <div className='rounded-2xl border border-dashed border-gray-200 p-6 text-center'>
                                <h3 className='text-xl font-bold'>Nenhum cliente encontrado</h3>
                                <p className='mt-2'>Tente pesquisar por outro nome, plano ou cidade.</p>
                            </div>
                        ) : null}
                    </div>
                </section>
            );
        }

        if (activeTab === 'financeiro') {
            return (
                <section className='grid gap-6'>
                    <div className='bg-white rounded-[32px] shadow-md p-6 lg:p-8'>
                        <h2 className='text-3xl font-bold'>Financeiro</h2>
                        <p className='mt-2'>Resumo das cobranças, recorrência e situação do caixa da operação.</p>

                        <div className='grid gap-4 mt-8 md:grid-cols-3'>
                            {financeRows.map((row) => (
                                <div key={row.label} className='rounded-2xl bg-gray-50 p-5'>
                                    <p className='text-sm'>{row.label}</p>
                                    <h3 className='text-3xl font-bold mt-2'>{row.value}</h3>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='bg-white rounded-[32px] shadow-md p-6 lg:p-8'>
                        <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
                            <div>
                                <h3 className='text-2xl font-bold'>Fluxo recente</h3>
                                <p className='mt-2'>Movimentações principais das assinaturas e pagamentos.</p>
                            </div>
                            <button
                                type='button'
                                onClick={() => setActiveModal('financeiro')}
                                className='border border-gray-200 px-5 py-3 rounded-2xl font-Manrope'
                            >
                                Exportar relatório
                            </button>
                        </div>

                        <div className='grid gap-4 mt-8'>
                            {[
                                'Pagamento de Maria Oliveira confirmado via PIX',
                                'Renovação da Cesta Santa Cruz agendada para amanhã',
                                '1 assinatura com cobrança pendente aguardando cartão',
                            ].map((entry) => (
                                <div key={entry} className='rounded-2xl border border-gray-100 bg-gray-50 p-4'>
                                    <p className='font-Manrope text-BlackH1'>{entry}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            );
        }

        if (activeTab === 'cupons') {
            return (
                <section className='grid gap-6'>
                    <div className='bg-white rounded-[32px] shadow-md p-6 lg:p-8'>
                        <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
                            <div>
                                <h2 className='text-3xl font-bold'>Cupons de desconto</h2>
                                <p className='mt-2'>Crie campanhas, acompanhe uso e controle a validade dos cupons.</p>
                            </div>
                            <button
                                type='button'
                                onClick={() => {
                                    setSelectedCoupon(couponRows[0]);
                                    setActiveModal('cupom');
                                }}
                                className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope'
                            >
                                Criar cupom
                            </button>
                        </div>

                        <div className='grid gap-4 mt-8'>
                            {couponRows.map((coupon) => (
                                <button
                                    key={coupon.code}
                                    type='button'
                                    onClick={() => {
                                        setSelectedCoupon(coupon);
                                        setActiveModal('cupom');
                                    }}
                                    className='grid gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left md:grid-cols-[1fr_0.7fr_0.7fr_0.7fr_auto] md:items-center'
                                >
                                    <div>
                                        <p className='text-sm'>Código</p>
                                        <p className='font-Manrope font-semibold text-BlackH1'>{coupon.code}</p>
                                    </div>
                                    <div>
                                        <p className='text-sm'>Status</p>
                                        <p className='font-Manrope font-semibold text-BlackH1'>{coupon.status}</p>
                                    </div>
                                    <div>
                                        <p className='text-sm'>Uso</p>
                                        <p className='font-Manrope font-semibold text-BlackH1'>{coupon.usage}</p>
                                    </div>
                                    <div>
                                        <p className='text-sm'>Desconto</p>
                                        <p className='font-Manrope font-semibold text-BlackH1'>{coupon.discount}</p>
                                    </div>
                                    <span className='font-Manrope text-GreenP'>Editar</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className='bg-white rounded-[32px] shadow-md p-6 lg:p-8'>
                        <h3 className='text-2xl font-bold'>Novo cupom rápido</h3>
                        <div className='grid gap-4 mt-6 md:grid-cols-3'>
                            <input className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0' placeholder='Código do cupom' type='text' />
                            <input className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0' placeholder='Desconto (%)' type='text' />
                            <input className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0' placeholder='Validade' type='text' />
                        </div>
                        <button
                            type='button'
                            onClick={() => {
                                setSelectedCoupon(couponRows[0]);
                                setActiveModal('cupom');
                            }}
                            className='mt-6 bg-YellowP px-6 py-3 rounded-2xl font-Manrope'
                        >
                            Salvar cupom
                        </button>
                    </div>
                </section>
            );
        }

        if (activeTab === 'assinaturas') {
            return (
                <section className='bg-white rounded-[32px] shadow-md p-6 lg:p-8'>
                    <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
                        <div>
                            <h2 className='text-3xl font-bold'>Assinaturas e planos</h2>
                            <p className='mt-2'>Acompanhe distribuição por plano e a rotina das renovações.</p>
                        </div>
                        <button
                            type='button'
                            onClick={() => {
                                setSelectedPlan(subscriptionRows[1]);
                                setActiveModal('plano');
                            }}
                            className='border border-gray-200 px-5 py-3 rounded-2xl font-Manrope'
                        >
                            Editar planos
                        </button>
                    </div>

                    <div className='grid gap-4 mt-8 md:grid-cols-3'>
                        {subscriptionRows.map((row) => (
                            <button
                                key={row.plan}
                                type='button'
                                onClick={() => {
                                    setSelectedPlan(row);
                                    setActiveModal('plano');
                                }}
                                className='rounded-2xl bg-gray-50 p-5 text-left'
                            >
                                <p className='text-sm'>Plano</p>
                                <h3 className='text-2xl font-bold mt-2'>{row.plan}</h3>
                                <p className='mt-3'>{row.subscribers}</p>
                                <p className='mt-1 text-sm'>{row.renewals}</p>
                                <span className='inline-block mt-4 font-Manrope text-GreenP'>Editar plano</span>
                            </button>
                        ))}
                    </div>

                    <div className='grid gap-4 mt-8 md:grid-cols-2'>
                        <div className='rounded-2xl border border-gray-100 p-5'>
                            <p className='text-sm'>Próximas renovações</p>
                            <h3 className='text-2xl font-bold mt-2'>10 renovações nas próximas 48h</h3>
                        </div>
                        <div className='rounded-2xl border border-gray-100 p-5'>
                            <p className='text-sm'>Entregas programadas</p>
                            <h3 className='text-2xl font-bold mt-2'>24 cestas em montagem</h3>
                        </div>
                    </div>
                </section>
            );
        }

        return (
            <section className='grid gap-6'>
                <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
                    <AdminMetricCard title='Clientes ativos' value='24' description='Assinaturas recorrentes com status ativo hoje.' icon={FiUsers} delay={0.05} />
                    <AdminMetricCard title='Receita prevista' value='R$ 5,4 mil' description='Total estimado da recorrência deste ciclo.' icon={FiBarChart2} delay={0.1} />
                    <AdminMetricCard title='Cupons ativos' value='3' description='Campanhas de desconto disponíveis para uso.' icon={FiGift} delay={0.15} />
                    <AdminMetricCard title='Entregas do dia' value='18' description='Cestas em separação ou rota para Brotas.' icon={FiTruck} delay={0.2} />
                </div>

                <div className='grid gap-6 xl:grid-cols-[1.1fr_0.9fr]'>
                    <div className='bg-white rounded-[32px] shadow-md p-6 lg:p-8'>
                        <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
                            <div>
                                <h2 className='text-3xl font-bold'>Visão operacional</h2>
                                <p className='mt-2'>Resumo rápido do que precisa de atenção no sistema agora.</p>
                            </div>
                            <button
                                type='button'
                                onClick={() => setActiveModal('overview')}
                                className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope'
                            >
                                Atualizar dados
                            </button>
                        </div>

                        <div className='grid gap-4 mt-8 md:grid-cols-2'>
                            {overviewAlerts.map((item) => (
                                <button
                                    key={item}
                                    type='button'
                                    onClick={() => setActiveModal('overview')}
                                    className='rounded-2xl bg-gray-50 p-5 text-left'
                                >
                                    <p className='font-Manrope text-BlackH1'>{item}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className='bg-white rounded-[32px] shadow-md p-6 lg:p-8'>
                        <h2 className='text-3xl font-bold'>Atalhos de gestão</h2>
                        <div className='space-y-4 mt-8'>
                            {shortcuts.map((shortcut) => (
                                <button
                                    key={shortcut}
                                    type='button'
                                    onClick={() => {
                                        if (shortcut === 'Consultar cliente') setActiveModal('clienteDetalhe');
                                        if (shortcut === 'Criar cupom promocional') setActiveModal('cupom');
                                        if (shortcut === 'Revisar cobranças pendentes') setActiveModal('financeiro');
                                        if (shortcut === 'Atualizar composição das cestas') setActiveModal('plano');
                                    }}
                                    className='w-full text-left border border-gray-200 rounded-2xl px-4 py-4 hover:border-GreenP/60 transition-colors'
                                >
                                    <span className='font-Manrope font-semibold text-BlackH1'>{shortcut}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }, [activeTab, clientSearch]);

    return (
        <main className='bgService min-h-[calc(100vh-92px)]'>
            <section className='gradient2 py-16 lg:py-20'>
                <div className='maxW'>
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className='mb-10'
                    >
                        <h6 className='text-xl'>Painel administrativo</h6>
                        <h1 className='text-3xl lg:text-5xl font-bold mt-2'>Controle do sistema de assinaturas.</h1>
                        <p className='mt-4 max-w-3xl'>
                            Um painel administrativo com sidebar para acompanhar clientes, financeiro, cupons e a operação do serviço sem sair do mesmo fluxo visual do projeto.
                        </p>
                    </motion.div>

                    <div className='grid gap-6 xl:grid-cols-[320px_1fr]'>
                        <AdminSidebar items={sidebarItems} activeTab={activeTab} onSelect={setActiveTab} />
                        <div>
                            {content}
                        </div>
                    </div>
                </div>
            </section>

            <PainelModal
                title='Detalhes do cliente'
                subtitle='Consulta rápida'
                isOpen={activeModal === 'clienteDetalhe'}
                onClose={() => setActiveModal(null)}
            >
                <div className='grid gap-4 md:grid-cols-2'>
                    <div className='rounded-2xl bg-gray-50 p-5'>
                        <p className='text-sm'>Cliente</p>
                        <h3 className='text-2xl font-bold mt-2'>{selectedClient.name}</h3>
                    </div>
                    <div className='rounded-2xl bg-gray-50 p-5'>
                        <p className='text-sm'>Plano atual</p>
                        <h3 className='text-2xl font-bold mt-2'>{selectedClient.plan}</h3>
                    </div>
                    <div className='rounded-2xl bg-gray-50 p-5'>
                        <p className='text-sm'>Status</p>
                        <h3 className='text-2xl font-bold mt-2'>{selectedClient.status}</h3>
                    </div>
                    <div className='rounded-2xl bg-gray-50 p-5'>
                        <p className='text-sm'>Cidade</p>
                        <h3 className='text-2xl font-bold mt-2'>{selectedClient.city}</h3>
                    </div>
                </div>
                <div className='mt-8 rounded-2xl border border-gray-100 p-5'>
                    <p className='text-sm'>Ações futuras</p>
                    <p className='mt-2'>Aqui depois vamos ligar histórico completo, pagamentos, endereço e mudanças de plano direto no backend.</p>
                </div>
            </PainelModal>

            <PainelModal
                title='Relatório financeiro'
                subtitle='Exportação e revisão'
                isOpen={activeModal === 'financeiro'}
                onClose={() => setActiveModal(null)}
            >
                <div className='grid gap-4 md:grid-cols-3'>
                    {financeRows.map((row) => (
                        <div key={row.label} className='rounded-2xl bg-gray-50 p-5'>
                            <p className='text-sm'>{row.label}</p>
                            <h3 className='text-2xl font-bold mt-2'>{row.value}</h3>
                        </div>
                    ))}
                </div>
                <div className='mt-8 grid gap-4'>
                    {[
                        'Gerar relatório em PDF',
                        'Enviar resumo financeiro por email',
                        'Marcar cobrança pendente para revisão',
                    ].map((item) => (
                        <button key={item} type='button' className='w-full text-left border border-gray-200 rounded-2xl px-4 py-4'>
                            <span className='font-Manrope font-semibold text-BlackH1'>{item}</span>
                        </button>
                    ))}
                </div>
            </PainelModal>

            <PainelModal
                title='Cupom promocional'
                subtitle='Gestão de desconto'
                isOpen={activeModal === 'cupom'}
                onClose={() => setActiveModal(null)}
            >
                <div className='grid gap-4 md:grid-cols-2'>
                    <div className='flex flex-col gap-2'>
                        <label className='font-Manrope font-semibold text-BlackH1'>Código</label>
                        <input className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0' defaultValue={selectedCoupon.code} type='text' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='font-Manrope font-semibold text-BlackH1'>Status</label>
                        <input className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0' defaultValue={selectedCoupon.status} type='text' />
                    </div>
                </div>
                <div className='grid gap-4 mt-4 md:grid-cols-2'>
                    <div className='flex flex-col gap-2'>
                        <label className='font-Manrope font-semibold text-BlackH1'>Desconto</label>
                        <input className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0' defaultValue={selectedCoupon.discount} type='text' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='font-Manrope font-semibold text-BlackH1'>Uso atual</label>
                        <input className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0' defaultValue={selectedCoupon.usage} type='text' />
                    </div>
                </div>
                <button type='button' className='mt-8 bg-YellowP px-6 py-3 rounded-2xl font-Manrope'>
                    Salvar cupom
                </button>
            </PainelModal>

            <PainelModal
                title='Editar plano'
                subtitle='Gestão das assinaturas'
                isOpen={activeModal === 'plano'}
                onClose={() => setActiveModal(null)}
            >
                <div className='grid gap-4 md:grid-cols-2'>
                    <div className='rounded-2xl bg-gray-50 p-5'>
                        <p className='text-sm'>Plano selecionado</p>
                        <h3 className='text-2xl font-bold mt-2'>{selectedPlan.plan}</h3>
                    </div>
                    <div className='rounded-2xl bg-gray-50 p-5'>
                        <p className='text-sm'>Assinantes</p>
                        <h3 className='text-2xl font-bold mt-2'>{selectedPlan.subscribers}</h3>
                    </div>
                </div>
                <div className='grid gap-4 mt-6'>
                    <input className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0' defaultValue={selectedPlan.plan} type='text' />
                    <input className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0' defaultValue='R$ 215,64 por mês' type='text' />
                    <textarea className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0 min-h-32 resize-none' defaultValue='Plano com variedade equilibrada para famílias e alta recorrência semanal.' />
                </div>
                <button type='button' className='mt-8 bg-YellowP px-6 py-3 rounded-2xl font-Manrope'>
                    Salvar alterações do plano
                </button>
            </PainelModal>

            <PainelModal
                title='Atualização operacional'
                subtitle='Visão geral'
                isOpen={activeModal === 'overview'}
                onClose={() => setActiveModal(null)}
            >
                <div className='grid gap-4'>
                    {overviewAlerts.map((item) => (
                        <div key={item} className='rounded-2xl border border-gray-100 bg-gray-50 p-4'>
                            <p className='font-Manrope text-BlackH1'>{item}</p>
                        </div>
                    ))}
                </div>
                <button type='button' className='mt-8 bg-YellowP px-6 py-3 rounded-2xl font-Manrope'>
                    Marcar revisão concluída
                </button>
            </PainelModal>
        </main>
    );
}
