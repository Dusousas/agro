import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiBarChart2, FiCreditCard, FiGift, FiGrid, FiShoppingBag, FiTruck, FiUsers } from 'react-icons/fi';
import { AdminDashboardData, ClientRecord, CouponRecord, DeliveryRecord, SubscriptionSummaryRecord } from '@/lib/types';
import PainelModal from '../Painel/PainelModal';
import AdminMetricCard from './AdminMetricCard';
import AdminSidebar from './AdminSidebar';

type AdminModalKey = 'clienteDetalhe' | 'financeiro' | 'cupom' | 'plano' | 'overview' | 'entrega' | null;
type DeliveryStatus = 'Pendente' | 'Em separacao' | 'Enviado' | 'Entregue';

const sidebarItems = [
    { id: 'overview', label: 'Visao geral', icon: FiGrid },
    { id: 'entregas', label: 'Entregas', icon: FiTruck },
    { id: 'clientes', label: 'Clientes', icon: FiUsers },
    { id: 'financeiro', label: 'Financeiro', icon: FiCreditCard },
    { id: 'cupons', label: 'Cupons', icon: FiGift },
    { id: 'assinaturas', label: 'Assinaturas', icon: FiShoppingBag },
];

const emptyCoupon: CouponRecord = { id: 0, code: '', status: 'Ativo', usageCount: 0, usage: '0 usos', discount: '' };
const emptyPlan: SubscriptionSummaryRecord = { id: 0, slug: '', plan: '', monthlyPriceValue: 0, monthlyPrice: 'R$ 0,00', description: '', subscribers: '0 clientes', renewals: '0 hoje' };
const emptyDelivery: DeliveryRecord = { id: 0, customerName: '', email: '', city: '', addressLine: '', addressReference: '', planName: '', basketProfile: '', deliveryDate: '', deliveryDateRaw: '', deliveryWindow: '', deliveryDay: '', status: 'Pendente' };
const deliveryStatuses: DeliveryStatus[] = ['Pendente', 'Em separacao', 'Enviado', 'Entregue'];

type AdminDashboardProps = {
    data: AdminDashboardData;
};

