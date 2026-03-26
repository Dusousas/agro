import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { FiChevronDown, FiMenu, FiUser, FiX } from "react-icons/fi";

export default function Navbar() {
    const router = useRouter();
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const accountMenuRef = useRef<HTMLDivElement | null>(null);

    const links = useMemo(() => {
        const base = router.pathname === "/" ? "" : "/";

        return [
            { href: `${base}#home`, label: "Inicio" },
            { href: `${base}#about`, label: "Como funciona" },
            { href: `${base}#assinaturas`, label: "Assinaturas" },
            { href: `${base}#service`, label: "Beneficios" },
            { href: `${base}#contact`, label: "Contato" },
        ];
    }, [router.pathname]);

    const isLoggedIn = Boolean(session?.user?.email);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => document.body.classList.remove("overflow-hidden");
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!accountMenuRef.current?.contains(event.target as Node)) {
                setIsAccountMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleMySubscription() {
        setIsAccountMenuOpen(false);
        await router.push("/painel");
    }

    async function handleLogout() {
        setIsAccountMenuOpen(false);
        await signOut({ callbackUrl: "/" });
    }

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

                    {isLoggedIn ? (
                        <div className="relative" ref={accountMenuRef}>
                            <button
                                type="button"
                                onClick={() => setIsAccountMenuOpen((current) => !current)}
                                className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3 font-Manrope text-BlackH1 shadow-sm"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-GreenP/10 text-GreenP">
                                    <FiUser className="text-lg" />
                                </span>
                                <span>Minha conta</span>
                                <FiChevronDown className={`transition-transform ${isAccountMenuOpen ? "rotate-180" : ""}`} />
                            </button>

                            {isAccountMenuOpen ? (
                                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-xl">
                                    <button
                                        type="button"
                                        onClick={handleMySubscription}
                                        className="block w-full border-b border-gray-100 px-5 py-4 text-left font-Manrope text-BlackH1 hover:bg-[#F7FAEF]"
                                    >
                                        Minha assinatura
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="block w-full px-5 py-4 text-left font-Manrope text-red-500 hover:bg-red-50"
                                    >
                                        Sair
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleMySubscription}
                            className="rounded-2xl bg-YellowP px-5 py-3 font-Manrope text-BlackH1"
                        >
                            Minha assinatura
                        </button>
                    )}
                </div>
            </nav>

            <div className="lg:hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative z-50 text-3xl text-BlackH1 focus:outline-none"
                    aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
                >
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>

                <div
                    className={`fixed inset-0 z-40 transition-all duration-300 ${isOpen ? "pointer-events-auto bg-black/35" : "pointer-events-none bg-transparent"}`}
                    onClick={() => setIsOpen(false)}
                />

                <nav
                    className={`fixed top-0 right-0 z-40 flex h-screen w-[88%] max-w-sm flex-col justify-between bg-white shadow-2xl transition-transform duration-300 ${
                        isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    <div className="px-6 pt-24">
                        <p className="font-GochiHand text-2xl text-GreenP">Hortalicas Santa Cruz</p>
                        <h3 className="mt-2 font-Poppins text-2xl font-bold text-BlackH1">O sabor do campo na sua mesa</h3>
                        <ul className="mt-10 flex flex-col gap-5 text-lg font-semibold text-BlackH1">
                            {links.map((link) => (
                                <a key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                                    <li>{link.label}</li>
                                </a>
                            ))}
                        </ul>
                    </div>

                    <div className="border-t border-gray-200 p-6">
                        {isLoggedIn ? (
                            <div className="rounded-[28px] border border-gray-200 bg-gray-50 p-4">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-GreenP/10 text-GreenP">
                                        <FiUser className="text-lg" />
                                    </span>
                                    <div>
                                        <p className="font-Manrope text-xs uppercase tracking-[0.18em] text-GrayP">Minha conta</p>
                                        <p className="font-Manrope font-semibold text-BlackH1">Acesso rapido</p>
                                    </div>
                                </div>
                                <div className="mt-4 space-y-3">
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            setIsOpen(false);
                                            await handleMySubscription();
                                        }}
                                        className="block w-full rounded-2xl bg-YellowP px-6 py-3 text-center font-Manrope"
                                    >
                                        Minha assinatura
                                    </button>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            setIsOpen(false);
                                            await handleLogout();
                                        }}
                                        className="block w-full rounded-2xl bg-red-500 px-6 py-3 text-center font-Manrope text-white"
                                    >
                                        Sair
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={async () => {
                                    setIsOpen(false);
                                    await handleMySubscription();
                                }}
                                className="block w-full rounded-2xl bg-YellowP px-6 py-3 text-center font-Manrope"
                            >
                                Minha assinatura
                            </button>
                        )}

                        <a
                            href="/admin"
                            onClick={() => setIsOpen(false)}
                            className="mt-3 block rounded-2xl border border-gray-200 px-6 py-3 text-center font-Manrope"
                        >
                            Painel admin
                        </a>
                    </div>
                </nav>
            </div>
        </>
    );
}
