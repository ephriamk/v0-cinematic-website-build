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
  created_at: string;
}

// Update this with your Render service URL after deployment
const RESEARCH_API_URL = process.env.NEXT_PUBLIC_RESEARCH_API_URL || 'https://postlabor-research-agent.onrender.com';

export function LiveResearchFeed() {
  const [updates, setUpdates] = useState<ResearchUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUpdate, setSelectedUpdate] = useState<ResearchUpdate | null>(null);

  const fetchUpdates = async () => {
    try {
      const res = await fetch(`${RESEARCH_API_URL}/api/research?limit=6`);
      if (!res.ok) throw new Error('Failed to fetch research');
      const data = await res.json();
      setUpdates(data.updates || []);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Research feed is warming up...');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
    // Refresh every 5 minutes
    const interval = setInterval(fetchUpdates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUpdates();
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recently';
    }
  };

  // Loading state with skeleton
  if (loading) {
    return (
      <section id="research" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
        <div className="container relative mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span className="text-cyan-400 text-sm font-mono uppercase tracking-wider">Loading Research Feed</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-1/4 mb-4" />
                <div className="h-6 bg-white/10 rounded w-3/4 mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded w-full" />
                  <div className="h-4 bg-white/10 rounded w-5/6" />
                  <div className="h-4 bg-white/10 rounded w-4/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="research" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0,255,255,0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * 800
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <div className="container relative mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="text-cyan-400 text-sm font-mono uppercase tracking-wider">AI Research Agent</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">Research</span> Feed
          </h2>
          
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
            Our AI agent continuously monitors the latest developments in post-labor economics, 
            automation, and the future of work.
          </p>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 
                     border border-cyan-500/30 text-cyan-400 hover:text-white hover:border-cyan-400/50 
                     transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                     hover:shadow-[0_0_30px_rgba(0,255,255,0.2)]"
          >
            <svg 
              className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {refreshing ? 'Updating...' : 'Refresh Feed'}
          </button>
        </motion.div>

        {/* Error State */}
        {error && updates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Research Agent Initializing</h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              The AI research agent is warming up. This may take a moment on first load.
            </p>
            <button
              onClick={handleRefresh}
              className="px-6 py-3 rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        ) : (
          /* Research Cards Grid */
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <AnimatePresence mode="popLayout">
              {updates.map((update, index) => (
                <motion.article
                  key={update.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  onClick={() => setSelectedUpdate(selectedUpdate?.id === update.id ? null : update)}
                  className="group relative cursor-pointer"
                >
                  {/* Card glow effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/30 to-blue-500/0 
                                rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] 
                                border border-white/10 rounded-2xl p-6 md:p-8 
                                hover:border-cyan-500/40 transition-all duration-500
                                backdrop-blur-sm h-full">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <span className="inline-flex items-center gap-1.5 text-cyan-400/80 text-xs font-mono">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(update.created_at)}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 
                                     text-cyan-400 text-[10px] uppercase tracking-widest font-semibold
                                     border border-cyan-500/20">
                        New
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-100 transition-colors line-clamp-2">
                      {update.topic}
                    </h3>

                    {/* Summary */}
                    <p className="text-white/60 text-sm leading-relaxed line-clamp-4 mb-4">
                      {update.summary}
                    </p>

                    {/* Key Stats Preview */}
                    {update.key_stats && update.key_stats.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {update.key_stats.slice(0, 2).map((stat, i) => (
                          <span 
                            key={i} 
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg 
                                     bg-white/5 text-white/50 text-xs border border-white/5"
                          >
                            <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <span className="truncate max-w-[150px]">{stat}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Expand indicator */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-xs text-white/40 font-mono">
                        {update.sources?.length || 0} sources
                      </span>
                      <span className="text-cyan-400 text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read more
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Expanded View Modal */}
        <AnimatePresence>
          {selectedUpdate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedUpdate(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-zinc-900 
                         border border-white/10 rounded-2xl p-8"
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedUpdate(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 
                           text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Content */}
                <div className="pr-8">
                  <span className="text-cyan-400 text-sm font-mono">
                    {formatDate(selectedUpdate.created_at)}
                  </span>
                  
                  <h3 className="text-2xl font-bold text-white mt-2 mb-4">
                    {selectedUpdate.topic}
                  </h3>
                  
                  <p className="text-white/70 leading-relaxed mb-6">
                    {selectedUpdate.summary}
                  </p>

                  {/* Key Stats */}
                  {selectedUpdate.key_stats && selectedUpdate.key_stats.length > 0 && (
                    <div className="mb-6">
                      <h4 className="flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Key Statistics
                      </h4>
                      <ul className="space-y-2">
                        {selectedUpdate.key_stats.map((stat, i) => (
                          <li key={i} className="flex items-start gap-2 text-white/60">
                            <span className="text-cyan-400 mt-0.5">•</span>
                            {stat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Sources */}
                  {selectedUpdate.sources && selectedUpdate.sources.length > 0 && (
                    <div className="pt-4 border-t border-white/10">
                      <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
                        Sources
                      </h4>
                      <div className="space-y-2">
                        {selectedUpdate.sources.map((source, i) => (
                          <a
                            key={i}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg 
                                     bg-white/5 text-white/60 text-sm hover:bg-white/10 
                                     hover:text-white transition-colors group"
                          >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <span className="truncate">{source.title || source.url}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

