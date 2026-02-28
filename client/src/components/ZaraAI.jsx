import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendZaraMessage } from '../services/zara.service';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import zara from "../assets/zara.jpg"

// ── Sub-components ────────────────────────────────────────────────────

const ZaraAvatar = ({ size = 'md', animated = false }) => {
    const sizes = { sm: 'w-7 h-7', md: 'w-10 h-10', lg: 'w-14 h-14' };
    return (
        <div className={`${sizes[size]} relative flex-shrink-0`}>
            {/* Soft glow background */}
            <div className={`absolute -inset-0.5 rounded-full bg-gradient-to-br from-violet-400/20 to-indigo-500/20 blur-sm ${animated ? 'animate-pulse' : ''}`} />
            
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/80 shadow-sm bg-slate-100 flex items-center justify-center">
                <img 
                    src={zara} 
                    alt="Zara" 
                    className="w-full h-full object-cover object-center scale-110" 
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
                <div className="hidden absolute inset-0 items-center justify-center bg-gradient-to-br from-violet-500 to-indigo-600">
                    <span className="font-bold text-white text-xs">Z</span>
                </div>
            </div>

            {/* Online indicator dot for specific sizes if needed, or just the ring pulse */}
            {animated && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full group-hover:scale-110 transition-transform" />
            )}
        </div>
    );
};

const TypingIndicator = () => (
    <div className="flex items-end gap-2 mb-4">
        <ZaraAvatar size="sm" animated />
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
            {[0, 0.2, 0.4].map((delay, i) => (
                <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-violet-400"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay, ease: 'easeInOut' }}
                />
            ))}
        </div>
    </div>
);

const CopyButton = ({ code }) => {
    const [copied, setCopied] = useState(false);
    return (
        <button
            onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs font-medium"
        >
            {copied ? (
                <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            )}
            {copied ? 'Copied' : 'Copy'}
        </button>
    );
};

// ── Content Formatter ─────────────────────────────────────────────────

const formatContent = (text) => {
    const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);
    return parts.map((part, i) => {
        if (part.startsWith('```') && part.endsWith('```')) {
            const inner = part.slice(3, -3);
            const firstNL = inner.indexOf('\n');
            let lang = 'javascript', code = inner;
            if (firstNL !== -1) {
                const possibleLang = inner.slice(0, firstNL).trim();
                if (/^[a-zA-Z0-9+#_-]+$/.test(possibleLang) && possibleLang.length < 20) {
                    lang = possibleLang; code = inner.slice(firstNL + 1);
                }
            }
            return (
                <div key={i} className="mt-2 mb-2 rounded-lg overflow-hidden border border-slate-700 text-xs">
                    <div className="bg-[#1e1e1e] flex items-center justify-between px-3 py-1.5 border-b border-black/40">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            <span className="ml-2 text-slate-500 font-mono uppercase tracking-wider" style={{ fontSize: '0.65rem' }}>{lang}</span>
                        </div>
                        <CopyButton code={code.trim()} />
                    </div>
                    <SyntaxHighlighter language={lang} style={vscDarkPlus} customStyle={{ margin: 0, padding: '0.85rem', fontSize: '0.75rem', background: '#1e1e1e' }} wrapLines wrapLongLines>
                        {code.trim()}
                    </SyntaxHighlighter>
                </div>
            );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={i} className="bg-violet-100 text-violet-900 text-xs px-1.5 py-0.5 rounded font-mono">{part.slice(1, -1)}</code>;
        }
        return part.split(/(\*\*[^*]+\*\*)/g).map((bp, j) => {
            if (bp.startsWith('**') && bp.endsWith('**')) return <strong key={j}>{bp.slice(2, -2)}</strong>;
            return bp.split('\n').map((line, k, arr) => (
                <span key={`${j}-${k}`}>{line}{k < arr.length - 1 && <br />}</span>
            ));
        });
    });
};

// ── Typing Chat Message ───────────────────────────────────────────────