export default function AdminDashboard({ data }: AdminDashboardProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [clientSearch, setClientSearch] = useState('');
    const [activeModal, setActiveModal] = useState<AdminModalKey>(null);
    const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(data.registeredClients[0] ?? null);
    const [selectedCoupon, setSelectedCoupon] = useState<CouponRecord>(data.couponRows[0] ?? emptyCoupon);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionSummaryRecord>(data.subscriptionRows[0] ?? emptyPlan);
    const [selectedDelivery, setSelectedDelivery] = useState<DeliveryRecord>(data.deliveryRows[0] ?? emptyDelivery);
    const [couponForm, setCouponForm] = useState<CouponRecord>(data.couponRows[0] ?? emptyCoupon);
    const [planForm, setPlanForm] = useState<SubscriptionSummaryRecord>(data.subscriptionRows[0] ?? emptyPlan);
    const [savingCoupon, setSavingCoupon] = useState(false);
    const [savingPlan, setSavingPlan] = useState(false);
    const [savingDelivery, setSavingDelivery] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [deliverySearch, setDeliverySearch] = useState('');
    const [deliveryCity, setDeliveryCity] = useState('');
    const [deliveryPlan, setDeliveryPlan] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [deliveryStatus, setDeliveryStatus] = useState('');

    useEffect(() => {
        setSelectedClient(data.registeredClients[0] ?? null);
        setSelectedCoupon(data.couponRows[0] ?? emptyCoupon);
        setCouponForm(data.couponRows[0] ?? emptyCoupon);
        setSelectedPlan(data.subscriptionRows[0] ?? emptyPlan);
        setPlanForm(data.subscriptionRows[0] ?? emptyPlan);
        setSelectedDelivery(data.deliveryRows[0] ?? emptyDelivery);
    }, [data]);

    const deliveryCities = useMemo(() => Array.from(new Set(data.deliveryRows.map((row) => row.city))).filter(Boolean), [data.deliveryRows]);
    const deliveryPlans = useMemo(() => Array.from(new Set(data.deliveryRows.map((row) => row.planName))).filter(Boolean), [data.deliveryRows]);
    const upcomingDeliveries = useMemo(() => data.deliveryRows.filter((row) => row.status !== 'Entregue').length, [data.deliveryRows]);
    const sentDeliveries = useMemo(() => data.deliveryRows.filter((row) => row.status === 'Enviado' || row.status === 'Entregue').length, [data.deliveryRows]);
    const nextDeliveryDate = useMemo(() => data.deliveryRows[0]?.deliveryDate ?? '--', [data.deliveryRows]);

    function openCouponModal(coupon?: CouponRecord) {
        const value = coupon ?? emptyCoupon;
        setSelectedCoupon(value);
        setCouponForm(value);
        setFeedback('');
        setActiveModal('cupom');
    }

    function openPlanModal(plan?: SubscriptionSummaryRecord) {
        const value = plan ?? emptyPlan;
        setSelectedPlan(value);
        setPlanForm(value);
        setFeedback('');
        setActiveModal('plano');
    }

    function openDeliveryModal(delivery: DeliveryRecord) {
        setSelectedDelivery(delivery);
        setFeedback('');
        setActiveModal('entrega');
    }

    async function saveCoupon() {
        setSavingCoupon(true);
        setFeedback('');
        const response = await fetch('/api/admin/coupons', {
            method: couponForm.id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: couponForm.id, code: couponForm.code, status: couponForm.status, discount: couponForm.discount }),
        });
        if (!response.ok) {
            const responseData = await response.json().catch(() => null);
            setFeedback(responseData?.message ?? 'Nao foi possivel salvar o cupom.');
            setSavingCoupon(false);
            return;
        }
        await router.replace(router.asPath);
        setSavingCoupon(false);
        setActiveModal(null);
    }

    async function savePlan() {
        setSavingPlan(true);
        setFeedback('');
        const response = await fetch('/api/admin/plans', {
            method: planForm.id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: planForm.id, slug: planForm.slug, name: planForm.plan, monthlyPrice: planForm.monthlyPriceValue, description: planForm.description, active: true }),
        });
        if (!response.ok) {
            const responseData = await response.json().catch(() => null);
            setFeedback(responseData?.message ?? 'Nao foi possivel salvar o plano.');
            setSavingPlan(false);
            return;
        }
        await router.replace(router.asPath);
        setSavingPlan(false);
        setActiveModal(null);
    }

    async function updateDeliveryStatus(status: DeliveryStatus) {
        if (!selectedDelivery.id) return;
        setSavingDelivery(true);
        setFeedback('');
        const response = await fetch('/api/admin/deliveries', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedDelivery.id, status }),
        });
        if (!response.ok) {
            const responseData = await response.json().catch(() => null);
            setFeedback(responseData?.message ?? 'Nao foi possivel atualizar a entrega.');
            setSavingDelivery(false);
            return;
        }
        await router.replace(router.asPath);
        setSavingDelivery(false);
        setActiveModal(null);
    }

    const deliveryContent = useMemo(() => {
        const filtered = data.deliveryRows.filter((row) => {
            const matchesText = `${row.customerName} ${row.addressLine} ${row.addressReference} ${row.city} ${row.planName} ${row.deliveryDate} ${row.email}`.toLowerCase().includes(deliverySearch.toLowerCase());
            return matchesText
                && (!deliveryCity || row.city === deliveryCity)
                && (!deliveryPlan || row.planName === deliveryPlan)
                && (!deliveryDate || row.deliveryDateRaw === deliveryDate)
                && (!deliveryStatus || row.status === deliveryStatus);
        });

        return (
            <section className='grid gap-6'>
                <div className='grid gap-6 md:grid-cols-3'>
                    <AdminMetricCard title='Proximas entregas' value={upcomingDeliveries.toString()} description='Assinaturas com entrega futura ainda em operacao.' icon={FiTruck} delay={0.05} />
                    <AdminMetricCard title='Ja enviadas' value={sentDeliveries.toString()} description='Entregas marcadas como enviadas ou concluidas.' icon={FiBarChart2} delay={0.1} />
                    <AdminMetricCard title='Proxima data' value={nextDeliveryDate} description='Primeira data de entrega encontrada na fila.' icon={FiShoppingBag} delay={0.15} />
                </div>

                <section className='rounded-[32px] bg-white p-6 shadow-md lg:p-8'>
                    <div><h2 className='text-3xl font-bold'>Operacao de entregas</h2><p className='mt-2'>Filtre por nome, endereco, cidade, tipo de cesta, data e status.</p></div>
                    <div className='mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5'>
                        <input className='rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-0 xl:col-span-2' placeholder='Buscar por nome, endereco, cidade ou data' type='text' value={deliverySearch} onChange={(event) => setDeliverySearch(event.target.value)} />
                        <select className='rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-0' value={deliveryCity} onChange={(event) => setDeliveryCity(event.target.value)}><option value=''>Todas as cidades</option>{deliveryCities.map((city) => <option key={city} value={city}>{city}</option>)}</select>
                        <select className='rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-0' value={deliveryPlan} onChange={(event) => setDeliveryPlan(event.target.value)}><option value=''>Todos os tipos de cesta</option>{deliveryPlans.map((plan) => <option key={plan} value={plan}>{plan}</option>)}</select>
                        <input className='rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-0' type='date' value={deliveryDate} onChange={(event) => setDeliveryDate(event.target.value)} />
                    </div>
                    <div className='mt-4 grid gap-4 md:grid-cols-[1fr_auto]'>
                        <select className='rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-0' value={deliveryStatus} onChange={(event) => setDeliveryStatus(event.target.value)}><option value=''>Todos os status</option>{deliveryStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select>
                        <button type='button' onClick={() => { setDeliverySearch(''); setDeliveryCity(''); setDeliveryPlan(''); setDeliveryDate(''); setDeliveryStatus(''); }} className='rounded-2xl border border-gray-200 px-5 py-3 font-Manrope'>Limpar filtros</button>
                    </div>
                    <div className='mt-8 grid gap-4'>
                        {filtered.map((delivery) => (
                            <div key={delivery.id} className='rounded-2xl border border-gray-100 bg-gray-50 p-4'>
                                <div className='grid gap-4 xl:grid-cols-[1.1fr_1.2fr_0.8fr_0.8fr_0.7fr_auto] xl:items-center'>
                                    <div><p className='text-sm'>Cliente</p><p className='font-Manrope font-semibold text-BlackH1'>{delivery.customerName}</p><p className='mt-1 text-sm'>{delivery.email}</p></div>
                                    <div><p className='text-sm'>Endereco</p><p className='font-Manrope font-semibold text-BlackH1'>{delivery.addressLine}</p><p className='mt-1 text-sm'>{delivery.city}{delivery.addressReference ? ` - ${delivery.addressReference}` : ''}</p></div>
                                    <div><p className='text-sm'>Cesta</p><p className='font-Manrope font-semibold text-BlackH1'>{delivery.planName}</p><p className='mt-1 text-sm'>{delivery.basketProfile}</p></div>
                                    <div><p className='text-sm'>Entrega</p><p className='font-Manrope font-semibold text-BlackH1'>{delivery.deliveryDate}</p><p className='mt-1 text-sm'>{delivery.deliveryWindow}</p></div>
                                    <div><p className='text-sm'>Status</p><span className='mt-1 inline-flex rounded-full bg-gray-200 px-4 py-2 text-sm font-Manrope text-BlackH1'>{delivery.status}</span></div>
                                    <div className='flex flex-wrap gap-2 xl:justify-end'>
                                        <button type='button' onClick={() => openDeliveryModal(delivery)} className='rounded-2xl border border-gray-200 px-4 py-2 font-Manrope'>Detalhes</button>
                                        <button type='button' onClick={() => { setSelectedDelivery(delivery); void updateDeliveryStatus('Enviado'); }} className='rounded-2xl bg-YellowP px-4 py-2 font-Manrope'>Marcar enviado</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {!filtered.length ? <div className='rounded-2xl border border-dashed border-gray-200 p-6 text-center'><p>Nenhuma entrega encontrada com os filtros atuais.</p></div> : null}
                    </div>
                </section>
            </section>
        );
    }, [data.deliveryRows, deliveryCity, deliveryDate, deliveryPlan, deliverySearch, deliveryStatus, deliveryCities, deliveryPlans, nextDeliveryDate, sentDeliveries, upcomingDeliveries]);

    const content = useMemo(() => {
        if (activeTab === 'entregas') return deliveryContent;

        if (activeTab === 'clientes') {
            const filteredClients = data.registeredClients.filter((client) => `${client.name} ${client.email ?? ''} ${client.plan} ${client.status} ${client.city}`.toLowerCase().includes(clientSearch.toLowerCase()));
            return (
                <section className='rounded-[32px] bg-white p-6 shadow-md lg:p-8'>
                    <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
                        <div><h2 className='text-3xl font-bold'>Clientes registrados</h2><p className='mt-2'>Aqui entram apenas clientes reais.</p></div>
                        <div className='w-full lg:max-w-sm'><input className='w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-0' placeholder='Pesquisar cliente' type='text' value={clientSearch} onChange={(event) => setClientSearch(event.target.value)} /></div>
                    </div>
                    <div className='mt-8 grid gap-4'>
                        {filteredClients.map((client) => <button key={`${client.id}-${client.email}`} type='button' onClick={() => { setSelectedClient(client); setActiveModal('clienteDetalhe'); }} className='grid gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left md:grid-cols-[1.2fr_1fr_0.9fr_0.9fr_auto] md:items-center'><div><p className='text-sm'>Cliente</p><p className='font-Manrope font-semibold text-BlackH1'>{client.name}</p><p className='mt-1 text-sm'>{client.email}</p></div><div><p className='text-sm'>Plano</p><p className='font-Manrope font-semibold text-BlackH1'>{client.plan}</p></div><div><p className='text-sm'>Status</p><span className={`mt-1 inline-flex rounded-full px-4 py-2 text-sm font-Manrope ${client.status === 'Ativa' ? 'bg-GreenP/15 text-GreenP' : 'bg-YellowP/35 text-BlackH1'}`}>{client.status}</span></div><div><p className='text-sm'>Cidade</p><p className='font-Manrope font-semibold text-BlackH1'>{client.city}</p></div><span className='font-Manrope text-GreenP'>Abrir</span></button>)}
                    </div>
                </section>
            );
        }

        if (activeTab === 'financeiro') {
            return (
                <section className='grid gap-6'>
                    <div className='rounded-[32px] bg-white p-6 shadow-md lg:p-8'><h2 className='text-3xl font-bold'>Financeiro</h2><p className='mt-2'>Metricas sem contas administrativas.</p><div className='mt-8 grid gap-4 md:grid-cols-3'>{data.financeRows.map((row) => <div key={row.label} className='rounded-2xl bg-gray-50 p-5'><p className='text-sm'>{row.label}</p><h3 className='mt-2 text-3xl font-bold'>{row.value}</h3></div>)}</div></div>
                    <div className='rounded-[32px] bg-white p-6 shadow-md lg:p-8'><div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'><div><h3 className='text-2xl font-bold'>Fluxo recente</h3><p className='mt-2'>Alertas para revisar no caixa e na operacao.</p></div><button type='button' onClick={() => setActiveModal('financeiro')} className='rounded-2xl border border-gray-200 px-5 py-3 font-Manrope'>Ver resumo</button></div><div className='mt-8 grid gap-4'>{data.overviewAlerts.map((entry) => <div key={entry} className='rounded-2xl border border-gray-100 bg-gray-50 p-4'><p className='font-Manrope text-BlackH1'>{entry}</p></div>)}</div></div>
                </section>
            );
        }

        if (activeTab === 'cupons') {
            return (
                <section className='rounded-[32px] bg-white p-6 shadow-md lg:p-8'>
                    <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'><div><h2 className='text-3xl font-bold'>Cupons de desconto</h2><p className='mt-2'>Crie, edite e acompanhe os cupons no banco.</p></div><button type='button' onClick={() => openCouponModal()} className='rounded-2xl bg-YellowP px-6 py-3 font-Manrope'>Novo cupom</button></div>
                    <div className='mt-8 grid gap-4'>{data.couponRows.map((coupon) => <button key={coupon.id} type='button' onClick={() => openCouponModal(coupon)} className='grid gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left md:grid-cols-[1fr_0.7fr_0.7fr_0.7fr_auto] md:items-center'><div><p className='text-sm'>Codigo</p><p className='font-Manrope font-semibold text-BlackH1'>{coupon.code}</p></div><div><p className='text-sm'>Status</p><p className='font-Manrope font-semibold text-BlackH1'>{coupon.status}</p></div><div><p className='text-sm'>Uso</p><p className='font-Manrope font-semibold text-BlackH1'>{coupon.usage}</p></div><div><p className='text-sm'>Desconto</p><p className='font-Manrope font-semibold text-BlackH1'>{coupon.discount}</p></div><span className='font-Manrope text-GreenP'>Editar</span></button>)}</div>
                </section>
            );
        }

        if (activeTab === 'assinaturas') {
            return (
                <section className='rounded-[32px] bg-white p-6 shadow-md lg:p-8'>
                    <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'><div><h2 className='text-3xl font-bold'>Assinaturas e planos</h2><p className='mt-2'>Crie planos e ajuste valores direto no sistema.</p></div><button type='button' onClick={() => openPlanModal()} className='rounded-2xl bg-YellowP px-5 py-3 font-Manrope'>Novo plano</button></div>
                    <div className='mt-8 grid gap-4 md:grid-cols-3'>{data.subscriptionRows.map((row) => <button key={row.id} type='button' onClick={() => openPlanModal(row)} className='rounded-2xl bg-gray-50 p-5 text-left'><p className='text-sm'>Plano</p><h3 className='mt-2 text-2xl font-bold'>{row.plan}</h3><p className='mt-3 font-Manrope'>{row.monthlyPrice}</p><p className='mt-2 text-sm'>{row.description}</p><p className='mt-4'>{row.subscribers}</p><p className='mt-1 text-sm'>{row.renewals}</p><span className='mt-4 inline-block font-Manrope text-GreenP'>Editar plano</span></button>)}</div>
                </section>
            );
        }

        return (
            <section className='grid gap-6'>
                <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
                    <AdminMetricCard title='Clientes ativos' value={`${data.registeredClients.filter((client) => client.status === 'Ativa').length}`} description='Clientes reais com assinatura ativa hoje.' icon={FiUsers} delay={0.05} />
                    <AdminMetricCard title='Receita prevista' value={data.financeRows[0]?.value ?? 'R$ 0,00'} description='Total mensal sem contas administrativas.' icon={FiBarChart2} delay={0.1} />
                    <AdminMetricCard title='Cupons ativos' value={`${data.couponRows.filter((coupon) => coupon.status === 'Ativo').length}`} description='Campanhas disponiveis para uso.' icon={FiGift} delay={0.15} />
                    <AdminMetricCard title='Entregas proximas' value={upcomingDeliveries.toString()} description='Cestas com entrega futura para organizar rota.' icon={FiTruck} delay={0.2} />
                </div>
                <div className='grid gap-6 xl:grid-cols-[1.1fr_0.9fr]'>
                    <div className='rounded-[32px] bg-white p-6 shadow-md lg:p-8'><div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'><div><h2 className='text-3xl font-bold'>Visao operacional</h2><p className='mt-2'>Resumo do que precisa de atencao agora.</p></div><button type='button' onClick={() => setActiveModal('overview')} className='rounded-2xl bg-YellowP px-6 py-3 font-Manrope'>Atualizar dados</button></div><div className='mt-8 grid gap-4 md:grid-cols-2'>{data.overviewAlerts.map((item) => <button key={item} type='button' onClick={() => setActiveModal('overview')} className='rounded-2xl bg-gray-50 p-5 text-left'><p className='font-Manrope text-BlackH1'>{item}</p></button>)}</div></div>
                    <div className='rounded-[32px] bg-white p-6 shadow-md lg:p-8'><h2 className='text-3xl font-bold'>Atalhos de gestao</h2><div className='mt-8 space-y-4'>{data.shortcuts.map((shortcut) => <button key={shortcut} type='button' onClick={() => { if (shortcut === 'Consultar cliente') setActiveModal('clienteDetalhe'); if (shortcut === 'Criar cupom promocional') openCouponModal(); if (shortcut === 'Revisar cobrancas pendentes') setActiveModal('financeiro'); if (shortcut === 'Atualizar composicao das cestas') openPlanModal(); }} className='w-full rounded-2xl border border-gray-200 px-4 py-4 text-left transition-colors hover:border-GreenP/60'><span className='font-Manrope font-semibold text-BlackH1'>{shortcut}</span></button>)}<button type='button' onClick={() => setActiveTab('entregas')} className='w-full rounded-2xl border border-gray-200 px-4 py-4 text-left transition-colors hover:border-GreenP/60'><span className='font-Manrope font-semibold text-BlackH1'>Acompanhar entregas proximas</span></button></div></div>
                </div>
            </section>
        );
    }, [activeTab, clientSearch, data, deliveryContent, upcomingDeliveries]);

    return (
        <main className='bgService min-h-[calc(100vh-92px)]'>
            <section className='gradient2 py-16 lg:py-20'>
                <div className='maxW'>
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='mb-10'>
                        <h6 className='text-xl'>Painel administrativo</h6>
                        <h1 className='mt-2 text-3xl font-bold lg:text-5xl'>Controle do sistema de assinaturas.</h1>
                        <p className='mt-4 max-w-3xl'>Clientes, financeiro, cupons, planos e agora operacao de entregas conectados ao banco.</p>
                    </motion.div>

                    <div className='grid gap-6 xl:grid-cols-[320px_1fr]'>
                        <AdminSidebar items={sidebarItems} activeTab={activeTab} onSelect={setActiveTab} />
                        <div>{content}</div>
                    </div>
                </div>
            </section>

            <PainelModal title='Detalhes do cliente' subtitle='Consulta rapida' isOpen={activeModal === 'clienteDetalhe'} onClose={() => setActiveModal(null)}>
                <div className='grid gap-4 md:grid-cols-2'>
                    <div className='rounded-2xl bg-gray-50 p-5'><p className='text-sm'>Cliente</p><h3 className='mt-2 text-2xl font-bold'>{selectedClient?.name ?? '--'}</h3></div>
                    <div className='rounded-2xl bg-gray-50 p-5'><p className='text-sm'>Email</p><h3 className='mt-2 break-all text-xl font-bold'>{selectedClient?.email ?? '--'}</h3></div>
                    <div className='rounded-2xl bg-gray-50 p-5'><p className='text-sm'>Plano atual</p><h3 className='mt-2 text-2xl font-bold'>{selectedClient?.plan ?? '--'}</h3></div>
                    <div className='rounded-2xl bg-gray-50 p-5'><p className='text-sm'>Status</p><h3 className='mt-2 text-2xl font-bold'>{selectedClient?.status ?? '--'}</h3></div>
                </div>
            </PainelModal>

            <PainelModal title='Relatorio financeiro' subtitle='Resumo do caixa' isOpen={activeModal === 'financeiro'} onClose={() => setActiveModal(null)}>
                <div className='grid gap-4 md:grid-cols-3'>{data.financeRows.map((row) => <div key={row.label} className='rounded-2xl bg-gray-50 p-5'><p className='text-sm'>{row.label}</p><h3 className='mt-2 text-2xl font-bold'>{row.value}</h3></div>)}</div>
            </PainelModal>

            <PainelModal title={couponForm.id ? 'Editar cupom' : 'Novo cupom'} subtitle='Gestao de desconto' isOpen={activeModal === 'cupom'} onClose={() => setActiveModal(null)}>
                <div className='grid gap-4 md:grid-cols-2'>
                    <input className='rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-0' value={couponForm.code} onChange={(event) => setCouponForm({ ...couponForm, code: event.target.value.toUpperCase() })} placeholder='Codigo do cupom' type='text' />
                    <select className='rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-0' value={couponForm.status} onChange={(event) => setCouponForm({ ...couponForm, status: event.target.value })}><option value='Ativo'>Ativo</option><option value='Rascunho'>Rascunho</option><option value='Inativo'>Inativo</option></select>
                    <input className='rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-0 md:col-span-2' value={couponForm.discount} onChange={(event) => setCouponForm({ ...couponForm, discount: event.target.value })} placeholder='Ex.: 10% off ou R$ 20 off' type='text' />
                </div>
                {feedback ? <p className='mt-4 text-sm text-red-500'>{feedback}</p> : null}
                <button type='button' onClick={saveCoupon} className='mt-8 rounded-2xl bg-YellowP px-6 py-3 font-Manrope' disabled={savingCoupon}>{savingCoupon ? 'Salvando...' : 'Salvar cupom'}</button>
            </PainelModal>

            <PainelModal title={planForm.id ? 'Editar plano' : 'Novo plano'} subtitle='Gestao das assinaturas' isOpen={activeModal === 'plano'} onClose={() => setActiveModal(null)}>
                <div className='grid gap-4'>
                    <input className='rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-0' value={planForm.plan} onChange={(event) => setPlanForm({ ...planForm, plan: event.target.value })} placeholder='Nome do plano' type='text' />
                    <input className='rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-0' value={planForm.slug} onChange={(event) => setPlanForm({ ...planForm, slug: event.target.value })} placeholder='Slug do plano' type='text' />
                    <input className='rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-0' value={planForm.monthlyPriceValue ?? 0} onChange={(event) => setPlanForm({ ...planForm, monthlyPriceValue: Number(event.target.value) })} placeholder='Valor mensal' type='number' min='0' step='0.01' />
                    <textarea className='min-h-32 resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-0' value={planForm.description ?? ''} onChange={(event) => setPlanForm({ ...planForm, description: event.target.value })} placeholder='Descricao do plano' />
                </div>
                {feedback ? <p className='mt-4 text-sm text-red-500'>{feedback}</p> : null}
                <button type='button' onClick={savePlan} className='mt-8 rounded-2xl bg-YellowP px-6 py-3 font-Manrope' disabled={savingPlan}>{savingPlan ? 'Salvando...' : 'Salvar plano'}</button>
            </PainelModal>

            <PainelModal title='Atualizacao operacional' subtitle='Visao geral' isOpen={activeModal === 'overview'} onClose={() => setActiveModal(null)}>
                <div className='grid gap-4'>{data.overviewAlerts.map((item) => <div key={item} className='rounded-2xl border border-gray-100 bg-gray-50 p-4'><p className='font-Manrope text-BlackH1'>{item}</p></div>)}</div>
            </PainelModal>

            <PainelModal title='Detalhes da entrega' subtitle='Operacao logistica' isOpen={activeModal === 'entrega'} onClose={() => setActiveModal(null)}>
                <div className='grid gap-4 md:grid-cols-2'>
                    <div className='rounded-2xl bg-gray-50 p-5'><p className='text-sm'>Cliente</p><h3 className='mt-2 text-2xl font-bold'>{selectedDelivery.customerName || '--'}</h3><p className='mt-2 text-sm'>{selectedDelivery.email}</p></div>
                    <div className='rounded-2xl bg-gray-50 p-5'><p className='text-sm'>Status</p><h3 className='mt-2 text-2xl font-bold'>{selectedDelivery.status || '--'}</h3><p className='mt-2 text-sm'>{selectedDelivery.deliveryDate} - {selectedDelivery.deliveryWindow}</p></div>
                    <div className='rounded-2xl bg-gray-50 p-5'><p className='text-sm'>Endereco</p><h3 className='mt-2 text-xl font-bold'>{selectedDelivery.addressLine || '--'}</h3><p className='mt-2 text-sm'>{selectedDelivery.city}{selectedDelivery.addressReference ? ` - ${selectedDelivery.addressReference}` : ''}</p></div>
                    <div className='rounded-2xl bg-gray-50 p-5'><p className='text-sm'>Cesta</p><h3 className='mt-2 text-xl font-bold'>{selectedDelivery.planName || '--'}</h3><p className='mt-2 text-sm'>{selectedDelivery.basketProfile}</p></div>
                </div>
                <div className='mt-8 grid gap-3 md:grid-cols-2'>
                    {deliveryStatuses.map((status) => <button key={status} type='button' onClick={() => void updateDeliveryStatus(status)} disabled={savingDelivery} className={`rounded-2xl px-5 py-3 font-Manrope ${selectedDelivery.status === status ? 'bg-BlackMain text-white' : 'border border-gray-200'}`}>{savingDelivery ? 'Atualizando...' : `Marcar como ${status}`}</button>)}
                </div>
                {feedback ? <p className='mt-4 text-sm text-red-500'>{feedback}</p> : null}
            </PainelModal>
        </main>
    );
}
