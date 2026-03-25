import React from 'react';
import { motion } from 'framer-motion';

const plans = [
    {
        name: 'Cesta Broto',
        badge: 'Ideal para 1 a 2 pessoas',
        weeklyPrice: 39.9,
        monthlyPrice: 143.64,
        description: 'Uma cesta prática para manter a rotina com folhas, legumes e temperos frescos durante o mês.',
        items: ['Folhas variadas da semana', '3 legumes da estação', 'Ervas frescas', 'Sugestão de consumo'],
    },
    {
        name: 'Cesta Colheita',
        badge: 'Perfeita para famílias',
        weeklyPrice: 59.9,
        monthlyPrice: 215.64,
        description: 'Mais variedade para quem cozinha com frequência e quer receber uma seleção equilibrada toda semana.',
        items: ['Mix reforçado de folhas', '5 legumes e raízes', 'Temperos e ervas', 'Item sazonal especial'],
    },
    {
        name: 'Cesta Santa Cruz',
        badge: 'Plano mais completo',
        weeklyPrice: 84.9,
        monthlyPrice: 305.64,
        description: 'Nossa assinatura premium com cesta farta, variedade estendida e melhor custo para abastecer a casa.',
        items: ['Folhas e legumes premium', '7 itens sazonais variados', 'Ervas e temperos extras', 'Seleção destaque da semana'],
    }
];

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);

export default function Plans() {
    return (
        <section id='assinaturas' className='py-20 bg-white'>
            <div className='maxW'>
                <motion.h6
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className='text-xl text-center'
                >
                    Assinaturas mensais
                </motion.h6>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    viewport={{ once: true }}
                    className='text-3xl font-bold text-center mt-2'
                >
                    Escolha sua cesta e compare os pacotes disponíveis.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    viewport={{ once: true }}
                    className='text-center mt-4 max-w-3xl mx-auto'
                >
                    Todas as assinaturas incluem seleção semanal de hortaliças, montagem cuidadosa e atendimento próximo para quem quer receber frescor com constância em Brotas.
                </motion.p>

                <div className='mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
                    {plans.map((plan, index) => (
                        <motion.article
                            key={plan.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.15 + index * 0.1 }}
                            viewport={{ once: true }}
                            className='text-left bg-white border border-gray-200 rounded-[28px] shadow-md p-8 transition-all hover:border-GreenP/60 hover:shadow-xl'
                        >
                            <span className='inline-block bg-GreenP/10 text-GreenP font-Manrope text-sm px-4 py-2 rounded-full'>
                                {plan.badge}
                            </span>
                            <h2 className='text-2xl font-bold mt-5'>{plan.name}</h2>
                            <p className='mt-3'>{plan.description}</p>
                            <div className='mt-6'>
                                <p className='font-Manrope text-sm uppercase tracking-[0.2em] text-GrayP'>Valor mensal</p>
                                <h3 className='text-4xl font-bold text-BlackH1 mt-2'>{formatCurrency(plan.monthlyPrice)}</h3>
                                <p className='mt-2 text-sm'>ou {formatCurrency(plan.weeklyPrice)} por cesta avulsa</p>
                            </div>
                            <div className='mt-6 space-y-3'>
                                {plan.items.map((item) => (
                                    <div key={item} className='flex items-start gap-3'>
                                        <span className='mt-1 h-2.5 w-2.5 rounded-full bg-YellowP shrink-0' />
                                        <p className='text-sm'>{item}</p>
                                    </div>
                                ))}
                            </div>
                            <a
                                className='mt-8 inline-block bg-YellowP px-6 py-3 rounded-2xl font-Manrope text-BlackH1'
                                href='#contact'
                            >
                                Quero esse plano
                            </a>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
