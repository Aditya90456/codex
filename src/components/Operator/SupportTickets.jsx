import { useState } from 'react';
import { useOperator, PERMISSIONS } from '../../contexts/OperatorContext';
import { MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const SupportTickets = () => {
  const { hasPermission } = useOperator();
  const [filter, setFilter] = useState('open');

  const tickets = [
    { id: 1, subject: 'Cannot submit solution', user: 'user@example.com', status: 'open', priority: 'high', created: '2024-02-20' },
    { id: 2, subject: 'Account access issue', user: 'test@example.com', status: 'open', priority: 'medium', created: '2024-02-21' },
    { id: 3, subject: 'Feature request', user: 'dev@example.com', status: 'closed', priority: 'low', created: '2024-02-19' },
  ];

  const filteredTickets = tickets.filter(t => filter === 'all' || t.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Support Tickets</h2>
        <span className="text-gray-400">{filteredTickets.length} tickets</span>
      </div>

      <div className="flex gap-2 border-b border-gray-700">
        {['all', 'open', 'closed'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 font-medium capitalize ${
              filter === status ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredTickets.map(ticket => (
          <div key={ticket.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-white font-medium">{ticket.subject}</h3>
                  <p className="text-sm text-gray-400">{ticket.user}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  ticket.priority === 'high' ? 'bg-red-900/50 text-red-400' :
                  ticket.priority === 'medium' ? 'bg-yellow-900/50 text-yellow-400' :
                  'bg-gray-700 text-gray-400'
                }`}>
                  {ticket.priority}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  ticket.status === 'open' ? 'bg-blue-900/50 text-blue-400' : 'bg-green-900/50 text-green-400'
                }`}>
                  {ticket.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {ticket.created}
              </span>
            </div>
            {hasPermission(PERMISSIONS.RESPOND_TICKETS) && ticket.status === 'open' && (
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                  Respond
                </button>
                {hasPermission(PERMISSIONS.CLOSE_TICKETS) && (
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm">
                    Close Ticket
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportTickets;
