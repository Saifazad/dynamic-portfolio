import React, { useState, useEffect } from 'react';
import { Mail, Calendar, Trash2, ShieldAlert, User, Search, RefreshCw } from 'lucide-react';

export default function MessagesTab({ backendUrl, token, addToast }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch messages from backend api
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Authentication expired. Please verify your secret token.');
        }
        throw new Error('Could not retrieve database messages.');
      }

      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Error fetching messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMessages();
    }
  }, [token]);

  // Handle message deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message? This action is permanent.')) return;

    try {
      const res = await fetch(`${backendUrl}/api/messages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Deletion request failed.');

      addToast('Message deleted successfully', 'success');
      // Optimistic state updates
      setMessages(prev => prev.filter(msg => msg.id !== id));
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to delete message', 'error');
    }
  };

  // Filter messages based on search query
  const filteredMessages = messages.filter(msg => 
    msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (msg.subject && msg.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
    msg.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!token) {
    return (
      <div className="p-8 border border-amber-500/20 bg-amber-500/5 rounded-2xl flex flex-col gap-3 items-center text-center text-amber-200 text-sm max-w-xl mx-auto mt-8">
        <ShieldAlert className="text-amber-400" size={32} />
        <span className="font-bold">Authentication Token Required</span>
        <p className="text-slate-400">Please enter a valid API authorization token in the settings header at the top of the dashboard to view visitor messages.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Visitor Messages</h2>
          <p className="text-xs text-slate-400 mt-1">Read and manage inquiries sent through the contact form.</p>
        </div>
        <button 
          onClick={fetchMessages}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-white hover:bg-white/10 cursor-pointer transition-colors"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Reload List
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by sender, email, or content..."
          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 text-white placeholder-slate-500 transition-colors"
        />
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-16 gap-3 text-slate-400">
          <RefreshCw className="animate-spin text-indigo-400" size={24} style={{ color: 'var(--primary-color)' }} />
          <span className="text-xs font-semibold">Retrieving inbox messages...</span>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-16 text-slate-500 bg-white/2 rounded-2xl border border-white/5">
          {searchQuery ? 'No matching search results found.' : 'Your inbox is empty. No messages received yet.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMessages.map((msg) => (
            <div 
              key={msg.id} 
              className="glass p-6 rounded-2xl border border-white/5 relative group hover:border-white/10 transition-colors flex flex-col md:flex-row justify-between gap-6"
            >
              <div className="space-y-3 flex-grow">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-white/5 px-2.5 py-1 rounded-md">
                    <User size={12} style={{ color: 'var(--primary-color)' }} />
                    {msg.name}
                  </span>
                  <span className="text-slate-600 text-xs">•</span>
                  <a 
                    href={`mailto:${msg.email}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    <Mail size={12} />
                    {msg.email}
                  </a>
                  <span className="text-slate-600 text-xs">•</span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Calendar size={12} />
                    {formatDate(msg.created_at)}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-base">
                    {msg.subject || 'No Subject'}
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed mt-2 whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-start justify-end flex-shrink-0">
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors cursor-pointer"
                  title="Delete message"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
