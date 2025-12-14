"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect, useCallback } from "react"
import { Volume2, VolumeX, ChevronLeft, ChevronRight, Tv, Play, Pause } from "lucide-react"

interface MediaItem {
  id: string
  type: "image" | "video"
  src: string
  title: string
  channel: number
}

interface ImageDimensions {
  [key: string]: { width: number; height: number; aspectRatio: number }
}

// Meme gallery items
const mediaItems: MediaItem[] = [
  {
    id: "1",
    type: "image",
    src: "/images/memes/Gemini_Generated_Image_2742nu2742nu2742.png",
    title: "When Even Robots Miss the Office",
    channel: 1,
  },
  {
    id: "2",
    type: "image",
    src: "/images/memes/Gemini_Generated_Image_7luxtc7luxtc7lux.png",
    title: "Employers Looking at AI",
    channel: 2,
  },
  {
    id: "3",
    type: "image",
    src: "/images/memes/Gemini_Generated_Image_fsuw0pfsuw0pfsuw.png",
    title: "The New Developer Workflow",
    channel: 3,
  },
  {
    id: "4",
    type: "image",
    src: "/images/memes/Gemini_Generated_Image_i89kfdi89kfdi89k.png",
    title: "Post-Labor Aesthetic",
    channel: 4,
  },
  {
    id: "5",
    type: "image",
    src: "/images/memes/Gemini_Generated_Image_p6o0ovp6o0ovp6o0.png",
    title: "Training Data Realization",
    channel: 5,
  },
  {
    id: "6",
    type: "image",
    src: "/images/memes/Gemini_Generated_Image_riwp0wriwp0wriwp.png",
    title: "The Automation Paradox",
    channel: 6,
  },
  {
    id: "7",
    type: "image",
    src: "/images/memes/Gemini_Generated_Image_si2dcssi2dcssi2d.png",
    title: "Sigma Robot Grindset",
    channel: 7,
  },
  {
    id: "8",
    type: "image",
    src: "/images/memes/Gemini_Generated_Image_wduf1kwduf1kwduf.png",
    title: "The Great Replacement",
    channel: 8,
  },
  {
    id: "9",
    type: "image",
    src: "/images/memes/Gemini_Generated_Image_x9yz0rx9yz0rx9yz.png",
    title: "Robot Living Its Best Life",
    channel: 9,
  },
  {
    id: "10",
    type: "image",
    src: "/images/memes/Gemini_Generated_Image_z33f80z33f80z33f.png",
    title: "Contemplating the Post-Labor Future",
    channel: 10,
  },
]

