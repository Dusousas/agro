import React from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { FiPhone } from 'react-icons/fi';
import { MdOutlineMail } from 'react-icons/md';

export default function Footer() {
    return (
        <>
            <footer className='bgService '>
                <div className='gradient3 h-full'>
                    <div className='maxW flex flex-col '>

                        <article className='py-8 flex'>
                            <div className='lg:max-w-[40%]'>
                                <a className='text-2xl font-Manrope text-GreenP uppercase' href="/">Sua<span className='font-extrabold text-BlackH1'>Farms</span></a>
                                <h5 className='text-white font-Manrope text-sm mt-2'>Velit montes quisque eros ullamcorper nisl interdum tristique. Congue elit donec est per ultrices quisque.</h5>
                                <div className='mt-6 flex items-center gap-1'>
                                    <FaLocationDot className='text-xl text-GreenP' />
                                    <h5 className='text-white font-Manrope text-sm'>Rua exemplo, 240 - São Paulo</h5>
                                </div>
                                <div className='mt-2 flex items-center gap-1'>
                                    <MdOutlineMail className='text-xl text-GreenP' />
                                    <h5 className='text-white font-Manrope text-sm'>seuemail@dominio.con</h5>
                                </div>
                                <div className='mt-2 flex items-center gap-1'>
                                    <FiPhone className='text-xl text-GreenP' />
                                    <h5 className='text-white font-Manrope text-sm'>11 9 1224-1234</h5>
                                </div>
                            </div>
                        </article>

                        <article className='py-8'>
                            <h5 className='text-xl font-Manrope text-white font-bold'>Assine a Newsletter</h5>
                            <h5 className='text-white font-Manrope text-sm mt-2'>Join 60,000+ Subscribers and get a new discount coupon every saturday</h5>
                            <input className='bg-white px-4 py-3 rounded-2xl outline-0 mt-4 w-full' type="text" name="" id="" />
                            <button className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope mt-4 cursor-pointer'>Enviar</button>

                        </article>


                    </div>
                    <article className='border-t border-white py-4'>
                        <h5 className='text-center text-white font-Manrope'>Todos os direitos reservados</h5>
                        <div className='flex items-center gap-1 justify-center mt-1'>
                            <h5 className='text-center text-sm text-white/60 font-Manrope'>Desenvolvido por</h5>
                            <a target='_blank' href="https://www.agenciayouon.com"><img className='w-[50px]' src="yo.png" alt="" /></a>
                        </div>
                    </article>
                </div>
            </footer>
        </>
    );
}