"use client"

import { motion } from "framer-motion"

export function MarqueeBanner() {
  const items = [
    "Universal Basic Income",
    "Automation",
    "Wealth Distribution",
    "Robot Tax",
    "Post-Scarcity",
    "Digital Economy",
    "Human Purpose",
    "Shared Prosperity",
  ]

  return (
    <div className="py-6 border-y border-border bg-card overflow-hidden">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center mx-8">
            <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground">{item}</span>
            <span className="ml-8 w-1.5 h-1.5 rounded-full bg-accent" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}
