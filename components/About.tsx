import React from 'react';

export default function About() {
    return (
        <>
            <section id='about' className='py-20'>
                <div className='maxW flex flex-col items-center gap-20 lg:flex-row'>
                    <article className='flex lg:w-[50%] gap-6'>
                        <div>
                            <img className='w-[400px] h-[500px] object-cover' src="/about1.webp" alt="" />

                        </div>
                        <img className='w-[400px] h-[500px] object-cover mt-10' src="/about2.webp" alt="" />
                    </article>

                    <article className='lg:w-[50%] '>
                        <h6 className='text-xl'>Sobre nós</h6>
                        <h1 className='text-3xl font-bold mt-2'>Sabores verdadeiros, cultivados com respeito.</h1>
                        <h2 className='font-Manrope text-BlackH1 text-lg font-semibold mt-4'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestiae animi suscipit repellat enim maiores ab?</h2>
                        <p className='mt-4'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi aspernatur repellat recusandae exercitationem, facilis excepturi neque accusantium, atque nobis temporibus repudiandae cum minima esse, itaque porro? Quis quod optio voluptas blanditiis dolorum, mollitia natus soluta hic? Ea expedita illo explicabo!</p>
                        <p className='mt-2'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa quos perspiciatis soluta? Similique labore beatae reiciendis deleniti error iure eaque.</p>
                        <div className='mt-6 flex justify-center lg:justify-start'>
                            <a className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope' href="">Entre em contato</a>
                        </div>
                    </article>
                </div>
            </section>
        </>
    );
}