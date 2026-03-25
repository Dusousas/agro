import React from 'react';
import { motion } from 'framer-motion';
import { SiVerizon } from 'react-icons/si';

export default function Why() {
    const reasons = [
        {
            title: 'Produção fresca e local',
            text: 'Selecionamos hortaliças com foco em frescor, sazonalidade e qualidade para cada cesta.',
        },
        {
            title: 'Planos para rotinas diferentes',
            text: 'Você pode começar com um pacote menor ou escolher uma assinatura mais completa para a casa toda.',
        },
        {
            title: 'Desconto na recorrência',
            text: 'Ao optar pelo mensal, o valor final fica mais vantajoso do que comprar cestas avulsas.',
        },
        {
            title: 'Entrega com praticidade',
            text: 'Receba sua seleção em Brotas com organização, previsibilidade e atendimento próximo.',
        },
    ];

    return (
        <section className='py-20'>
            <div className='maxW flex flex-col gap-20 justify-center lg:flex-row'>
                <motion.img
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className='lg:w-[30%]'
                    src="why.webp"
                    alt="Produtos frescos e selecionados"
                />

                <article>
                    <motion.h6
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className='text-xl text-center lg:text-left'
                    >
                        Por que assinar
                    </motion.h6>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        viewport={{ once: true }}
                        className='text-3xl font-bold mt-2'
                    >
                        Uma assinatura feita para quem quer qualidade sem perder tempo.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        viewport={{ once: true }}
                        className='mt-4'
                    >
                        A experiência vai além da entrega: nossa proposta é facilitar sua rotina com cestas organizadas, valores claros e um cuidado constante com o que chega à sua mesa.
                    </motion.p>

                    <article className='mt-10 flex gap-6 flex-wrap'>
                        {reasons.map((reason, i) => (
                            <motion.div
                                key={reason.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                                viewport={{ once: true }}
                                className='bg-gray-100 px-5 py-8 hover:outline hover:outline-GreenP lg:w-[48%]'
                            >
                                <SiVerizon className='text-white text-5xl bg-GreenP px-4 py-4' />
                                <h1 className='font-semibold text-lg mt-4'>{reason.title}</h1>
                                <p>{reason.text}</p>
                            </motion.div>
                        ))}
                    </article>
                </article>
            </div>
        </section>
    );
}
