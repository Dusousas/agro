import React from 'react';
import { motion } from 'framer-motion';
import { IoLogoInstagram } from 'react-icons/io';
import Form from './subc/Form';

export default function Contact() {
    return (
        <section id='contact' className='bgContact relative py-20'>
            <div className='bg-white/96 absolute w-full h-full inset-0' />
            <div className='maxW relative justify-center flex flex-col gap-10 lg:flex-row'>
                <motion.article
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className='lg:w-[50%]'
                >
                    <h6 className='text-xl'>Fale com a equipe</h6>
                    <h1 className='text-3xl font-bold mt-2'>Quer assinar sua cesta ou tirar dúvidas sobre os planos?</h1>
                    <p className='mt-4'>Nossa equipe da Hortaliças Santa Cruz atende Brotas e está pronta para ajudar você a escolher a assinatura ideal, entender o que vai em cada pacote e organizar o melhor formato de entrega.</p>
                    <p className='mt-2'>Se quiser, use o formulário para pedir atendimento, consultar disponibilidade ou solicitar uma proposta para sua casa, empresa ou comércio.</p>
                    <div className='mt-6 flex gap-3'>
                        {[...Array(3)].map((_, i) => (
                            <IoLogoInstagram key={i} className='bg-BlackMain text-5xl text-GreenP cursor-pointer rounded-full p-3' />
                        ))}
                    </div>
                </motion.article>

                <motion.article
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className='w-[100%] lg:w-[60%]'
                >
                    <Form />
                </motion.article>
            </div>
        </section>
    );
}
