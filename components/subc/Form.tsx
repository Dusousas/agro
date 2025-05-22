import React from 'react';

export default function Form() {
    return (
        <>
            <form className='border-t-2 border-GreenP bg-white py-10 px-4 lg:px-12 shadow-xl' action="">
                <article className='flex flex-col gap-4 lg:flex-row'>
                    <div className='flex flex-col gap-1'>
                        <label className='font-semibold font-Manrope' htmlFor="">Nome</label>
                        <input className='bg-gray-100 px-4 py-3 rounded-2xl outline-0' placeholder='Seu Nome' type="text" />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label className='font-semibold font-Manrope' htmlFor="">Email</label>
                        <input className='bg-gray-100 px-4 py-3 rounded-2xl outline-0' placeholder='Seu Email' type="text" />
                    </div>
                </article>
                <article className='flex flex-col gap-4 mt-4 lg:flex-row'>
                    <div className='flex flex-col gap-1'>
                        <label className='font-semibold font-Manrope' htmlFor="">Telefone</label>
                        <input className='bg-gray-100 px-4 py-3 rounded-2xl outline-0' placeholder='Seu telefone' type="text" />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label className='font-semibold font-Manrope' htmlFor="">Assunto</label>
                        <input className='bg-gray-100 px-4 py-3 rounded-2xl outline-0' placeholder='Assunto' type="text" />
                    </div>
                </article>

                <div className='flex flex-col gap-1 mt-4'>
                    <label className='font-semibold font-Manrope' htmlFor="">Mensagem</label>
                    <textarea className='bg-gray-100 px-4 py-3 rounded-2xl outline-0 resize-none' placeholder='Sua mensagem' />
                </div>

                <button className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope mt-4 cursor-pointer'>Enviar agora</button>
            </form>
        </>
    );
}