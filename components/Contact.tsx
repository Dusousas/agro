import React from 'react';
import { motion } from 'framer-motion';
import { IoLogoInstagram } from 'react-icons/io';
import Form from './subc/Form';

export default function Contact() {
    return (
        <section className='bgContact relative py-20'>
            <div className='bg-white/96 absolute w-full h-full inset-0' />
            <div className='maxW relative justify-center flex flex-col gap-10 lg:flex-row'>

                {/* Article da esquerda - Texto e ícones */}
                <motion.article
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className='lg:w-[50%]'
                >
                    <h6 className='text-xl'>Entre em contato</h6>
                    <h1 className='text-3xl font-bold mt-2'>Dúvidas, ideias ou projetos? Estamos prontos para ajudar.</h1>
                    <p className='mt-4'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur facere aut deserunt labore illo harum hic? Nesciunt necessitatibus, voluptatibus officia velit perferendis alias provident, vero excepturi veniam tenetur aut accusantium.</p>
                    <p className='mt-2'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur facere aut deserunt labore illo harum hic? Nesciunt necessitatibus, voluptatibus officia velit perferendis alias provident, vero excepturi veniam tenetur aut accusantium.</p>
                    <div className='mt-6 flex gap-3'>
                        {[...Array(3)].map((_, i) => (
                            <IoLogoInstagram key={i} className='bg-BlackMain text-5xl text-GreenP cursor-pointer rounded-full p-3' />
                        ))}
                    </div>
                </motion.article>

                {/* Article da direita - Formulário */}
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
