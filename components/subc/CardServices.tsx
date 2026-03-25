import React from 'react';

export default function CardServices() {
    const cards = [
        {
            title: "Escolha seu plano",
            text: "Selecione a cesta que faz sentido para sua rotina e veja o valor mensal com desconto.",
        },
        {
            title: "Montagem semanal",
            text: "Separamos hortaliças frescas e sazonais para manter qualidade e variedade em cada entrega.",
        },
        {
            title: "Entrega em Brotas",
            text: "Organizamos as entregas com recorrência para você receber sem precisar pedir toda semana.",
        },
        {
            title: "Itens equilibrados",
            text: "Cada pacote traz uma combinação pensada de folhas, legumes, temperos e itens da estação.",
        },
        {
            title: "Economia mensal",
            text: "A assinatura reduz o valor em relação às cestas avulsas e ajuda no planejamento do mês.",
        },
        {
            title: "Atendimento próximo",
            text: "Nossa equipe acompanha sua assinatura para orientar trocas, ajustes e dúvidas do pedido.",
        }
    ];

    return (
        <article className='flex flex-col flex-wrap justify-center gap-8 mt-20 lg:flex-row'>
            {cards.map((card) => (
                <div key={card.title} className='bg-white flex flex-col shador-lg px-6 py-20 items-center justify-center lg:w-[30.3%] shadow-md hover:shadow-xl'>
                    <div className='bg-GreenP px-4 py-3 rounded-full flex items-center justify-center'>
                        <svg aria-hidden="true" className="w-[20px] text-white bg-GreenP" viewBox="0 0 384 512" fill='currentColor' xmlns="http://www.w3.org/2000/svg">
                            <path d="M384 312.7c-55.1 136.7-187.1 54-187.1 54-40.5 81.8-107.4 134.4-184.6 134.7-16.1 0-16.6-24.4 0-24.4 64.4-.3 120.5-42.7 157.2-110.1-41.1 15.9-118.6 27.9-161.6-82.2 109-44.9 159.1 11.2 178.3 45.5 9.9-24.4 17-50.9 21.6-79.7 0 0-139.7 21.9-149.5-98.1 119.1-47.9 152.6 76.7 152.6 76.7 1.6-16.7 3.3-52.6 3.3-53.4 0 0-106.3-73.7-38.1-165.2 124.6 43 61.4 162.4 61.4 162.4.5 1.6.5 23.8 0 33.4 0 0 45.2-89 136.4-57.5-4.2 134-141.9 106.4-141.9 106.4-4.4 27.4-11.2 53.4-20 77.5 0 0 83-91.8 172-20z"></path>
                        </svg>
                    </div>
                    <h1 className='font-semibold text-xl mt-4'>{card.title}</h1>
                    <p className='text-center mt-4'>
                        {card.text}
                    </p>
                </div>
            ))}
        </article>
    );
}
