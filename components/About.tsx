import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
    return (
        <section id='about' className='py-20'>
            <div className='maxW flex flex-col items-center gap-20 lg:flex-row'>

                {/* Imagens com animação */}
                <motion.article
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className='flex flex-col lg:w-[50%] gap-6 lg:flex-row'
                >
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <img className='w-[400px] h-[500px] object-cover' src="/about1.webp" alt="" />
                    </motion.div>

                    <motion.img
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className='w-[400px] h-[500px] object-cover mt-10'
                        src="/about2.webp"
                        alt=""
                    />
                </motion.article>

                {/* Texto com animação */}
                <motion.article
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                    className='lg:w-[50%]'
                >
                    <h6 className='text-xl'>Sobre nós</h6>
                    <h1 className='text-3xl font-bold mt-2'>Sabores verdadeiros, cultivados com respeito.</h1>
                    <h2 className='font-Manrope text-BlackH1 text-lg font-semibold mt-4'>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestiae animi suscipit repellat enim maiores ab?
                    </h2>
                    <p className='mt-4'>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi aspernatur repellat recusandae exercitationem, facilis excepturi...
                    </p>
                    <p className='mt-2'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa quos perspiciatis soluta?
                    </p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        viewport={{ once: true }}
                        className='mt-6 flex justify-center lg:justify-start'
                    >
                        <a className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope' href="">
                            Entre em contato
                        </a>
                    </motion.div>
                </motion.article>
            </div>
        </section>
    );
}
