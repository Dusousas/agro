import React from 'react';
import { motion } from 'framer-motion';
import { SiVerizon } from 'react-icons/si';

export default function Why() {
    return (
        <section className='py-20'>
            <div className='maxW flex flex-col gap-20 justify-center lg:flex-row'>

                {/* Imagem animada da esquerda */}
                <motion.img
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className='lg:w-[30%]'
                    src="why.webp"
                    alt=""
                />

                <article>
                    {/* Título */}
                    <motion.h6
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className='text-xl text-center lg:text-left'
                    >
                        Por que nos escolher
                    </motion.h6>

                    {/* Subtítulo */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        viewport={{ once: true }}
                        className='text-3xl font-bold mt-2'
                    >
                        Sabores em harmonia, cultivados com atenção verdadeira.
                    </motion.h1>

                    {/* Parágrafo */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        viewport={{ once: true }}
                        className='mt-4'
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Non aliquam excepturi nostrum, dolorum possimus placeat nam vitae maiores esse porro?
                    </motion.p>

                    {/* Cards com efeito de entrada */}
                    <article className='mt-10 flex gap-6 flex-wrap'>
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                                viewport={{ once: true }}
                                className='bg-gray-100 px-5 py-8 hover:outline hover:outline-GreenP lg:w-[48%]'
                            >
                                <SiVerizon className='text-white text-5xl bg-GreenP px-4 py-4' />
                                <h1 className='font-semibold text-lg mt-4'>Orgânico Certificado</h1>
                                <p>Montes risus si aliquet diam et. Turpis in enim sollicitudin morbi pulvinar.</p>
                            </motion.div>
                        ))}
                    </article>
                </article>
            </div>
        </section>
    );
}
