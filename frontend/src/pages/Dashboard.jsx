import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  const cards = [
    {
      title: 'AI Chat',
      description: 'Ask questions and get instant AI-powered support responses.',
      to: '/chat',
      icon: '💬',
    },
    {
      title: 'Conversation History',
      description: 'View your previous AI conversations and responses.',
      to: '/conversations',
      icon: '📋',
    },
    {
      title: 'Support Tickets',
      description: 'Create and track support tickets for unresolved issues.',
      to: '/tickets',
      icon: '🎫',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-16 px-8 sm:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Welcome, {user?.name || 'User'}!
          </h1>
          <p className="text-lg text-slate-400 mt-3">
            How can we help you today? Select an option below to get started.
          </p>
        </div>

        <div className="flex flex-col space-y-8">
          {cards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="bg-slate-800/80 border border-slate-700/70 p-10 rounded-3xl shadow-xl hover:bg-slate-800 hover:border-indigo-500/60 hover:shadow-indigo-500/10 transition-all group flex items-center space-x-8"
            >
              <div className="p-6 bg-slate-700/50 rounded-2xl text-5xl group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {card.title}
                </h2>
                <p className="text-lg text-slate-400 mt-2">{card.description}</p>
              </div>
              <div className="text-slate-500 group-hover:text-indigo-400 transition-colors text-3xl font-bold pr-6">
                →
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}