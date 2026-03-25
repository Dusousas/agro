import React from 'react';
import { motion } from 'framer-motion';
import CardServices from './subc/CardServices';

export default function Services() {
    return (
        <section id='service' className='bgService'>
            <div className='gradient2 py-20 h-full'>
                <div className='maxW'>
                    <motion.h6
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className='text-xl text-center'
                    >
                        Como funciona
                    </motion.h6>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        viewport={{ once: true }}
                        className='text-3xl font-bold text-center mt-2'
                    >
                        Tudo pensado para sua assinatura ser simples, prática e recorrente.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        viewport={{ once: true }}
                        className='text-center mt-4'
                    >
                        Da escolha do plano até a entrega da cesta, organizamos cada etapa para você receber hortaliças frescas com previsibilidade e sem complicação.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <CardServices />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        viewport={{ once: true }}
                        className='mt-10 flex justify-center'
                    >
                        <a className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope' href="#contact">
                            Quero receber minha cesta
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
