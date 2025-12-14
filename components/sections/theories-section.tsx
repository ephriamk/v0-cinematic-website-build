"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import { ChevronDown, ExternalLink, Quote } from "lucide-react"

interface TheoryCardProps {
  theory: {
    number: string
    title: string
    description: string
    quotes: Array<{
      text: string
      author: string
      source: string
      sourceUrl: string
    }>
  }
  index: number
  isInView: boolean
}

function TheoryCard({ theory, index, isInView }: TheoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      className="border-t border-border"
    >
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full py-8 md:py-12 text-left group">
        <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Number */}
          <div className="md:col-span-1">
            <span className="font-mono text-sm text-accent">{theory.number}</span>
          </div>

          {/* Title */}
          <div className="md:col-span-4">
            <h3 className="font-serif text-2xl md:text-3xl group-hover:text-accent transition-colors duration-300">
              {theory.title}
            </h3>
          </div>

          {/* Description */}
          <div className="md:col-span-6">
            <p className="text-muted-foreground leading-relaxed">{theory.description}</p>
          </div>

          {/* Expand Button */}
          <div className="md:col-span-1 flex justify-end">
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-accent/50 transition-colors"
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
            </motion.div>
          </div>
        </div>
      </button>

      {/* Expandable Quotes Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-12 pl-0 md:pl-[8.33%] grid gap-6">
              {theory.quotes.map((quote, i) => (
                <div key={i} className="bg-card border border-border/50 p-6 md:p-8 relative">
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-accent/20" />
                  <blockquote className="font-serif text-lg md:text-xl text-foreground/90 leading-relaxed mb-4 italic">
                    "{quote.text}"
                  </blockquote>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="font-medium text-accent">{quote.author}</span>
                    <a
                      href={quote.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                      {quote.source} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const theories = [
  {
    number: "01",
    title: "Universal Basic Income",
    description:
      "Regular unconditional payments to all citizens, ensuring everyone can meet basic needs regardless of employment status.",
    quotes: [
      {
        text: "AI will affect almost 40 percent of jobs around the world, replacing some and complementing others. We need a careful balance of policies to tap its potential.",
        author: "Kristalina Georgieva",
        source: "IMF (2024)",
        sourceUrl: "https://www.imf.org/en/Blogs/Articles/2024/01/14/ai-will-transform-the-global-economy-lets-make-sure-it-benefits-humanity",
      },
      {
        text: "We're all the ones who trained AI... we should receive our cut of all of this productivity growth.",
        author: "Scott Santens",
        source: "WBUR On Point (2024)",
        sourceUrl: "https://www.wbur.org/onpoint/2024/09/02/ai-universal-basic-income-economy-artificial-intelligence",
      },
      {
        text: "Several countries are now conducting UBI pilot programs including South Korea, Wales, and India to address economic inequality and automation-driven unemployment.",
        author: "Global UBI Initiatives",
        source: "Newsweek (2025)",
        sourceUrl: "https://www.newsweek.com/countries-testing-universal-basic-income-2025-2103428",
      },
    ],
  },
  {
    number: "02",
    title: "AI & Workforce Transformation",
    description:
      "Understanding how AI reshapes employment, requiring new policies for worker transition and economic stability.",
    quotes: [
      {
        text: "The WEF Future of Jobs Report 2025 projects 92 million jobs will be displaced while 170 million new roles emerge—a net gain of 78 million jobs by 2030.",
        author: "World Economic Forum",
        source: "Future of Jobs Report (2025)",
        sourceUrl: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/",
      },
      {
        text: "Workers aged 22 to 25 in AI-exposed occupations like customer service and software development experienced a 13% decline in employment since 2022.",
        author: "Stanford University",
        source: "CNBC (2025)",
        sourceUrl: "https://www.cnbc.com/2025/08/28/generative-ai-reshapes-us-job-market-stanford-study-shows-entry-level-young-workers.html",
      },
      {
        text: "As many as 41% of employers plan to use AI to replace roles, highlighting the accelerating trend of AI integration in the workplace.",
        author: "Employer Survey",
        source: "CNBC (2025)",
        sourceUrl: "https://www.cnbc.com/2025/02/26/as-many-as-41percent-of-employers-plan-to-use-ai-to-replace-roles-says-new-report.html",
      },
    ],
  },
  {
    number: "03",
    title: "Productivity & Wages",
    description:
      "AI is creating unprecedented productivity gains while reshaping compensation structures for skilled workers.",
    quotes: [
      {
        text: "Workers with AI skills observed an average wage premium of 56% in 2024, up from 25% the previous year, as AI reshapes labor market value.",
        author: "PwC",
        source: "Global AI Jobs Barometer (2025)",
        sourceUrl: "https://www.pwc.com/gx/en/news-room/press-releases/2025/ai-linked-to-a-fourfold-increase-in-productivity-growth.html",
      },
      {
        text: "Industries most exposed to AI have seen a fourfold increase in productivity growth, from 7% (2018-2022) to 27% (2018-2024).",
        author: "PwC",
        source: "Global AI Jobs Barometer (2025)",
        sourceUrl: "https://www.pwc.com/gx/en/news-room/press-releases/2025/ai-linked-to-a-fourfold-increase-in-productivity-growth.html",
      },
      {
        text: "Major U.S. banks including JPMorgan Chase and Wells Fargo report significant productivity gains due to AI adoption, with implications for workforce restructuring.",
        author: "Banking Industry",
        source: "Reuters (2025)",
        sourceUrl: "https://www.reuters.com/business/finance/us-bank-executives-say-ai-will-boost-productivity-cut-jobs-2025-12-09/",
      },
    ],
  },
  {
    number: "04",
    title: "Enterprise AI Adoption",
    description:
      "Organizations are rapidly integrating AI, fundamentally changing how businesses operate and employ workers.",
    quotes: [
      {
        text: "78% of organizations reported using AI in 2024, up from 55% the previous year, marking rapid enterprise adoption across industries.",
        author: "U.S. Census Bureau",
        source: "Census.gov (2025)",
        sourceUrl: "https://www.census.gov/library/stories/2025/09/technology-impact.html",
      },
      {
        text: "Automation could increase up to three hours per day, significantly affecting sectors like office support, customer service, and food service.",
        author: "McKinsey",
        source: "Forbes (2025)",
        sourceUrl: "https://www.forbes.com/sites/corneliawalther/2025/06/04/universal-basic-income-a-business-case-for-the-ai-era/",
      },
      {
        text: "The U.S. economy added nearly one million fewer jobs than estimated, with the information sector experiencing 3% decline—evidence AI is automating tech jobs.",
        author: "Bureau of Labor Statistics",
        source: "Fortune (2025)",
        sourceUrl: "https://fortune.com/2025/09/09/bls-revisions-nearly-a-million-fewer-jobs-ai-automating-tech/",
      },
    ],
  },
  {
    number: "05",
    title: "Sovereign Wealth Funds",
    description:
      "Public ownership stakes in automated industries, distributing productivity gains as universal dividends to all citizens.",
    quotes: [
      {
        text: "A dividend-paying social wealth fund provides a natural solution to inequality by collectively owning assets and paying out a universal basic dividend to every citizen.",
        author: "Matt Bruenig",
        source: "People's Policy Project",
        sourceUrl: "https://www.peoplespolicyproject.org/projects/social-wealth-fund/",
      },
      {
        text: "Taiwan announced its second universal cash payment to all citizens in 2025, providing NT$10,000 (approximately $300 USD) to address economic uncertainties.",
        author: "Taiwan Government",
        source: "Basic Income Earth (2025)",
        sourceUrl: "https://basicincome.org/news/2025/08/",
      },
    ],
  },
  {
    number: "06",
    title: "Global Economic Outlook",
    description:
      "Understanding the broader economic context as AI transforms markets, trade, and growth patterns worldwide.",
    quotes: [
      {
        text: "Global growth is projected at 3.2% for 2025, with AI and automation reshaping economic dynamics across all major economies.",
        author: "IMF",
        source: "World Economic Outlook (2025)",
        sourceUrl: "https://www.imf.org/en/Publications/WEO/Issues/2025/04/22/world-economic-outlook-april-2025",
      },
      {
        text: "AI-driven automation will displace approximately 85 million jobs globally by 2025, but create around 97 million new roles—a net gain of 12 million jobs.",
        author: "Industry Analysis",
        source: "SQ Magazine (2025)",
        sourceUrl: "https://sqmagazine.co.uk/ai-job-creation-statistics/",
      },
    ],
  },
]

export function TheoriesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="theories" ref={ref} className="py-32 md:py-48 px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <motion.span
          className="text-sm font-medium tracking-widest uppercase text-accent block mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          03 — Economic Frameworks
        </motion.span>

        {/* Heading */}
        <motion.h2
          className="font-serif text-3xl md:text-5xl lg:text-6xl leading-tight max-w-4xl mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Ideas shaping the post-labor conversation
        </motion.h2>

        <motion.p
          className="text-muted-foreground text-lg max-w-2xl mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Economists, technologists, and policy makers are proposing frameworks for navigating the transition. Click
          each topic to explore key voices and sources.
        </motion.p>

        {/* Theories List */}
        <div>
          {theories.map((theory, i) => (
            <TheoryCard key={theory.number} theory={theory} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}
