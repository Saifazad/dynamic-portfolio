import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, MessageSquare, Loader } from 'lucide-react';

export default function AiChatbot({ backendUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hi! I'm Saif's AI Assistant. Ask me anything about his skills, projects, work experience, or education! 🚀",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setUnread(false);
    }
  }, [isOpen]);

  // Suggestion chips
  const suggestions = [
    "What are your core skills?",
    "Show me your projects",
    "Where did you study?",
    "How can I contact you?"
  ];

  const handleSend = async (messageText) => {
    const textToSend = messageText || input.trim();
    if (!textToSend) return;

    if (!messageText) {
      setInput('');
    }

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Format history for the backend
      const history = messages.map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));

      const response = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          history: history
        })
      });

      if (!response.ok) {
        throw new Error('Chat API returned an error');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Chat Assistant Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: "I'm having trouble connecting to my brain right now. Please make sure the backend server is running and try again, or fill out the contact form below to reach Saif directly!",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass w-88 md:w-96 h-[500px] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden flex flex-col mb-4"
          >
            {/* Header */}
            <div 
              className="p-4 flex items-center justify-between border-b border-white/5 relative"
              style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, rgba(15,23,42,0.8) 100%)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white relative">
                  <Bot size={20} className="animate-pulse" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-slate-900"></span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    Saif's Assistant
                    <Sparkles size={12} className="text-yellow-400 fill-yellow-400" />
                  </h3>
                  <p className="text-[10px] text-white/70">Online • Live DB Context</p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer border-none"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages Viewport */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'text-white' 
                        : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                    }`}
                    style={{
                      backgroundColor: msg.sender === 'user' ? 'var(--primary-color)' : undefined,
                      borderTopRightRadius: msg.sender === 'user' ? '0px' : undefined
                    }}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 text-slate-400 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && !isTyping && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(sug)}
                    className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 rounded-full px-3 py-1.5 transition-all cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 bg-slate-950/40 border-t border-white/5 flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isTyping}
                className="flex-1 bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 disabled:opacity-50"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setUnread(false);
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] cursor-pointer relative border-none"
        style={{ 
          background: 'linear-gradient(135deg, var(--primary-color) 0%, rgba(15,23,42,0.9) 100%)',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
        }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        
        {/* Sparkle badge */}
        {!isOpen && (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-500 text-[10px] font-black rounded-full flex items-center justify-center border border-slate-900 animate-bounce">
            AI
          </div>
        )}
      </motion.button>
    </div>
  );
}
