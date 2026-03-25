import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

type AdminMetricCardProps = {
    title: string;
    value: string;
    description: string;
    icon: IconType;
    delay?: number;
};

export default function AdminMetricCard({
    title,
    value,
    description,
    icon: Icon,
    delay = 0,
}: AdminMetricCardProps) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay }}
            className='bg-white rounded-[28px] shadow-md p-6'
        >
            <Icon className='text-4xl text-GreenP' />
            <p className='text-sm mt-5'>{title}</p>
            <h3 className='text-3xl font-bold mt-2'>{value}</h3>
            <p className='mt-2'>{description}</p>
        </motion.article>
    );
}