const ChatMessage = ({ message, isLatestAssistant = false }) => {
    const isUser = message.role === 'user';
    const [displayed, setDisplayed] = useState(isLatestAssistant ? '' : message.content);
    const [done, setDone] = useState(!isLatestAssistant);

    useEffect(() => {
        if (!isLatestAssistant) { setDisplayed(message.content); setDone(true); return; }
        setDisplayed('');
        setDone(false);
        const words = message.content.split('');
        let idx = 0;
        // Type char-by-char, fast batching for code blocks
        const interval = setInterval(() => {
            const batch = message.content[idx] === '`' ? 1 : 4;
            idx = Math.min(idx + batch, message.content.length);
            setDisplayed(message.content.slice(0, idx));
            if (idx >= message.content.length) { clearInterval(interval); setDone(true); }
        }, 10);
        return () => clearInterval(interval);
    }, [message.content, isLatestAssistant]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex items-end gap-2 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {!isUser && <ZaraAvatar size="sm" />}
            <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser
                    ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-br-sm shadow-md shadow-violet-200'
                    : 'bg-white border border-slate-100 shadow-sm text-slate-700 rounded-bl-sm'
                }`}>
                <div className="space-y-1">
                    {formatContent(displayed)}
                    {!done && !isUser && (
                        <span className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 animate-pulse align-middle" />
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// ── Main ZaraAI Component ─────────────────────────────────────────────

export default function ZaraAI({ lessonContext }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hey! I'm **Zara** 👋 Your AI learning assistant on Learnify. Ask me anything about your lesson — concepts, code, examples — I'm here to help you understand better!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [latestAssistantIdx, setLatestAssistantIdx] = useState(0);
    const inputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const scrollAreaRef = useRef(null);

    // Auto-scroll to bottom ONLY when the chat is opened/reopened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                inputRef.current?.focus();
            }, 200);
        }
    }, [isOpen]);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        const userMsg = { role: 'user', content: trimmed };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        // Scroll to bottom when user sends (so they see their message + typing indicator)
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

        try {
            const { data } = await sendZaraMessage({
                userMessage: trimmed,
                lessonContext,
                chatHistory: messages.map(m => ({ role: m.role, content: m.content }))
            });
            setMessages(prev => {
                const next = [...prev, { role: 'assistant', content: data.reply }];
                setLatestAssistantIdx(next.length - 1);
                return next;
            });
        } catch {
            setMessages(prev => {
                const next = [...prev, { role: 'assistant', content: "Oops! I'm having a connection hiccup. Could you try again in a moment? 🔄" }];
                setLatestAssistantIdx(next.length - 1);
                return next;
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const suggestedPrompts = lessonContext
        ? [`Explain "${lessonContext.title}" simply`, 'Give me a real-world example', 'What are common mistakes here?']
        : ['What is this lesson about?', 'Give me an example', 'How do I practice this?'];

    return (
        <>
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 20 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                        className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[370px] max-h-[600px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-slate-100"
                        style={{ background: '#f8fafc' }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <ZaraAvatar size="md" />
                                <div>
                                    <h3 className="font-bold text-white text-sm">Zara AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-violet-200 text-xs">Online · Learning Assistant</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Messages — user can scroll freely, no forced auto-scroll during typing */}
                        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto px-4 pt-4 pb-2" style={{ maxHeight: '380px' }}>
                            {messages.map((msg, idx) => (
                                <ChatMessage
                                    key={idx}
                                    message={msg}
                                    isLatestAssistant={msg.role === 'assistant' && idx === latestAssistantIdx}
                                />
                            ))}
                            {isLoading && <TypingIndicator />}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggested Prompts */}
                        {messages.length <= 2 && !isLoading && (
                            <div className="px-4 pb-2 flex flex-col gap-2">
                                <p className="text-xs text-slate-400 font-medium">Try asking:</p>
                                <div className="flex flex-wrap gap-2">
                                    {suggestedPrompts.map((p, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { setInput(p); setTimeout(() => inputRef.current?.focus(), 50); }}
                                            className="text-xs bg-violet-50 text-violet-700 border border-violet-200 rounded-full px-3 py-1.5 hover:bg-violet-100 transition-colors font-medium"
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="px-4 pb-4 pt-2 flex-shrink-0 border-t border-slate-100 bg-white">
                            <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask Zara anything..."
                                    rows={1}
                                    className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 resize-none outline-none max-h-28 min-h-[1.5rem] leading-6"
                                    onInput={e => { e.target.style.height = 'auto'; e.target.style.height = `${e.target.scrollHeight}px`; }}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-center text-xs text-slate-400 mt-2">Powered by Learnify AI</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FAB */}
            <motion.button
                onClick={() => setIsOpen(prev => !prev)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                className="fixed bottom-5 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-xl shadow-violet-300/50 flex items-center justify-center"
                aria-label="Open Zara AI"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.svg key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }} className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </motion.svg>
                    ) : (
                        <motion.span key="z" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="text-lg font-bold">
                            Z
                        </motion.span>
                    )}
                </AnimatePresence>

                {/* Online pulse */}
                {!isOpen && (
                    <>
                        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white animate-ping" />
                        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
                    </>
                )}
            </motion.button>
        </>
    );
}
