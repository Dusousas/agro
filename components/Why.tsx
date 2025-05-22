import React from 'react';
import { SiVerizon } from 'react-icons/si';

export default function Why() {
    return (
        <>
            <section className='py-20'>
                <div className='maxW flex flex-col gap-20 justify-center'>

                    <img className='lg:w-[30%]' src="why.webp" alt="" />

                    <article className=''>
                        <h6 className='text-xl text-center lg:text-left'>Por que nos escolher</h6>
                        <h1 className='text-3xl font-bold  mt-2'>Sabores em harmonia, cultivados com atenção verdadeira.</h1>
                        <p className='mt-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non aliquam excepturi nostrum, dolorum possimus placeat nam vitae maiores esse porro?</p>

                        <article className='mt-10 flex gap-6 flex-wrap'>

                            <div className='bg-gray-100 px-5 py-8 hover:outline hover:outline-GreenP lg:w-[48%]'>
                                <SiVerizon className='text-white text-5xl bg-GreenP px-4 py-4' />
                                <h1 className='font-semibold text-lg mt-4'>Orgânico Certificado</h1>
                                <p>Montes risus si aliquet diam et. Turpis in enim sollicitudin morbi pulvinar.</p>
                            </div>

                            <div className='bg-gray-100 px-5 py-8 hover:outline hover:outline-GreenP lg:w-[48%]'>
                                <SiVerizon className='text-white text-5xl bg-GreenP px-4 py-4' />
                                <h1 className='font-semibold text-lg mt-4'>Orgânico Certificado</h1>
                                <p>Montes risus si aliquet diam et. Turpis in enim sollicitudin morbi pulvinar.</p>
                            </div>

                            <div className='bg-gray-100 px-5 py-8 hover:outline hover:outline-GreenP lg:w-[48%]'>
                                <SiVerizon className='text-white text-5xl bg-GreenP px-4 py-4' />
                                <h1 className='font-semibold text-lg mt-4'>Orgânico Certificado</h1>
                                <p>Montes risus si aliquet diam et. Turpis in enim sollicitudin morbi pulvinar.</p>
                            </div>

                            <div className='bg-gray-100 px-5 py-8 hover:outline hover:outline-GreenP lg:w-[48%]'>
                                <SiVerizon className='text-white text-5xl bg-GreenP px-4 py-4' />
                                <h1 className='font-semibold text-lg mt-4'>Orgânico Certificado</h1>
                                <p>Montes risus si aliquet diam et. Turpis in enim sollicitudin morbi pulvinar.</p>
                            </div>


                        </article>
                    </article>
                </div>
            </section>
        </>
    );
}