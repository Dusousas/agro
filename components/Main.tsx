import React from 'react';

export default function Main() {
    return (
        <>
            <section className='bgMain'>
                <div className='maxW'>
                    <div className='gradient w-full h-[100vh] absolute left-0 z-0 lg:w-[50%]' />

                    <article className='z-10 relative flex gap-y-4 flex-col justify-center h-[100vh] lg:w-[50%]'>
                        <div className='flex justify-center gap-2 lg:justify-start'>
                            <svg aria-hidden="true" className="w-[20px] text-GreenP" viewBox="0 0 384 512" fill='currentColor' xmlns="http://www.w3.org/2000/svg"><path d="M384 312.7c-55.1 136.7-187.1 54-187.1 54-40.5 81.8-107.4 134.4-184.6 134.7-16.1 0-16.6-24.4 0-24.4 64.4-.3 120.5-42.7 157.2-110.1-41.1 15.9-118.6 27.9-161.6-82.2 109-44.9 159.1 11.2 178.3 45.5 9.9-24.4 17-50.9 21.6-79.7 0 0-139.7 21.9-149.5-98.1 119.1-47.9 152.6 76.7 152.6 76.7 1.6-16.7 3.3-52.6 3.3-53.4 0 0-106.3-73.7-38.1-165.2 124.6 43 61.4 162.4 61.4 162.4.5 1.6.5 23.8 0 33.4 0 0 45.2-89 136.4-57.5-4.2 134-141.9 106.4-141.9 106.4-4.4 27.4-11.2 53.4-20 77.5 0 0 83-91.8 172-20z"></path>
                                <path d="M384 312.7c-55.1 136.7-187.1 54-187.1 54-40.5 81.8-107.4 134.4-184.6 134.7-16.1 0-16.6-24.4 0-24.4 64.4-.3 120.5-42.7 157.2-110.1-41.1 15.9-118.6 27.9-161.6-82.2 109-44.9 159.1 11.2 178.3 45.5 9.9-24.4 17-50.9 21.6-79.7 0 0-139.7 21.9-149.5-98.1 119.1-47.9 152.6 76.7 152.6 76.7 1.6-16.7 3.3-52.6 3.3-53.4 0 0-106.3-73.7-38.1-165.2 124.6 43 61.4 162.4 61.4 162.4.5 1.6.5 23.8 0 33.4 0 0 45.2-89 136.4-57.5-4.2 134-141.9 106.4-141.9 106.4-4.4 27.4-11.2 53.4-20 77.5 0 0 83-91.8 172-20z"></path>
                            </svg>
                            <h5 className='font-GochiHand text-BlackH1 text-xl'>Estabelecido desde 2025</h5>
                        </div>

                        <h2 className='text-BlackMain font-Manrope font-extrabold text-4xl text-center lg:text-6xl lg:text-left'>Semeando qualidade, Colhendo confiança.</h2>
                        <p className='text-center lg:text-left'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Itaque cum illo repellat quos laboriosam officiis?</p>
                    <div className='mt-2 flex justify-center lg:justify-start'>
                        <a className='bg-YellowP px-6 py-3 rounded-2xl font-Manrope' href="">Entre em contato</a>
                    </div>
                    </article>

                </div>
            </section>
        </>
    );
}

