import React from 'react';
import { IconType } from 'react-icons';

type AdminSidebarItem = {
    id: string;
    label: string;
    icon: IconType;
};

type AdminSidebarProps = {
    items: AdminSidebarItem[];
    activeTab: string;
    onSelect: (id: string) => void;
    activeClients: number;
    upcomingDeliveries: number;
    activeCoupons: number;
    pendingRevenue: string;
};

export default function AdminSidebar({ items, activeTab, onSelect, activeClients, upcomingDeliveries, activeCoupons, pendingRevenue }: AdminSidebarProps) {
    return (
        <aside className='h-fit rounded-[32px] bg-white p-6 shadow-md xl:sticky xl:top-8 lg:p-8'>
            <p className='font-GochiHand text-[10px] uppercase text-GreenP'>Painel Admin</p>
            <h2 className='mt-2 text-xl font-bold uppercase'>Operacao da assinatura</h2>
            <p className='mt-3'>Gerencie clientes, financas, cupons, entregas e catalogo de planos em um unico dashboard.</p>

            <div className='mt-8 space-y-3'>
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            type='button'
                            onClick={() => onSelect(item.id)}
                            className={`w-full rounded-2xl px-4 py-4 text-left transition-all ${
                                isActive ? 'bg-BlackMain text-white' : 'bg-gray-50 hover:bg-[#F7FAEF]'
                            }`}
                        >
                            <div className='flex items-center gap-3'>
                                <Icon className={`text-2xl ${isActive ? 'text-YellowP' : 'text-GreenP'}`} />
                                <span className='font-Manrope font-semibold'>{item.label}</span>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className='mt-8 rounded-2xl bg-[#FFF8DE] p-5'>
                <p className='text-sm'>Resumo do dia</p>
                <h3 className='mt-2 text-2xl font-bold'>{activeClients} clientes ativos</h3>
                <p className='mt-2 text-sm'>{upcomingDeliveries} entregas na fila, {activeCoupons} cupons ativos e {pendingRevenue} em aberto.</p>
            </div>
        </aside>
    );
}
