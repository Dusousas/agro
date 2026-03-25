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
};

export default function AdminSidebar({ items, activeTab, onSelect }: AdminSidebarProps) {
    return (
        <aside className='bg-white rounded-[32px] shadow-md p-6 lg:p-8 h-fit xl:sticky xl:top-8'>
            <p className='font-GochiHand text-[10px] uppercase text-GreenP'>Painel Admin</p>
            <h2 className='text-xl uppercase font-bold mt-2'>Eduardo Sousa</h2>
            <p className='mt-3'>Gerencie clientes, finanças, cupons e a operação do sistema em um único dashboard.</p>

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
                                isActive
                                    ? 'bg-BlackMain text-white'
                                    : 'bg-gray-50 hover:bg-[#F7FAEF]'
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
                <h3 className='text-2xl font-bold mt-2'>24 assinaturas ativas</h3>
                <p className='mt-2 text-sm'>3 novos clientes, 2 cupons usados e 1 pagamento pendente.</p>
            </div>
        </aside>
    );
}
