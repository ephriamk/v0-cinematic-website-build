"use client"

import { motion } from "framer-motion"
import { Twitter } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const links = [
    { label: "Back to Top", href: "#" },
    { label: "Futures", href: "#futures" },
    { label: "Theories", href: "#theories" },
    { label: "Resources", href: "#resources" },
  ]

  return (
    <footer className="py-16 md:py-24 px-6 md:px-12 lg:px-16 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12 md:gap-8">
          {/* Logo / Title */}
          <div className="md:col-span-4">
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-serif text-2xl md:text-3xl">
                Post-Labor
                <br />
                <span className="italic font-light text-accent">Economics</span>
              </h3>
              <span className="inline-block mt-2 px-3 py-1 bg-accent/20 border border-accent/40 rounded text-accent text-sm font-bold tracking-wide">
                $PLE
              </span>
            </motion.div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Exploring the economic systems that will define humanity's relationship with work in the age of
              automation.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 md:col-start-6">
            <span className="text-xs tracking-widest uppercase text-muted-foreground block mb-4">Navigate</span>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-foreground/70 hover:text-foreground transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div className="md:col-span-2">
            <span className="text-xs tracking-widest uppercase text-muted-foreground block mb-4">Community</span>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://x.com/i/communities/1997365593889177684"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-accent transition-colors duration-300 text-sm flex items-center gap-2"
                >
                  <Twitter className="w-4 h-4" />
                  X Community
                </a>
              </li>
              <li>
                <a
                  href="https://pump.fun/coin/6zLA3vRBE348wkuzkkxqhChzQdfzX748xcc53Z2Dpump"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-accent transition-colors duration-300 text-sm"
                >
                  PumpFun
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2">
            <span className="text-xs tracking-widest uppercase text-muted-foreground block mb-4">Resources</span>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://basicincome.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-foreground transition-colors duration-300 text-sm"
                >
                  Basic Income Earth
                </a>
              </li>
              <li>
                <a
                  href="https://futureoflife.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-foreground transition-colors duration-300 text-sm"
                >
                  Future of Life
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Post-Labor Economics ($PLE). All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">Built with curiosity about the future.</p>
        </div>
      </div>
    </footer>
  )
}
