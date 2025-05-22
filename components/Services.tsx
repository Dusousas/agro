import React from 'react';
import CardServices from './subc/CardServices';

export default function Services() {
    return (
        <>
            <section id='service' className='bgService'>
                <div className='gradient2 py-20 h-full'>
                    <div className='maxW'>
                        <h6 className='text-xl text-center'>Nossos Serviços</h6>
                        <h1 className='text-3xl font-bold text-center mt-2'>Prove a diferença, descubra a verdadeira agricultura</h1>
                        <p className='text-center mt-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non aliquam excepturi nostrum, dolorum possimus placeat nam vitae maiores esse porro?</p>
                        <CardServices />
                        <div className='mt-10 flex justify-center'>
                            <a className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope' href="">Saiba mais</a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}