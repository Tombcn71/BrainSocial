"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BrainCircuitIcon, SparklesIcon } from "lucide-react"
import { dict } from "@/lib/dictionary"

export default function HomeContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full gradient-bg-1 flex items-center justify-center">
              <BrainCircuitIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-brand-purple">SocialAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              {dict.landing.pricing.title}
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
              Blog
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hover:text-primary transition-colors">
                {dict.common.login}
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="btn-gradient text-white rounded-full px-6">{dict.common.signup}</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-10 z-0"></div>
          <div className="container flex flex-col items-center text-center relative z-10">
            <div className="absolute top-0 right-0 -translate-y-1/2 w-64 h-64 bg-brand-purple/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 w-64 h-64 bg-brand-pink/10 rounded-full blur-3xl"></div>

            <div className="flex items-center justify-center mb-6 space-x-2">
              <SparklesIcon className="h-6 w-6 text-brand-purple animate-pulse-light" />
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple">
                AI-Powered Content Creation
              </span>
              <SparklesIcon className="h-6 w-6 text-brand-purple animate-pulse-light" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-brand-purple">
              {dict.landing.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl">{dict.landing.subtitle}</p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="btn-gradient text-white rounded-full px-8 h-12">
                  {dict.landing.cta}
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-12 border-2 hover:bg-brand-purple/5">
                  Bekijk demo
                </Button>
              </Link>
            </div>

            {/* Rest of the home page content */}
          </div>
        </section>
        {/* More sections... */}
      </main>
      <footer className="border-t py-12 bg-white">{/* Footer content */}</footer>
    </div>
  )
}
