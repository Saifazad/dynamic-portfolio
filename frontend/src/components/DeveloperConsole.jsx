import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, CornerDownLeft } from 'lucide-react';

export default function DeveloperConsole({ projects = [], skills = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState([
    { text: 'System terminal initialized.', type: 'sys' },
    { text: 'Type "help" to view list of interactive commands.', type: 'sys' }
  ]);

  const logEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of logs on update
  useEffect(() => {
    if (isOpen) {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [logs, isOpen]);

  const handleCommand = (e) => {
    e.preventDefault();
    const commandText = inputVal.trim().toLowerCase();
    if (!commandText) return;

    // Add command to log list
    const newLogs = [...logs, { text: `$ ${inputVal}`, type: 'input' }];

    switch (commandText) {
      case 'help':
        newLogs.push(
          { text: 'Available commands:', type: 'sys' },
          { text: '  about    - Print professional background introduction.', type: 'info' },
          { text: '  projects - Query recent development projects.', type: 'info' },
          { text: '  skills   - Draw dynamic skills proficiency metrics.', type: 'info' },
          { text: '  contact  - Show inquiries connection email.', type: 'info' },
          { text: '  clear    - Clear terminal shell logs.', type: 'info' },
          { text: '  exit     - Exit command terminal panel.', type: 'info' }
        );
        break;

      case 'about':
        newLogs.push(
          { text: 'Profile Summary:', type: 'sys' },
          { text: 'Full-Stack Software Developer specializing in building high-fidelity web experiences.', type: 'info' },
          { text: 'Stack: JavaScript, React, Node.js, Express, Postgres.', type: 'info' },
          { text: 'Design Philosophy: Rich interactive micro-animations & premium details.', type: 'info' }
        );
        break;

      case 'projects':
        if (projects.length === 0) {
          newLogs.push({ text: 'No projects loaded in database.', type: 'err' });
        } else {
          newLogs.push({ text: `Fetched ${projects.length} live database records:`, type: 'sys' });
          projects.forEach((p, idx) => {
            const stack = p.tech_stack ? p.tech_stack.split(',').join(', ') : 'Web Technologies';
            newLogs.push(
              { text: `${idx + 1}. ${p.title} (${stack})`, type: 'info' },
              { text: `   Link: ${p.live_url || 'Private Repo'}`, type: 'dim' }
            );
          });
        }
        break;

      case 'skills':
        if (skills.length === 0) {
          newLogs.push({ text: 'No skills loaded in database.', type: 'err' });
        } else {
          newLogs.push({ text: 'Dynamic Skills Matrix:', type: 'sys' });
          skills.forEach((s) => {
            const pct = parseInt(s.proficiency) || 80;
            const barLength = Math.round(pct / 10);
            const activeBar = '█'.repeat(barLength);
            const emptyBar = '░'.repeat(10 - barLength);
            newLogs.push({ text: `[${activeBar}${emptyBar}] ${pct}% - ${s.name}`, type: 'info' });
          });
        }
        break;

      case 'contact':
        newLogs.push(
          { text: 'Inquiries connection parameters:', type: 'sys' },
          { text: 'Email: saifazad000@gmail.com', type: 'info' },
          { text: 'You can also drop a message using the Contact Form section below.', type: 'info' }
        );
        break;

      case 'clear':
        setLogs([]);
        setInputVal('');
        return;

      case 'exit':
        setIsOpen(false);
        setInputVal('');
        return;

      default:
        newLogs.push({ text: `bash: command not found: ${commandText}. Type "help" for controls.`, type: 'err' });
        break;
    }

    setLogs(newLogs);
    setInputVal('');
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-slate-900 border border-white/10 hover:border-white/20 text-white shadow-xl hover:scale-105 transition-all z-40 active:scale-95 cursor-pointer flex items-center justify-center"
        title="Toggle Developer Terminal"
      >
        <Terminal size={20} className={isOpen ? "text-indigo-400" : "text-white"} style={{ color: isOpen ? 'var(--primary-color)' : 'white' }} />
      </button>

      {/* Glassmorphic Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className="fixed bottom-24 right-6 w-[92vw] sm:w-[480px] h-[360px] z-50 rounded-2xl flex flex-col border border-white/10 bg-slate-950/85 backdrop-blur-2xl shadow-[0_30px_70px_rgba(0,0,0,0.85)] overflow-hidden font-mono text-xs select-none"
          >
            {/* Terminal Window Header Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/60 border-b border-white/5 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <div className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                root@saif-dev: ~
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0"
              >
                <X size={14} />
              </button>
            </div>

            {/* Terminal Shell Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 select-text selection:bg-indigo-500/30">
              {logs.map((log, idx) => {
                let colorClass = 'text-slate-300';
                if (log.type === 'sys') colorClass = 'text-emerald-400 font-semibold';
                else if (log.type === 'input') colorClass = 'text-indigo-300 font-bold';
                else if (log.type === 'err') colorClass = 'text-red-400 font-semibold';
                else if (log.type === 'dim') colorClass = 'text-slate-500 text-[10px]';

                return (
                  <div key={idx} className={`${colorClass} leading-relaxed break-words`}>
                    {log.text}
                  </div>
                );
              })}
              <div ref={logEndRef} />
            </div>

            {/* Terminal Input Prompt */}
            <form
              onSubmit={handleCommand}
              className="flex items-center gap-2 px-4 py-3 bg-slate-900/40 border-t border-white/5"
            >
              <span className="text-emerald-400 font-bold">$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="type command..."
                className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none border-none p-0 focus:ring-0 leading-none select-text"
              />
              <button
                type="submit"
                className="text-slate-500 hover:text-indigo-400 transition-colors bg-transparent border-none cursor-pointer p-0"
              >
                <CornerDownLeft size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
