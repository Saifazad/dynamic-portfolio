import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from './MotionProvider';
import { Mail, Send, CheckCircle, AlertCircle, User, FileText, MessageSquare } from 'lucide-react';
import TiltCard from './TiltCard';
import TextReveal from './TextReveal';
import { BACKEND_URL } from '../config';

export default function Contact({ backendUrl = BACKEND_URL }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ submitting: false, success: false, error: 'Please fill in all required fields.' });
      return;
    }

    setStatus({ submitting: true, success: false, error: null });

    try {
      const res = await fetch(`${backendUrl}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error('Failed to submit message. Please try again.');
      }

      setStatus({ submitting: false, success: true, error: null });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Clear success notification after 5 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 5000);

    } catch (err) {
      console.error(err);
      setStatus({ submitting: false, success: false, error: err.message || 'Something went wrong.' });
    }
  };

  return (
    <section id="contact" className="py-24 px-6 max-w-7xl mx-auto">
      <FadeIn className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
          <TextReveal text="Get In Touch" />
        </h2>
        <div className="w-16 h-1 bg-indigo-500 mx-auto rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></div>
        <p className="text-slate-400 mt-4 max-w-lg mx-auto">
          Have an interesting project or vacancy? Drop me a message and I'll get back to you as soon as possible!
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Contact Information Cards */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <FadeIn delay={0.1}>
            <div className="glass p-6 rounded-2xl flex items-start gap-4 border border-white/5 relative group hover:border-white/10 transition-all duration-300">
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 flex-shrink-0" style={{ color: 'var(--primary-color)' }}>
                <Mail size={22} />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Email Me</h4>
                <p className="text-slate-400 text-sm break-all select-all">saifazad000@gmail.com</p>
                <span className="text-slate-500 text-[10px] uppercase font-bold mt-1.5 inline-block">Response under 24 hours</span>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="glass p-6 rounded-2xl flex items-start gap-4 border border-white/5 relative group hover:border-white/10 transition-all duration-300">
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 flex-shrink-0" style={{ color: 'var(--primary-color)' }}>
                <MessageSquare size={22} />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Social Channels</h4>
                <div className="flex gap-3 mt-1.5">
                  <a href="https://github.com/Saifazad" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white text-sm font-semibold transition-colors">GitHub</a>
                  <span className="text-slate-700">•</span>
                  <a href="https://linkedin.com/in/saifazad" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white text-sm font-semibold transition-colors">LinkedIn</a>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="glass p-6 rounded-2xl flex items-start gap-4 border border-white/5 relative group hover:border-white/10 transition-all duration-300">
              <div className="p-3 bg-green-500/10 rounded-xl text-green-400 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M12.031 2a9.967 9.967 0 0 0-9.953 9.953c-.007 1.932.502 3.81 1.48 5.48L2 22l4.756-1.248a9.924 9.924 0 0 0 5.275 1.482h.005a9.965 9.965 0 0 0 9.964-9.953A9.972 9.972 0 0 0 12.031 2zm0 18.257c-1.636 0-3.238-.435-4.637-1.264l-.333-.198-3.45.905.922-3.364-.216-.345a8.218 8.218 0 0 1-1.258-4.321A8.257 8.257 0 0 1 12.03 3.738a8.255 8.255 0 0 1 8.252 8.255 8.258 8.258 0 0 1-8.251 8.264zm4.536-6.19c-.248-.124-1.467-.724-1.693-.807-.226-.08-.393-.124-.558.124-.166.248-.641.806-.784.97-.144.166-.29.187-.538.063a6.786 6.786 0 0 1-1.996-1.23c-.777-.694-1.303-1.55-1.455-1.811-.153-.26-.017-.402.107-.527.113-.112.249-.29.373-.435.124-.144.165-.248-.248-.413.083-.166.04-.31-.02-.435-.062-.124-.558-1.343-.765-1.84-.2-.48-.4-.413-.558-.423-.144-.007-.31-.007-.475-.007a.916.916 0 0 0-.662.31c-.227.248-.868.847-.868 2.066 0 1.218.889 2.396 1.012 2.56.124.167 1.752 2.675 4.244 3.75 1.705.733 2.395.812 3.242.687.525-.078 1.467-.6 1.674-1.18.206-.578.206-1.074.144-1.18-.06-.104-.226-.166-.474-.29z"/>
                </svg>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">WhatsApp Me</h4>
                <a href="https://wa.me/918084215228" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white text-sm font-semibold transition-colors select-all">
                  +91 8084215228
                </a>
                <span className="text-slate-500 text-[10px] uppercase font-bold mt-1.5 inline-block">Direct Chat Available</span>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Right Side: Interactive 3D Form Card */}
        <div className="lg:col-span-8">
          <FadeIn delay={0.3}>
            <TiltCard 
              maxRotation={4}
              className="glass p-8 md:p-10 rounded-3xl border border-white/5 preserve-3d"
            >
              <form onSubmit={handleSubmit} className="space-y-6 translate-z-20 preserve-3d" style={{ transform: 'translateZ(20px)' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <User size={12} />
                      Your Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 text-white placeholder-slate-500 transition-colors w-full focus:bg-white/8"
                      style={{ focusBorderColor: 'var(--primary-color)' }}
                    />
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Mail size={12} />
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 text-white placeholder-slate-500 transition-colors w-full focus:bg-white/8"
                    />
                  </div>

                </div>

                {/* Subject Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText size={12} />
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry / Collaboration Deal"
                    className="px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 text-white placeholder-slate-500 transition-colors w-full focus:bg-white/8"
                  />
                </div>

                {/* Message Textarea */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <MessageSquare size={12} />
                    Your Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your requirements..."
                    required
                    rows={5}
                    className="px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 text-white placeholder-slate-500 transition-colors w-full focus:bg-white/8 resize-none"
                  />
                </div>

                {/* Status Messages */}
                {status.success && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle size={16} />
                    Thank you! Your message has been sent successfully.
                  </div>
                )}
                {status.error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle size={16} />
                    {status.error}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status.submitting}
                  className="w-full py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer text-white shadow-lg disabled:opacity-50"
                  style={{ 
                    backgroundColor: 'var(--primary-color)',
                    boxShadow: `0 8px 24px -8px var(--primary-color)`
                  }}
                >
                  {status.submitting ? (
                    <>Sending Message...</>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </TiltCard>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}
