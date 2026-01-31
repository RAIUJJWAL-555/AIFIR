import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minus, Bot, User, Sparkles, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Jai Hind! I help you file complaints and answer queries. How can I assist you?", sender: 'bot', time: new Date().toLocaleTimeString() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isAiMode, setIsAiMode] = useState(true); // Default to AI mode
    const [language, setLanguage] = useState('en'); // 'en' or 'hi'
    const messagesEndRef = useRef(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleFaqEvent = (e) => {
            const question = e.detail;
            sendMessageLogic(question);
        };
        document.addEventListener('send-faq', handleFaqEvent);
        return () => document.removeEventListener('send-faq', handleFaqEvent);
    }, [messages, isAiMode]);

    const sendMessageLogic = async (text) => {
        if (!text.trim()) return;

        const newUserMessage = {
            id: messages.length + 1,
            text: text,
            sender: 'user',
            time: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');

        try {
            const endpoint = isAiMode ? "/api/chat/ai" : "/api/chat";
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            const botResponse = {
                id: messages.length + 2,
                text: data.reply || "Sorry, I couldn't process that.",
                sender: 'bot',
                time: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, botResponse]);

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                id: messages.length + 2,
                text: "Network connection issue. Please try again.",
                sender: 'bot',
                time: new Date().toLocaleTimeString()
            }]);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        sendMessageLogic(inputValue);
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4 font-sans">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="bg-navy-900/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl w-[380px] h-[600px] flex flex-col overflow-hidden ring-1 ring-white/5"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-navy-950 to-navy-900 p-4 flex items-center justify-between shrink-0 border-b border-white/5">
                                <div className="flex items-center space-x-3 text-white">
                                    <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-2 rounded-xl shadow-lg shadow-primary-900/50">
                                        <Bot className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight tracking-tight">
                                            {isAiMode ? "Police AI Assistant" : "Help Center"}
                                        </h3>
                                        <div className="flex items-center space-x-1.5 mt-0.5">
                                            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
                                            <span className="text-[10px] text-accent font-medium tracking-wide uppercase">Online</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1 text-white/80">
                                    <button
                                        onClick={() => setIsOpne(false)}
                                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Mode Switcher with Glassmorphism */}
                            <div className="px-4 pt-4 pb-2 bg-navy-900/50">
                                <div className="bg-navy-950/80 p-1 rounded-xl flex border border-white/5">
                                    <button
                                        onClick={() => setIsAiMode(true)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${isAiMode
                                                ? 'bg-primary-600 text-white shadow-lg'
                                                : 'text-navy-300 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <Sparkles className="w-3 h-3" />
                                        Smart AI
                                    </button>
                                    <button
                                        onClick={() => setIsAiMode(false)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${!isAiMode
                                                ? 'bg-navy-700 text-white shadow-lg'
                                                : 'text-navy-300 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <MessageCircle className="w-3 h-3" />
                                        FAQ Mode
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar bg-navy-900">
                                <div className="flex justify-center mb-2">
                                    <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-medium text-navy-300 border border-white/5">
                                        {new Date().toLocaleDateString()}
                                    </span>
                                </div>

                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2.5`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${msg.sender === 'user'
                                                ? 'bg-navy-700 border border-navy-600 text-white'
                                                : 'bg-gradient-to-br from-primary-600 to-primary-700 text-white border border-primary-500'
                                                }`}>
                                                {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                                            </div>

                                            <div
                                                className={`p-3.5 shadow-sm relative ${msg.sender === 'user'
                                                    ? 'bg-white text-navy-900 rounded-2xl rounded-tr-none'
                                                    : 'bg-navy-800 text-white border border-white/5 rounded-2xl rounded-tl-none'
                                                    }`}
                                            >
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                                <span className={`text-[10px] mt-1.5 block font-medium ${msg.sender === 'user' ? 'text-navy-400' : 'text-navy-400'
                                                    }`}>
                                                    {msg.time.replace(/:\d\d /, ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* FAQ Options (Only in FAQ Mode) */}
                                {!isAiMode && (
                                    <div className="grid grid-cols-1 gap-2 mt-4 px-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-navy-300 font-medium">Suggested Questions</span>
                                            <button
                                                onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
                                                className="flex items-center gap-1.5 px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-xs text-accent transition-colors"
                                            >
                                                <Languages className="w-3 h-3" />
                                                {language === 'en' ? 'हिन्दी' : 'English'}
                                            </button>
                                        </div>

                                        {(language === 'en' ? [
                                            "How to file an FIR?",
                                            "How to check FIR status?",
                                            "What documents are required for FIR?",
                                            "How to find Officer details?"
                                        ] : [
                                            "FIR kaise file karein?",
                                            "FIR status kaise check karein?",
                                            "FIR ke liye documents?",
                                            "Investigating Officer kaise dhundhe?"
                                        ]).map((question, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setInputValue(question);
                                                    document.dispatchEvent(new CustomEvent('send-faq', { detail: question }));
                                                }}
                                                className="text-sm text-left px-4 py-3 rounded-xl bg-navy-800/50 border border-white/5 text-navy-100 hover:bg-navy-700/50 hover:border-primary-500/30 hover:shadow-lg transition-all duration-200"
                                            >
                                                {question}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area (Only in AI Mode) */}
                            {isAiMode && (
                                <div className="p-4 bg-navy-950 border-t border-white/5">
                                    <form onSubmit={handleSendMessage} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="Type your message here..."
                                            className="flex-1 bg-navy-900 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary-500 border border-white/5 placeholder:text-navy-500 text-sm shadow-inner"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!inputValue.trim()}
                                            className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-primary-900/20 active:scale-95 flex items-center justify-center"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleChat}
                    className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white p-4.5 rounded-full shadow-2xl shadow-primary-900/40 transition-all duration-300 group relative border border-white/10"
                >
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-[3px] border-navy-900"></span>
                    {isOpen ? (
                        <X className="w-7 h-7" />
                    ) : (
                        <Bot className="w-7 h-7" />
                    )}
                </motion.button>
            </div>
        </>
    );
};

export default Chatbot;
