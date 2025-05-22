import React from 'react';

export default function Banner() {
    return (
        <>
            <section className='py-40 bgBanner relative'>
                <div className='absolute inset-0 bg-black/50' />
                <div className='maxW z-10 relative'>
                    <h2 className='text-3xl font-bold text-white  text-center lg:w-1/2 lg:text-left'>Prove a diferença, descubra a verdadeira agricultura</h2>
                    <h5 className='text-white font-Manrope mt-4 text-center lg:w-1/2 lg:text-left'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolore commodi ab ullam molestias modi id reprehenderit similique odio adipisci, fuga nobis animi illum? Excepturi impedit quidem cum tempore consectetur non a. Architecto natus nostrum provident. Mollitia dignissimos esse reprehenderit impedit.</h5>
                    <div className='mt-6 flex justify-center lg:justify-start'>
                        <a className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope' href="">Entre em contato</a>
                    </div>
                </div>
            </section>
        </>
    );
}