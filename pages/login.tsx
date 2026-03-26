import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { signIn } from 'next-auth/react';
import { authOptions } from '@/lib/auth';
import { getCustomerByEmail } from '@/lib/customer';

export default function Login() {
  return (
    <main className='bgService min-h-[calc(100vh-92px)]'>
      <section className='gradient2 py-20'>
        <div className='maxW'>
          <div className='max-w-2xl mx-auto bg-white rounded-[32px] shadow-md p-8 lg:p-12 text-center'>
            <h6 className='text-xl'>Entrar na assinatura</h6>
            <h1 className='text-3xl lg:text-5xl font-bold mt-2'>Acesse sua area com o Google.</h1>
            <p className='mt-4'>
              Faca login para completar seu cadastro, escolher seu plano e acompanhar tudo no painel da assinatura.
            </p>

            <button
              type='button'
              onClick={() => signIn('google', { callbackUrl: '/onboarding' })}
              className='mt-8 bg-YellowP px-8 py-4 rounded-2xl font-Manrope text-BlackH1'
            >
              Entrar com Google
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session?.user?.email) {
    const customer = await getCustomerByEmail(session.user.email);

    return {
      redirect: {
        destination: !customer?.complete ? '/onboarding' : customer.hasSubscription ? '/painel' : '/assinaturas',
        permanent: false,
      },
    };
  }

  return { props: {} };
};
