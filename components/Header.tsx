import React from 'react';
import Navbar from './subc/Navbar';

export default function Header() {
    return (
        <>
            <header className='py-6 border-b border-GrayP '>
                <div className='maxW flex justify-between items-center'>

                    <div>
                        <a className='text-2xl font-Manrope text-GreenP uppercase' href="/">Sua<span className='font-extrabold text-BlackH1'>Farms</span></a>
                    </div>
                    <Navbar />
                </div>
            </header>
        </>
    );
}