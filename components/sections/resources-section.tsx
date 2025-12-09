"use client"

import { motion } from "framer-motion"
import { ExternalLink, FileText, BookOpen, Mic, Video } from "lucide-react"

const resources = [
  {
    category: "Research & Studies",
    icon: FileText,
    items: [
      {
        title: "47% of U.S. Jobs at Risk of Automation",
        source: "Axios / Frey & Osborne Study",
        url: "https://www.axios.com/2017/12/15/expert-doubles-down-robots-still-threaten-47-of-us-jobs-1513305167",
        description: "Oxford economists' landmark automation risk analysis",
      },
      {
        title: "AI to Add $15.7 Trillion to Global GDP",
        source: "World Economic Forum / PwC",
        url: "https://www.weforum.org/stories/2017/06/the-global-economy-will-be-14-bigger-in-2030-because-of-ai/",
        description: "PwC's 'Sizing the Prize' report on AI economic impact",
      },
      {
        title: "800 Million Workers May Be Displaced",
        source: "World Economic Forum / McKinsey",
        url: "https://www.weforum.org/stories/2017/12/robots-coming-for-800-million-jobs/",
        description: "McKinsey Global Institute workforce transition study",
      },
      {
        title: "Social Wealth Fund for America",
        source: "People's Policy Project",
        url: "https://www.peoplespolicyproject.org/projects/social-wealth-fund/",
        description: "Matt Bruenig's proposal for universal dividends",
      },
    ],
  },
  {
    category: "Books & Essays",
    icon: BookOpen,
    items: [
      {
        title: "Fully Automated Luxury Communism: A Manifesto",
        source: "Aaron Bastani / Verso Books",
        url: "https://www.versobooks.com/products/476-fully-automated-luxury-communism",
        description: "A vision for post-scarcity abundance",
      },
      {
        title: "A Basic Income for All",
        source: "Philippe Van Parijs / Boston Review",
        url: "https://www.bostonreview.net/forum/ubi-van-parijs/",
        description: "Philosophical case for universal basic income",
      },
      {
        title: "Wages Against Housework",
        source: "Silvia Federici",
        url: "https://caringlabor.wordpress.com/2010/09/15/silvia-federici-wages-against-housework/",
        description: "Marxist feminist critique of unpaid care work",
      },
      {
        title: "Utopia for Realists",
        source: "Rutger Bregman / The Guardian",
        url: "https://www.theguardian.com/books/2017/feb/26/rutger-bregman-utopia-for-realists-interview-universal-basic-income",
        description: "Case for UBI and the 15-hour work week",
      },
    ],
  },
  {
    category: "Interviews & Podcasts",
    icon: Mic,
    items: [
      {
        title: "Andrew Yang on AI and Job Displacement",
        source: "Business Insider",
        url: "https://www.businessinsider.com/andrew-yang-ai-may-wipe-out-40-million-us-jobs-2025-12",
        description: "Yang warns AI may eliminate 40 million U.S. jobs",
      },
      {
        title: "Is AI the Best Argument for UBI?",
        source: "WBUR On Point / Scott Santens",
        url: "https://www.wbur.org/onpoint/2024/09/02/ai-universal-basic-income-economy-artificial-intelligence",
        description: "UBI activist on tech dividends as income",
      },
      {
        title: "Ai-jen Poo on Transforming the Care Economy",
        source: "Rockefeller Foundation",
        url: "https://www.rockefellerfoundation.org/bellagio-breakthroughs/ai-jen-poo-on-transforming-the-care-economy/",
        description: "Vision for valuing care work in the economy",
      },
      {
        title: "Bill Gates: Why We Should Tax Robots",
        source: "World Economic Forum",
        url: "https://www.weforum.org/stories/2017/02/bill-gates-this-is-why-we-should-tax-robots/",
        description: "Gates proposes robot taxation for worker retraining",
      },
    ],
  },
  {
    category: "Policy & Analysis",
    icon: Video,
    items: [
      {
        title: "San Francisco Explores Robot Tax",
        source: "McDonald Hopkins",
        url: "https://www.mcdonaldhopkins.com/insights/news/California-San-Francisco-explores-the-need-for-a-r",
        description: "Jane Kim's 'Jobs of the Future Fund' initiative",
      },
      {
        title: "Taxes on Robots: International Perspectives",
        source: "CIAT",
        url: "https://www.ciat.org/taxes-on-robots/?lang=en",
        description: "Global analysis of robot taxation proposals",
      },
      {
        title: "21-Hour Working Week Proposal",
        source: "Personnel Today / NEF",
        url: "https://www.personneltoday.com/hr/21-hour-working-week-could-cut-unemployment-and-boost-productivity-says-nef/",
        description: "New Economics Foundation's reduced work week study",
      },
      {
        title: "Money in the Star Trek Universe",
        source: "Post-Scarcity Economics",
        url: "https://mb21.github.io/blog/2014/07/06/money-in-the-star-trek-universe",
        description: "Fictional model for post-scarcity society",
      },
    ],
  },
]

export function ResourcesSection() {
  return (
    <section id="resources" className="py-32 md:py-48 px-6 md:px-12 lg:px-16 bg-card">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-16"
        >
          <span className="text-sm font-medium tracking-widest uppercase text-accent mb-4 block">04 — Resources</span>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-tight mb-6">Sources & Further Reading</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Primary sources, research papers, and key voices cited throughout this site. All claims link back to their
            original sources.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {resources.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.8,
                delay: categoryIndex * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="bg-background border border-border/50 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-serif text-xl">{category.category}</h3>
              </div>

              <div className="space-y-1">
                {category.items.map((item) => (
                  <motion.a
                    key={item.title}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group p-4 -mx-4 hover:bg-muted/50 transition-colors"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-medium text-foreground group-hover:text-accent transition-colors mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-1">{item.description}</p>
                        <span className="text-xs text-accent/70">{item.source}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
