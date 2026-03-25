import React from 'react';

export default function Banner() {
    return (
        <section className='py-40 bgBanner relative'>
            <div className='absolute inset-0 bg-black/50' />
            <div className='maxW z-10 relative'>
                <h2 className='text-3xl font-bold text-white text-center lg:w-1/2 lg:text-left'>Monte uma assinatura que combina com a sua mesa.</h2>
                <h5 className='text-white font-Manrope mt-4 text-center lg:w-1/2 lg:text-left'>Das cestas essenciais aos pacotes mais completos, cada plano foi pensado para entregar frescor, praticidade e economia mensal com entregas recorrentes em Brotas.</h5>
                <div className='mt-6 flex justify-center lg:justify-start'>
                    <a className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope' href="#assinaturas">Comparar assinaturas</a>
                </div>
            </div>
        </section>
    );
}
