"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Twitter } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative h-screen flex flex-col">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium tracking-widest uppercase text-white/80">Post-Labor</span>
          <span className="px-2 py-1 bg-accent/20 border border-accent/40 rounded text-accent text-xs font-bold tracking-wide">
            $PLE
          </span>
        </div>
        <div className="flex items-center gap-6 md:gap-8">
          <a href="#intro" className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block">
            The Shift
          </a>
          <a href="#futures" className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block">
            Futures
          </a>
          <a href="#theories" className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block">
            Theories
          </a>
          <a href="#memes" className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block">
            Broadcast
          </a>
          <a href="#research" className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block">
            Research
          </a>
          <div className="flex items-center gap-4 pl-4 border-l border-white/20">
            <a
              href="https://x.com/i/communities/1997365593889177684"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-accent transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://pump.fun/coin/6zLA3vRBE348wkuzkkxqhChzQdfzX748xcc53Z2Dpump"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-white/60 hover:text-accent transition-colors uppercase tracking-wider"
            >
              PumpFun
            </a>
          </div>
        </div>
      </nav>

      <motion.div
        className="absolute top-20 left-6 md:left-12 z-20 flex items-center gap-3 px-4 py-2 bg-background/80 backdrop-blur-sm border border-accent/30 rounded-full"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium text-foreground">$PLE</span>
        <span className="text-xs text-muted-foreground">Post Labor Economics</span>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Image
          src="/images/b6c4d28e-f4f5-4522-804e-a6c8bcb88da7-20-281-29.jpeg"
          alt="Post Labor Economics - Futuristic utopian cityscape"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Subtle vignette effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </motion.div>

      {/* Scroll Indicator - centered at bottom */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <span className="text-xs tracking-widest uppercase text-white/60">Explore</span>
        <motion.div
          className="w-6 h-10 border border-white/30 rounded-full flex items-start justify-center p-2"
          animate={{ borderColor: ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.6)", "rgba(255,255,255,0.3)"] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <motion.div
            className="w-1 h-2 bg-white/80 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
