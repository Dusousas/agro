import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FiCalendar,
    FiCheckCircle,
    FiCreditCard,
    FiEdit3,
    FiMapPin,
    FiPackage,
    FiRefreshCcw,
} from 'react-icons/fi';
import { CustomerDashboardData } from '@/lib/types';
import PainelModal from './PainelModal';
import StatCard from './StatCard';

type ModalKey =
    | 'planos'
    | 'planoAtual'
    | 'proximaEntrega'
    | 'cartoes'
    | 'novoCartao'
    | 'pagamentos'
    | 'status'
    | 'endereco'
    | 'alterarPlano'
    | 'atualizarEndereco'
    | 'pedirAjuste'
    | null;

const quickActions = [
    { key: 'alterarPlano' as const, title: 'Alterar plano', description: 'Troque sua assinatura por outro pacote sem sair do painel.', icon: FiRefreshCcw },
    { key: 'atualizarEndereco' as const, title: 'Atualizar endereço', description: 'Edite local, referência e instruções da sua entrega.', icon: FiMapPin },
    { key: 'pedirAjuste' as const, title: 'Pedir ajuste', description: 'Solicite observações ou ajustes para a próxima cesta.', icon: FiEdit3 },
];

type PainelDashboardProps = {
    data: CustomerDashboardData;
};

