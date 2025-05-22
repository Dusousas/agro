import React from 'react';
import { IoLogoInstagram } from 'react-icons/io';
import Form from './subc/Form';

export default function Contact() {
    return (
        <>
            <section className='bgContact relative py-20'>
                <div className='bg-white/96 absolute w-full h-full inset-0 ' />
                <div className='maxW relative justify-center flex flex-col gap-10 lg:flex-row'>
                    <article className='lg:w-[50%]'>
                        <h6 className='text-xl'>Entre em contato</h6>
                        <h1 className='text-3xl font-bold  mt-2'>Dúvidas, ideias ou projetos? Estamos prontos para ajudar.</h1>
                        <p className='mt-4'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur facere aut deserunt labore illo harum hic? Nesciunt necessitatibus, voluptatibus officia velit perferendis alias provident, vero excepturi veniam tenetur aut accusantium.</p>
                        <p className='mt-2'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur facere aut deserunt labore illo harum hic? Nesciunt necessitatibus, voluptatibus officia velit perferendis alias provident, vero excepturi veniam tenetur aut accusantium.</p>
                        <div className='mt-6 flex gap-3'>
                            <IoLogoInstagram className='bg-BlackMain text-5xl text-GreenP cursor-pointer rounded-full p-3' />
                            <IoLogoInstagram className='bg-BlackMain text-5xl text-GreenP cursor-pointer rounded-full p-3' />
                            <IoLogoInstagram className='bg-BlackMain text-5xl text-GreenP cursor-pointer rounded-full p-3' />
                        </div>
                    </article>

                    <article className='W-[60%]'>
                        <Form />
                    </article>
                </div>
            </section>
        </>
    );
}