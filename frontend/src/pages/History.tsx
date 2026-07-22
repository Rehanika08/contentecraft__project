import { useState, useEffect } from 'react';
import { getHistory, deleteHistory } from '../lib/api';
import { History as HistoryIcon, Trash2, Loader2, FileText, Mail, Share2, AlignLeft, Wand2, CheckCircle2, Pen, Clock } from 'lucide-react';

const TOOL_ICONS: Record<string, any> = {
  blog: FileText,
  email: Mail,
  social: Share2,
  summarize: AlignLeft,
  rewrite: Wand2,
  grammar: CheckCircle2,
  creative: Pen,
};

interface HistoryItem {
  _id: string;
  prompt: string;
  response: string;
  toolUsed: string;
  language: string;
  tone: string;
  createdAt: string;
}

const HistoryPage = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await getHistory();
      setItems(res.data);
    } catch {
      setError('Failed to load history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteHistory(id);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch {
      setError('Failed to delete item.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <HistoryIcon size={28} style={{ color: 'rgb(99 102 241)' }} />
          Content History
        </h1>
        <p className="mt-1" style={{ color: 'rgb(100 116 139)' }}>All your previously generated content</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl mb-6 text-sm" style={{ background: 'rgb(239 68 68 / 0.1)', color: 'rgb(252 165 165)', border: '1px solid rgb(239 68 68 / 0.2)' }}>
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-24 gap-3" style={{ color: 'rgb(100 116 139)' }}>
          <Loader2 size={24} className="animate-spin" />
          <span>Loading history...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 rounded-2xl border" style={{ background: 'rgb(22 27 45)', borderColor: 'rgb(30 41 59)' }}>
          <HistoryIcon size={48} style={{ color: 'rgb(30 41 59)' }} />
          <div className="text-center">
            <p className="text-lg font-semibold text-white">No history yet</p>
            <p className="text-sm mt-1" style={{ color: 'rgb(100 116 139)' }}>Generate some content and save it to see it here.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(item => {
            const Icon = TOOL_ICONS[item.toolUsed] || FileText;
            const isExpanded = expandedId === item._id;
            return (
              <div
                key={item._id}
                className="rounded-2xl border overflow-hidden transition-all duration-300"
                style={{ background: 'rgb(22 27 45)', borderColor: 'rgb(30 41 59)' }}
              >
                {/* Header */}
                <div
                  className="flex items-start gap-4 p-5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : item._id)}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgb(99 102 241 / 0.15)', border: '1px solid rgb(99 102 241 / 0.3)' }}>
                    <Icon size={18} style={{ color: 'rgb(165 180 252)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.prompt}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgb(99 102 241 / 0.15)', color: 'rgb(165 180 252)' }}>{item.toolUsed}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgb(30 41 59)', color: 'rgb(100 116 139)' }}>{item.tone}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgb(30 41 59)', color: 'rgb(100 116 139)' }}>{item.language}</span>
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'rgb(71 85 105)' }}>
                        <Clock size={11} />
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                    disabled={deletingId === item._id}
                    className="p-2 rounded-lg transition-colors shrink-0"
                    style={{ color: 'rgb(71 85 105)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgb(239 68 68)'; (e.currentTarget as HTMLElement).style.background = 'rgb(239 68 68 / 0.1)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgb(71 85 105)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    {deletingId === item._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-5 pb-5">
                    <div className="rounded-xl p-4" style={{ background: 'rgb(15 17 26)', border: '1px solid rgb(30 41 59)' }}>
                      <pre className="text-sm whitespace-pre-wrap leading-relaxed font-sans" style={{ color: 'rgb(203 213 225)' }}>
                        {item.response}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