export default function PainelDashboard({ data }: PainelDashboardProps) {
    const [selectedPlan, setSelectedPlan] = useState(data.selectedPlanName);
    const [activeModal, setActiveModal] = useState<ModalKey>(null);

    const paidSubscriptions = useMemo(
        () => data.paymentHistory.filter((payment) => payment.status === 'Pago').length,
        [data.paymentHistory]
    );

    const currentPlan = useMemo(
        () => data.availablePlans.find((plan) => plan.name === selectedPlan) ?? data.availablePlans[0],
        [data.availablePlans, selectedPlan]
    );

    const primaryCard = data.cards.find((card) => card.isPrimary) ?? data.cards[0];
    const secondaryCard = data.cards.find((card) => !card.isPrimary);

    return (
        <main className='bgService min-h-[calc(100vh-92px)]'>
            <section className='gradient2 py-16 lg:py-20'>
                <div className='maxW'>
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className='flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between'
                    >
                        <div>
                            <h6 className='text-xl'>Painel da assinatura</h6>
                            <h1 className='text-3xl lg:text-5xl font-bold mt-2'>Seu dashboard da assinatura, simples e direto.</h1>
                            <p className='mt-4 max-w-3xl'>
                                Aqui o cliente acompanha plano, entregas, pagamentos e ações principais sem sair da tela. Essa versão já pode carregar dados reais do Postgres quando a conexão estiver configurada.
                            </p>
                        </div>

                        <button
                            type='button'
                            onClick={() => setActiveModal('planos')}
                            className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope text-center'
                        >
                            Ver outros planos
                        </button>
                    </motion.div>

                    <div className='grid gap-6 mt-12 md:grid-cols-2 xl:grid-cols-4'>
                        <StatCard title='Plano atual' value={currentPlan?.name ?? 'Sem plano'} description='Assinatura mensal ativa com entrega recorrente.' icon={FiPackage} delay={0.05} onClick={() => setActiveModal('planoAtual')} />
                        <StatCard title='Próxima entrega' value={data.subscription.nextDeliveryDate} description={`${data.subscription.deliveryWindow} em ${data.customer.city}.`} icon={FiCalendar} delay={0.1} onClick={() => setActiveModal('proximaEntrega')} />
                        <StatCard title='Meus cartões' value={`${data.cards.length} cartões`} description='Salve os cartões usados na cobrança recorrente do serviço.' icon={FiCreditCard} delay={0.15} onClick={() => setActiveModal('cartoes')} />
                        <StatCard title='Status da assinatura' value={data.subscription.status} description='Seu plano está ativo e pronto para a próxima entrega.' icon={FiCheckCircle} delay={0.2} dark onClick={() => setActiveModal('status')} />
                    </div>

                    <div className='grid gap-6 mt-10 xl:grid-cols-[1.35fr_0.65fr] xl:items-stretch'>
                        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.25 }} className='bg-white rounded-[32px] shadow-md p-6 lg:p-8 h-full'>
                            <div className='flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between'>
                                <div>
                                    <h2 className='text-2xl font-bold'>Próxima cesta</h2>
                                    <p className='mt-2'>Itens previstos para sua próxima entrega carregados da assinatura atual.</p>
                                </div>
                                <div className='flex flex-wrap gap-3'>
                                    <span className='bg-GreenP/10 text-GreenP font-Manrope text-sm px-4 py-2 rounded-full inline-block'>{currentPlan?.name ?? 'Plano'}</span>
                                    <button type='button' onClick={() => setActiveModal('pedirAjuste')} className='border border-gray-200 px-4 py-2 rounded-full font-Manrope text-sm text-BlackH1'>Ajustar cesta</button>
                                </div>
                            </div>

                            <div className='grid gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-3'>
                                {data.nextBasket.map((item) => (
                                    <div key={item} className='bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4'>
                                        <p className='text-BlackH1 font-Manrope font-semibold'>{item}</p>
                                        <p className='text-sm mt-1'>Item sujeito à sazonalidade.</p>
                                    </div>
                                ))}
                            </div>

                            <div className='grid gap-4 mt-8 md:grid-cols-3'>
                                <div className='rounded-2xl bg-[#F7FAEF] p-5'>
                                    <p className='text-sm'>Entrega preferencial</p>
                                    <h3 className='text-2xl font-bold mt-2'>{data.subscription.deliveryDay}</h3>
                                    <p className='text-sm mt-2'>{data.subscription.deliveryWindow}.</p>
                                </div>
                                <div className='rounded-2xl bg-[#FFF8DE] p-5'>
                                    <p className='text-sm'>Perfil da cesta</p>
                                    <h3 className='text-2xl font-bold mt-2'>{data.subscription.basketProfile}</h3>
                                    <p className='text-sm mt-2'>Preferência atual da assinatura.</p>
                                </div>
                                <button type='button' onClick={() => setActiveModal('endereco')} className='rounded-2xl bg-[#F3F5F4] p-5 text-left'>
                                    <p className='text-sm'>Endereço cadastrado</p>
                                    <h3 className='text-2xl font-bold mt-2'>{data.customer.city}</h3>
                                    <p className='text-sm mt-2'>{data.customer.addressLine}</p>
                                    <span className='inline-block mt-4 font-Manrope text-GreenP'>Editar dados</span>
                                </button>
                            </div>
                        </motion.section>

                        <motion.aside initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.3 }} className='h-full'>
                            <section className='bg-white rounded-[32px] shadow-md p-6 lg:p-8 h-full flex flex-col'>
                                <div className='flex items-start justify-between gap-4'>
                                    <div>
                                        <h2 className='text-2xl font-bold'>Ações rápidas</h2>
                                        <p className='mt-2'>Clique em uma ação para abrir um popup sem sair do painel.</p>
                                    </div>
                                    <span className='bg-YellowP/40 text-BlackH1 px-3 py-2 rounded-full text-xs font-Manrope'>Dashboard</span>
                                </div>

                                <div className='space-y-4 mt-8 flex-1'>
                                    {quickActions.map((action) => {
                                        const Icon = action.icon;
                                        return (
                                            <button key={action.title} type='button' onClick={() => setActiveModal(action.key)} className='w-full text-left border border-gray-200 rounded-2xl p-4 hover:border-GreenP/60 transition-colors'>
                                                <Icon className='text-3xl text-GreenP' />
                                                <h3 className='text-lg font-bold mt-4'>{action.title}</h3>
                                                <p className='text-sm mt-1'>{action.description}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        </motion.aside>
                    </div>

                    <div className='grid gap-6 mt-10 xl:grid-cols-2'>
                        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.35 }} className='bg-white rounded-[32px] shadow-md p-6 lg:p-8'>
                            <div className='flex items-end justify-between gap-4'>
                                <div>
                                    <h2 className='text-2xl font-bold'>Resumo da conta</h2>
                                    <p className='mt-2'>Informações rápidas do relacionamento do cliente com a assinatura.</p>
                                </div>
                                <button type='button' onClick={() => setActiveModal('status')} className='font-Manrope text-GreenP'>Ver detalhes</button>
                            </div>

                            <div className='mt-8 space-y-4'>
                                <div className='rounded-2xl bg-gray-50 p-4'><p className='text-sm'>Cliente desde</p><h3 className='text-3xl font-bold mt-2'>{data.customerSummary.since}</h3></div>
                                <div className='rounded-2xl bg-gray-50 p-4'><p className='text-sm'>Entregas concluídas</p><h3 className='text-xl font-bold mt-2'>{data.customerSummary.deliveriesCompleted}</h3></div>
                                <div className='rounded-2xl bg-gray-50 p-4'><p className='text-sm'>Última atualização</p><h3 className='text-xl font-bold mt-2'>{data.customerSummary.lastUpdate}</h3></div>
                            </div>
                        </motion.section>

                        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.4 }} className='bg-white rounded-[32px] shadow-md p-6 lg:p-8'>
                            <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
                                <div>
                                    <h2 className='text-2xl font-bold'>Histórico de pagamentos</h2>
                                    <p className='mt-2'>Uma visão rápida dos últimos ciclos da assinatura.</p>
                                </div>
                                <button type='button' onClick={() => setActiveModal('pagamentos')} className='border border-gray-200 px-5 py-3 rounded-2xl font-Manrope'>Abrir detalhes</button>
                            </div>

                            <div className='grid gap-4 mt-8'>
                                <div className='grid gap-4 md:grid-cols-2'>
                                    <button type='button' onClick={() => setActiveModal('cartoes')} className='rounded-2xl bg-[#F7FAEF] p-5 text-left'>
                                        <p className='text-sm'>Cartão da cobrança</p>
                                        <h3 className='text-2xl font-bold mt-2'>{primaryCard ? `${primaryCard.brand} final ${primaryCard.last4}` : 'Sem cartão'}</h3>
                                        <p className='text-sm mt-2'>Usado na assinatura recorrente.</p>
                                        <span className='inline-block mt-4 font-Manrope text-GreenP'>Gerenciar cartões</span>
                                    </button>
                                    <div className='rounded-2xl bg-[#FFF8DE] p-5'>
                                        <p className='text-sm'>Cupom de desconto</p>
                                        <h3 className='text-2xl font-bold mt-2'>{data.appliedCoupon.code}</h3>
                                        <p className='text-sm mt-2'>{data.appliedCoupon.description}</p>
                                    </div>
                                </div>

                                {data.paymentHistory.map((payment) => (
                                    <div key={`${payment.month}-${payment.method}`} className='grid gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center'>
                                        <div><p className='text-sm'>Referência</p><p className='font-Manrope font-semibold text-BlackH1'>{payment.month}</p></div>
                                        <div><p className='text-sm'>Forma</p><p className='font-Manrope font-semibold text-BlackH1'>{payment.method}</p></div>
                                        <div><p className='text-sm'>Valor</p><p className='font-Manrope font-semibold text-BlackH1'>{payment.amount}</p></div>
                                        <span className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-Manrope ${payment.status === 'Pago' ? 'bg-GreenP/15 text-GreenP' : 'bg-YellowP/35 text-BlackH1'}`}>{payment.status}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    </div>
                </div>
            </section>

            <PainelModal title='Alterar plano da assinatura' subtitle='Planos disponíveis' isOpen={activeModal === 'planos' || activeModal === 'alterarPlano'} onClose={() => setActiveModal(null)}>
                <p>Escolha outro pacote para a assinatura. Quando o backend estiver completo, esta troca pode salvar direto no banco.</p>
                <div className='grid gap-4 mt-8'>
                    {data.availablePlans.map((plan) => {
                        const isCurrent = currentPlan?.name === plan.name;
                        return (
                            <button key={plan.name} type='button' onClick={() => setSelectedPlan(plan.name)} className={`w-full text-left rounded-[24px] border p-5 transition-all ${isCurrent ? 'border-GreenP bg-[#F7FAEF]' : 'border-gray-200 hover:border-GreenP/60'}`}>
                                <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
                                    <div><h3 className='text-xl font-bold'>{plan.name}</h3><p className='mt-2'>{plan.description}</p></div>
                                    <div className='md:text-right'><p className='text-sm'>Valor mensal</p><p className='text-2xl font-bold text-BlackH1 mt-1'>{plan.monthlyPrice}</p></div>
                                </div>
                                <span className='inline-block mt-4 font-Manrope text-GreenP'>{isCurrent ? 'Plano selecionado' : 'Selecionar este plano'}</span>
                            </button>
                        );
                    })}
                </div>
            </PainelModal>

            <PainelModal title='Detalhes do plano atual' subtitle='Resumo da assinatura' isOpen={activeModal === 'planoAtual'} onClose={() => setActiveModal(null)}>
                <div className='grid gap-4 md:grid-cols-2'>
                    <div className='rounded-2xl bg-gray-50 p-5'><p className='text-sm'>Plano</p><h3 className='text-2xl font-bold mt-2'>{currentPlan?.name}</h3></div>
                    <div className='rounded-2xl bg-gray-50 p-5'><p className='text-sm'>Valor</p><h3 className='text-2xl font-bold mt-2'>{currentPlan?.monthlyPrice}</h3></div>
                </div>
                <p className='mt-6'>{currentPlan?.description}</p>
                <button type='button' onClick={() => setActiveModal('alterarPlano')} className='mt-8 bg-YellowP px-6 py-3 rounded-2xl font-Manrope'>Trocar plano</button>
            </PainelModal>

            <PainelModal title='Informações da próxima entrega' subtitle='Entrega programada' isOpen={activeModal === 'proximaEntrega'} onClose={() => setActiveModal(null)}>
                <div className='space-y-4'>
                    <div className='rounded-2xl bg-gray-50 p-5'><p className='text-sm'>Data prevista</p><h3 className='text-2xl font-bold mt-2'>{data.subscription.nextDeliveryDate}</h3></div>
                    <div className='rounded-2xl bg-gray-50 p-5'><p className='text-sm'>Janela de entrega</p><h3 className='text-2xl font-bold mt-2'>{data.subscription.deliveryWindow}</h3></div>
                    <div className='rounded-2xl bg-gray-50 p-5'><p className='text-sm'>Observação</p><h3 className='text-xl font-bold mt-2'>Entrega residencial em {data.customer.city}</h3></div>
                </div>
            </PainelModal>

            <PainelModal title='Meus cartões' subtitle='Cobrança da assinatura' isOpen={activeModal === 'cartoes'} onClose={() => setActiveModal(null)}>
                <div className='grid gap-4'>
                    {primaryCard ? <div className='rounded-[24px] bg-BlackMain p-5 text-white'><p className='text-white/70 text-sm'>Cartão principal</p><h3 className='text-2xl font-bold mt-3'>{primaryCard.brand} final {primaryCard.last4}</h3><p className='text-white/80 mt-2'>Expira em {primaryCard.expMonth}/{primaryCard.expYear}</p><span className='inline-block mt-4 text-YellowP font-Manrope'>Usado para a cobrança recorrente</span></div> : null}
                    {secondaryCard ? <div className='rounded-[24px] border border-gray-200 p-5'><p className='text-sm'>Cartão reserva</p><h3 className='text-2xl font-bold mt-3'>{secondaryCard.brand} final {secondaryCard.last4}</h3><p className='mt-2'>Expira em {secondaryCard.expMonth}/{secondaryCard.expYear}</p></div> : null}
                </div>
                <div className='grid gap-4 mt-8 md:grid-cols-2'>
                    <button type='button' onClick={() => setActiveModal('novoCartao')} className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope'>Adicionar novo cartão</button>
                    <button type='button' className='border border-gray-200 px-6 py-3 rounded-2xl font-Manrope'>Definir cartão principal</button>
                </div>
            </PainelModal>

            <PainelModal title='Adicionar cartão e cupom' subtitle='Nova forma de pagamento' isOpen={activeModal === 'novoCartao'} onClose={() => setActiveModal(null)}>
                <div className='grid gap-4 md:grid-cols-2'>
                    <div className='flex flex-col gap-2'><label className='font-Manrope font-semibold text-BlackH1'>Nome no cartão</label><input className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0' placeholder='Como está no cartão' type='text' /></div>
                    <div className='flex flex-col gap-2'><label className='font-Manrope font-semibold text-BlackH1'>Número do cartão</label><input className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0' placeholder='0000 0000 0000 0000' type='text' /></div>
                </div>
                <div className='grid gap-4 mt-4 md:grid-cols-3'>
                    <div className='flex flex-col gap-2'><label className='font-Manrope font-semibold text-BlackH1'>Validade</label><input className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0' placeholder='MM/AA' type='text' /></div>
                    <div className='flex flex-col gap-2'><label className='font-Manrope font-semibold text-BlackH1'>CVV</label><input className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0' placeholder='123' type='text' /></div>
                    <div className='flex flex-col gap-2'><label className='font-Manrope font-semibold text-BlackH1'>CPF do titular</label><input className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0' placeholder='000.000.000-00' type='text' /></div>
                </div>
                <div className='rounded-[24px] border border-dashed border-GreenP/40 bg-[#F7FAEF] p-5 mt-8'>
                    <p className='text-sm'>Cupom de desconto</p>
                    <h3 className='text-2xl font-bold mt-2'>Aplicar cupom na assinatura</h3>
                    <div className='grid gap-4 mt-4 md:grid-cols-[1fr_auto]'>
                        <input className='bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-0' placeholder='Digite seu cupom' type='text' />
                        <button type='button' className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope'>Aplicar cupom</button>
                    </div>
                </div>
                <div className='grid gap-4 mt-8 md:grid-cols-2'>
                    <button type='button' className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope'>Salvar cartão</button>
                    <button type='button' className='border border-gray-200 px-6 py-3 rounded-2xl font-Manrope'>Salvar e definir principal</button>
                </div>
            </PainelModal>

            <PainelModal title='Pagamentos da assinatura' subtitle='Histórico financeiro' isOpen={activeModal === 'pagamentos'} onClose={() => setActiveModal(null)}>
                <div className='grid gap-4 md:grid-cols-3'>
                    <div className='rounded-2xl bg-[#F7FAEF] p-5'><p className='text-sm'>Meses pagos</p><h3 className='text-3xl font-bold mt-2'>{paidSubscriptions}</h3></div>
                    <div className='rounded-2xl bg-[#FFF8DE] p-5'><p className='text-sm'>Em aberto</p><h3 className='text-3xl font-bold mt-2'>{data.paymentHistory.filter((payment) => payment.status !== 'Pago').length}</h3></div>
                    <div className='rounded-2xl bg-gray-50 p-5'><p className='text-sm'>Próximo valor</p><h3 className='text-3xl font-bold mt-2'>{currentPlan?.monthlyPrice}</h3></div>
                </div>
                <div className='grid gap-4 mt-8 md:grid-cols-2'>
                    <button type='button' onClick={() => setActiveModal('cartoes')} className='rounded-2xl border border-gray-200 p-5 text-left'><p className='text-sm'>Cartão salvo</p><h3 className='text-2xl font-bold mt-2'>{primaryCard ? `${primaryCard.brand} final ${primaryCard.last4}` : 'Sem cartão'}</h3><p className='mt-2'>Clique para adicionar ou trocar o cartão da cobrança.</p></button>
                    <div className='rounded-2xl border border-gray-200 p-5'><p className='text-sm'>Cupom de desconto</p><h3 className='text-2xl font-bold mt-2'>{data.appliedCoupon.code}</h3><p className='mt-2'>{data.appliedCoupon.description}</p><button type='button' onClick={() => setActiveModal('novoCartao')} className='mt-4 text-GreenP font-Manrope'>Aplicar outro cupom</button></div>
                </div>
                <div className='grid gap-4 mt-8'>
                    {data.paymentHistory.map((payment) => (
                        <div key={`${payment.month}-${payment.method}-${payment.status}`} className='rounded-2xl border border-gray-100 p-4'>
                            <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
                                <div><p className='text-sm'>Referência</p><h3 className='text-xl font-bold mt-1'>{payment.month}</h3></div>
                                <div><p className='text-sm'>Forma</p><h3 className='text-lg font-bold mt-1'>{payment.method}</h3></div>
                                <div><p className='text-sm'>Valor</p><h3 className='text-lg font-bold mt-1'>{payment.amount}</h3></div>
                                <span className={`inline-flex rounded-full px-4 py-2 text-sm font-Manrope ${payment.status === 'Pago' ? 'bg-GreenP/15 text-GreenP' : 'bg-YellowP/35 text-BlackH1'}`}>{payment.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </PainelModal>

            <PainelModal title='Status geral da assinatura' subtitle='Resumo da conta' isOpen={activeModal === 'status'} onClose={() => setActiveModal(null)}>
                <div className='grid gap-4 md:grid-cols-3'>
                    <div className='rounded-2xl bg-[#F7FAEF] p-5'><p className='text-sm'>Status atual</p><h3 className='text-2xl font-bold mt-2'>{data.subscription.status}</h3></div>
                    <div className='rounded-2xl bg-[#FFF8DE] p-5'><p className='text-sm'>Cliente desde</p><h3 className='text-2xl font-bold mt-2'>{data.customerSummary.since}</h3></div>
                    <div className='rounded-2xl bg-gray-50 p-5'><p className='text-sm'>Entregas realizadas</p><h3 className='text-2xl font-bold mt-2'>{data.customerSummary.deliveriesCompleted}</h3></div>
                </div>
                <div className='mt-8 rounded-2xl border border-gray-100 p-5'><p className='text-sm'>Observação</p><h3 className='text-xl font-bold mt-2'>Sem pendências no momento</h3><p className='mt-2'>Seu cadastro está ativo, o plano está em dia e a próxima cesta segue programada normalmente.</p></div>
            </PainelModal>

            <PainelModal title='Endereço da assinatura' subtitle='Dados de entrega' isOpen={activeModal === 'endereco' || activeModal === 'atualizarEndereco'} onClose={() => setActiveModal(null)}>
                <div className='space-y-4'>
                    <div className='rounded-2xl bg-gray-50 p-5'><p className='text-sm'>Local</p><h3 className='text-2xl font-bold mt-2'>{data.customer.addressLine}</h3><p className='mt-2'>{data.customer.city}</p></div>
                    <div className='rounded-2xl bg-gray-50 p-5'><p className='text-sm'>Referência</p><h3 className='text-xl font-bold mt-2'>{data.customer.addressReference}</h3></div>
                    <button type='button' className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope'>Salvar nova solicitação</button>
                </div>
            </PainelModal>

            <PainelModal title='Solicitar ajuste da cesta' subtitle='Preferências da próxima entrega' isOpen={activeModal === 'pedirAjuste'} onClose={() => setActiveModal(null)}>
                <p>Espaço pensado para o cliente informar ajustes antes da próxima montagem da cesta.</p>
                <div className='mt-8 rounded-2xl bg-gray-50 p-5'><p className='text-sm'>Exemplo de pedido</p><h3 className='text-xl font-bold mt-2'>Trocar rúcula por outra folha disponível na semana</h3></div>
                <button type='button' className='mt-8 bg-YellowP px-6 py-3 rounded-2xl font-Manrope'>Enviar ajuste</button>
            </PainelModal>
        </main>
    );
}
