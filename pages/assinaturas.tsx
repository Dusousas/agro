import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useState } from 'react';
import { authOptions } from '@/lib/auth';
import { getActivePlans, getCustomerByEmail, SubscriptionPlanOption } from '@/lib/customer';

type AssinaturasProps = {
  plans: SubscriptionPlanOption[];
  selectedPlanName: string;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export default function Assinaturas({ plans, selectedPlanName }: AssinaturasProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<number>(plans[0]?.id ?? 0);
  const [loading, setLoading] = useState(false);

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? plans[0];

  async function handleContinue() {
    if (!selectedPlanId) return;
    setLoading(true);

    await fetch('/api/subscription/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: selectedPlanId }),
    });

    window.location.href = '/painel';
  }

  return (
    <main className='bgService min-h-[calc(100vh-92px)]'>
      <section className='gradient2 py-20'>
        <div className='maxW'>
          <div className='max-w-6xl mx-auto grid gap-8 xl:grid-cols-[1.6fr_0.95fr]'>
            <div className='bg-white rounded-[32px] shadow-md p-8 lg:p-12'>
              <h6 className='text-xl'>Assinaturas</h6>
              <h1 className='text-3xl lg:text-5xl font-bold mt-2'>Escolha a cesta ideal para sua rotina.</h1>
              <p className='mt-4'>
                Seu cadastro ja esta pronto. Agora e so selecionar o plano mensal da Hortaliças Santa Cruz e seguir para a etapa de pagamento.
              </p>

              <div className='mt-10 grid gap-5 lg:grid-cols-3'>
                {plans.map((plan) => {
                  const isSelected = plan.id === selectedPlanId;

                  return (
                    <button
                      key={plan.id}
                      type='button'
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`rounded-[28px] border p-6 text-left transition-all ${
                        isSelected
                          ? 'border-GreenP bg-GreenP/5 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-GreenP/40'
                      }`}
                    >
                      <span className='inline-block bg-YellowP/20 text-BlackH1 font-Manrope text-sm px-4 py-2 rounded-full'>
                        {plan.badge}
                      </span>
                      <h2 className='text-2xl font-bold mt-5'>{plan.name}</h2>
                      <p className='mt-3 min-h-[72px]'>{plan.description}</p>
                      <div className='mt-5'>
                        <p className='text-sm uppercase tracking-[0.18em] text-GrayP'>Mensal</p>
                        <h3 className='text-3xl font-bold mt-2'>{formatCurrency(plan.monthlyPrice)}</h3>
                        <p className='mt-2 text-sm'>ou {formatCurrency(plan.weeklyPrice)} por cesta</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <aside className='bg-white rounded-[32px] shadow-md p-8 lg:p-10 self-start'>
              <span className='inline-block bg-GreenP/10 text-GreenP font-Manrope text-sm px-4 py-2 rounded-full'>
                {selectedPlanName ? `Plano atual: ${selectedPlanName}` : 'Etapa final antes do painel'}
              </span>
              <h2 className='text-3xl font-bold mt-5'>{selectedPlan?.name ?? 'Selecione um plano'}</h2>
              <p className='mt-3'>{selectedPlan?.description}</p>

              <div className='mt-6 rounded-[28px] bg-gray-50 border border-gray-200 p-6'>
                <p className='text-sm uppercase tracking-[0.18em] text-GrayP'>Resumo do pagamento</p>
                <h3 className='text-4xl font-bold mt-3'>{selectedPlan ? formatCurrency(selectedPlan.monthlyPrice) : '--'}</h3>
                <p className='mt-2 text-sm'>Assinatura mensal com cobrança recorrente. A integração do pagamento real entra na próxima etapa.</p>
              </div>

              <div className='mt-6 space-y-3'>
                {selectedPlan?.items.map((item) => (
                  <div key={item} className='flex items-start gap-3'>
                    <span className='mt-1 h-2.5 w-2.5 rounded-full bg-GreenP shrink-0' />
                    <p className='text-sm'>{item}</p>
                  </div>
                ))}
              </div>

              <button
                type='button'
                onClick={handleContinue}
                disabled={!selectedPlanId || loading}
                className='mt-8 w-full bg-YellowP px-8 py-4 rounded-2xl font-Manrope text-BlackH1 disabled:opacity-70'
              >
                {loading ? 'Processando pagamento...' : 'Pagar e ir para meu painel'}
              </button>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<AssinaturasProps> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.email) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const customer = await getCustomerByEmail(session.user.email);

  if (!customer?.complete) {
    return {
      redirect: {
        destination: '/onboarding',
        permanent: false,
      },
    };
  }

  if (customer.hasSubscription) {
    return {
      redirect: {
        destination: '/painel',
        permanent: false,
      },
    };
  }

  const plans = await getActivePlans();

  return {
    props: {
      plans,
      selectedPlanName: customer.selectedPlanName ?? '',
    },
  };
};
