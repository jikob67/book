
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Smartphone } from 'lucide-react';
import { sendMessageToAI } from '../services/geminiService';
import { useTranslation } from '../context/LanguageContext';

interface Message {
    id: number;
    text: string;
    isUser: boolean;
}

const AISupport: React.FC = () => {
    const { t, isRtl } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]); // Start with empty array
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { id: Date.now(), text: userMsg, isUser: true }]);
        setIsLoading(true);

        try {
            const aiResponse = await sendMessageToAI(userMsg);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: aiResponse, isUser: false }]);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "Unable to process your request right now.", isUser: false }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-20 right-4 md:bottom-8 md:right-8 bg-accent hover:bg-accent-hover text-black p-4 rounded-full shadow-xl transition-all z-50 ${isOpen ? 'hidden' : 'block'}`}
            >
                <Bot className="w-6 h-6" />
            </button>

            {isOpen && (
                <div className="fixed bottom-0 right-0 md:bottom-8 md:right-8 w-full md:w-96 h-[80vh] md:h-[600px] bg-white shadow-2xl rounded-t-2xl md:rounded-2xl flex flex-col z-50 border border-gray-100 overflow-hidden">
                    <div className="bg-black p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5 text-accent" />
                            <span className="font-black text-xs uppercase tracking-widest">Support Core</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.length === 0 && (
                             <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                                <Bot className="w-12 h-12 text-black" />
                                <p className="font-black uppercase tracking-widest text-[10px]">{isRtl ? 'كيف يمكنني مساعدتك؟' : 'How can I help you?'}</p>
                            </div>
                        )}
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium ${msg.isUser ? 'bg-black text-white rounded-br-none' : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 text-xs text-gray-400 flex items-center gap-1">
                                    <div className="w-1 h-1 bg-accent rounded-full animate-bounce"></div>
                                    <div className="w-1 h-1 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-1 h-1 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message..."
                            className="flex-1 bg-gray-50 border-0 rounded-full px-4 py-3 text-xs focus:ring-2 focus:ring-accent focus:outline-none font-bold"
                        />
                        <button 
                            onClick={handleSend}
                            disabled={isLoading}
                            className="bg-accent text-black p-3 rounded-full hover:bg-accent-hover disabled:opacity-50 transition-all"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AISupport;
