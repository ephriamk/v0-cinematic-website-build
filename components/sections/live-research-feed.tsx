"use client";

import { useEffect, useState, useRef } from 'react';
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

const RESEARCH_API_URL = process.env.NEXT_PUBLIC_RESEARCH_API_URL || 'https://postlabor-research-agent.onrender.com';

// Custom animated icons
const PulseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <motion.path
      d="M3 12h4l3-9 4 18 3-9h4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </svg>
);

const DataIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function LiveResearchFeed() {
  const [updates, setUpdates] = useState<ResearchUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpdate, setSelectedUpdate] = useState<ResearchUpdate | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    fetchUpdates();
    const interval = setInterval(fetchUpdates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      if (diff < 1) return 'Now';
      if (diff < 24) return `${diff}h`;
      return `${Math.floor(diff / 24)}d`;
    } catch {
      return '—';
    }
  };

  return (
    <section 
      id="research" 
      ref={containerRef} 
      className="relative min-h-screen py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #000 0%, #0a0a12 50%, #000 100%)' }}
    >
      {/* Atmospheric Background */}
      <div className="absolute inset-0">
        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 60%)' }} 
        />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 60%)' }} 
        />
        
        {/* Animated line */}
        <motion.div
          className="absolute top-1/2 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)' }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <div className="container relative mx-auto px-6 max-w-6xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-24"
        >
          {/* Status indicator */}
          <motion.div 
            className="flex items-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative flex items-center gap-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ 
                  boxShadow: ['0 0 0 0 rgba(52,211,153,0.4)', '0 0 0 8px rgba(52,211,153,0)', '0 0 0 0 rgba(52,211,153,0)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[11px] tracking-[0.2em] uppercase text-white/40 font-light">
                Live Intelligence
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <div className="space-y-4">
            <motion.h2 
              className="text-[clamp(2.5rem,8vw,6rem)] font-extralight tracking-tight leading-[0.9]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-white/90">Research</span>
            </motion.h2>
            <motion.h2 
              className="text-[clamp(2.5rem,8vw,6rem)] font-extralight tracking-tight leading-[0.9]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <span 
                className="bg-clip-text text-transparent"
                style={{ 
                  backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)',
                }}
              >
                Stream
              </span>
            </motion.h2>
          </div>

          <motion.p 
            className="mt-8 text-white/30 text-lg font-light max-w-lg leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            AI-curated insights on the evolving landscape of work, automation, and economic transformation.
          </motion.p>
        </motion.header>

        {loading ? (
          /* Minimal Loading */
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="h-32 rounded-2xl bg-white/[0.02] border border-white/[0.03]"
              />
            ))}
          </div>
        ) : updates.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 text-center"
          >
            <div className="text-white/20 mb-4">
              <DataIcon />
            </div>
            <p className="text-white/30 font-light">Initializing research stream...</p>
          </motion.div>
        ) : (
          /* Content */
          <div className="space-y-4">
            {updates.map((update, index) => (
              <motion.article
                key={update.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.08, duration: 0.6 }}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setSelectedUpdate(update)}
                className="group relative cursor-pointer"
              >
                {/* Hover gradient border */}
                <motion.div
                  className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(96,165,250,0.2), rgba(167,139,250,0.2), rgba(244,114,182,0.2))',
                  }}
                />
                
                <div className="relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.04] rounded-2xl p-6 md:p-8 group-hover:bg-white/[0.03] transition-all duration-500">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Index number */}
                    <div className="hidden md:flex flex-shrink-0 w-12 h-12 items-center justify-center">
                      <span 
                        className="text-3xl font-extralight tabular-nums"
                        style={{
                          background: activeIndex === index 
                            ? 'linear-gradient(135deg, #60a5fa, #a78bfa)' 
                            : 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-4">
                      {/* Title row */}
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-xl md:text-2xl font-light text-white/90 leading-snug group-hover:text-white transition-colors">
                          {update.topic}
                        </h3>
                        <span className="flex-shrink-0 text-xs text-white/20 font-mono tabular-nums mt-1">
                          {formatTime(update.created_at)}
                        </span>
                      </div>

                      {/* Summary */}
                      <p className="text-white/40 font-light leading-relaxed line-clamp-2 text-[15px]">
                        {update.summary}
                      </p>

                      {/* Stats preview */}
                      {update.key_stats && update.key_stats.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {update.key_stats.slice(0, 2).map((stat, i) => (
                            <span 
                              key={i}
                              className="text-xs text-white/25 font-light px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.04]"
                            >
                              {stat.length > 50 ? stat.slice(0, 50) + '...' : stat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Arrow */}
                    <motion.div 
                      className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.02] text-white/20 group-hover:text-white/60 group-hover:bg-white/[0.05] transition-all duration-300"
                      whileHover={{ x: 4 }}
                    >
                      <ArrowIcon />
                    </motion.div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Source count */}
        {updates.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 flex items-center justify-center gap-3 text-white/20"
          >
            <div className="w-8 h-px bg-white/10" />
            <span className="text-xs tracking-[0.15em] uppercase font-light">
              {updates.length} Research Entries
            </span>
            <div className="w-8 h-px bg-white/10" />
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedUpdate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50"
            onClick={() => setSelectedUpdate(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
            
            {/* Content */}
            <div className="relative h-full overflow-y-auto">
              <div className="min-h-full flex items-start justify-center p-6 md:p-12">
                <motion.article
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-3xl py-12"
                >
                  {/* Close hint */}
                  <motion.div 
                    className="flex items-center justify-between mb-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-[11px] tracking-[0.2em] uppercase text-white/30">
                      Research Analysis
                    </span>
                    <button
                      onClick={() => setSelectedUpdate(null)}
                      className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-2"
                    >
                      <span>Close</span>
                      <kbd className="px-2 py-0.5 rounded bg-white/5 text-[10px]">ESC</kbd>
                    </button>
                  </motion.div>

                  {/* Title */}
                  <motion.h2 
                    className="text-3xl md:text-5xl font-extralight text-white leading-tight mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {selectedUpdate.topic}
                  </motion.h2>

                  {/* Divider */}
                  <motion.div 
                    className="w-16 h-px mb-12"
                    style={{ background: 'linear-gradient(90deg, #60a5fa, #a78bfa, transparent)' }}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  />

                  {/* Summary */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-16"
                  >
                    <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed">
                      {selectedUpdate.summary}
                    </p>
                  </motion.div>

                  {/* Key Insights */}
                  {selectedUpdate.key_stats && selectedUpdate.key_stats.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mb-16"
                    >
                      <h3 className="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-8">
                        Key Findings
                      </h3>
                      <div className="space-y-4">
                        {selectedUpdate.key_stats.map((stat, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            className="flex gap-6 items-start"
                          >
                            <span 
                              className="flex-shrink-0 text-sm font-light tabular-nums"
                              style={{
                                background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                              }}
                            >
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <p className="text-white/50 font-light leading-relaxed">
                              {stat}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Sources */}
                  {selectedUpdate.sources && selectedUpdate.sources.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3 className="text-[11px] tracking-[0.2em] uppercase text-white/30 mb-8">
                        Sources
                      </h3>
                      <div className="space-y-3">
                        {selectedUpdate.sources.map((source, i) => (
                          <motion.a
                            key={i}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 + i * 0.05 }}
                            className="group/link flex items-center gap-4 py-3 border-b border-white/[0.03] hover:border-white/10 transition-colors"
                          >
                            <span className="text-white/30 group-hover/link:text-white/60 transition-colors font-light text-sm flex-1 truncate">
                              {source.title || source.url}
                            </span>
                            <svg 
                              className="w-4 h-4 text-white/20 group-hover/link:text-white/50 transition-colors flex-shrink-0" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </motion.a>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Close button */}
                  <motion.div 
                    className="mt-20 flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <button
                      onClick={() => setSelectedUpdate(null)}
                      className="px-8 py-3 rounded-full text-sm text-white/40 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      Return to Feed
                    </button>
                  </motion.div>
                </motion.article>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