function TVScreen({ 
  item, 
  isActive, 
  onImageLoad 
}: { 
  item: MediaItem; 
  isActive: boolean;
  onImageLoad?: (id: string, width: number, height: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    if (onImageLoad && img.naturalWidth && img.naturalHeight) {
      onImageLoad(item.id, img.naturalWidth, img.naturalHeight)
    }
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-sm">
      {/* Static/noise overlay */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Scan lines */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.15) 2px,
            rgba(0, 0, 0, 0.15) 4px
          )`,
        }}
      />

      {/* VHS tracking effect on edges */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Color aberration effect */}
      <div className="absolute inset-0 z-10 pointer-events-none mix-blend-screen opacity-30">
        <div className="absolute inset-0 bg-red-500/10 translate-x-[1px]" />
        <div className="absolute inset-0 bg-blue-500/10 -translate-x-[1px]" />
      </div>

      {/* Media content */}
      {item.type === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.src}
          alt={item.title}
          className="w-full h-full object-contain"
          onLoad={handleImageLoad}
        />
      ) : (
        <video
          ref={videoRef}
          src={item.src}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-contain"
        />
      )}

      {/* Video controls */}
      {item.type === "video" && (
        <div className="absolute bottom-4 right-4 z-30 flex gap-2">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/80 transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleMute}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/80 transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Channel indicator */}
      <div className="absolute top-4 right-4 z-30 font-mono text-green-400 text-sm bg-black/60 px-2 py-1 rounded">
        CH {item.channel.toString().padStart(2, "0")}
      </div>
    </div>
  )
}

function TVFrame({ children, isHovered }: { children: React.ReactNode; isHovered: boolean }) {
  return (
    <div className="relative group">
      {/* Outer glow rings */}
      <div className={`absolute -inset-8 rounded-3xl transition-all duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-cyan-500/10 rounded-3xl blur-3xl animate-pulse" />
        <div className="absolute inset-4 bg-accent/10 rounded-2xl blur-2xl animate-pulse" style={{ animationDelay: '0.3s' }} />
      </div>
      
      {/* Main holographic frame */}
      <div className="relative">
        {/* Animated outer border */}
        <div 
          className="absolute -inset-[2px] rounded-xl"
          style={{
            background: 'linear-gradient(90deg, #c4a77d, #22d3ee, #c4a77d, #22d3ee)',
            backgroundSize: '300% 100%',
            animation: 'borderFlow 4s linear infinite',
          }}
        />
        
        {/* Glass frame */}
        <div className="relative bg-black/90 backdrop-blur-xl rounded-xl overflow-hidden">
          {/* Top HUD bar */}
          <div className="relative bg-gradient-to-r from-zinc-900/80 via-black to-zinc-900/80 border-b border-cyan-500/20 px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Left cluster */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]" />
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                </div>
                <div className="h-4 w-px bg-cyan-500/30" />
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-[9px] font-mono text-cyan-400 tracking-wider">STREAMING</span>
                </div>
              </div>
              
              {/* Center - Logo */}
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span className="text-xs font-mono tracking-[0.2em] text-zinc-400">POST—LABOR</span>
                <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              
              {/* Right cluster */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-mono text-zinc-500">SIG</span>
                  <div className="flex gap-px">
                    {[1,2,3,4,5].map((i) => (
                      <div 
                        key={i} 
                        className={`w-1 rounded-sm transition-all ${i <= 4 ? 'h-3 bg-cyan-400' : 'h-2 bg-zinc-700'}`}
                        style={{ height: `${8 + i * 2}px` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="h-4 w-px bg-cyan-500/30" />
                <span className="text-[10px] font-mono text-accent tabular-nums">2025</span>
              </div>
            </div>
            
            {/* Scanning line effect */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              style={{ animation: 'scanline 2s ease-in-out infinite' }}
            />
          </div>
          
          {/* Screen area */}
          <div className="relative p-1">
            {/* Corner brackets */}
            <div className="absolute top-2 left-2 w-8 h-8">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent to-transparent" />
              <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-accent to-transparent" />
            </div>
            <div className="absolute top-2 right-2 w-8 h-8">
              <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-cyan-400 to-transparent" />
              <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-cyan-400 to-transparent" />
            </div>
            <div className="absolute bottom-2 left-2 w-8 h-8">
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-transparent" />
              <div className="absolute bottom-0 left-0 w-[2px] h-full bg-gradient-to-t from-cyan-400 to-transparent" />
            </div>
            <div className="absolute bottom-2 right-2 w-8 h-8">
              <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-accent to-transparent" />
              <div className="absolute bottom-0 right-0 w-[2px] h-full bg-gradient-to-t from-accent to-transparent" />
            </div>
            
            {/* Screen content with holographic overlay */}
            <div className={`relative rounded-md overflow-hidden transition-transform duration-300 ${isHovered ? "scale-[1.005]" : ""}`}>
              {children}
              
              {/* Holographic scan overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 211, 238, 0.03) 2px, rgba(34, 211, 238, 0.03) 4px)',
                }}
              />
            </div>
          </div>
          
          {/* Bottom data bar */}
          <div className="bg-gradient-to-r from-zinc-900/80 via-black to-zinc-900/80 border-t border-cyan-500/20 px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Left info */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border border-accent/40 flex items-center justify-center">
                  <Tv className="w-3 h-3 text-accent" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-zinc-500 leading-none">BROADCAST</span>
                  <span className="text-[10px] font-mono text-cyan-400 leading-none">ACTIVE</span>
                </div>
              </div>
              
              {/* Center - Progress bar */}
              <div className="flex-1 mx-6">
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent via-cyan-400 to-accent rounded-full"
                    style={{ 
                      width: '60%',
                      animation: 'pulse 2s ease-in-out infinite'
                    }}
                  />
                </div>
              </div>
              
              {/* Right info */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-zinc-500">RES</span>
                <span className="text-[10px] font-mono text-accent">4K</span>
                <div className="w-px h-3 bg-zinc-700" />
                <span className="text-[9px] font-mono text-zinc-500">FPS</span>
                <span className="text-[10px] font-mono text-cyan-400">60</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Holographic projection base */}
      <div className="flex justify-center mt-3">
        <div 
          className={`relative transition-all duration-500 ${isHovered ? 'w-2/3' : 'w-1/2'}`}
        >
          <div className="h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent rounded-full" />
          <div className="h-6 bg-gradient-to-b from-cyan-400/20 to-transparent rounded-b-full blur-md -mt-1" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-accent/60 rounded-full blur-sm" />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes borderFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        @keyframes scanline {
          0%, 100% { opacity: 0; transform: translateX(-100%); }
          50% { opacity: 1; transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

export function MemeGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isChangingChannel, setIsChangingChannel] = useState(false)
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions>({})
  const [isLoading, setIsLoading] = useState(true)

  const currentItem = mediaItems[currentIndex] || mediaItems[0]
  const currentDimensions = imageDimensions[currentItem.id]
  
  // Preload all images to get their dimensions
  useEffect(() => {
    const loadImages = async () => {
      const dims: ImageDimensions = {}
      
      await Promise.all(
        mediaItems.map((item) => {
          return new Promise<void>((resolve) => {
            if (item.type === "image") {
              const img = new window.Image()
              img.onload = () => {
                dims[item.id] = {
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                  aspectRatio: img.naturalWidth / img.naturalHeight
                }
                resolve()
              }
              img.onerror = () => resolve()
              img.src = item.src
            } else {
              resolve()
            }
          })
        })
      )
      
      setImageDimensions(dims)
      setIsLoading(false)
    }
    
    loadImages()
  }, [])

  const handleImageLoad = useCallback((id: string, width: number, height: number) => {
    setImageDimensions(prev => ({
      ...prev,
      [id]: { width, height, aspectRatio: width / height }
    }))
  }, [])

  // Calculate max width based on aspect ratio
  const getMaxWidth = () => {
    if (!currentDimensions) return "800px"
    const ratio = currentDimensions.aspectRatio
    if (ratio < 0.7) return "450px" // Very tall
    if (ratio < 1) return "550px" // Tall/portrait
    if (ratio < 1.3) return "650px" // Square-ish
    return "900px" // Wide
  }

  const changeChannel = (direction: "next" | "prev") => {
    setIsChangingChannel(true)
    
    setTimeout(() => {
      if (direction === "next") {
        setCurrentIndex((prev) => (prev + 1) % mediaItems.length)
      } else {
        setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length)
      }
      
      setTimeout(() => {
        setIsChangingChannel(false)
      }, 150)
    }, 150)
  }

  // If no media items, show placeholder
  if (mediaItems.length === 0) {
    return null
  }

  return (
    <section id="memes" className="py-32 md:py-48 px-6 md:px-12 lg:px-16 bg-background relative overflow-hidden">
      {/* Background static effect */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="max-w-5xl mx-auto relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-16 text-center"
        >
          <span className="text-sm font-medium tracking-widest uppercase text-accent mb-4 block">
            05 — The Broadcast
          </span>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-tight mb-6">
            Tune In to the Discourse
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Memes, visuals, and video content from the post-labor conversation. 
            Change channels to explore.
          </p>
        </motion.div>

        {/* TV Display */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* TV Container with animated size */}
          <div className="flex justify-center">
            <motion.div
              layout
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full"
              style={{ maxWidth: getMaxWidth() }}
            >
              <TVFrame isHovered={isHovered}>
                <motion.div
                  layout
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ 
                    aspectRatio: currentDimensions 
                      ? `${currentDimensions.width} / ${currentDimensions.height}` 
                      : "16 / 9",
                    minHeight: "200px"
                  }}
                  className="relative bg-black"
                >
                  <AnimatePresence mode="wait">
                    {isChangingChannel ? (
                      <motion.div
                        key="static"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-zinc-900 flex items-center justify-center"
                      >
                        {/* Static animation */}
                        <div 
                          className="absolute inset-0 animate-pulse"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                          }}
                        />
                        <span className="relative z-10 font-mono text-white/50 text-xl md:text-2xl">
                          CH {currentItem.channel.toString().padStart(2, "0")}
                        </span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={currentItem.id}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                      >
                        <TVScreen item={currentItem} isActive={true} onImageLoad={handleImageLoad} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </TVFrame>
            </motion.div>
          </div>

          {/* Channel controls */}
          {mediaItems.length > 1 && (
            <div className="flex items-center justify-center gap-6 mt-8">
              <motion.button
                onClick={() => changeChannel("prev")}
                className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/50 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {mediaItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (idx !== currentIndex) {
                        setIsChangingChannel(true)
                        setTimeout(() => {
                          setCurrentIndex(idx)
                          setTimeout(() => setIsChangingChannel(false), 150)
                        }, 150)
                      }
                    }}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === currentIndex 
                        ? "bg-accent w-6" 
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
              
              <motion.button
                onClick={() => changeChannel("next")}
                className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/50 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          )}

          {/* Current item title */}
          <motion.p
            key={currentItem.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-6 text-muted-foreground font-medium"
          >
            {currentItem.title}
          </motion.p>
        </motion.div>

        {/* Thumbnail strip */}
        {mediaItems.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
          >
            {mediaItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  if (idx !== currentIndex) {
                    setIsChangingChannel(true)
                    setTimeout(() => {
                      setCurrentIndex(idx)
                      setTimeout(() => setIsChangingChannel(false), 150)
                    }, 150)
                  }
                }}
                className={`relative flex-shrink-0 w-32 aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                  idx === currentIndex 
                    ? "border-accent shadow-[0_0_20px_rgba(196,167,125,0.3)]" 
                    : "border-border/50 opacity-50 hover:opacity-100"
                }`}
              >
                {item.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={item.src}
                    className="w-full h-full object-cover"
                    muted
                  />
                )}
                {/* Scan lines on thumbnails */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `repeating-linear-gradient(
                      0deg,
                      transparent,
                      transparent 1px,
                      rgba(0, 0, 0, 0.1) 1px,
                      rgba(0, 0, 0, 0.1) 2px
                    )`,
                  }}
                />
                <div className="absolute top-1 right-1 font-mono text-[10px] text-green-400 bg-black/60 px-1 rounded">
                  {item.channel.toString().padStart(2, "0")}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}

