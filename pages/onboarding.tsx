import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useState } from 'react';
import { authOptions } from '@/lib/auth';
import { CustomerOnboardingData, getCustomerByEmail } from '@/lib/customer';

type OnboardingProps = {
  customer: CustomerOnboardingData;
};

export default function Onboarding({ customer }: OnboardingProps) {
  const [form, setForm] = useState(customer);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
              Depois do login com Google, preencha seus dados para salvar endereco, cidade e preferencias de entrega antes de escolher sua assinatura.
            </p>

            <form onSubmit={handleSubmit} className='mt-8 space-y-4'>
              <div className='grid gap-4 md:grid-cols-2'>
                <input className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0' placeholder='Nome' value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
                <input className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0' placeholder='Cidade' value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
              </div>
              <input className='w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0' placeholder='Endereco' value={form.addressLine} onChange={(event) => setForm({ ...form, addressLine: event.target.value })} />
              <input className='w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0' placeholder='Referencia' value={form.addressReference} onChange={(event) => setForm({ ...form, addressReference: event.target.value })} />
              <div className='grid gap-4 md:grid-cols-3'>
                <input className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0' placeholder='Dia preferido de entrega' value={form.deliveryDay} onChange={(event) => setForm({ ...form, deliveryDay: event.target.value })} />
                <input className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0' placeholder='Janela de entrega' value={form.deliveryWindow} onChange={(event) => setForm({ ...form, deliveryWindow: event.target.value })} />
                <input className='bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-0' placeholder='Perfil da cesta' value={form.basketProfile} onChange={(event) => setForm({ ...form, basketProfile: event.target.value })} />
              </div>

              <button type='submit' className='bg-YellowP px-8 py-4 rounded-2xl font-Manrope text-BlackH1'>
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
