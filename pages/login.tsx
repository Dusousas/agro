import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { signIn } from 'next-auth/react';
import { authOptions } from '@/lib/auth';

export default function Login() {
  return (
    <main className='bgService min-h-[calc(100vh-92px)]'>
      <section className='gradient2 py-20'>
        <div className='maxW'>
          <div className='max-w-2xl mx-auto bg-white rounded-[32px] shadow-md p-8 lg:p-12 text-center'>
            <h6 className='text-xl'>Entrar na assinatura</h6>
            <h1 className='text-3xl lg:text-5xl font-bold mt-2'>Acesse seu painel com o Google.</h1>
            <p className='mt-4'>
              Faça login para acompanhar sua assinatura, completar seu cadastro e manter suas preferências salvas no sistema.
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

  if (session) {
    return {
      redirect: {
        destination: '/onboarding',
        permanent: false,
      },
    };
  }

  return { props: {} };
};
