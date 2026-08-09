import { useState, useEffect } from 'react';
import TicketForm from '../components/TicketForm';
import { ticketService } from '../services';

const statusColors = {
  open: 'bg-rose-950/60 text-rose-300 border border-rose-700/50',
  in_progress: 'bg-amber-950/60 text-amber-300 border border-amber-700/50',
  resolved: 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/50',
  closed: 'bg-slate-800 text-slate-300 border border-slate-700',
};

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const { data } = await ticketService.getAll();
      setTickets(data.tickets);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-950 via-rose-950/30 to-orange-950/20 py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-400" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-950 via-rose-950/30 to-orange-950/20 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6 bg-slate-900/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-rose-900/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-xl flex items-center justify-center font-bold shadow-inner">
              🎫
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">Support Tickets</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-sm font-semibold bg-rose-600 text-white rounded-xl shadow-md shadow-rose-500/25 hover:bg-rose-500 transition-all"
          >
            + New Ticket
          </button>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-rose-900/40 shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm">
              📝
            </div>
            <p className="text-xl font-bold text-slate-200">No support tickets yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-rose-400 hover:text-rose-300 font-semibold text-sm mt-2 transition-colors cursor-pointer"
            >
              Create your first ticket →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-700/70 hover:border-rose-500/60 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-100">{ticket.subject}</h3>
                    <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                      {ticket.description}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 px-3 py-1 text-xs font-semibold rounded-lg capitalize ${
                      statusColors[ticket.status] || statusColors.open
                    }`}
                  >
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-3 font-medium">
                  Created {formatDate(ticket.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <TicketForm
            onClose={() => setShowForm(false)}
            onSuccess={loadTickets}
          />
        )}
      </div>
    </div>
  );
}