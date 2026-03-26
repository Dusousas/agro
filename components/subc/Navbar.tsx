import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const links = useMemo(() => {
        const base = router.pathname === "/" ? "" : "/";

        return [
            { href: `${base}#home`, label: "Início" },
            { href: `${base}#about`, label: "Como funciona" },
            { href: `${base}#assinaturas`, label: "Assinaturas" },
            { href: `${base}#service`, label: "Benefícios" },
            { href: `${base}#contact`, label: "Contato" },
        ];
    }, [router.pathname]);

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
                <div className="flex items-center gap-6">
                    <ul className="flex gap-6 text-BlackH1 uppercase font-Manrope">
                        {links.map((link) => (
                            <a key={link.href} href={link.href}>
                                <li>{link.label}</li>
                            </a>
                        ))}
                    </ul>

                    <a
                        href="/painel"
                        className="bg-YellowP px-5 py-3 rounded-2xl font-Manrope text-BlackH1"
                    >
                        Minha assinatura
                    </a>
                </div>
            </nav>

            <div className="lg:hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-3xl text-BlackH1 focus:outline-none relative z-50"
                    aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
                >
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>

                <div
                    className={`fixed inset-0 z-40 transition-all duration-300 ${isOpen ? "pointer-events-auto bg-black/35" : "pointer-events-none bg-transparent"}`}
                    onClick={() => setIsOpen(false)}
                />

                <nav
                    className={`fixed top-0 right-0 h-screen w-[84%] max-w-sm bg-white shadow-2xl z-40 flex flex-col justify-between transition-transform duration-300 ${
                        isOpen ? "translate-x-0" : "translate-x-full"
                    }`}>
                    <div className="px-6 pt-24">
                        <p className="font-GochiHand text-2xl text-GreenP">Hortaliças Santa Cruz</p>
                        <h3 className="font-Poppins text-2xl font-bold text-BlackH1 mt-2">O sabor do campo na sua mesa</h3>
                        <ul className="flex flex-col gap-5 text-lg font-semibold text-BlackH1 mt-10">
                            {links.map((link) => (
                                <a key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                                    <li>{link.label}</li>
                                </a>
                            ))}
                        </ul>
                    </div>

                    <div className="p-6 border-t border-gray-200">
                        <div className="space-y-3">
                            <a
                                href="/painel"
                                onClick={() => setIsOpen(false)}
                                className="bg-YellowP px-6 py-3 rounded-2xl font-Manrope text-center block"
                            >
                                Minha assinatura
                            </a>
                            <a
                                href="/admin"
                                onClick={() => setIsOpen(false)}
                                className="border border-gray-200 px-6 py-3 rounded-2xl font-Manrope text-center block"
                            >
                                Painel admin
                            </a>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
}
