import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { FiCalendar, FiCheckCircle, FiCreditCard, FiLogOut, FiMapPin, FiPackage, FiRefreshCcw, FiSliders } from "react-icons/fi";
import { CustomerDashboardData } from "@/lib/types";
import PainelModal from "./PainelModal";
import StatCard from "./StatCard";

type ModalKey =
    | "planos"
    | "planoAtual"
    | "proximaEntrega"
    | "cartoes"
    | "novoCartao"
    | "pagamentos"
    | "status"
    | "endereco"
    | "alterarPlano"
    | "atualizarEndereco"
    | "preferenciasCesta"
    | null;

type ProfileFormState = {
    city: string;
    addressLine: string;
    addressReference: string;
    deliveryDay: string;
    deliveryWindow: string;
    basketProfile: string;
};

type PainelDashboardProps = {
    data: CustomerDashboardData;
};

const quickActions = [
    { key: "alterarPlano" as const, title: "Alterar plano", description: "Troque sua assinatura por outro pacote sem sair do painel.", icon: FiRefreshCcw },
    { key: "atualizarEndereco" as const, title: "Atualizar endereco", description: "Edite local, referencia e instrucoes da sua entrega.", icon: FiMapPin },
    { key: "preferenciasCesta" as const, title: "Preferencias da cesta", description: "Ajuste perfil da cesta, dia e janela da sua entrega.", icon: FiSliders },
];

