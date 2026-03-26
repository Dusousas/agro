import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { FiMessageCircle, FiSend, FiX } from "react-icons/fi";

type ChatMessage = {
    id: number;
    role: "assistant" | "user";
    text: string;
};

const initialMessages: ChatMessage[] = [
    {
        id: 1,
        role: "assistant",
        text: "Oi! Sou o assistente da assinatura. Por enquanto este chat e uma versao inicial, mas ja posso te receber por aqui.",
    },
];

export default function ChatbotWidget() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [draft, setDraft] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

    const isLoggedIn = Boolean(session?.user?.email);

    const assistantReply = useMemo(
        () => "Recebi sua mensagem. Em breve vamos conectar este chat com atendimento e dados reais do painel.",
        []
    );

    if (!isLoggedIn) {
        return null;
    }

    function handleSend() {
        const text = draft.trim();
        if (!text) return;

        setMessages((current) => [
            ...current,
            { id: Date.now(), role: "user", text },
            { id: Date.now() + 1, role: "assistant", text: assistantReply },
        ]);
        setDraft("");
    }

    return (
        <div className="fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-3">
            {isOpen ? (
                <div className="w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-2xl">
                    <div className="flex items-center justify-between bg-BlackMain px-5 py-4 text-white">
                        <div>
                            <p className="font-Manrope text-xs uppercase tracking-[0.2em] text-white/70">Chat da assinatura</p>
                            <h3 className="font-Poppins text-lg font-bold">Atendimento rapido</h3>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-xl"
                            aria-label="Fechar chat"
                        >
                            <FiX />
                        </button>
                    </div>

                    <div className="max-h-80 space-y-3 overflow-y-auto bg-[#F7FAEF] p-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                                    message.role === "assistant"
                                        ? "bg-white text-BlackH1"
                                        : "ml-auto bg-YellowP text-BlackH1"
                                }`}
                            >
                                {message.text}
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={draft}
                                onChange={(event) => setDraft(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Digite sua mensagem"
                                className="h-12 flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 outline-none"
                            />
                            <button
                                type="button"
                                onClick={handleSend}
                                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-YellowP text-xl text-BlackH1"
                                aria-label="Enviar mensagem"
                            >
                                <FiSend />
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-GreenP text-3xl text-white shadow-xl transition-transform hover:scale-105"
                aria-label={isOpen ? "Fechar chat" : "Abrir chat"}
            >
                <FiMessageCircle />
            </button>
        </div>
    );
}
