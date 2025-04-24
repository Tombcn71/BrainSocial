import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BrainCircuitIcon,
  SparklesIcon,
  CalendarIcon,
  RocketIcon,
  BarChart3Icon,
  CheckIcon,
  LinkedinIcon,
  TwitterIcon,
  InstagramIcon,
  FacebookIcon,
} from "lucide-react";

// Simple dictionary for the page
const dict = {
  common: {
    login: "Inloggen",
    signup: "Aanmelden",
  },
  landing: {
    title: " Smart Social Media Management",
    subtitle: "Genereer, plan en publiceer social media content met AI",
    cta: "Begin nu",
    features: {
      ai: "AI Content Generatie",
      calendar: "Content Kalender",
      publish: "Direct Publiceren",
      analytics: "Content Analytics",
    },
    pricing: {
      title: "Abonnementen",
      starter: {
        name: "Starter",
        price: "€9,99",
        period: "per maand",
        features: [
          "5 AI generaties per dag",
          "Basis content kalender",
          "1 social media kanaal",
        ],
      },
      pro: {
        name: "Pro",
        price: "€19,99",
        period: "per maand",
        features: [
          "20 AI generaties per dag",
          "Geavanceerde content kalender",
          "3 social media kanalen",
          "Analytics dashboard",
        ],
      },
      business: {
        name: "Business",
        price: "€49,99",
        period: "per maand",
        features: [
          "Onbeperkte AI generaties",
          "Premium content kalender",
          "Onbeperkte social media kanalen",
          "Geavanceerde analytics",
          "Prioriteit ondersteuning",
        ],
      },
    },
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full gradient-bg-1 flex items-center justify-center">
              <BrainCircuitIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#8A4FFF]">
              BrainSocial
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary transition-colors">
              {dict.landing.pricing.title}
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium hover:text-primary transition-colors">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="hover:text-primary transition-colors">
                {dict.common.login}
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="btn-gradient text-white rounded-full px-6">
                {dict.common.signup}
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-10 z-0"></div>
          <div className="container flex flex-col items-center text-center relative z-10">
            <div className="absolute top-0 right-0 -translate-y-1/2 w-64 h-64 bg-[#8A4FFF]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 w-64 h-64 bg-[#FF4F8A]/10 rounded-full blur-3xl"></div>

            <div className="flex items-center justify-center mb-6 space-x-2">
              <SparklesIcon className="h-6 w-6 text-[#8A4FFF] animate-pulse-light" />
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-[#8A4FFF]/10 text-[#8A4FFF]">
                AI-Powered Content Creatie
              </span>
              <SparklesIcon className="h-6 w-6 text-[#8A4FFF] animate-pulse-light" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-[#8A4FFF]">
              {dict.landing.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl">
              {dict.landing.subtitle}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="btn-gradient text-white rounded-full px-8 h-12">
                  {dict.landing.cta}
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 h-12 border-2 hover:bg-[#8A4FFF]/5">
                  Bekijk demo
                </Button>
              </Link>
            </div>

            {/* User avatars section directly after the buttons */}

            <div className="mt-16 flex items-center justify-center gap-8">
              <div className="flex -space-x-4">
                <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                  JD
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-pink flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                  MK
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                  TS
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                  RV
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                  +
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Meer dan{" "}
                <span className="font-bold text-foreground">1,000+</span>{" "}
                content creators vertrouwen op ons
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 wave-pattern opacity-10 z-0"></div>
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Creëer content voor alle platforms
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Genereer professionele content voor al je social media kanalen
                met één klik
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-brand-purple/10 hover:shadow-xl transition-all hover:-translate-y-1 group">
                <div className="h-14 w-14 rounded-full gradient-bg-1 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BrainCircuitIcon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  {dict.landing.features.ai}
                </h3>
                <p className="text-muted-foreground">
                  Genereer content voor verschillende platforms met AI die jouw
                  merk begrijpt.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-brand-blue/10 hover:shadow-xl transition-all hover:-translate-y-1 group">
                <div className="h-14 w-14 rounded-full gradient-bg-2 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CalendarIcon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  {dict.landing.features.calendar}
                </h3>
                <p className="text-muted-foreground">
                  Plan en organiseer je content met onze intuïtieve kalender.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-brand-green/10 hover:shadow-xl transition-all hover:-translate-y-1 group">
                <div className="h-14 w-14 rounded-full gradient-bg-2 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <RocketIcon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  {dict.landing.features.publish}
                </h3>
                <p className="text-muted-foreground">
                  Publiceer direct naar verschillende social media platforms.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-brand-orange/10 hover:shadow-xl transition-all hover:-translate-y-1 group">
                <div className="h-14 w-14 rounded-full gradient-bg-3 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  {dict.landing.features.analytics}
                </h3>
                <p className="text-muted-foreground">
                  Analyseer de prestaties van je content met duidelijke
                  inzichten.
                </p>
              </div>
            </div>

            <div className="mt-16 flex flex-wrap justify-center gap-8">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white shadow-md">
                <InstagramIcon className="h-8 w-8 text-brand-pink" />
              </div>
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white shadow-md">
                <TwitterIcon className="h-8 w-8 text-brand-blue" />
              </div>
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white shadow-md">
                <LinkedinIcon className="h-8 w-8 text-brand-purple" />
              </div>
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white shadow-md">
                <FacebookIcon className="h-8 w-8 text-brand-blue" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-brand-purple/5 to-brand-pink/5 relative">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              {dict.landing.pricing.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Starter Plan */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-brand-purple/10">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">
                      {dict.landing.pricing.starter.name}
                    </h3>
                    <div className="h-10 w-10 rounded-full bg-brand-purple/10 flex items-center justify-center">
                      <SparklesIcon className="h-5 w-5 text-brand-purple" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">
                      {dict.landing.pricing.starter.price}
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      {dict.landing.pricing.starter.period}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {dict.landing.pricing.starter.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-brand-green mr-2 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup?plan=starter" className="w-full">
                    <Button className="w-full rounded-full btn-gradient text-white">
                      {dict.landing.cta}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="bg-white rounded-xl overflow-hidden shadow-xl border-2 border-brand-purple/20 relative transform scale-105">
                <div className="absolute top-0 right-0 bg-brand-purple text-white px-4 py-1 text-xs font-medium rounded-bl-lg">
                  Populair
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">
                      {dict.landing.pricing.pro.name}
                    </h3>
                    <div className="h-10 w-10 rounded-full gradient-bg-1 flex items-center justify-center">
                      <RocketIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">
                      {dict.landing.pricing.pro.price}
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      {dict.landing.pricing.pro.period}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {dict.landing.pricing.pro.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-brand-green mr-2 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup?plan=pro" className="w-full">
                    <Button className="w-full rounded-full btn-gradient text-white">
                      {dict.landing.cta}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Business Plan */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-brand-purple/10">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">
                      {dict.landing.pricing.business.name}
                    </h3>
                    <div className="h-10 w-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                      <BarChart3Icon className="h-5 w-5 text-brand-blue" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">
                      {dict.landing.pricing.business.price}
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      {dict.landing.pricing.business.period}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {dict.landing.pricing.business.features.map(
                      (feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckIcon className="h-5 w-5 text-brand-green mr-2 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      )
                    )}
                  </ul>
                  <Link href="/signup?plan=business" className="w-full">
                    <Button className="w-full rounded-full btn-gradient text-white">
                      {dict.landing.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold mb-4">
                    Klaar om te beginnen?
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Meld je vandaag nog aan en begin met het creëren van
                    boeiende content voor al je social media kanalen.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link href="/signup">
                      <Button className="btn-gradient text-white rounded-full px-8">
                        {dict.landing.cta}
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button variant="outline" className="rounded-full px-8">
                        Contact
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="gradient-bg-1 p-8 md:p-12 flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg max-w-md">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                        <BrainCircuitIcon className="h-5 w-5 text-brand-purple" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">SocialAI</h3>
                        <p className="text-xs text-white/70">
                          AI-Powered Content Creation
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 mb-4">
                      <p className="text-white text-sm">
                        "SocialAI heeft mijn workflow compleet veranderd. Ik
                        bespaar nu uren per week aan content creatie!"
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-brand-pink flex items-center justify-center text-white font-bold">
                        L
                      </div>
                      <div>
                        <h4 className="font-medium text-white">
                          Laura de Vries
                        </h4>
                        <p className="text-xs text-white/70">Content Creator</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-12 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full gradient-bg-1 flex items-center justify-center">
                  <BrainCircuitIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-brand-purple">
                  SocialAI
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                AI-powered social media content creation platform voor content
                creators.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="h-8 w-8 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple hover:bg-brand-purple/20 transition-colors">
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="h-8 w-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue hover:bg-brand-blue/20 transition-colors">
                  <TwitterIcon className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="h-8 w-8 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple hover:bg-brand-purple/20 transition-colors">
                  <LinkedinIcon className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="h-8 w-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue hover:bg-brand-blue/20 transition-colors">
                  <FacebookIcon className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-brand-purple transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-brand-purple transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-brand-purple transition-colors">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-brand-purple transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Bedrijf</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-brand-purple transition-colors">
                    Over ons
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-brand-purple transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-brand-purple transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-brand-purple transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-brand-purple transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="text-muted-foreground hover:text-brand-purple transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-brand-purple transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} SocialAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
