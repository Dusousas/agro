import React from 'react';

export default function Footer() {
    return (
        <>
            <footer className='py-6'>
                <div className='maxW'>
                    <p className='text-center'>Todos os direitos reservados</p>

                    <div className='flex items-center gap-1'>
                        <p className='text-center'>Desenvolvido por</p>
                        <a target='_blank' href="https://www.agenciayouon.com"><img className='w-[50px]' src="yo.png" alt="" /></a>
                    </div>
                </div>
            </footer>
        </>
    );
}