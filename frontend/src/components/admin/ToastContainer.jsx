import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

export default function ToastContainer({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map(t => (
        <div 
          key={t.id} 
          className={`p-4 rounded-xl flex items-center gap-3 shadow-lg max-w-sm backdrop-blur-md animate-slide-in text-white ${
            t.type === 'error' ? 'bg-red-500/90 border border-red-500/20' : 
            t.type === 'info' ? 'bg-blue-500/90 border border-blue-500/20' :
            'bg-emerald-500/90 border border-emerald-500/20'
          }`}
        >
          {t.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
          <span className="text-sm font-semibold">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
