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

const availablePlans = [
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
];

const nextBasket = [
    'Alface crespa',
    'Rúcula',
    'Couve',
    'Tomate',
    'Cenoura',
    'Cheiro-verde',
];

const paymentHistory = [
    { month: 'Janeiro', status: 'Pago', amount: 'R$ 215,64', method: 'PIX' },
    { month: 'Fevereiro', status: 'Pago', amount: 'R$ 215,64', method: 'Cartão' },
    { month: 'Março', status: 'Pago', amount: 'R$ 215,64', method: 'PIX' },
    { month: 'Abril', status: 'Aberto', amount: 'R$ 215,64', method: 'Agendado' },
];

const quickActions = [
    {
        key: 'alterarPlano' as const,
        title: 'Alterar plano',
        description: 'Troque sua assinatura por outro pacote sem sair do painel.',
        icon: FiRefreshCcw,
    },
    {
        key: 'atualizarEndereco' as const,
        title: 'Atualizar endereço',
        description: 'Edite local, referência e instruções da sua entrega.',
        icon: FiMapPin,
    },
    {
        key: 'pedirAjuste' as const,
        title: 'Pedir ajuste',
        description: 'Solicite observações ou ajustes para a próxima cesta.',
        icon: FiEdit3,
    },
];

export default function PainelDashboard() {
    const [selectedPlan, setSelectedPlan] = useState('Cesta Colheita');
    const [activeModal, setActiveModal] = useState<ModalKey>(null);

    const paidSubscriptions = useMemo(
        () => paymentHistory.filter((payment) => payment.status === 'Pago').length,
        []
    );

    const currentPlan = useMemo(
        () => availablePlans.find((plan) => plan.name === selectedPlan) ?? availablePlans[1],
        [selectedPlan]
    );

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
                                Aqui o cliente acompanha plano, entregas, pagamentos e ações principais sem sair da tela. É uma base enxuta, mas já com cara de dashboard e pronta para crescer.
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
                        <StatCard
                            title='Plano atual'
                            value={currentPlan.name}
                            description='Assinatura mensal ativa com entrega recorrente.'
                            icon={FiPackage}
                            delay={0.05}
                            onClick={() => setActiveModal('planoAtual')}
                        />
                        <StatCard
                            title='Próxima entrega'
                            value='30 de março'
                            description='Janela prevista entre 8h e 12h em Brotas.'
                            icon={FiCalendar}
                            delay={0.1}
                            onClick={() => setActiveModal('proximaEntrega')}
                        />
                        <StatCard
                            title='Meus cartões'
                            value='2 cartões'
                            description='Salve os cartões usados na cobrança recorrente do serviço.'
                            icon={FiCreditCard}
                            delay={0.15}
                            onClick={() => setActiveModal('cartoes')}
                        />
                        <StatCard
                            title='Status da assinatura'
                            value='Assinatura ativa'
                            description='Seu plano está ativo e pronto para a próxima entrega.'
                            icon={FiCheckCircle}
                            delay={0.2}
                            dark
                            onClick={() => setActiveModal('status')}
                        />
                    </div>

                    <div className='grid gap-6 mt-10 xl:grid-cols-[1.35fr_0.65fr] xl:items-stretch'>
                        <motion.section
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.25 }}
                            className='bg-white rounded-[32px] shadow-md p-6 lg:p-8 h-full'
                        >
                            <div className='flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between'>
                                <div>
                                    <h2 className='text-2xl font-bold'>Próxima cesta</h2>
                                    <p className='mt-2'>Itens previstos para sua próxima entrega. Depois podemos ligar isso ao cadastro real da assinatura.</p>
                                </div>
                                <div className='flex flex-wrap gap-3'>
                                    <span className='bg-GreenP/10 text-GreenP font-Manrope text-sm px-4 py-2 rounded-full inline-block'>
                                        {currentPlan.name}
                                    </span>
                                    <button
                                        type='button'
                                        onClick={() => setActiveModal('pedirAjuste')}
                                        className='border border-gray-200 px-4 py-2 rounded-full font-Manrope text-sm text-BlackH1'
                                    >
                                        Ajustar cesta
                                    </button>
                                </div>
                            </div>

                            <div className='grid gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-3'>
                                {nextBasket.map((item) => (
                                    <div key={item} className='bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4'>
                                        <p className='text-BlackH1 font-Manrope font-semibold'>{item}</p>
                                        <p className='text-sm mt-1'>Item sujeito à sazonalidade.</p>
                                    </div>
                                ))}
                            </div>

                            <div className='grid gap-4 mt-8 md:grid-cols-3'>
                                <div className='rounded-2xl bg-[#F7FAEF] p-5'>
                                    <p className='text-sm'>Entrega preferencial</p>
                                    <h3 className='text-2xl font-bold mt-2'>Segunda-feira</h3>
                                    <p className='text-sm mt-2'>Manhã, entre 8h e 12h.</p>
                                </div>
                                <div className='rounded-2xl bg-[#FFF8DE] p-5'>
                                    <p className='text-sm'>Perfil da cesta</p>
                                    <h3 className='text-2xl font-bold mt-2'>Mais folhas</h3>
                                    <p className='text-sm mt-2'>Preferência atual da assinatura.</p>
                                </div>
                                <button
                                    type='button'
                                    onClick={() => setActiveModal('endereco')}
                                    className='rounded-2xl bg-[#F3F5F4] p-5 text-left'
                                >
                                    <p className='text-sm'>Endereço cadastrado</p>
                                    <h3 className='text-2xl font-bold mt-2'>Brotas - SP</h3>
                                    <p className='text-sm mt-2'>Rua exemplo, 120, Bairro Centro</p>
                                    <span className='inline-block mt-4 font-Manrope text-GreenP'>Editar dados</span>
                                </button>
                            </div>
                        </motion.section>

                        <motion.aside
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.3 }}
                            className='h-full'
                        >
                            <section className='bg-white rounded-[32px] shadow-md p-6 lg:p-8 h-full flex flex-col'>
                                <div className='flex items-start justify-between gap-4'>
                                    <div>
                                        <h2 className='text-2xl font-bold'>Ações rápidas</h2>
                                        <p className='mt-2'>Clique em uma ação para abrir um popup sem sair do painel.</p>
                                    </div>
                                    <span className='bg-YellowP/40 text-BlackH1 px-3 py-2 rounded-full text-xs font-Manrope'>
                                        Dashboard
                                    </span>
                                </div>

                                <div className='space-y-4 mt-8 flex-1'>
                                    {quickActions.map((action) => {
                                        const Icon = action.icon;

                                        return (
                                            <button
                                                key={action.title}
                                                type='button'
                                                onClick={() => setActiveModal(action.key)}
                                                className='w-full text-left border border-gray-200 rounded-2xl p-4 hover:border-GreenP/60 transition-colors'
                                            >
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
                        <motion.section
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.35 }}
                            className='bg-white rounded-[32px] shadow-md p-6 lg:p-8'
                        >
                            <div className='flex items-end justify-between gap-4'>
                                <div>
                                    <h2 className='text-2xl font-bold'>Resumo da conta</h2>
                                    <p className='mt-2'>Informações rápidas do relacionamento do cliente com a assinatura.</p>
                                </div>
                                <button
                                    type='button'
                                    onClick={() => setActiveModal('status')}
                                    className='font-Manrope text-GreenP'
                                >
                                    Ver detalhes
                                </button>
                            </div>

                            <div className='mt-8 space-y-4'>
                                <div className='rounded-2xl bg-gray-50 p-4'>
                                    <p className='text-sm'>Cliente desde</p>
                                    <h3 className='text-3xl font-bold mt-2'>Jan/2026</h3>
                                </div>
                                <div className='rounded-2xl bg-gray-50 p-4'>
                                    <p className='text-sm'>Entregas concluídas</p>
                                    <h3 className='text-xl font-bold mt-2'>12 cestas entregues</h3>
                                </div>
                                <div className='rounded-2xl bg-gray-50 p-4'>
                                    <p className='text-sm'>Última atualização</p>
                                    <h3 className='text-xl font-bold mt-2'>Perfil revisado hoje</h3>
                                </div>
                            </div>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.4 }}
                            className='bg-white rounded-[32px] shadow-md p-6 lg:p-8'
                        >
                            <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
                                <div>
                                    <h2 className='text-2xl font-bold'>Histórico de pagamentos</h2>
                                    <p className='mt-2'>Uma visão rápida dos últimos ciclos da assinatura.</p>
                                </div>
                                <button
                                    type='button'
                                    onClick={() => setActiveModal('pagamentos')}
                                    className='border border-gray-200 px-5 py-3 rounded-2xl font-Manrope'
                                >
                                    Abrir detalhes
                                </button>
                            </div>

                            <div className='grid gap-4 mt-8'>
                                <div className='grid gap-4 md:grid-cols-2'>
                                    <button
                                        type='button'
                                        onClick={() => setActiveModal('cartoes')}
                                        className='rounded-2xl bg-[#F7FAEF] p-5 text-left'
                                    >
                                        <p className='text-sm'>Cartão da cobrança</p>
                                        <h3 className='text-2xl font-bold mt-2'>Visa final 4587</h3>
                                        <p className='text-sm mt-2'>Usado na assinatura recorrente.</p>
                                        <span className='inline-block mt-4 font-Manrope text-GreenP'>Gerenciar cartões</span>
                                    </button>
                                    <div className='rounded-2xl bg-[#FFF8DE] p-5'>
                                        <p className='text-sm'>Cupom de desconto</p>
                                        <h3 className='text-2xl font-bold mt-2'>SANTACRUZ10</h3>
                                        <p className='text-sm mt-2'>Cupom aplicado na próxima renovação.</p>
                                    </div>
                                </div>

                                {paymentHistory.map((payment) => (
                                    <div
                                        key={payment.month}
                                        className='grid gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center'
                                    >
                                        <div>
                                            <p className='text-sm'>Referência</p>
                                            <p className='font-Manrope font-semibold text-BlackH1'>{payment.month}</p>
                                        </div>
                                        <div>
                                            <p className='text-sm'>Forma</p>
                                            <p className='font-Manrope font-semibold text-BlackH1'>{payment.method}</p>
                                        </div>
                                        <div>
                                            <p className='text-sm'>Valor</p>
                                            <p className='font-Manrope font-semibold text-BlackH1'>{payment.amount}</p>
                                        </div>
                                        <span
                                            className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-Manrope ${
                                                payment.status === 'Pago'
                                                    ? 'bg-GreenP/15 text-GreenP'
                                                    : 'bg-YellowP/35 text-BlackH1'
                                            }`}
                                        >
                                            {payment.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    </div>
                </div>
            </section>

            <PainelModal
                title='Alterar plano da assinatura'
                subtitle='Planos disponíveis'
                isOpen={activeModal === 'planos' || activeModal === 'alterarPlano'}
                onClose={() => setActiveModal(null)}
            >
                <p>
                    Escolha outro pacote para a assinatura. Por enquanto o comportamento é visual e já pronto para depois ligarmos com dados reais.
                </p>

                <div className='grid gap-4 mt-8'>
                    {availablePlans.map((plan) => {
                        const isCurrent = currentPlan.name === plan.name;

                        return (
                            <button
                                key={plan.name}
                                type='button'
                                onClick={() => setSelectedPlan(plan.name)}
                                className={`w-full text-left rounded-[24px] border p-5 transition-all ${
                                    isCurrent ? 'border-GreenP bg-[#F7FAEF]' : 'border-gray-200 hover:border-GreenP/60'
                                }`}
                            >
                                <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
                                    <div>
                                        <h3 className='text-xl font-bold'>{plan.name}</h3>
                                        <p className='mt-2'>{plan.description}</p>
                                    </div>
                                    <div className='md:text-right'>
                                        <p className='text-sm'>Valor mensal</p>
                                        <p className='text-2xl font-bold text-BlackH1 mt-1'>{plan.monthlyPrice}</p>
                                    </div>
                                </div>
                                <span className='inline-block mt-4 font-Manrope text-GreenP'>
                                    {isCurrent ? 'Plano selecionado' : 'Selecionar este plano'}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </PainelModal>

            <PainelModal
                title='Detalhes do plano atual'
                subtitle='Resumo da assinatura'
                isOpen={activeModal === 'planoAtual'}
                onClose={() => setActiveModal(null)}
            >
                <div className='grid gap-4 md:grid-cols-2'>
                    <div className='rounded-2xl bg-gray-50 p-5'>
                        <p className='text-sm'>Plano</p>
                        <h3 className='text-2xl font-bold mt-2'>{currentPlan.name}</h3>
                    </div>
                    <div className='rounded-2xl bg-gray-50 p-5'>
                        <p className='text-sm'>Valor</p>
                        <h3 className='text-2xl font-bold mt-2'>{currentPlan.monthlyPrice}</h3>
                    </div>
                </div>
                <p className='mt-6'>{currentPlan.description}</p>
                <button
                    type='button'
                    onClick={() => setActiveModal('alterarPlano')}
                    className='mt-8 bg-YellowP px-6 py-3 rounded-2xl font-Manrope'
                >
                    Trocar plano
                </button>
            </PainelModal>

            <PainelModal
                title='Informações da próxima entrega'
                subtitle='Entrega programada'
                isOpen={activeModal === 'proximaEntrega'}
                onClose={() => setActiveModal(null)}
            >
                <div className='space-y-4'>
                    <div className='rounded-2xl bg-gray-50 p-5'>
                        <p className='text-sm'>Data prevista</p>
                        <h3 className='text-2xl font-bold mt-2'>30 de março</h3>
                    </div>
                    <div className='rounded-2xl bg-gray-50 p-5'>
                        <p className='text-sm'>Janela de entrega</p>
                        <h3 className='text-2xl font-bold mt-2'>8h às 12h</h3>
                    </div>
                    <div className='rounded-2xl bg-gray-50 p-5'>
                        <p className='text-sm'>Observação</p>
                        <h3 className='text-xl font-bold mt-2'>Entrega residencial em Brotas</h3>
                    </div>
                </div>
            </PainelModal>

            <PainelModal
                title='Meus cartões'
                subtitle='Cobrança da assinatura'
                isOpen={activeModal === 'cartoes'}
                onClose={() => setActiveModal(null)}
            >
                <div className='grid gap-4'>
                    <div className='rounded-[24px] bg-BlackMain p-5 text-white'>
                        <p className='text-white/70 text-sm'>Cartão principal</p>
                        <h3 className='text-2xl font-bold mt-3'>Visa final 4587</h3>
                        <p className='text-white/80 mt-2'>Expira em 09/28</p>
                        <span className='inline-block mt-4 text-YellowP font-Manrope'>Usado para a cobrança recorrente</span>
                    </div>
                    <div className='rounded-[24px] border border-gray-200 p-5'>
                        <p className='text-sm'>Cartão reserva</p>
                        <h3 className='text-2xl font-bold mt-3'>Mastercard final 0321</h3>
                        <p className='mt-2'>Expira em 01/29</p>
                    </div>
                </div>

                <div className='grid gap-4 mt-8 md:grid-cols-2'>
                    <button
                        type='button'
                        onClick={() => setActiveModal('novoCartao')}
                        className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope'
                    >
                        Adicionar novo cartão
                    </button>
                    <button type='button' className='border border-gray-200 px-6 py-3 rounded-2xl font-Manrope'>
                        Definir cartão principal
                    </button>
                </div>
            </PainelModal>

            <PainelModal
                title='Adicionar cartão e cupom'
                subtitle='Nova forma de pagamento'
                isOpen={activeModal === 'novoCartao'}
                onClose={() => setActiveModal(null)}
            >
                <div className='grid gap-4 md:grid-cols-2'>
                    <div className='flex flex-col gap-2'>
                        <label className='font-Manrope font-semibold text-BlackH1'>Nome no cartão</label>
                        <input
                            className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0'
                            placeholder='Como está no cartão'
                            type='text'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='font-Manrope font-semibold text-BlackH1'>Número do cartão</label>
                        <input
                            className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0'
                            placeholder='0000 0000 0000 0000'
                            type='text'
                        />
                    </div>
                </div>

                <div className='grid gap-4 mt-4 md:grid-cols-3'>
                    <div className='flex flex-col gap-2'>
                        <label className='font-Manrope font-semibold text-BlackH1'>Validade</label>
                        <input
                            className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0'
                            placeholder='MM/AA'
                            type='text'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='font-Manrope font-semibold text-BlackH1'>CVV</label>
                        <input
                            className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0'
                            placeholder='123'
                            type='text'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='font-Manrope font-semibold text-BlackH1'>CPF do titular</label>
                        <input
                            className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0'
                            placeholder='000.000.000-00'
                            type='text'
                        />
                    </div>
                </div>

                <div className='rounded-[24px] border border-dashed border-GreenP/40 bg-[#F7FAEF] p-5 mt-8'>
                    <p className='text-sm'>Cupom de desconto</p>
                    <h3 className='text-2xl font-bold mt-2'>Aplicar cupom na assinatura</h3>
                    <div className='grid gap-4 mt-4 md:grid-cols-[1fr_auto]'>
                        <input
                            className='bg-white border border-gray-200 rounded-2xl px-4 py-3 outline-0'
                            placeholder='Digite seu cupom'
                            type='text'
                        />
                        <button type='button' className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope'>
                            Aplicar cupom
                        </button>
                    </div>
                </div>

                <div className='grid gap-4 mt-8 md:grid-cols-2'>
                    <button type='button' className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope'>
                        Salvar cartão
                    </button>
                    <button type='button' className='border border-gray-200 px-6 py-3 rounded-2xl font-Manrope'>
                        Salvar e definir principal
                    </button>
                </div>
            </PainelModal>

            <PainelModal
                title='Pagamentos da assinatura'
                subtitle='Histórico financeiro'
                isOpen={activeModal === 'pagamentos'}
                onClose={() => setActiveModal(null)}
            >
                <div className='grid gap-4 md:grid-cols-3'>
                    <div className='rounded-2xl bg-[#F7FAEF] p-5'>
                        <p className='text-sm'>Meses pagos</p>
                        <h3 className='text-3xl font-bold mt-2'>{paidSubscriptions}</h3>
                    </div>
                    <div className='rounded-2xl bg-[#FFF8DE] p-5'>
                        <p className='text-sm'>Em aberto</p>
                        <h3 className='text-3xl font-bold mt-2'>1</h3>
                    </div>
                    <div className='rounded-2xl bg-gray-50 p-5'>
                        <p className='text-sm'>Próximo valor</p>
                        <h3 className='text-3xl font-bold mt-2'>{currentPlan.monthlyPrice}</h3>
                    </div>
                </div>

                <div className='grid gap-4 mt-8 md:grid-cols-2'>
                    <button
                        type='button'
                        onClick={() => setActiveModal('cartoes')}
                        className='rounded-2xl border border-gray-200 p-5 text-left'
                    >
                        <p className='text-sm'>Cartão salvo</p>
                        <h3 className='text-2xl font-bold mt-2'>Visa final 4587</h3>
                        <p className='mt-2'>Clique para adicionar ou trocar o cartão da cobrança.</p>
                    </button>
                    <div className='rounded-2xl border border-gray-200 p-5'>
                        <p className='text-sm'>Cupom de desconto</p>
                        <h3 className='text-2xl font-bold mt-2'>HORTA5</h3>
                        <p className='mt-2'>Aplicado para reduzir a próxima renovação em 5%.</p>
                        <button
                            type='button'
                            onClick={() => setActiveModal('novoCartao')}
                            className='mt-4 text-GreenP font-Manrope'
                        >
                            Aplicar outro cupom
                        </button>
                    </div>
                </div>

                <div className='grid gap-4 mt-8'>
                    {paymentHistory.map((payment) => (
                        <div key={payment.month} className='rounded-2xl border border-gray-100 p-4'>
                            <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
                                <div>
                                    <p className='text-sm'>Referência</p>
                                    <h3 className='text-xl font-bold mt-1'>{payment.month}</h3>
                                </div>
                                <div>
                                    <p className='text-sm'>Forma</p>
                                    <h3 className='text-lg font-bold mt-1'>{payment.method}</h3>
                                </div>
                                <div>
                                    <p className='text-sm'>Valor</p>
                                    <h3 className='text-lg font-bold mt-1'>{payment.amount}</h3>
                                </div>
                                <span className={`inline-flex rounded-full px-4 py-2 text-sm font-Manrope ${
                                    payment.status === 'Pago' ? 'bg-GreenP/15 text-GreenP' : 'bg-YellowP/35 text-BlackH1'
                                }`}>
                                    {payment.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </PainelModal>

            <PainelModal
                title='Status geral da assinatura'
                subtitle='Resumo da conta'
                isOpen={activeModal === 'status'}
                onClose={() => setActiveModal(null)}
            >
                <div className='grid gap-4 md:grid-cols-3'>
                    <div className='rounded-2xl bg-[#F7FAEF] p-5'>
                        <p className='text-sm'>Status atual</p>
                        <h3 className='text-2xl font-bold mt-2'>Assinatura ativa</h3>
                    </div>
                    <div className='rounded-2xl bg-[#FFF8DE] p-5'>
                        <p className='text-sm'>Cliente desde</p>
                        <h3 className='text-2xl font-bold mt-2'>Janeiro de 2026</h3>
                    </div>
                    <div className='rounded-2xl bg-gray-50 p-5'>
                        <p className='text-sm'>Entregas realizadas</p>
                        <h3 className='text-2xl font-bold mt-2'>12 entregas</h3>
                    </div>
                </div>
                <div className='mt-8 rounded-2xl border border-gray-100 p-5'>
                    <p className='text-sm'>Observação</p>
                    <h3 className='text-xl font-bold mt-2'>Sem pendências no momento</h3>
                    <p className='mt-2'>Seu cadastro está ativo, o plano está em dia e a próxima cesta segue programada normalmente.</p>
                </div>
            </PainelModal>

            <PainelModal
                title='Endereço da assinatura'
                subtitle='Dados de entrega'
                isOpen={activeModal === 'endereco' || activeModal === 'atualizarEndereco'}
                onClose={() => setActiveModal(null)}
            >
                <div className='space-y-4'>
                    <div className='rounded-2xl bg-gray-50 p-5'>
                        <p className='text-sm'>Local</p>
                        <h3 className='text-2xl font-bold mt-2'>Rua exemplo, 120</h3>
                        <p className='mt-2'>Centro, Brotas - SP</p>
                    </div>
                    <div className='rounded-2xl bg-gray-50 p-5'>
                        <p className='text-sm'>Referência</p>
                        <h3 className='text-xl font-bold mt-2'>Portão branco ao lado da padaria</h3>
                    </div>
                    <button type='button' className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope'>
                        Salvar nova solicitação
                    </button>
                </div>
            </PainelModal>

            <PainelModal
                title='Solicitar ajuste da cesta'
                subtitle='Preferências da próxima entrega'
                isOpen={activeModal === 'pedirAjuste'}
                onClose={() => setActiveModal(null)}
            >
                <p>
                    Espaço pensado para o cliente informar ajustes antes da próxima montagem da cesta, como observações, itens que gostaria de evitar ou preferências da semana.
                </p>
                <div className='mt-8 rounded-2xl bg-gray-50 p-5'>
                    <p className='text-sm'>Exemplo de pedido</p>
                    <h3 className='text-xl font-bold mt-2'>Trocar rúcula por outra folha disponível na semana</h3>
                </div>
                <button type='button' className='mt-8 bg-YellowP px-6 py-3 rounded-2xl font-Manrope'>
                    Enviar ajuste
                </button>
            </PainelModal>
        </main>
    );
}
