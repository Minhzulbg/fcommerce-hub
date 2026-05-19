import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Menu,
  X,
  Moon,
  Sun,
  ShoppingBag,
  MessageSquare,
  Bot,
  Truck,
  BarChart3,
  Shield,
  Zap,
  ChevronDown,
  Check,
  ArrowRight,
  Star,
  Play,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FCommerce — Facebook Commerce Platform" },
      { name: "description", content: "Manage Facebook orders, messages, AI replies, and courier delivery in one place." },
      { property: "og:title", content: "FCommerce — Facebook Commerce Platform" },
      { property: "og:description", content: "Manage Facebook orders, messages, AI replies, and courier delivery in one place." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LandingPage,
});

/* ------------------------------------------------------------------ */
/*  Reusable animation hook                                            */
/* ------------------------------------------------------------------ */
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, inView };
}

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">FCommerce</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="rounded-full px-4">
              Log in
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="sm" className="rounded-full px-5">
              Start Free Trial
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-4 py-4 space-y-3">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground py-2"
            >
              {l.label}
            </a>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <Button variant="ghost" size="icon" onClick={toggle}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link to="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full rounded-full">Log in</Button>
            </Link>
            <Link to="/dashboard" className="flex-1">
              <Button className="w-full rounded-full">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
function Hero() {
  const { ref, inView } = useInView<HTMLDivElement>(0.1);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-28 pb-20 lg:pt-40 lg:pb-32"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-chart-2/[0.07]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-chart-2/10 rounded-full blur-[100px] opacity-50" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary transition-all duration-700",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            <Zap className="h-4 w-4" />
            Now with AI-powered replies
          </div>

          {/* Headline */}
          <h1
            className={cn(
              "mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl transition-all duration-700 delay-100",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            Manage Facebook orders, messages,{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">AI replies</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-primary/20 rounded-sm -z-0" />
            </span>
            , and courier delivery in one place.
          </h1>

          {/* Subhead */}
          <p
            className={cn(
              "mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            The all-in-one commerce platform built for Bangladeshi Facebook sellers.
            Automate replies, track orders, and delight customers — without switching tabs.
          </p>

          {/* CTAs */}
          <div
            className={cn(
              "mt-10 flex flex-wrap items-center justify-center gap-4 transition-all duration-700 delay-300",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            <Link to="/dashboard">
              <Button size="lg" className="rounded-full px-8 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="rounded-full px-8 text-base gap-2">
              <Play className="h-4 w-4 fill-current" />
              Watch Demo
            </Button>
          </div>

          {/* Social proof */}
          <p
            className={cn(
              "mt-8 text-sm text-muted-foreground transition-all duration-700 delay-400",
              inView ? "opacity-100" : "opacity-0",
            )}
          >
            Trusted by 2,400+ sellers across Bangladesh
          </p>
        </div>

        {/* Hero visual / dashboard preview */}
        <div
          className={cn(
            "mt-16 mx-auto max-w-5xl transition-all duration-1000 delay-500",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <div className="relative rounded-2xl border border-border bg-card shadow-2xl shadow-primary/5 overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <div className="ml-4 flex-1 max-w-md rounded-md bg-background border border-border px-3 py-1 text-xs text-muted-foreground truncate">
                fcommerce.app/dashboard
              </div>
            </div>
            {/* Mock content */}
            <div className="p-6 lg:p-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total Orders", value: "2,847", icon: ShoppingBag, color: "text-blue-500" },
                  { label: "Revenue", value: "৳ 8,42,560", icon: TrendingUp, color: "text-emerald-500" },
                  { label: "Messages", value: "126", icon: MessageSquare, color: "text-amber-500" },
                  { label: "AI Replies", value: "1,032", icon: Bot, color: "text-violet-500" },
                ].map((card) => (
                  <div key={card.label} className="rounded-xl border border-border bg-background p-4">
                    <div className="flex items-center gap-2">
                      <card.icon className={cn("h-4 w-4", card.color)} />
                      <span className="text-xs text-muted-foreground">{card.label}</span>
                    </div>
                    <div className="mt-2 text-xl font-bold">{card.value}</div>
                  </div>
                ))}
              </div>
              <div className="h-32 flex items-end gap-2 rounded-xl bg-muted/50 p-4">
                {[45, 62, 38, 75, 58, 84, 70, 92, 78, 96, 88, 110].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/40 to-primary/70"
                    style={{ height: `${(h / 110) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Features                                                           */
/* ------------------------------------------------------------------ */
const features = [
  {
    icon: ShoppingBag,
    title: "Order Management",
    description:
      "Track every Facebook order from payment to delivery. Auto-sync with Pathao, Steadfast, RedX, and Paperfly.",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: MessageSquare,
    title: "Unified Inbox",
    description:
      "All Messenger, WhatsApp, and comments in one inbox. Never miss a customer query again.",
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    icon: Bot,
    title: "AI Auto-Replies",
    description:
      "Train an AI assistant on your products and FAQs. It replies instantly, 24/7, in Bangla or English.",
    color: "bg-violet-500/10 text-violet-600",
  },
  {
    icon: Truck,
    title: "Courier Tracking",
    description:
      "Real-time delivery status updates. Auto-SMS to customers with tracking links.",
    color: "bg-pink-500/10 text-pink-600",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description:
      "Beautiful charts for revenue, top products, customer retention, and courier performance.",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Bank-grade encryption, automatic backups, and 99.9% uptime. Your data stays in Bangladesh.",
    color: "bg-sky-500/10 text-sky-600",
  },
];

function Features() {
  const { ref, inView } = useInView<HTMLDivElement>(0.1);

  return (
    <section id="features" ref={ref} className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2
            className={cn(
              "text-3xl font-bold tracking-tight sm:text-4xl transition-all duration-700",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            Everything you need to scale
          </h2>
          <p
            className={cn(
              "mt-4 text-lg text-muted-foreground transition-all duration-700 delay-100",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            Powerful tools designed specifically for Facebook commerce sellers in Bangladesh.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={cn(
                "group rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-500",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
              )}
              style={{ transitionDelay: inView ? `${150 + i * 80}ms` : "0ms" }}
            >
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                  f.color,
                )}
              >
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Pricing                                                            */
/* ------------------------------------------------------------------ */
const plans = [
  {
    name: "Starter",
    price: "0",
    period: "forever",
    description: "Perfect for new sellers testing the waters.",
    features: [
      "Up to 50 orders/month",
      "1 Facebook page",
      "Basic inbox",
      "Pathao integration",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Growth",
    price: "1,999",
    period: "/month",
    description: "For growing businesses ready to automate.",
    features: [
      "Unlimited orders",
      "3 Facebook pages",
      "Unified inbox + AI replies",
      "All courier integrations",
      "Analytics dashboard",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Pro",
    price: "4,999",
    period: "/month",
    description: "For power sellers who need the full stack.",
    features: [
      "Everything in Growth",
      "Unlimited Facebook pages",
      "Custom AI training",
      "Advanced analytics & exports",
      "Team members (up to 10)",
      "Dedicated account manager",
      "WhatsApp Business API",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

function Pricing() {
  const { ref, inView } = useInView<HTMLDivElement>(0.1);

  return (
    <section id="pricing" ref={ref} className="py-20 lg:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2
            className={cn(
              "text-3xl font-bold tracking-tight sm:text-4xl transition-all duration-700",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            Simple, transparent pricing
          </h2>
          <p
            className={cn(
              "mt-4 text-lg text-muted-foreground transition-all duration-700 delay-100",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            Start free. Upgrade when you're ready. No hidden fees.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl border p-6 lg:p-8 transition-all duration-500",
                plan.popular
                  ? "border-primary/30 bg-card shadow-xl shadow-primary/5 scale-[1.02]"
                  : "border-border bg-card shadow-sm",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
              )}
              style={{ transitionDelay: inView ? `${150 + i * 100}ms` : "0ms" }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-sm text-muted-foreground">৳</span>
                <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <Link to="/dashboard" className="block mt-8">
                <Button
                  className={cn(
                    "w-full rounded-full",
                    plan.popular ? "" : "variant-outline",
                  )}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Testimonials                                                       */
/* ------------------------------------------------------------------ */
const testimonials = [
  {
    name: "Fatima Khan",
    role: "Founder, StyleBD",
    content:
      "FCommerce cut our response time from hours to seconds. The AI handles 80% of inquiries automatically. Our customers love the instant replies.",
    rating: 5,
  },
  {
    name: "Rahim Uddin",
    role: "Owner, GadgetHub BD",
    content:
      "We process 300+ orders a month. The courier integration with Pathao and Steadfast saves us 2 hours every day. Best investment for our business.",
    rating: 5,
  },
  {
    name: "Tasnim Jahan",
    role: "CEO, OrganicCare BD",
    content:
      "The analytics dashboard helped us identify our top-selling products and peak hours. Revenue went up 40% in just two months.",
    rating: 5,
  },
];

function Testimonials() {
  const { ref, inView } = useInView<HTMLDivElement>(0.1);

  return (
    <section id="testimonials" ref={ref} className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2
            className={cn(
              "text-3xl font-bold tracking-tight sm:text-4xl transition-all duration-700",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            Loved by Bangladeshi sellers
          </h2>
          <p
            className={cn(
              "mt-4 text-lg text-muted-foreground transition-all duration-700 delay-100",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            Join thousands of Facebook commerce entrepreneurs who trust FCommerce.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={cn(
                "rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-500",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
              )}
              style={{ transitionDelay: inView ? `${150 + i * 100}ms` : "0ms" }}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground">"{t.content}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */
const faqs = [
  {
    q: "How does the AI reply feature work?",
    a: "You upload your product catalog and FAQs. Our AI learns your tone and answers common questions automatically in Bangla or English. You review and approve before it goes live.",
  },
  {
    q: "Which courier services are supported?",
    a: "We integrate with Pathao, Steadfast, RedX, and Paperfly. More couriers are added every month based on seller demand.",
  },
  {
    q: "Can I connect multiple Facebook pages?",
    a: "Yes! Starter plan includes 1 page, Growth includes 3, and Pro supports unlimited pages. Perfect if you run multiple brands.",
  },
  {
    q: "Is my customer data secure?",
    a: "Absolutely. We use bank-grade encryption (AES-256), store data in Bangladesh, and never share or sell your information. We're GDPR-compliant.",
  },
  {
    q: "Do you offer a free trial?",
    a: "Yes — every paid plan starts with a 14-day free trial. No credit card required. Cancel anytime.",
  },
];

function FAQ() {
  const { ref, inView } = useInView<HTMLDivElement>(0.1);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" ref={ref} className="py-20 lg:py-28 bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2
            className={cn(
              "text-3xl font-bold tracking-tight sm:text-4xl transition-all duration-700",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            Frequently asked questions
          </h2>
          <p
            className={cn(
              "mt-4 text-lg text-muted-foreground transition-all duration-700 delay-100",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            Everything you need to know before getting started.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl border border-border bg-card overflow-hidden transition-all duration-500",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
              )}
              style={{ transitionDelay: inView ? `${150 + i * 80}ms` : "0ms" }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-medium text-sm">{faq.q}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300",
                    openIndex === i && "rotate-180",
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openIndex === i ? "max-h-40" : "max-h-0",
                )}
              >
                <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA Banner                                                         */
/* ------------------------------------------------------------------ */
function CTABanner() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <section ref={ref} className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          )}
        >
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-[80px]" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Ready to scale your Facebook business?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Join 2,400+ sellers using FCommerce to automate, grow, and delight customers.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full px-8 text-base"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight">FCommerce</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              The all-in-one platform for Facebook commerce sellers in Bangladesh.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2025 FCommerce. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Landing page wrapper                                               */
/* ------------------------------------------------------------------ */
function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTABanner />
      <Footer />
    </div>
  );
}
