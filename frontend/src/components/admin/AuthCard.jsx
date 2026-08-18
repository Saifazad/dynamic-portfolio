import React from 'react';
import { LogIn } from 'lucide-react';

export default function AuthCard({ authToken, setAuthToken, isAuthValid, onSaveAuthToken }) {
  return (
    <form 
      onSubmit={onSaveAuthToken} 
      className="flex items-center gap-3 bg-white/5 border border-white/5 p-2 rounded-xl w-full md:w-auto"
    >
      <LogIn size={18} className={isAuthValid ? 'text-slate-400' : 'text-red-400'} />
      <input
        type="password"
        placeholder="Enter API Auth Token"
        value={authToken}
        onChange={(e) => setAuthToken(e.target.value)}
        className="bg-transparent text-sm text-white focus:outline-none w-full md:w-48 placeholder-slate-500"
      />
      <button 
        type="submit" 
        className="text-xs px-3 py-1.5 rounded-lg bg-indigo-500 text-white font-medium hover:brightness-110 cursor-pointer"
        style={{ backgroundColor: 'var(--primary-color)' }}
      >
        Apply
      </button>
    </form>
  );
}
