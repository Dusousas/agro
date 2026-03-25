import React from 'react';
import Navbar from './subc/Navbar';

export default function Header() {
    return (
        <header className='py-6 border-b border-GrayP'>
            <div className='maxW flex justify-between items-center'>
                <a className='text-2xl font-Manrope text-GreenP uppercase leading-tight' href="/#home">
                    Hortaliças <span className='font-extrabold text-BlackH1'>Santa Cruz</span>
                </a>
                <Navbar />
            </div>
        </header>
    );
}
