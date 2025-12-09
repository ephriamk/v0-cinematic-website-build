"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { ExternalLink, ChevronDown } from "lucide-react"

interface StatCardProps {
  value: string
  label: string
  citation: string
  sourceUrl: string
  delay: number
  isInView: boolean
}

function StatCard({ value, label, citation, sourceUrl, delay, isInView }: StatCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
      className="group"
    >
      <div
        className="bg-card border border-border/50 p-6 md:p-8 cursor-pointer transition-all duration-300 hover:border-accent/30"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between mb-4">
          <span className="block font-serif text-4xl md:text-5xl lg:text-6xl text-accent">{value}</span>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>
        <span className="text-sm text-muted-foreground uppercase tracking-wide block">{label}</span>

        {/* Expandable Citation */}
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-4 mt-4 border-t border-border/50">
            <p className="text-sm text-foreground/70 mb-3">{citation}</p>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
            >
              View Source <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function IntroSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const stats = [
    {
      value: "47%",
      label: "of U.S. jobs at high risk of automation",
      citation:
        "Oxford economists Carl Benedikt Frey and Michael Osborne estimated that automation puts roughly 47% of U.S. jobs at high risk over 20 years (by around 2030).",
      sourceUrl: "https://www.axios.com/2017/12/15/expert-doubles-down-robots-still-threaten-47-of-us-jobs-1513305167",
    },
    {
      value: "$15.7T",
      label: "potential global GDP boost from AI by 2030",
      citation: "According to PwC, AI could boost global GDP by about $15.7 trillion (a 14% increase) by 2030.",
      sourceUrl: "https://www.weforum.org/stories/2017/06/the-global-economy-will-be-14-bigger-in-2030-because-of-ai/",
    },
    {
      value: "800M",
      label: "workers may need to transition jobs",
      citation:
        "A 2017 McKinsey report warned that up to 800 million workers worldwide may be displaced by automation and need to transition jobs by 2030.",
      sourceUrl: "https://www.weforum.org/stories/2017/12/robots-coming-for-800-million-jobs/",
    },
  ]

  return (
    <section id="intro" ref={ref} className="py-32 md:py-48 px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <motion.span
          className="text-sm font-medium tracking-widest uppercase text-accent block mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          01 — The Shift
        </motion.span>

        {/* Large Statement */}
        <motion.h2
          className="font-serif text-3xl md:text-5xl lg:text-6xl leading-tight max-w-4xl mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          We stand at the threshold of the most significant economic transformation in human history.
        </motion.h2>

        {/* Description */}
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.p
            className="text-muted-foreground text-lg leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            For millennia, human labor has been the foundation of economic value. But as artificial intelligence and
            automation advance, we face a fundamental question: what happens when machines can perform most jobs better
            and cheaper than humans?
          </motion.p>

          <motion.p
            className="text-muted-foreground text-lg leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Post-labor economics explores the systems, policies, and philosophies that could guide humanity through this
            transition—toward either shared abundance or concentrated scarcity.
          </motion.p>
        </div>

        {/* Stats with Expandable Citations */}
        <div className="grid md:grid-cols-3 gap-6 mt-24">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} delay={0.4 + i * 0.1} isInView={isInView} />
          ))}
        </div>

        <motion.p
          className="text-xs text-muted-foreground/60 mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Click each statistic to view source citation
        </motion.p>
      </div>
    </section>
  )
}
