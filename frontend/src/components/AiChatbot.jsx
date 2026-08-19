import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, MessageSquare, Loader } from 'lucide-react';

const ChatContactForm = ({ msgId, onSubmit, status }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [messageText, setMessageText] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !messageText.trim()) {
      setErr('All fields are required.');
      return;
    }
    setErr('');
    onSubmit(msgId, { name, email, message: messageText });
  };

  if (status === 'success') {
    return (
      <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
        <span className="inline-block w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-1.5 text-xs font-bold font-sans">✓</span>
        <p className="text-[10px] font-bold text-white leading-snug">Message sent successfully!</p>
        <p className="text-[9px] text-slate-300 mt-0.5">Saif will get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 p-3 bg-black/30 border border-white/10 rounded-xl space-y-2 text-left">
      <h4 className="text-[9px] uppercase font-bold text-[var(--primary-color)] tracking-wider">Direct Message Form</h4>
      
      <div>
        <input 
          type="text" 
          placeholder="Your Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={status === 'submitting'}
          className="w-full bg-black/40 border border-white/5 focus:border-white/20 focus:outline-none rounded-lg px-2.5 py-1 text-[11px] text-white placeholder:text-slate-500"
        />
      </div>
      <div>
        <input 
          type="email" 
          placeholder="Your Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'submitting'}
          className="w-full bg-black/40 border border-white/5 focus:border-white/20 focus:outline-none rounded-lg px-2.5 py-1 text-[11px] text-white placeholder:text-slate-500"
        />
      </div>
      <div>
        <textarea 
          placeholder="Write your message here..." 
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          disabled={status === 'submitting'}
          rows={2}
          className="w-full bg-black/40 border border-white/5 focus:border-white/20 focus:outline-none rounded-lg px-2.5 py-1 text-[11px] text-white placeholder:text-slate-500 resize-none"
        />
      </div>

      {err && <p className="text-[9px] text-red-400 font-bold mt-1">{err}</p>}
      {status === 'error' && <p className="text-[9px] text-red-400 font-bold mt-1">Failed to send. Try again.</p>}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-1.5 rounded-lg text-white text-[10px] font-bold transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 hover:brightness-110 disabled:opacity-50 mt-1"
        style={{ backgroundColor: 'var(--primary-color)' }}
      >
        {status === 'submitting' ? (
          <>
            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Sending...
          </>
        ) : (
          'Send Inquiry'
        )}
      </button>
    </form>
  );
};

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
      const rawText = data.response || '';
      const hasForm = rawText.includes('[SHOW_CONTACT_FORM]');
      const cleanText = rawText.replace('[SHOW_CONTACT_FORM]', '').trim();
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: cleanText,
        showForm: hasForm,
        formStatus: 'idle',
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

  const handleFormSubmit = async (msgId, formData) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === msgId) {
        return { ...msg, formStatus: 'submitting' };
      }
      return msg;
    }));

    try {
      const response = await fetch(`${backendUrl}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: 'Inquiry via AI Chatbot Form',
          message: formData.message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send contact inquiry');
      }

      setMessages(prev => prev.map(msg => {
        if (msg.id === msgId) {
          return { ...msg, formStatus: 'success' };
        }
        return msg;
      }));
    } catch (err) {
      console.error('Chat Form Submit Error:', err);
      setMessages(prev => prev.map(msg => {
        if (msg.id === msgId) {
          return { ...msg, formStatus: 'error' };
        }
        return msg;
      }));
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
            <div 
              data-lenis-prevent
              className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10"
            >
              {messages.map((msg) => {
                // Parse bold text and bullet list markers
                const formatMessageText = (text) => {
                  if (!text) return '';
                  const lines = text.split('\n');
                  return lines.map((line, idx) => {
                    let cleanLine = line;
                    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
                    if (isBullet) {
                      cleanLine = line.trim().substring(2);
                    }

                    const parts = cleanLine.split(/\*\*([^*]+)\*\*/g);
                    const renderedLine = parts.map((part, pIdx) => {
                      if (pIdx % 2 === 1) {
                        return <strong key={pIdx} className="font-extrabold text-white">{part}</strong>;
                      }
                      return part;
                    });

                    if (isBullet) {
                      return (
                        <div key={idx} className="flex items-start gap-2 my-1 ml-2 text-slate-200">
                          <span className="text-[var(--primary-color)] font-bold">•</span>
                          <span className="flex-1">{renderedLine}</span>
                        </div>
                      );
                    }

                    return (
                      <p key={idx} className="min-h-[1.2em] mb-1 text-slate-200">
                        {renderedLine}
                      </p>
                    );
                  });
                };

                return (
                  <div 
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'text-white' 
                          : 'bg-white/5 border border-white/10 rounded-tl-none'
                      }`}
                      style={{
                        backgroundColor: msg.sender === 'user' ? 'var(--primary-color)' : undefined,
                        borderTopRightRadius: msg.sender === 'user' ? '0px' : undefined
                      }}
                    >
                      {msg.sender === 'user' ? (
                        <p className="whitespace-pre-line">{msg.text}</p>
                      ) : (
                        <div className="space-y-1">{formatMessageText(msg.text)}</div>
                      )}
                      {msg.showForm && (
                        <ChatContactForm 
                          msgId={msg.id} 
                          onSubmit={handleFormSubmit} 
                          status={msg.formStatus} 
                        />
                      )}
                    </div>
                  </div>
                );
              })}
              
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
