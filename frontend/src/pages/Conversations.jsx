import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { conversationService } from '../services';

export default function Conversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const { data } = await conversationService.getAll();
      setConversations(data.conversations);
    } catch {
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-950 via-amber-950/30 to-stone-950 py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-400" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-950 via-amber-950/30 to-stone-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6 bg-slate-900/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-amber-800/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-amber-600/20 text-amber-400 border border-amber-500/30 rounded-xl flex items-center justify-center font-bold shadow-inner">
              📋
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">Conversation History</h1>
          </div>
          <Link
            to="/chat"
            className="px-4 py-2 text-sm font-semibold bg-amber-600 text-white rounded-xl shadow-md shadow-amber-500/25 hover:bg-amber-500 transition-all"
          >
            + New Chat
          </Link>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-amber-800/40 shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 bg-amber-600/20 text-amber-400 border border-amber-500/30 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm">
              💬
            </div>
            <p className="text-xl font-bold text-slate-200">No conversations yet.</p>
            <Link to="/chat" className="text-amber-400 hover:text-amber-300 font-semibold text-sm mt-2 inline-block transition-colors">
              Start your first chat →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                to={`/chat/${conv.id}`}
                className="block bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-700/70 hover:border-amber-500/60 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-100 group-hover:text-amber-400 transition-colors truncate">
                    {conv.title}
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg ml-4 shrink-0">
                    {conv.message_count} messages
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2 font-medium">
                  {formatDate(conv.updated_at)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}