import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minus, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your AI Assistant. How can I help you today?", sender: 'bot', time: new Date().toLocaleTimeString() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = inputValue;
        const newUserMessage = {
            id: messages.length + 1,
            text: userMessage,
            sender: 'user',
            time: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

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
            const errorResponse = {
                id: messages.length + 2,
                text: "Sorry, I'm having trouble connecting to the server right now.",
                sender: 'bot',
                time: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, errorResponse]);
        }
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl w-[380px] h-[600px] flex flex-col overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-4 flex items-center justify-between shrink-0">
                                <div className="flex items-center space-x-3 text-white">
                                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                        <Bot className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg leading-none">AI Assistant</h3>
                                        <div className="flex items-center space-x-1 mt-1">
                                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                            <span className="text-xs text-blue-100 font-medium">Online</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 text-white/80">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                                <div className="flex justify-center my-4">
                                    <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs py-1 px-3 rounded-full">
                                        Today
                                    </div>
                                </div>

                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user'
                                                ? 'bg-primary-100 text-primary-600'
                                                : 'bg-primary-600 text-white'
                                                }`}>
                                                {msg.sender === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                                            </div>

                                            <div
                                                className={`p-3 rounded-2xl ${msg.sender === 'user'
                                                    ? 'bg-primary-600 text-white rounded-tr-sm'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                                                    }`}
                                            >
                                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                                <span className={`text-[10px] mt-1 block ${msg.sender === 'user' ? 'text-primary-200' : 'text-slate-400'
                                                    }`}>
                                                    {msg.time.replace(/:\d\d /, ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {messages.length === 1 && (
                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        {["Report an FIR", "Emergency Contacts", "Check Status", "Nearest Station"].map((suggestion) => (
                                            <button
                                                key={suggestion}
                                                onClick={() => setInputValue(suggestion)}
                                                className="text-xs text-left p-3 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-primary-50 dark:border-slate-700 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                                <form onSubmit={handleSendMessage} className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 placeholder:text-slate-400 text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputValue.trim()}
                                        className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/30"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleChat}
                    className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg shadow-primary-500/30 transition-all duration-300 group relative"
                >
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                    {isOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <MessageCircle className="w-6 h-6" />
                    )}

                    {/* Tooltip for button */}
                    {!isOpen && (
                        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Chat with us
                        </div>
                    )}
                </motion.button>
            </div>
        </>
    );
};

export default Chatbot;
