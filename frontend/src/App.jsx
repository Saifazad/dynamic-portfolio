import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from './context/ThemeContext';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Timeline from './components/Timeline';
import Skills from './components/Skills';
import Contact from './components/Contact';
import ScrollBackground from './components/ScrollBackground';
import CustomCursor from './components/CustomCursor';
import AdminDashboard from './components/AdminDashboard';
import AiChatbot from './components/AiChatbot';

import { Layout, Shield, RefreshCw } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

export default function App() {
  const { setTheme, setIsLoading, isLoading, setError, error, theme } = useTheme();
  const { scrollYProgress } = useScroll();

  
  // View mode switcher: 'portfolio' or 'admin'
  const [viewMode, setViewMode] = useState('portfolio');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });

  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_authenticated', 'true');
        if (data.token) {
          localStorage.setItem('api_auth_token', data.token);
        }
        setLoginPassword('');
      } else {
        setLoginError(data.error || 'Incorrect passcode.');
      }
    } catch (err) {
      setLoginError('Could not reach authentication server.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setViewMode('portfolio');
  };



  // Aggregated data state
  const [portfolioData, setPortfolioData] = useState({
    site_config: null,
    projects: [],
    education: [],
    experience: [],
    skills: []
  });

  // Fetch portfolio data from Node.js Express server
  const fetchPortfolioData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/portfolio-data`);
      if (!res.ok) throw new Error(`Server returned status: ${res.status}`);
      const payload = await res.json();
      
      setPortfolioData(payload);
      
      // Inject site_config to the Theme Context
      if (payload.site_config) {
        setTheme(payload.site_config);
      }
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
      setError('Could not connect to the backend server. Please make sure the Express backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  // Initialize Lenis Smooth Scrolling (Only active in portfolio mode for cleaner scroll feels)
  useEffect(() => {
    if (viewMode !== 'portfolio') return;

    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => 1 - Math.pow(1 - t, 5), // Cinematic Quintic Ease-out
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.8,
    });


    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [viewMode]);

  // Method passed to dashboard for real-time optimistic/actual updates
  const handleDataUpdated = (table, updatedData) => {
    setPortfolioData(prev => ({
      ...prev,
      [table]: updatedData
    }));
  };

  const handleNavigateToProjects = () => {
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading && !portfolioData.site_config) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center gap-4 text-white">
        <RefreshCw className="animate-spin text-indigo-400" size={32} style={{ color: 'var(--primary-color)' }} />
        <span className="text-sm font-semibold tracking-wider uppercase text-slate-400">Loading Portfolio Experience...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500/30">
      
      {/* Dynamic Navigation Header */}
      <nav className="glass-nav sticky top-0 left-0 w-full z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => setViewMode('portfolio')}
            className="text-lg font-black tracking-tight text-white cursor-pointer select-none"
          >
            DYN<span style={{ color: 'var(--primary-color)' }}>FOLIO</span>
          </button>

          {/* Smooth Scroll Navigation Links */}
          {viewMode === 'portfolio' && (
            <div className="hidden md:flex items-center gap-7">
              <button 
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} 
                className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Projects
              </button>
              <button 
                onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })} 
                className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Journey
              </button>
              <button 
                onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })} 
                className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Skills
              </button>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} 
                className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Contact
              </button>
            </div>
          )}

          <div className="flex items-center gap-4">
            {/* Color Accent Shifter */}
            {viewMode === 'portfolio' && (
              <div className="hidden sm:flex items-center gap-2 mr-2 bg-white/5 border border-white/5 rounded-full px-3 py-1.5">
                {[
                  { name: 'indigo', hex: '#6366f1' },
                  { name: 'emerald', hex: '#10b981' },
                  { name: 'cyan', hex: '#06b6d4' },
                  { name: 'rose', hex: '#f43f5e' }
                ].map((color) => (
                  <button
                    key={color.name}
                    onClick={() => document.documentElement.style.setProperty('--primary-color', color.hex)}
                    className="w-3.5 h-3.5 rounded-full transition-transform hover:scale-125 cursor-pointer relative"
                    style={{ 
                      backgroundColor: color.hex,
                      boxShadow: `0 0 8px ${color.hex}`
                    }}
                    title={`Theme: ${color.name}`}
                  />
                ))}
              </div>
            )}

            {viewMode === 'admin' && isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs font-bold tracking-wider uppercase px-4 py-2.5 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all text-red-300 bg-red-500/10 cursor-pointer hover:bg-red-500/20"
              >
                Logout
              </button>
            )}

            <button
              onClick={() => setViewMode(viewMode === 'portfolio' ? 'admin' : 'portfolio')}
              className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition-all text-white bg-white/5 cursor-pointer hover:bg-white/10"
            >


              {viewMode === 'portfolio' ? (
                <>
                  <Shield size={14} style={{ color: 'var(--primary-color)' }} />
                  Admin Dashboard
                </>
              ) : (
                <>
                  <Layout size={14} style={{ color: 'var(--primary-color)' }} />
                  View Portfolio
                </>
              )}
            </button>
          </div>
        </div>

        {/* Glowing Scroll Progress Indicator Bar */}
        {viewMode === 'portfolio' && (
          <motion.div 
            className="absolute bottom-0 left-0 h-[2px] shadow-lg"
            style={{ 
              scaleX: scrollYProgress,
              width: '100%',
              transformOrigin: '0%',
              backgroundColor: 'var(--primary-color)',
              boxShadow: `0 0 8px var(--primary-color)`
            }}
          />
        )}
      </nav>


      {/* Main Container */}
      <main className="flex-grow">
        {error && (
          <div className="max-w-3xl mx-auto mt-12 mx-6 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex flex-col gap-3 items-center text-center">
            <span className="font-bold flex items-center gap-2 text-red-400">
              ⚠️ Backend Connection Warning
            </span>
            <p>{error}</p>
            <button 
              onClick={fetchPortfolioData} 
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {viewMode === 'portfolio' ? (
          <>
            <ScrollBackground />
            <CustomCursor />
            <Hero onNavigateToProjects={handleNavigateToProjects} />

            <div id="projects">
              <Projects projects={portfolioData.projects} />
            </div>
            <div id="timeline">
              <Timeline education={portfolioData.education} experience={portfolioData.experience} />
            </div>
            <div id="skills">
              <Skills skills={portfolioData.skills} />
            </div>
            <div id="contact">
              <Contact backendUrl={BACKEND_URL} />
            </div>
          </>
        ) : (
          isAuthenticated ? (
            <AdminDashboard 
              data={portfolioData} 
              onDataUpdated={handleDataUpdated} 
              backendUrl={BACKEND_URL} 
            />
          ) : (
            /* Glassmorphic Login Overlay Form */
            <div className="min-h-[75vh] flex items-center justify-center px-6">
              <ScrollBackground />
              <CustomCursor />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="glass max-w-md w-full p-8 rounded-3xl border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.85)] text-center relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-6" style={{ color: 'var(--primary-color)' }}>
                  <Shield size={24} />
                </div>
                
                <h2 className="text-2xl font-black text-white mb-2">Admin Authentication</h2>
                <p className="text-xs text-slate-400 mb-8 max-w-xs mx-auto">
                  Please enter your security passcode to access database customizers.
                </p>

                {loginError && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center justify-center gap-2">
                    <span className="font-bold">Error:</span> {loginError}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Passcode..."
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-indigo-500 rounded-xl px-5 py-3.5 text-xs text-white focus:outline-none transition-all placeholder:text-slate-500 text-center font-bold tracking-widest"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loginSubmitting}
                    className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ backgroundColor: 'var(--primary-color)' }}
                  >
                    {loginSubmitting ? 'Verifying...' : 'Access Dashboard'}
                  </button>
                </form>

                <button
                  onClick={() => setViewMode('portfolio')}
                  className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer border-none bg-transparent"
                >
                  Return to Portfolio
                </button>
              </motion.div>
            </div>
          )
        )}

        {viewMode === 'portfolio' && <AiChatbot backendUrl={BACKEND_URL} />}
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-slate-950/60 text-center">
        <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase">
          &copy; {new Date().getFullYear()} Saif. Built with React, Express & Supabase.
        </p>
      </footer>
    </div>
  );
}
