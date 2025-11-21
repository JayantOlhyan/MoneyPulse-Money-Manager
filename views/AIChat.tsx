
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Bot, User, RefreshCw } from 'lucide-react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Account, Transaction, Category } from '../types';

interface AIChatProps {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const AIChat: React.FC<AIChatProps> = ({ accounts, transactions, categories }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm your personal financial assistant. I've analyzed your transactions and accounts. Ask me anything about your spending, budget, or savings!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat Session
  useEffect(() => {
    const initChat = async () => {
      try {
        // Prepare context data
        const contextData = {
          accounts: accounts.map(a => ({ name: a.name, balance: a.balance, currency: a.currency, type: a.type })),
          transactions: transactions.slice(0, 50).map(t => ({ // Limit context for efficiency
            date: t.date,
            amount: t.amount,
            type: t.type,
            category: categories.find(c => c.id === t.categoryId)?.name || 'Unknown',
            account: accounts.find(a => a.id === t.accountId)?.name || 'Unknown',
            note: t.note
          })),
          currentDate: new Date().toISOString().split('T')[0]
        };

        const systemInstruction = `You are a friendly and expert financial advisor for the 'Aptos Money Manager' app.
        You have access to the user's recent financial data in JSON format below.
        
        DATA CONTEXT:
        ${JSON.stringify(contextData)}

        YOUR ROLE:
        1. Analyze the user's spending habits and identify trends.
        2. Provide specific numbers when asked (e.g., "You spent $50 on food").
        3. Give brief, actionable advice on budgeting and saving.
        4. Be encouraging and professional.
        5. If asked about 'SmoothSend' or 'Aptos', explain that it is a gasless transfer feature in this app.

        Keep responses concise (under 100 words) and formatted nicely. Use Markdown for bolding key figures.`;

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatSessionRef.current = ai.chats.create({
          model: 'gemini-3-pro-preview',
          config: {
            systemInstruction: systemInstruction,
          },
        });
      } catch (error) {
        console.error("Failed to initialize AI chat:", error);
      }
    };

    initChat();
  }, [accounts, transactions, categories]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessageStream({ message: input });
      
      let fullResponse = "";
      const modelMsgId = (Date.now() + 1).toString();
      
      // Add placeholder for stream
      setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '' }]);

      for await (const chunk of result) {
        const text = (chunk as GenerateContentResponse).text;
        if (text) {
            fullResponse += text;
            setMessages(prev => prev.map(msg => 
                msg.id === modelMsgId ? { ...msg, text: fullResponse } : msg
            ));
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "I'm having trouble connecting to the network right now. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white pb-24 md:pb-0">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Sparkles size={20} className="text-white" />
        </div>
        <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Advisor</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                Powered by Gemini <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${
                            msg.role === 'user' ? 'bg-[#FF5252]' : 'bg-white dark:bg-[#2C2C2C] border border-gray-200 dark:border-gray-700'
                        }`}>
                            {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-blue-600 dark:text-blue-400" />}
                        </div>

                        {/* Bubble */}
                        <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                            msg.role === 'user' 
                                ? 'bg-[#FF5252] text-white rounded-tr-none' 
                                : 'bg-white dark:bg-[#2C2C2C] text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-800'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                </div>
            ))}
            
            {isLoading && (
                <div className="flex justify-start w-full">
                    <div className="flex max-w-[85%] gap-3">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-[#2C2C2C] border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm">
                            <RefreshCw size={16} className="animate-spin text-blue-500" />
                        </div>
                        <div className="bg-white dark:bg-[#2C2C2C] px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-800 flex items-center gap-1 shadow-sm">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white dark:bg-[#1A1A1A] border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto relative flex items-end gap-2 bg-gray-100 dark:bg-[#2C2C2C] rounded-xl p-2 border border-transparent focus-within:border-[#FF5252] focus-within:bg-white dark:focus-within:bg-[#252525] transition-all">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask for advice or analysis..."
                className="flex-1 bg-transparent text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-500 resize-none max-h-32 p-2 focus:outline-none scrollbar-hide"
                rows={1}
            />
            <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 rounded-lg bg-[#FF5252] text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-0.5 shadow-sm"
            >
                <Send size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};
