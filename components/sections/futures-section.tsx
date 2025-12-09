"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"

export function FuturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeTab, setActiveTab] = useState<"abundance" | "scarcity">("abundance")

  const futures = {
    abundance: {
      title: "Shared Abundance",
      subtitle: "The optimistic path",
      color: "text-emerald-400",
      borderColor: "border-emerald-400/30",
      bgColor: "bg-emerald-400/5",
      points: [
        {
          title: "Universal Basic Income",
          description: "Every citizen receives enough to live with dignity, funded by automation productivity.",
        },
        {
          title: "Democratized Capital",
          description: "Ownership of automated production is distributed broadly through sovereign wealth funds.",
        },
        {
          title: "Freedom to Create",
          description: "Liberated from survival labor, humans pursue art, science, relationships, and meaning.",
        },
        {
          title: "Sustainable Systems",
          description: "Automated efficiency enables regenerative practices and environmental restoration.",
        },
      ],
    },
    scarcity: {
      title: "Concentrated Scarcity",
      subtitle: "The cautionary path",
      color: "text-red-400",
      borderColor: "border-red-400/30",
      bgColor: "bg-red-400/5",
      points: [
        {
          title: "Wealth Concentration",
          description: "Automation profits flow to a shrinking elite who own the machines.",
        },
        {
          title: "Mass Displacement",
          description: "Billions lose economic relevance with no viable alternatives offered.",
        },
        {
          title: "Surveillance Economy",
          description: "Those without capital become dependent on systems that monitor and control.",
        },
        {
          title: "Social Fragmentation",
          description: "Inequality breeds instability, tribalism, and authoritarian responses.",
        },
      ],
    },
  }

  const active = futures[activeTab]

  return (
    <section id="futures" ref={ref} className="py-32 md:py-48 px-6 md:px-12 lg:px-16 bg-card">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <motion.span
          className="text-sm font-medium tracking-widest uppercase text-accent block mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          02 — Two Futures
        </motion.span>

        {/* Heading */}
        <motion.h2
          className="font-serif text-3xl md:text-5xl lg:text-6xl leading-tight max-w-3xl mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          The same technology. Two vastly different outcomes.
        </motion.h2>

        {/* Tab Switcher */}
        <motion.div
          className="flex gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <button
            onClick={() => setActiveTab("abundance")}
            className={`px-6 py-3 text-sm font-medium tracking-wide uppercase transition-all duration-300 border ${
              activeTab === "abundance"
                ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-400"
                : "border-border text-muted-foreground hover:border-foreground/30"
            }`}
          >
            Shared Abundance
          </button>
          <button
            onClick={() => setActiveTab("scarcity")}
            className={`px-6 py-3 text-sm font-medium tracking-wide uppercase transition-all duration-300 border ${
              activeTab === "scarcity"
                ? "border-red-400/50 bg-red-400/10 text-red-400"
                : "border-border text-muted-foreground hover:border-foreground/30"
            }`}
          >
            Concentrated Scarcity
          </button>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`border ${active.borderColor} ${active.bgColor} p-8 md:p-12`}
        >
          <div className="mb-12">
            <span className={`text-sm tracking-widest uppercase ${active.color}`}>{active.subtitle}</span>
            <h3 className={`font-serif text-3xl md:text-4xl mt-2 ${active.color}`}>{active.title}</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {active.points.map((point, i) => (
              <div key={i} className="group">
                <div className="flex items-start gap-4">
                  <span className={`text-sm font-mono ${active.color} opacity-50`}>0{i + 1}</span>
                  <div>
                    <h4 className="font-medium text-lg mb-2">{point.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{point.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
