import React from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { FiPhone } from 'react-icons/fi';
import { MdOutlineMail } from 'react-icons/md';

export default function Footer() {
    return (
        <footer className='bgService'>
            <div className='gradient3 h-full'>
                <div className='maxW flex flex-col lg:justify-between lg:flex-row'>
                    <article className='py-8 flex'>
                        <div className='lg:max-w-[40%]'>
                            <a className='text-2xl font-Manrope text-GreenP uppercase' href="#home">Hortaliças <span className='font-extrabold text-white'>Santa Cruz</span></a>
                            <h5 className='text-white font-Manrope text-sm mt-2'>O sabor do campo na sua mesa com assinaturas mensais de cestas frescas para Brotas.</h5>
                            <div className='mt-6 flex items-center gap-1'>
                                <FaLocationDot className='text-xl text-GreenP' />
                                <h5 className='text-white font-Manrope text-sm'>Brotas - SP</h5>
                            </div>
                            <div className='mt-2 flex items-center gap-1'>
                                <MdOutlineMail className='text-xl text-GreenP' />
                                <h5 className='text-white font-Manrope text-sm'>contato@hortalicassantacruz.com.br</h5>
                            </div>
                            <div className='mt-2 flex items-center gap-1'>
                                <FiPhone className='text-xl text-GreenP' />
                                <h5 className='text-white font-Manrope text-sm'>(14) 99999-0000</h5>
                            </div>
                        </div>
                    </article>

                    <article className='py-8 lg:w-[30%]'>
                        <h5 className='text-xl font-Manrope text-white font-bold'>Receba novidades</h5>
                        <h5 className='text-white font-Manrope text-sm mt-2'>Cadastre seu contato para receber avisos sobre novas cestas, disponibilidade e condições especiais de assinatura.</h5>
                        <input className='bg-white px-4 py-3 rounded-2xl outline-0 mt-4 w-full' type="text" name="" id="" placeholder='Seu melhor email' />
                        <button className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope mt-4 cursor-pointer'>Quero receber</button>
                    </article>
                </div>
                <article className='border-t border-white py-4'>
                    <h5 className='text-center text-white font-Manrope'>Todos os direitos reservados</h5>
                    <div className='flex items-center gap-1 justify-center mt-1'>
                        <h5 className='text-center text-sm text-white/60 font-Manrope'>Desenvolvido por</h5>
                        <a target='_blank' href="https://www.agenciayouon.com"><img className='w-[50px]' src="yo.png" alt="Agência You On" /></a>
                    </div>
                </article>
            </div>
        </footer>
    );
}
