import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatMessage from '../components/ChatMessage';
import TicketForm from '../components/TicketForm';
import { chatService, conversationService } from '../services';

export default function Chat() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(conversationId);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
    } else {
      setMessages([]);
      setCurrentConversationId(null);
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversation = async (id) => {
    try {
      const { data } = await conversationService.getById(id);
      setMessages(data.conversation.messages || []);
      setCurrentConversationId(id);
    } catch {
      navigate('/chat');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMessage, id: Date.now() },
    ]);

    try {
      const { data } = await chatService.sendMessage({
        message: userMessage,
        conversationId: currentConversationId,
      });

      if (!currentConversationId) {
        setCurrentConversationId(data.conversationId);
        navigate(`/chat/${data.conversationId}`, { replace: true });
      }

      setMessages((prev) => [...prev, data.message]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
          id: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
    navigate('/chat');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-950 via-teal-950/50 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6 bg-slate-900/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-teal-800/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-teal-600/20 text-teal-400 border border-teal-500/30 rounded-xl flex items-center justify-center font-bold shadow-inner">
              💬
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">AI Support Chat</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleNewChat}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800/80 border border-slate-700/60 rounded-xl hover:bg-slate-800 hover:text-white transition-all shadow-sm"
            >
              + New Chat
            </button>
            <button
              onClick={() => setShowTicketForm(true)}
              className="px-4 py-2 text-sm font-semibold bg-teal-600 text-white rounded-xl shadow-md shadow-teal-500/25 hover:bg-teal-500 transition-all"
            >
              Create Ticket
            </button>
          </div>
        </div>

        {/* Main Chat Box Container */}
        <div className="flex-1 overflow-y-auto bg-slate-900/60 backdrop-blur-xl border border-teal-800/40 rounded-3xl p-6 space-y-4 shadow-2xl">
          {messages.length === 0 && (
            <div className="text-center text-slate-400 my-auto pt-16 flex flex-col items-center">
              <div className="w-16 h-16 bg-teal-600/20 text-teal-400 border border-teal-500/30 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm">
                ✨
              </div>
              <p className="text-xl font-bold text-slate-200">How can I help you today?</p>
              <p className="text-sm text-slate-400 mt-2 max-w-sm">
                Ask about products, policies, shipping, or account issues.
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <ChatMessage key={msg.id || i} message={msg} />
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl px-5 py-3.5 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="mt-4 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            disabled={loading}
            className="flex-1 px-5 py-3.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/70 rounded-2xl text-slate-100 placeholder-slate-500 shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none disabled:opacity-50 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-7 py-3.5 bg-teal-600 text-white rounded-2xl font-semibold shadow-lg shadow-teal-500/25 hover:bg-teal-500 disabled:opacity-50 disabled:shadow-none transition-all"
          >
            Send
          </button>
        </form>

        {showTicketForm && (
          <TicketForm
            conversationId={currentConversationId}
            onClose={() => setShowTicketForm(false)}
            onSuccess={() => navigate('/tickets')}
          />
        )}
      </div>
    </div>
  );
}