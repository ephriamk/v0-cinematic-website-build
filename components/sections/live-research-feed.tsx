"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResearchSource {
  title: string;
  url: string;
  date: string;
}

interface ResearchUpdate {
  id: number;
  topic: string;
  summary: string;
  sources: ResearchSource[];
  key_stats: string[];
  image_url?: string;
  created_at: string;
}

const RESEARCH_API_URL = process.env.NEXT_PUBLIC_RESEARCH_API_URL || 'https://postlabor-research-agent.onrender.com';

export function LiveResearchFeed() {
  const [updates, setUpdates] = useState<ResearchUpdate[]>([]);
  const [allUpdates, setAllUpdates] = useState<ResearchUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpdate, setSelectedUpdate] = useState<ResearchUpdate | null>(null);
  const [showArchive, setShowArchive] = useState(false);

  const fetchUpdates = async () => {
    try {
      const res = await fetch(`${RESEARCH_API_URL}/api/research?limit=6`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setUpdates(data.updates || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUpdates = async () => {
    try {
      const res = await fetch(`${RESEARCH_API_URL}/api/research/all`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setAllUpdates(data.updates || []);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchUpdates();
    const interval = setInterval(fetchUpdates, 60 * 1000); // Check every minute for UI updates
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showArchive && allUpdates.length === 0) {
      fetchAllUpdates();
    }
  }, [showArchive]);

  const featured = updates[0];
  const recent = updates.slice(1, 5);

  return (
    <section id="research" className="relative py-24 md:py-32 overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950/50 to-black" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20"
          style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 70%)' }} 
        />
      </div>

      <div className="container relative mx-auto px-4 md:px-6 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <motion.span
                className="w-2 h-2 rounded-full bg-emerald-500"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs tracking-[0.25em] uppercase text-white/40">Live Feed</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-white">
              Research <span className="text-white/30">Stream</span>
            </h2>
          </div>
          
          {/* Archive Toggle */}
          <button
            onClick={() => setShowArchive(!showArchive)}
            className="self-start md:self-auto px-5 py-2.5 rounded-full text-sm border transition-all duration-300
              bg-white/[0.02] border-white/10 text-white/50 hover:text-white hover:border-white/30"
          >
            {showArchive ? '← Back to Latest' : `View Archive (${updates.length > 0 ? allUpdates.length || '...' : 0})`}
          </button>
        </motion.div>

        {loading ? (
          <LoadingSkeleton />
        ) : updates.length === 0 ? (
          <EmptyState />
        ) : showArchive ? (
          /* Archive View */
          <ArchiveView 
            updates={allUpdates} 
            onSelect={setSelectedUpdate}
            onLoadMore={fetchAllUpdates}
          />
        ) : (
          /* Main Feed */
          <div className="space-y-6">
            {/* Featured */}
            {featured && (
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedUpdate(featured)}
                className="group cursor-pointer"
              >
                <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
                  {featured.image_url ? (
                    <img src={featured.image_url} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-violet-900/40" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
                    <span className="inline-block self-start px-3 py-1 mb-4 rounded-full text-[10px] tracking-widest uppercase bg-white/10 backdrop-blur text-white/70 border border-white/10">
                      Latest
                    </span>
                    <h3 className="text-2xl md:text-3xl font-light text-white mb-3">{featured.topic}</h3>
                    <p className="text-white/50 font-light line-clamp-2 max-w-2xl">{featured.summary}</p>
                  </div>
                </div>
              </motion.article>
            )}

            {/* Recent Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recent.map((update, i) => (
                <motion.article
                  key={update.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedUpdate(update)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    {update.image_url ? (
                      <img src={update.image_url} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute inset-0 p-4 flex flex-col justify-end">
                      <h3 className="text-sm font-light text-white line-clamp-2">{update.topic}</h3>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedUpdate && (
          <DetailModal update={selectedUpdate} onClose={() => setSelectedUpdate(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function ArchiveView({ 
  updates, 
  onSelect,
  onLoadMore
}: { 
  updates: ResearchUpdate[]; 
  onSelect: (u: ResearchUpdate) => void;
  onLoadMore: () => void;
}) {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return ''; }
  };

  if (updates.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 mx-auto mb-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        <p className="text-white/40">Loading archive...</p>
      </div>
    );
  }

  // Group by month
  const grouped: { [key: string]: ResearchUpdate[] } = {};
  updates.forEach(u => {
    const date = new Date(u.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(u);
  });

  return (
    <div className="space-y-12">
      {Object.entries(grouped).map(([monthKey, items]) => {
        const [year, month] = monthKey.split('-');
        const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        return (
          <div key={monthKey}>
            <h3 className="text-sm text-white/30 mb-6 tracking-wide">{monthName}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((update, i) => (
                <motion.article
                  key={update.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => onSelect(update)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    {update.image_url ? (
                      <img src={update.image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <div className="absolute inset-0 bg-zinc-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute inset-0 p-4 flex flex-col justify-end">
                      <span className="text-[10px] text-white/30 mb-1">{formatDate(update.created_at)}</span>
                      <h4 className="text-sm font-light text-white/90 line-clamp-2">{update.topic}</h4>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DetailModal({ update, onClose }: { update: ResearchUpdate; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black"
      onClick={onClose}
    >
      {/* Image Hero */}
      <div className="relative h-[40vh] md:h-[50vh]">
        {update.image_url ? (
          <img src={update.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 p-3 rounded-full bg-black/40 backdrop-blur border border-white/10 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-4xl font-light text-white">{update.topic}</h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div onClick={(e) => e.stopPropagation()} className="bg-black">
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-10 space-y-10">
          <p className="text-lg text-white/60 font-light leading-relaxed">{update.summary}</p>

          {update.key_stats?.length > 0 && (
            <div>
              <h3 className="text-xs tracking-[0.2em] uppercase text-white/30 mb-4">Key Statistics</h3>
              <div className="space-y-3">
                {update.key_stats.map((stat, i) => (
                  <div key={i} className="flex gap-4 py-3 border-b border-white/5">
                    <span className="text-indigo-400/60 text-sm">{String(i + 1).padStart(2, '0')}</span>
                    <p className="text-white/50 font-light">{stat}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {update.sources?.length > 0 && (
            <div>
              <h3 className="text-xs tracking-[0.2em] uppercase text-white/30 mb-4">Sources</h3>
              <div className="space-y-2">
                {update.sources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 py-2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="text-sm truncate">{source.title || source.url}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 flex justify-center">
            <button onClick={onClose} className="px-6 py-2.5 text-sm text-white/40 hover:text-white border border-white/10 hover:border-white/30 rounded-full transition-all">
              Close
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-[400px] rounded-2xl bg-white/5 animate-pulse" />
      <div className="grid md:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="aspect-[4/3] rounded-xl bg-white/5 animate-pulse" />)}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-20 text-center">
      <p className="text-white/30">No research yet. Checking for news...</p>
    </div>
  );
}
