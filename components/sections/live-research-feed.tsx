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
  const [loading, setLoading] = useState(true);
  const [selectedUpdate, setSelectedUpdate] = useState<ResearchUpdate | null>(null);

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

  // Split into featured (first with image) and rest
  const featured = updates.find(u => u.image_url) || updates[0];
  const secondary = updates.filter(u => u.id !== featured?.id).slice(0, 2);
  const rest = updates.filter(u => u.id !== featured?.id && !secondary.find(s => s.id === u.id));

  return (
    <section id="research" className="relative py-24 md:py-40 overflow-hidden bg-black">
      {/* Ambient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950/50 to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-30"
          style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)' }} 
        />
      </div>

      <div className="container relative mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-24"
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.span
              className="w-2 h-2 rounded-full bg-indigo-500"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs tracking-[0.3em] uppercase text-white/40 font-medium">
              AI Research
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight">
            Intelligence
            <span className="block text-white/20">Stream</span>
          </h2>
        </motion.div>

        {loading ? (
          <LoadingSkeleton />
        ) : updates.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6 md:space-y-8">
            {/* Featured + Secondary Row */}
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
              {/* Featured Card - Large with image */}
              {featured && (
                <motion.article
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedUpdate(featured)}
                  className="group cursor-pointer lg:row-span-2"
                >
                  <div className="relative h-full min-h-[500px] md:min-h-[600px] rounded-3xl overflow-hidden">
                    {/* Image */}
                    {featured.image_url ? (
                      <img 
                        src={featured.image_url} 
                        alt={featured.topic}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50" />
                    )}
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
                      <div className="space-y-4">
                        <span className="inline-block px-3 py-1 rounded-full text-[10px] tracking-widest uppercase bg-white/10 backdrop-blur-sm text-white/70 border border-white/10">
                          Featured
                        </span>
                        <h3 className="text-2xl md:text-4xl font-light text-white leading-tight">
                          {featured.topic}
                        </h3>
                        <p className="text-white/50 font-light leading-relaxed line-clamp-3 max-w-lg">
                          {featured.summary}
                        </p>
                        <motion.div 
                          className="flex items-center gap-2 text-white/40 text-sm pt-2"
                          whileHover={{ x: 5 }}
                        >
                          <span>Explore</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              )}

              {/* Secondary Cards */}
              <div className="space-y-6 md:space-y-8">
                {secondary.map((update, index) => (
                  <motion.article
                    key={update.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedUpdate(update)}
                    className="group cursor-pointer"
                  >
                    <div className="relative h-[240px] md:h-[280px] rounded-2xl overflow-hidden">
                      {/* Image */}
                      {update.image_url ? (
                        <img 
                          src={update.image_url} 
                          alt={update.topic}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      
                      {/* Content */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <h3 className="text-lg md:text-xl font-light text-white leading-snug mb-2">
                          {update.topic}
                        </h3>
                        <p className="text-white/40 text-sm font-light line-clamp-2">
                          {update.summary}
                        </p>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>

            {/* Rest - Horizontal scroll or grid */}
            {rest.length > 0 && (
              <div className="pt-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="text-xs tracking-[0.2em] uppercase text-white/20">More Research</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {rest.map((update, index) => (
                    <motion.article
                      key={update.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedUpdate(update)}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
                        {update.image_url ? (
                          <img 
                            src={update.image_url} 
                            alt={update.topic}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
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
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedUpdate && (
          <Modal update={selectedUpdate} onClose={() => setSelectedUpdate(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="h-[600px] rounded-3xl bg-white/5 animate-pulse" />
      <div className="space-y-8">
        <div className="h-[280px] rounded-2xl bg-white/5 animate-pulse" />
        <div className="h-[280px] rounded-2xl bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-32 text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
        <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <p className="text-white/30 font-light">Research stream initializing...</p>
    </div>
  );
}

function Modal({ update, onClose }: { update: ResearchUpdate; onClose: () => void }) {
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-full">
        {/* Image Hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-[50vh] md:h-[60vh]"
        >
          {update.image_url ? (
            <img 
              src={update.image_url} 
              alt={update.topic}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight"
              >
                {update.topic}
              </motion.h2>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-black"
        >
          <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-16 space-y-12">
            {/* Summary */}
            <div>
              <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed">
                {update.summary}
              </p>
            </div>

            {/* Key Stats */}
            {update.key_stats && update.key_stats.length > 0 && (
              <div>
                <h3 className="text-xs tracking-[0.3em] uppercase text-white/30 mb-6">Key Findings</h3>
                <div className="grid gap-4">
                  {update.key_stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex gap-4 items-start py-4 border-b border-white/5"
                    >
                      <span className="text-indigo-400/50 font-light">{String(i + 1).padStart(2, '0')}</span>
                      <p className="text-white/60 font-light">{stat}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Sources */}
            {update.sources && update.sources.length > 0 && (
              <div>
                <h3 className="text-xs tracking-[0.3em] uppercase text-white/30 mb-6">Sources</h3>
                <div className="space-y-2">
                  {update.sources.map((source, i) => (
                    <a
                      key={i}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 py-3 text-white/40 hover:text-white/70 transition-colors group"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span className="font-light text-sm truncate">{source.title || source.url}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Close */}
            <div className="pt-8 flex justify-center">
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-full text-sm text-white/40 hover:text-white border border-white/10 hover:border-white/30 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
