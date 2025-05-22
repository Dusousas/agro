import React, { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => document.body.classList.remove("overflow-hidden");
    }, [isOpen]);

    return (
        <>
            <nav className="hidden lg:block">
                <ul className="flex gap-6 text-lg text-BlackH1 font-Manrope">
                    <a href="#home"><li>Início</li></a>
                    <a href="#about"><li>Sobre</li></a>
                    <a href="#services"><li>Serviços</li></a>
                    <a href="#contact"><li>Contato</li></a>
                </ul>
            </nav>

            <div className="lg:hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-3xl text-BlackH1 focus:outline-none relative z-50"
                >
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>

                <nav
                    className={`fixed top-0 right-0 h-screen w-full bg-white shadow-md z-40 flex flex-col items-center justify-center transition-transform duration-300 ${
                        isOpen ? "translate-x-0" : "translate-x-full"
                    }`}>
                    <ul className="flex flex-col items-center gap-8 text-lg uppercase font-semibold text-BlackH1">
                        <a href="#home" onClick={() => setIsOpen(false)}><li>Início</li></a>
                        <a href="#about" onClick={() => setIsOpen(false)}><li>Sobre</li></a>
                        <a href="#services" onClick={() => setIsOpen(false)}><li>Serviços</li></a>
                        <a href="#contact" onClick={() => setIsOpen(false)}><li>Contato</li></a>
                    </ul>
                </nav>
            </div>
        </>
    );
}
