"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export function CtaSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-32 md:py-48 px-6 md:px-12 lg:px-16 bg-card">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="text-sm font-medium tracking-widest uppercase text-accent block mb-8">
            The Choice Is Ours
          </span>

          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight mb-8">
            Technology is not destiny.
            <br />
            <span className="italic font-light text-muted-foreground">Policy is.</span>
          </h2>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            The future of work is not predetermined. The choices we make today about ownership, distribution, and
            governance will shape whether automation liberates or oppresses.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="#theories"
              className="px-8 py-4 bg-foreground text-background font-medium tracking-wide text-sm uppercase hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Frameworks
            </motion.a>
            <motion.a
              href="#futures"
              className="px-8 py-4 border border-border font-medium tracking-wide text-sm uppercase hover:border-foreground transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Compare Futures
            </motion.a>
          </div>
        </motion.div>

        {/* Decorative Quote */}
        <motion.blockquote
          className="mt-24 pt-16 border-t border-border"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <p className="font-serif text-xl md:text-2xl italic text-muted-foreground max-w-3xl mx-auto">
            "The question is not whether machines will replace human labor, but whether we will share the abundance they
            create."
          </p>
          <cite className="block mt-6 text-sm tracking-widest uppercase not-italic text-accent">
            — The Post-Labor Manifesto
          </cite>
        </motion.blockquote>
      </div>
    </section>
  )
}
