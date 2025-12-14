"use client"

import { motion } from "framer-motion"
import { ExternalLink, FileText, BookOpen, Mic, Video } from "lucide-react"

const resources = [
  {
    category: "Research & Studies",
    icon: FileText,
    items: [
      {
        title: "Future of Jobs Report 2025",
        source: "World Economic Forum (2025)",
        url: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/",
        description: "92M jobs displaced, 170M new roles created by 2030",
      },
      {
        title: "AI Will Transform 40% of Global Jobs",
        source: "IMF / Kristalina Georgieva (2024)",
        url: "https://www.imf.org/en/Blogs/Articles/2024/01/14/ai-will-transform-the-global-economy-lets-make-sure-it-benefits-humanity",
        description: "IMF analysis on AI's impact on global employment",
      },
      {
        title: "Global AI Jobs Barometer 2025",
        source: "PwC (2025)",
        url: "https://www.pwc.com/gx/en/news-room/press-releases/2025/ai-linked-to-a-fourfold-increase-in-productivity-growth.html",
        description: "AI skills command 56% wage premium, 4x productivity growth",
      },
      {
        title: "AI Index Report 2024",
        source: "Stanford HAI (2024)",
        url: "https://hai.stanford.edu/ai-index",
        description: "Comprehensive annual report on AI progress and policy",
      },
    ],
  },
  {
    category: "Policy & UBI Initiatives",
    icon: BookOpen,
    items: [
      {
        title: "Countries Testing Universal Basic Income",
        source: "Newsweek (2025)",
        url: "https://www.newsweek.com/countries-testing-universal-basic-income-2025-2103428",
        description: "South Korea, Wales, and India pilot programs",
      },
      {
        title: "Universal Basic Income: A Business Case for AI Era",
        source: "Forbes (2025)",
        url: "https://www.forbes.com/sites/corneliawalther/2025/06/04/universal-basic-income-a-business-case-for-the-ai-era/",
        description: "McKinsey data on automation adding 3 hours/day",
      },
      {
        title: "Is AI the Best Argument for UBI?",
        source: "WBUR On Point (2024)",
        url: "https://www.wbur.org/onpoint/2024/09/02/ai-universal-basic-income-economy-artificial-intelligence",
        description: "Scott Santens on tech dividends as income",
      },
      {
        title: "Taiwan's Universal Cash Payments",
        source: "Basic Income Earth (2025)",
        url: "https://basicincome.org/news/2025/08/",
        description: "NT$10,000 universal payment to all citizens",
      },
    ],
  },
  {
    category: "Economic Impact",
    icon: Mic,
    items: [
      {
        title: "IMF World Economic Outlook 2025",
        source: "IMF (2025)",
        url: "https://www.imf.org/en/Publications/WEO/Issues/2025/04/22/world-economic-outlook-april-2025",
        description: "Global economic analysis amid policy shifts",
      },
      {
        title: "AI Automating Tech Jobs",
        source: "Fortune (2025)",
        url: "https://fortune.com/2025/09/09/bls-revisions-nearly-a-million-fewer-jobs-ai-automating-tech/",
        description: "BLS data shows AI impact on tech employment",
      },
      {
        title: "US Banks Say AI Will Cut Jobs",
        source: "Reuters (2025)",
        url: "https://www.reuters.com/business/finance/us-bank-executives-say-ai-will-boost-productivity-cut-jobs-2025-12-09/",
        description: "JPMorgan, Wells Fargo report AI productivity gains",
      },
      {
        title: "41% of Employers Plan AI Replacement",
        source: "CNBC (2025)",
        url: "https://www.cnbc.com/2025/02/26/as-many-as-41percent-of-employers-plan-to-use-ai-to-replace-roles-says-new-report.html",
        description: "Growing trend of AI integration in workplace",
      },
    ],
  },
  {
    category: "Workforce Trends",
    icon: Video,
    items: [
      {
        title: "AI Impact on Young Workers",
        source: "Stanford / CNBC (2025)",
        url: "https://www.cnbc.com/2025/08/28/generative-ai-reshapes-us-job-market-stanford-study-shows-entry-level-young-workers.html",
        description: "13% employment decline for ages 22-25 in AI-exposed jobs",
      },
      {
        title: "78% of Organizations Now Using AI",
        source: "U.S. Census Bureau (2025)",
        url: "https://www.census.gov/library/stories/2025/09/technology-impact.html",
        description: "AI adoption up from 55% the previous year",
      },
      {
        title: "Social Wealth Fund for America",
        source: "People's Policy Project",
        url: "https://www.peoplespolicyproject.org/projects/social-wealth-fund/",
        description: "Blueprint for universal citizen dividends",
      },
      {
        title: "AI Job Creation Statistics 2025",
        source: "SQ Magazine (2025)",
        url: "https://sqmagazine.co.uk/ai-job-creation-statistics/",
        description: "85M jobs displaced, 97M new roles projected",
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
