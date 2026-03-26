import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

type PainelModalProps = {
    title: string;
    subtitle: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

export default function PainelModal({ title, subtitle, isOpen, onClose, children }: PainelModalProps) {
    useEffect(() => {
        if (!isOpen) return;

        document.body.classList.add('overflow-hidden');

        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='fixed inset-0 z-[60] flex items-center justify-center bg-black/45 px-4 py-6 lg:px-8'
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className='max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[36px] bg-white shadow-2xl'
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className='flex items-start justify-between gap-4 border-b border-gray-100 p-6 lg:p-10'>
                            <div>
                                <p className='font-GochiHand text-xl text-GreenP'>{subtitle}</p>
                                <h2 className='text-3xl font-bold mt-2'>{title}</h2>
                            </div>
                            <button
                                type='button'
                                onClick={onClose}
                                className='h-11 w-11 rounded-full border border-gray-200 flex items-center justify-center text-2xl text-BlackH1'
                                aria-label='Fechar popup'
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className='p-6 lg:p-10'>
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}
