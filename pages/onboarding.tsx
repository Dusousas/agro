import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useMemo, useState } from 'react';
import { authOptions } from '@/lib/auth';
import { CustomerOnboardingData, getCustomerByEmail } from '@/lib/customer';

type OnboardingProps = {
  customer: CustomerOnboardingData;
};

type FieldKey = 'name' | 'city' | 'addressLine' | 'deliveryDay' | 'deliveryWindow' | 'basketProfile';

const fieldLabels: Record<FieldKey, string> = {
  name: 'nome',
  city: 'cidade',
  addressLine: 'endereco',
  deliveryDay: 'dia de entrega',
  deliveryWindow: 'periodo de entrega',
  basketProfile: 'perfil da cesta',
};

export default function Onboarding({ customer }: OnboardingProps) {
  const [form, setForm] = useState(customer);
  const [saving, setSaving] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const requiredFields: FieldKey[] = ['name', 'city', 'addressLine', 'deliveryDay', 'deliveryWindow', 'basketProfile'];
  const missingFields = useMemo(
    () => requiredFields.filter((field) => !String(form[field] ?? '').trim()),
    [form]
  );

  const isComplete = missingFields.length === 0;

  function inputClass(field: FieldKey) {
    const isMissing = showErrors && missingFields.includes(field);
    return `w-full rounded-2xl px-4 py-3 outline-0 transition-colors ${
      isMissing ? 'bg-red-50 border border-red-400' : 'bg-gray-50 border border-gray-200'
    }`;
  }

  function fieldHelp(field: FieldKey) {
    if (!showErrors || !missingFields.includes(field)) return null;
    return <p className='mt-2 text-sm text-red-500'>Preencha {fieldLabels[field]} para continuar.</p>;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isComplete) {
      setShowErrors(true);
      return;
    }

    setSaving(true);

    await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    window.location.href = '/assinaturas';
  }

  return (
    <main className='bgService min-h-[calc(100vh-92px)]'>
      <section className='gradient2 py-20'>
        <div className='maxW'>
          <div className='max-w-3xl mx-auto bg-white rounded-[32px] shadow-md p-8 lg:p-12'>
            <h6 className='text-xl'>Complete seu cadastro</h6>
            <h1 className='text-3xl lg:text-5xl font-bold mt-2'>Vamos configurar sua assinatura.</h1>
            <p className='mt-4'>
              Preencha seus dados de entrega para liberar a escolha do plano. Assim que tudo estiver completo, voce segue para as assinaturas.
            </p>

            <form onSubmit={handleSubmit} className='mt-8 space-y-5'>
              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <label className='block text-sm font-Manrope text-BlackH1 mb-2'>Nome completo</label>
                  <input
                    className={inputClass('name')}
                    placeholder='Como devemos identificar sua assinatura'
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                  />
                  {fieldHelp('name')}
                </div>

                <div>
                  <label className='block text-sm font-Manrope text-BlackH1 mb-2'>Cidade</label>
                  <input
                    className={inputClass('city')}
                    placeholder='Ex.: Brotas - SP'
                    value={form.city}
                    onChange={(event) => setForm({ ...form, city: event.target.value })}
                  />
                  {fieldHelp('city')}
                </div>
              </div>

              <div>
                <label className='block text-sm font-Manrope text-BlackH1 mb-2'>Endereco de entrega</label>
                <input
                  className={inputClass('addressLine')}
                  placeholder='Rua, numero e bairro'
                  value={form.addressLine}
                  onChange={(event) => setForm({ ...form, addressLine: event.target.value })}
                />
                <p className='mt-2 text-sm text-GrayP'>Esse endereco sera usado nas proximas entregas da sua assinatura.</p>
                {fieldHelp('addressLine')}
              </div>

              <div>
                <label className='block text-sm font-Manrope text-BlackH1 mb-2'>Ponto de referencia</label>
                <input
                  className='w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0'
                  placeholder='Opcional: portao branco, esquina, comercio proximo...'
                  value={form.addressReference}
                  onChange={(event) => setForm({ ...form, addressReference: event.target.value })}
                />
              </div>

              <div className='grid gap-4 md:grid-cols-3'>
                <div>
                  <label className='block text-sm font-Manrope text-BlackH1 mb-2'>Dia preferido</label>
                  <input
                    className={inputClass('deliveryDay')}
                    placeholder='Ex.: Segunda-feira'
                    value={form.deliveryDay}
                    onChange={(event) => setForm({ ...form, deliveryDay: event.target.value })}
                  />
                  <p className='mt-2 text-sm text-GrayP'>Dia da semana em que voce prefere receber a cesta.</p>
                  {fieldHelp('deliveryDay')}
                </div>

                <div>
                  <label className='block text-sm font-Manrope text-BlackH1 mb-2'>Periodo de entrega</label>
                  <input
                    className={inputClass('deliveryWindow')}
                    placeholder='Ex.: 8h as 12h'
                    value={form.deliveryWindow}
                    onChange={(event) => setForm({ ...form, deliveryWindow: event.target.value })}
                  />
                  <p className='mt-2 text-sm text-GrayP'>Horario ideal para receber sem desencontro.</p>
                  {fieldHelp('deliveryWindow')}
                </div>

                <div>
                  <label className='block text-sm font-Manrope text-BlackH1 mb-2'>Perfil da cesta</label>
                  <input
                    className={inputClass('basketProfile')}
                    placeholder='Ex.: Mais folhas'
                    value={form.basketProfile}
                    onChange={(event) => setForm({ ...form, basketProfile: event.target.value })}
                  />
                  <p className='mt-2 text-sm text-GrayP'>Fale o estilo de itens que voce mais quer receber.</p>
                  {fieldHelp('basketProfile')}
                </div>
              </div>

              {showErrors && !isComplete ? (
                <div className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>
                  Preencha todos os campos obrigatorios para liberar a proxima etapa.
                </div>
              ) : null}

              <button
                type='submit'
                disabled={!isComplete || saving}
                className='bg-YellowP px-8 py-4 rounded-2xl font-Manrope text-BlackH1 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {saving ? 'Salvando...' : 'Salvar e escolher plano'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<OnboardingProps> = async (context) => {
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

  if (customer?.complete && customer.hasSubscription) {
    return {
      redirect: {
        destination: '/painel',
        permanent: false,
      },
    };
  }

  if (customer?.complete) {
    return {
      redirect: {
        destination: '/assinaturas',
        permanent: false,
      },
    };
  }

  return {
    props: {
      customer: customer ?? {
        name: session.user.name ?? '',
        email: session.user.email,
        city: '',
        addressLine: '',
        addressReference: '',
        deliveryDay: '',
        deliveryWindow: '',
        basketProfile: '',
        complete: false,
        hasSubscription: false,
        selectedPlanName: '',
      },
    },
  };
};