export default function PainelDashboard({ data }: PainelDashboardProps) {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState(data.selectedPlanName);
    const [activeModal, setActiveModal] = useState<ModalKey>(null);
    const [savingPlan, setSavingPlan] = useState(false);
    const [planFeedback, setPlanFeedback] = useState("");
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileFeedback, setProfileFeedback] = useState("");
    const [profileForm, setProfileForm] = useState<ProfileFormState>({
        city: data.customer.city,
        addressLine: data.customer.addressLine,
        addressReference: data.customer.addressReference,
        deliveryDay: data.subscription.deliveryDay,
        deliveryWindow: data.subscription.deliveryWindow,
        basketProfile: data.subscription.basketProfile,
    });

    const paidSubscriptions = useMemo(() => data.paymentHistory.filter((payment) => payment.status === "Pago").length, [data.paymentHistory]);
    const currentPlan = useMemo(() => data.availablePlans.find((plan) => plan.name === selectedPlan) ?? data.availablePlans[0], [data.availablePlans, selectedPlan]);
    const primaryCard = data.cards.find((card) => card.isPrimary) ?? data.cards[0];
    const secondaryCard = data.cards.find((card) => !card.isPrimary);

    function updateProfileField<K extends keyof ProfileFormState>(field: K, value: ProfileFormState[K]) {
        setProfileForm((current) => ({ ...current, [field]: value }));
    }

    async function handlePlanChange() {
        if (!currentPlan) return;
        setSavingPlan(true);
        setPlanFeedback("");

        const response = await fetch("/api/subscription/select", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                plan: {
                    slug: currentPlan.slug,
                    name: currentPlan.name,
                    monthlyPrice: currentPlan.monthlyPriceValue,
                    description: currentPlan.description,
                },
            }),
        });

        if (!response.ok) {
            const responseData = await response.json().catch(() => null);
            setPlanFeedback(responseData?.message ?? "Nao foi possivel trocar o plano agora.");
            setSavingPlan(false);
            return;
        }

        await router.replace(router.asPath);
        setSavingPlan(false);
        setActiveModal(null);
    }

    async function handleProfileSave() {
        setSavingProfile(true);
        setProfileFeedback("");

        const response = await fetch("/api/customer/update-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profileForm),
        });

        if (!response.ok) {
            const responseData = await response.json().catch(() => null);
            setProfileFeedback(responseData?.message ?? "Nao foi possivel atualizar os dados agora.");
            setSavingProfile(false);
            return;
        }

        await router.replace(router.asPath);
        setSavingProfile(false);
        setActiveModal(null);
    }

    function renderAddressForm() {
        return (
            <>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <label className="font-Manrope font-semibold text-BlackH1">Cidade</label>
                        <input className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none" value={profileForm.city} onChange={(event) => updateProfileField("city", event.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-Manrope font-semibold text-BlackH1">Referencia</label>
                        <input className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none" value={profileForm.addressReference} onChange={(event) => updateProfileField("addressReference", event.target.value)} />
                    </div>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                    <label className="font-Manrope font-semibold text-BlackH1">Endereco de entrega</label>
                    <input className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none" value={profileForm.addressLine} onChange={(event) => updateProfileField("addressLine", event.target.value)} />
                </div>
                {profileFeedback ? <p className="mt-4 text-sm text-red-500">{profileFeedback}</p> : null}
                <button type="button" onClick={handleProfileSave} disabled={savingProfile} className="mt-8 rounded-2xl bg-YellowP px-6 py-3 font-Manrope disabled:opacity-70">{savingProfile ? "Salvando alteracoes..." : "Salvar alteracoes"}</button>
            </>
        );
    }

    function renderPreferencesForm() {
        return (
            <>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <label className="font-Manrope font-semibold text-BlackH1">Dia de entrega</label>
                        <input className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none" value={profileForm.deliveryDay} onChange={(event) => updateProfileField("deliveryDay", event.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-Manrope font-semibold text-BlackH1">Janela de entrega</label>
                        <input className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none" value={profileForm.deliveryWindow} onChange={(event) => updateProfileField("deliveryWindow", event.target.value)} />
                    </div>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                    <label className="font-Manrope font-semibold text-BlackH1">Perfil da cesta</label>
                    <input className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none" value={profileForm.basketProfile} onChange={(event) => updateProfileField("basketProfile", event.target.value)} />
                </div>
                {profileFeedback ? <p className="mt-4 text-sm text-red-500">{profileFeedback}</p> : null}
                <button type="button" onClick={handleProfileSave} disabled={savingProfile} className="mt-8 rounded-2xl bg-YellowP px-6 py-3 font-Manrope disabled:opacity-70">{savingProfile ? "Salvando alteracoes..." : "Salvar alteracoes"}</button>
            </>
        );
    }

    return (
        <main className="bgService min-h-[calc(100vh-92px)]">
            <section className="gradient2 py-16 lg:py-20">
                <div className="maxW">
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                        <div>
                            <h6 className="text-xl">Painel da assinatura</h6>
                            <h1 className="mt-2 text-3xl font-bold lg:text-5xl">Seu dashboard da assinatura, simples e direto.</h1>
                            <p className="mt-4 max-w-3xl">Aqui voce acompanha plano, entregas, pagamentos e seus dados principais em um so lugar. Endereco e preferencias agora podem ser atualizados sem sair do painel.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button type="button" onClick={() => setActiveModal("planos")} className="rounded-2xl bg-YellowP px-6 py-3 font-Manrope text-center">Ver outros planos</button>
                            <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-6 py-3 font-Manrope text-white"><FiLogOut />Sair</button>
                        </div>
                    </motion.div>

                    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        <StatCard title="Plano atual" value={currentPlan?.name ?? "Sem plano"} description="Assinatura mensal ativa com entrega recorrente." icon={FiPackage} delay={0.05} onClick={() => setActiveModal("planoAtual")} />
                        <StatCard title="Proxima entrega" value={data.subscription.nextDeliveryDate} description={`${profileForm.deliveryWindow} em ${profileForm.city}.`} icon={FiCalendar} delay={0.1} onClick={() => setActiveModal("proximaEntrega")} />
                        <StatCard title="Meus cartoes" value={`${data.cards.length} cartoes`} description="Salve os cartoes usados na cobranca recorrente do servico." icon={FiCreditCard} delay={0.15} onClick={() => setActiveModal("cartoes")} />
                        <StatCard title="Status da assinatura" value={data.subscription.status} description="Seu plano esta ativo e pronto para a proxima entrega." icon={FiCheckCircle} delay={0.2} dark onClick={() => setActiveModal("status")} />
                    </div>

                    <div className="mt-10 grid gap-6 xl:grid-cols-[1.35fr_0.65fr] xl:items-stretch">
                        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.25 }} className="h-full rounded-[32px] bg-white p-6 shadow-md lg:p-8">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">Proxima cesta</h2>
                                    <p className="mt-2">Itens previstos para sua proxima entrega carregados da assinatura atual.</p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <span className="inline-block rounded-full bg-GreenP/10 px-4 py-2 text-sm font-Manrope text-GreenP">{currentPlan?.name ?? "Plano"}</span>
                                    <button type="button" onClick={() => setActiveModal("preferenciasCesta")} className="rounded-full border border-gray-200 px-4 py-2 text-sm font-Manrope text-BlackH1">Editar preferencias</button>
                                </div>
                            </div>
                            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {data.nextBasket.map((item) => (
                                    <div key={item} className="flex min-h-[132px] flex-col justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
                                        <p className="font-Manrope font-semibold text-BlackH1">{item}</p>
                                        <p className="mt-1 text-sm">Item sujeito a sazonalidade.</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 grid gap-4 md:grid-cols-3">
                                <div className="rounded-2xl bg-[#F7FAEF] p-5"><p className="text-sm">Entrega preferencial</p><h3 className="mt-2 text-2xl font-bold">{profileForm.deliveryDay}</h3><p className="mt-2 text-sm">{profileForm.deliveryWindow}.</p></div>
                                <button type="button" onClick={() => setActiveModal("preferenciasCesta")} className="rounded-2xl bg-[#FFF8DE] p-5 text-left"><p className="text-sm">Perfil da cesta</p><h3 className="mt-2 text-2xl font-bold">{profileForm.basketProfile}</h3><p className="mt-2 text-sm">Clique para ajustar suas preferencias.</p><span className="mt-4 inline-block font-Manrope text-GreenP">Editar preferencias</span></button>
                                <button type="button" onClick={() => setActiveModal("endereco")} className="rounded-2xl bg-[#F3F5F4] p-5 text-left"><p className="text-sm">Endereco cadastrado</p><h3 className="mt-2 text-2xl font-bold">{profileForm.city}</h3><p className="mt-2 text-sm">{profileForm.addressLine}</p><span className="mt-4 inline-block font-Manrope text-GreenP">Editar dados</span></button>
                            </div>
                        </motion.section>

                        <motion.aside initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.3 }} className="h-full">
                            <section className="flex h-full flex-col rounded-[32px] bg-white p-6 shadow-md lg:p-8">
                                <div className="flex items-start justify-between gap-4">
                                    <div><h2 className="text-2xl font-bold">Acoes rapidas</h2><p className="mt-2">Clique em uma acao para abrir um popup sem sair do painel.</p></div>
                                    <span className="rounded-full bg-YellowP/40 px-3 py-2 text-xs font-Manrope text-BlackH1">Dashboard</span>
                                </div>
                                <div className="mt-8 flex-1 space-y-4">
                                    {quickActions.map((action) => {
                                        const Icon = action.icon;
                                        return <button key={action.title} type="button" onClick={() => setActiveModal(action.key)} className="w-full rounded-2xl border border-gray-200 p-4 text-left transition-colors hover:border-GreenP/60"><Icon className="text-3xl text-GreenP" /><h3 className="mt-4 text-lg font-bold">{action.title}</h3><p className="mt-1 text-sm">{action.description}</p></button>;
                                    })}
                                </div>
                            </section>
                        </motion.aside>
                    </div>

                    <div className="mt-10 grid gap-6 xl:grid-cols-2">
                        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.35 }} className="rounded-[32px] bg-white p-6 shadow-md lg:p-8">
                            <div className="flex items-end justify-between gap-4"><div><h2 className="text-2xl font-bold">Resumo da conta</h2><p className="mt-2">Informacoes rapidas do relacionamento do cliente com a assinatura.</p></div><button type="button" onClick={() => setActiveModal("status")} className="font-Manrope text-GreenP">Ver detalhes</button></div>
                            <div className="mt-8 space-y-4">
                                <div className="rounded-2xl bg-gray-50 p-4"><p className="text-sm">Cliente desde</p><h3 className="mt-2 text-3xl font-bold">{data.customerSummary.since}</h3></div>
                                <div className="rounded-2xl bg-gray-50 p-4"><p className="text-sm">Entregas concluidas</p><h3 className="mt-2 text-xl font-bold">{data.customerSummary.deliveriesCompleted}</h3></div>
                                <div className="rounded-2xl bg-gray-50 p-4"><p className="text-sm">Ultima atualizacao</p><h3 className="mt-2 text-xl font-bold">{data.customerSummary.lastUpdate}</h3></div>
                            </div>
                        </motion.section>

                        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.4 }} className="rounded-[32px] bg-white p-6 shadow-md lg:p-8">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"><div><h2 className="text-2xl font-bold">Historico de pagamentos</h2><p className="mt-2">Uma visao rapida dos ultimos ciclos da assinatura.</p></div><button type="button" onClick={() => setActiveModal("pagamentos")} className="rounded-2xl border border-gray-200 px-5 py-3 font-Manrope">Abrir detalhes</button></div>
                            <div className="mt-8 grid gap-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <button type="button" onClick={() => setActiveModal("cartoes")} className="rounded-2xl bg-[#F7FAEF] p-5 text-left"><p className="text-sm">Cartao da cobranca</p><h3 className="mt-2 text-2xl font-bold">{primaryCard ? `${primaryCard.brand} final ${primaryCard.last4}` : "Sem cartao"}</h3><p className="mt-2 text-sm">Usado na assinatura recorrente.</p><span className="mt-4 inline-block font-Manrope text-GreenP">Gerenciar cartoes</span></button>
                                    <div className="rounded-2xl bg-[#FFF8DE] p-5"><p className="text-sm">Cupom de desconto</p><h3 className="mt-2 text-2xl font-bold">{data.appliedCoupon.code}</h3><p className="mt-2 text-sm">{data.appliedCoupon.description}</p></div>
                                </div>
                                {data.paymentHistory.map((payment) => (
                                    <div key={`${payment.month}-${payment.method}`} className="grid gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center">
                                        <div><p className="text-sm">Referencia</p><p className="font-Manrope font-semibold text-BlackH1">{payment.month}</p></div>
                                        <div><p className="text-sm">Forma</p><p className="font-Manrope font-semibold text-BlackH1">{payment.method}</p></div>
                                        <div><p className="text-sm">Valor</p><p className="font-Manrope font-semibold text-BlackH1">{payment.amount}</p></div>
                                        <span className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-Manrope ${payment.status === "Pago" ? "bg-GreenP/15 text-GreenP" : "bg-YellowP/35 text-BlackH1"}`}>{payment.status}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    </div>
                </div>
            </section>

            <PainelModal title="Alterar plano da assinatura" subtitle="Planos disponiveis" isOpen={activeModal === "planos" || activeModal === "alterarPlano"} onClose={() => setActiveModal(null)}>
                <p>Escolha outro pacote para a assinatura. Essa alteracao salva no banco e atualiza o painel.</p>
                <div className="mt-8 grid gap-4">
                    {data.availablePlans.map((plan) => {
                        const isCurrent = currentPlan?.name === plan.name;
                        return <button key={plan.name} type="button" onClick={() => setSelectedPlan(plan.name)} className={`w-full rounded-[24px] border p-5 text-left transition-all ${isCurrent ? "border-GreenP bg-[#F7FAEF]" : "border-gray-200 hover:border-GreenP/60"}`}><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><h3 className="text-xl font-bold">{plan.name}</h3><p className="mt-2">{plan.description}</p></div><div className="md:text-right"><p className="text-sm">Valor mensal</p><p className="mt-1 text-2xl font-bold text-BlackH1">{plan.monthlyPrice}</p></div></div><span className="mt-4 inline-block font-Manrope text-GreenP">{isCurrent ? "Plano selecionado" : "Selecionar este plano"}</span></button>;
                    })}
                </div>
                {planFeedback ? <p className="mt-4 text-sm text-red-500">{planFeedback}</p> : null}
                <button type="button" onClick={handlePlanChange} disabled={savingPlan || !currentPlan} className="mt-8 rounded-2xl bg-YellowP px-6 py-3 font-Manrope disabled:opacity-70">{savingPlan ? "Salvando plano..." : "Confirmar novo plano"}</button>
            </PainelModal>

            <PainelModal title="Detalhes do plano atual" subtitle="Resumo da assinatura" isOpen={activeModal === "planoAtual"} onClose={() => setActiveModal(null)}>
                <div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl bg-gray-50 p-5"><p className="text-sm">Plano</p><h3 className="mt-2 text-2xl font-bold">{currentPlan?.name}</h3></div><div className="rounded-2xl bg-gray-50 p-5"><p className="text-sm">Valor</p><h3 className="mt-2 text-2xl font-bold">{currentPlan?.monthlyPrice}</h3></div></div>
                <p className="mt-6">{currentPlan?.description}</p>
                <button type="button" onClick={() => setActiveModal("alterarPlano")} className="mt-8 rounded-2xl bg-YellowP px-6 py-3 font-Manrope">Trocar plano</button>
            </PainelModal>

            <PainelModal title="Informacoes da proxima entrega" subtitle="Entrega programada" isOpen={activeModal === "proximaEntrega"} onClose={() => setActiveModal(null)}>
                <div className="space-y-4"><div className="rounded-2xl bg-gray-50 p-5"><p className="text-sm">Data prevista</p><h3 className="mt-2 text-2xl font-bold">{data.subscription.nextDeliveryDate}</h3></div><div className="rounded-2xl bg-gray-50 p-5"><p className="text-sm">Janela de entrega</p><h3 className="mt-2 text-2xl font-bold">{profileForm.deliveryWindow}</h3></div><div className="rounded-2xl bg-gray-50 p-5"><p className="text-sm">Observacao</p><h3 className="mt-2 text-xl font-bold">Entrega residencial em {profileForm.city}</h3></div></div>
            </PainelModal>

            <PainelModal title="Meus cartoes" subtitle="Cobranca da assinatura" isOpen={activeModal === "cartoes"} onClose={() => setActiveModal(null)}>
                <div className="grid gap-4">
                    {primaryCard ? <div className="rounded-[24px] bg-BlackMain p-5 text-white"><p className="text-sm text-white/70">Cartao principal</p><h3 className="mt-3 text-2xl font-bold">{primaryCard.brand} final {primaryCard.last4}</h3><p className="mt-2 text-white/80">Expira em {primaryCard.expMonth}/{primaryCard.expYear}</p><span className="mt-4 inline-block font-Manrope text-YellowP">Usado para a cobranca recorrente</span></div> : null}
                    {secondaryCard ? <div className="rounded-[24px] border border-gray-200 p-5"><p className="text-sm">Cartao reserva</p><h3 className="mt-3 text-2xl font-bold">{secondaryCard.brand} final {secondaryCard.last4}</h3><p className="mt-2">Expira em {secondaryCard.expMonth}/{secondaryCard.expYear}</p></div> : null}
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-2"><button type="button" onClick={() => setActiveModal("novoCartao")} className="rounded-2xl bg-YellowP px-6 py-3 font-Manrope">Adicionar novo cartao</button><button type="button" className="rounded-2xl border border-gray-200 px-6 py-3 font-Manrope">Definir cartao principal</button></div>
            </PainelModal>

            <PainelModal title="Adicionar cartao e cupom" subtitle="Nova forma de pagamento" isOpen={activeModal === "novoCartao"} onClose={() => setActiveModal(null)}>
                <p>Espaco pronto para integrar cadastro de cartao e cupom no proximo passo.</p>
            </PainelModal>

            <PainelModal title="Pagamentos da assinatura" subtitle="Historico financeiro" isOpen={activeModal === "pagamentos"} onClose={() => setActiveModal(null)}>
                <div className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl bg-[#F7FAEF] p-5"><p className="text-sm">Meses pagos</p><h3 className="mt-2 text-3xl font-bold">{paidSubscriptions}</h3></div><div className="rounded-2xl bg-[#FFF8DE] p-5"><p className="text-sm">Em aberto</p><h3 className="mt-2 text-3xl font-bold">{data.paymentHistory.filter((payment) => payment.status !== "Pago").length}</h3></div><div className="rounded-2xl bg-gray-50 p-5"><p className="text-sm">Proximo valor</p><h3 className="mt-2 text-3xl font-bold">{currentPlan?.monthlyPrice}</h3></div></div>
            </PainelModal>

            <PainelModal title="Status geral da assinatura" subtitle="Resumo da conta" isOpen={activeModal === "status"} onClose={() => setActiveModal(null)}>
                <div className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl bg-[#F7FAEF] p-5"><p className="text-sm">Status atual</p><h3 className="mt-2 text-2xl font-bold">{data.subscription.status}</h3></div><div className="rounded-2xl bg-[#FFF8DE] p-5"><p className="text-sm">Cliente desde</p><h3 className="mt-2 text-2xl font-bold">{data.customerSummary.since}</h3></div><div className="rounded-2xl bg-gray-50 p-5"><p className="text-sm">Entregas realizadas</p><h3 className="mt-2 text-2xl font-bold">{data.customerSummary.deliveriesCompleted}</h3></div></div>
            </PainelModal>

            <PainelModal title="Endereco da assinatura" subtitle="Dados de entrega" isOpen={activeModal === "endereco" || activeModal === "atualizarEndereco"} onClose={() => setActiveModal(null)}>
                <p>Atualize o endereco e a referencia da entrega. Essas informacoes sao salvas no cadastro do cliente.</p>
                <div className="mt-8">{renderAddressForm()}</div>
            </PainelModal>

            <PainelModal title="Preferencias da cesta" subtitle="Entrega e perfil" isOpen={activeModal === "preferenciasCesta"} onClose={() => setActiveModal(null)}>
                <p>Defina como sua assinatura deve chegar na proxima recorrencia.</p>
                <div className="mt-8">{renderPreferencesForm()}</div>
            </PainelModal>
        </main>
    );
}
