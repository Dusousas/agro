import React from 'react';
import { motion } from 'framer-motion';
import CardServices from './subc/CardServices';

export default function Services() {
    return (
        <section id='service' className='bgService'>
            <div className='gradient2 py-20 h-full'>
                <div className='maxW'>

                    {/* Título */}
                    <motion.h6
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className='text-xl text-center'
                    >
                        Nossos Serviços
                    </motion.h6>

                    {/* Subtítulo */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        viewport={{ once: true }}
                        className='text-3xl font-bold text-center mt-2'
                    >
                        Prove a diferença, descubra a verdadeira agricultura
                    </motion.h1>

                    {/* Parágrafo */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        viewport={{ once: true }}
                        className='text-center mt-4'
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Non aliquam excepturi nostrum, dolorum possimus placeat nam vitae maiores esse porro?
                    </motion.p>

                    {/* Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <CardServices />
                    </motion.div>

                    {/* Botão */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        viewport={{ once: true }}
                        className='mt-10 flex justify-center'
                    >
                        <a className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope' href="">
                            Saiba mais
                        </a>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
