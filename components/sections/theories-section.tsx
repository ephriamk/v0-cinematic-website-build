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
        text: "Automation will cause widespread job losses... a $1,000/month UBI would help workers survive the shockwaves of automation and maintain basic economic stability.",
        author: "Andrew Yang",
        source: "CNN/Business Insider",
        sourceUrl: "https://www.businessinsider.com/andrew-yang-ai-may-wipe-out-40-million-us-jobs-2025-12",
      },
      {
        text: "We're all the ones who trained AI... we should receive our cut of all of this productivity growth.",
        author: "Scott Santens",
        source: "WBUR On Point",
        sourceUrl: "https://www.wbur.org/onpoint/2024/09/02/ai-universal-basic-income-economy-artificial-intelligence",
      },
      {
        text: "UBI is a powerful instrument of social justice that would promote real freedom for all by providing the material resources that people need to pursue their aims.",
        author: "Philippe Van Parijs",
        source: "Boston Review",
        sourceUrl: "https://www.bostonreview.net/forum/ubi-van-parijs/",
      },
    ],
  },
  {
    number: "02",
    title: "Robot Taxation",
    description:
      "Taxing automated labor at rates similar to human labor, creating funding for social programs and worker transition support.",
    quotes: [
      {
        text: "If a robot replaces a $50k worker, you'd think that we'd tax the robot at a similar level... we'd be willing to slow down the speed of automation to fund worker retraining.",
        author: "Bill Gates",
        source: "World Economic Forum",
        sourceUrl: "https://www.weforum.org/stories/2017/02/bill-gates-this-is-why-we-should-tax-robots/",
      },
      {
        text: "Automation could eliminate up to 47% of jobs in the next 20 years... Millions of jobs will be lost – but if we prepare now, we can create new opportunities through training, education and smart investments.",
        author: "Jane Kim",
        source: "McDonald Hopkins",
        sourceUrl: "https://www.mcdonaldhopkins.com/insights/news/California-San-Francisco-explores-the-need-for-a-r",
      },
      {
        text: "If a machine replaces a man and creates wealth, there is no reason that wealth should not be taxed.",
        author: "Benoît Hamon",
        source: "CIAT",
        sourceUrl: "https://www.ciat.org/taxes-on-robots/?lang=en",
      },
    ],
  },
  {
    number: "03",
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
        text: "Alaska's Permanent Fund invests oil revenues and has paid every Alaskan an annual dividend—$1,100 per resident in 2017, with earlier years over $2,000.",
        author: "Alaska Permanent Fund",
        source: "People's Policy Project",
        sourceUrl: "https://www.peoplespolicyproject.org/projects/social-wealth-fund/",
      },
    ],
  },
  {
    number: "04",
    title: "Reduced Work Week",
    description:
      "Distributing remaining human work more evenly through shorter standard hours, maintaining employment while sharing productivity gains.",
    quotes: [
      {
        text: "We could cut the working week by a third and be just as rich – probably richer! Eventually we should aim for a 15-hour week.",
        author: "Rutger Bregman",
        source: "The Guardian",
        sourceUrl:
          "https://www.theguardian.com/books/2017/feb/26/rutger-bregman-utopia-for-realists-interview-universal-basic-income",
      },
      {
        text: "A 21-hour week would reduce stress and overwork, making people less stressed, more in control, happier in our jobs and more productive.",
        author: "Anna Coote, New Economics Foundation",
        source: "Personnel Today",
        sourceUrl:
          "https://www.personneltoday.com/hr/21-hour-working-week-could-cut-unemployment-and-boost-productivity-says-nef/",
      },
    ],
  },
  {
    number: "05",
    title: "Care Economy",
    description:
      "Recognizing and compensating caregiving, education, and community work as essential contributions to society and the economy.",
    quotes: [
      {
        text: "Care is a vital and fundamental ingredient to a thriving future economy. Society must finally recognize that care is valuable and a shared need worthy of support.",
        author: "Ai-jen Poo",
        source: "Rockefeller Foundation",
        sourceUrl:
          "https://www.rockefellerfoundation.org/bellagio-breakthroughs/ai-jen-poo-on-transforming-the-care-economy/",
      },
      {
        text: "By denying housework a wage and transforming it into an act of love, capital has... got a hell of a lot of work almost for free.",
        author: "Silvia Federici",
        source: "Wages Against Housework",
        sourceUrl: "https://caringlabor.wordpress.com/2010/09/15/silvia-federici-wages-against-housework/",
      },
    ],
  },
  {
    number: "06",
    title: "Post-Scarcity Models",
    description:
      "Reimagining economics for a world where technology makes essentials abundant and traditional market logic breaks down.",
    quotes: [
      {
        text: "The acquisition of wealth is no longer the driving force in our lives. We work to better ourselves and the rest of humanity.",
        author: "Captain Picard, Star Trek",
        source: "Star Trek: First Contact",
        sourceUrl: "https://mb21.github.io/blog/2014/07/06/money-in-the-star-trek-universe",
      },
      {
        text: "New technologies could liberate us from work... automation is the path to a world of liberty, luxury and happiness beyond scarcity.",
        author: "Aaron Bastani",
        source: "Fully Automated Luxury Communism",
        sourceUrl: "https://www.versobooks.com/products/476-fully-automated-luxury-communism",
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
