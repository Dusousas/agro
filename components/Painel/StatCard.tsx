import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

type StatCardProps = {
    title: string;
    value: string;
    description: string;
    icon: IconType;
    delay?: number;
    dark?: boolean;
    onClick?: () => void;
};

export default function StatCard({
    title,
    value,
    description,
    icon: Icon,
    delay = 0,
    dark = false,
    onClick,
}: StatCardProps) {
    const className = `w-full text-left rounded-[28px] shadow-md p-6 transition-all ${
        dark
            ? 'bg-BlackMain hover:bg-BlackMain/95'
            : 'bg-white hover:-translate-y-1 hover:shadow-xl'
    }`;

    const content = (
        <>
            <Icon className={`text-4xl ${dark ? 'text-YellowP' : 'text-GreenP'}`} />
            <p className={`text-sm mt-5 ${dark ? 'text-white/70' : ''}`}>{title}</p>
            <h2 className={`text-2xl font-bold mt-1 ${dark ? 'text-white' : 'text-BlackH1'}`}>{value}</h2>
            <p className={`mt-2 ${dark ? 'text-white/80' : ''}`}>{description}</p>
            {onClick ? (
                <span className={`inline-block mt-5 font-Manrope ${dark ? 'text-YellowP' : 'text-GreenP'}`}>
                    Abrir detalhes
                </span>
            ) : null}
        </>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            {onClick ? (
                <button type='button' onClick={onClick} className={className}>
                    {content}
                </button>
            ) : (
                <article className={className}>
                    {content}
                </article>
            )}
        </motion.div>
    );
}
