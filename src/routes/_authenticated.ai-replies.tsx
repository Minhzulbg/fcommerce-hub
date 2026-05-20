import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bot,
  Sparkles,
  MessageSquare,
  Zap,
  ShieldCheck,
  Languages,
  Wand2,
  HandMetal,
  History,
  ShoppingBag,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Copy,
  PencilLine,
  ChevronRight,
  Gauge,
  Crown,
  Briefcase,
  TrendingUp,
  Smile,
  Star,
  Facebook,
  Instagram,
  Send,
  Brain,
  Filter,
  ArrowUpRight,
  CircleCheck,
  CircleAlert,
  CirclePause,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/ai-replies")({
  component: AiRepliesPage,
});

// -------------------- Types & data --------------------

type Tone = "friendly" | "professional" | "sales" | "luxury";
type Lang = "bn" | "en" | "auto";
type PageChannel = "messenger" | "instagram" | "whatsapp";

type Page = {
  id: string;
  name: string;
  channel: PageChannel;
  enabled: boolean;
  tone: Tone;
  lang: Lang;
  confidence: number;
  handoff: number;
  prompt: string;
  followers: string;
};

type QuickReply = {
  id: string;
  trigger: string;
  reply: string;
  channel: PageChannel | "all";
};

type TrainingPair = {
  id: string;
  question: string;
  answer: string;
  tone: Tone;
};

type SuggestedReply = {
  id: string;
  text: string;
  confidence: number;
  tone: Tone;
  intent: string;
};

type HistoryItem = {
  id: string;
  customer: string;
  initials: string;
  channel: PageChannel;
  question: string;
  reply: string;
  confidence: number;
  intent: string;
  status: "auto" | "handover" | "review";
  at: string;
  feedback?: "up" | "down";
};

const TONE_META: Record<
  Tone,
  { label: string; icon: typeof Smile; desc: string; tone: string }
> = {
  friendly: {
    label: "Friendly",
    icon: Smile,
    desc: "Warm, conversational, light emojis 😊",
    tone: "from-amber-500/20 to-amber-500/0 text-amber-700 dark:text-amber-300 ring-amber-500/30",
  },
  professional: {
    label: "Professional",
    icon: Briefcase,
    desc: "Polished, neutral, business-grade language",
    tone: "from-sky-500/20 to-sky-500/0 text-sky-700 dark:text-sky-300 ring-sky-500/30",
  },
  sales: {
    label: "Sales-focused",
    icon: TrendingUp,
    desc: "Persuasive, urgency, upsell + cross-sell",
    tone: "from-rose-500/20 to-rose-500/0 text-rose-700 dark:text-rose-300 ring-rose-500/30",
  },
  luxury: {
    label: "Luxury brand",
    icon: Crown,
    desc: "Refined, premium voice, no slang",
    tone: "from-violet-500/20 to-violet-500/0 text-violet-700 dark:text-violet-300 ring-violet-500/30",
  },
};

const channelMeta: Record<
  PageChannel,
  { icon: typeof Facebook; tone: string; label: string }
> = {
  messenger: {
    icon: Facebook,
    tone: "bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-blue-500/20",
    label: "Messenger",
  },
  instagram: {
    icon: Instagram,
    tone: "bg-pink-500/10 text-pink-700 dark:text-pink-300 ring-pink-500/20",
    label: "Instagram",
  },
  whatsapp: {
    icon: MessageSquare,
    tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-500/20",
    label: "WhatsApp",
  },
};

const seedPages: Page[] = [
  {
    id: "p1",
    name: "Rupa's Saree House",
    channel: "messenger",
    enabled: true,
    tone: "luxury",
    lang: "bn",
    confidence: 84,
    handoff: 70,
    followers: "128K",
    prompt:
      "তুমি Rupa's Saree House-এর কাস্টমার কেয়ার AI। বিনয়ী, আভিজাত্যপূর্ণ এবং সাহায্যকারী টোনে বাংলায় উত্তর দাও।",
  },
  {
    id: "p2",
    name: "DhakaThreads Menswear",
    channel: "instagram",
    enabled: true,
    tone: "sales",
    lang: "auto",
    confidence: 78,
    handoff: 60,
    followers: "54K",
    prompt:
      "You are the AI sales rep for DhakaThreads. Be persuasive, recommend matching products, and create gentle urgency.",
  },
  {
    id: "p3",
    name: "NovaCart Electronics",
    channel: "whatsapp",
    enabled: false,
    tone: "professional",
    lang: "en",
    confidence: 80,
    handoff: 75,
    followers: "31K",
    prompt:
      "You are the customer support AI for NovaCart. Reply in clear, professional English. Always cite warranty/return policy when relevant.",
  },
];

const seedQuickReplies: QuickReply[] = [
  { id: "q1", trigger: "Price?", reply: "Hi! 🌸 This product is ৳1,250 with free delivery inside Dhaka.", channel: "all" },
  { id: "q2", trigger: "Stock?", reply: "Yes, this item is in stock — would you like to place an order now?", channel: "all" },
  { id: "q3", trigger: "Delivery time", reply: "Inside Dhaka: 24 hours. Outside Dhaka: 2–3 working days.", channel: "messenger" },
  { id: "q4", trigger: "ফেরত পলিসি", reply: "ডেলিভারির ৩ দিনের মধ্যে রিটার্ন করা যাবে যদি প্রোডাক্ট অব্যবহৃত থাকে।", channel: "all" },
];

const seedTraining: TrainingPair[] = [
  {
    id: "t1",
    question: "ভাইয়া এইটার দাম কত?",
    answer: "আসসালামু আলাইকুম 🌸 এই শাড়িটির দাম ৳২,৪৫০ টাকা। ঢাকার ভিতরে ফ্রি ডেলিভারি।",
    tone: "friendly",
  },
  {
    id: "t2",
    question: "Do you have size M in stock?",
    answer:
      "Yes! Size M is currently in stock. It pairs beautifully with our new linen trousers — would you like me to add them to your order?",
    tone: "sales",
  },
  {
    id: "t3",
    question: "What is your return policy?",
    answer:
      "We accept returns within 3 days of delivery for unused items in original packaging. Refund is processed within 48 hours.",
    tone: "professional",
  },
];

const seedSuggestions: SuggestedReply[] = [
  {
    id: "s1",
    text: "আসসালামু আলাইকুম 🌸 ধন্যবাদ যোগাযোগ করার জন্য। এই শাড়িটির দাম ৳২,২০০ এবং ঢাকার ভিতরে ফ্রি ডেলিভারি।",
    confidence: 94,
    tone: "luxury",
    intent: "Price inquiry",
  },
  {
    id: "s2",
    text: "Yes apu, it's available in 3 colors — royal blue, maroon, and sea green. Which one would you like?",
    confidence: 88,
    tone: "friendly",
    intent: "Stock + variants",
  },
  {
    id: "s3",
    text: "Order করতে শুধু আপনার নাম, ফোন আর ঠিকানা পাঠান, আমরা পরের ২৪ ঘন্টার মধ্যে ডেলিভারি দিয়ে দিব ✨",
    confidence: 91,
    tone: "sales",
    intent: "Order capture",
  },
];

const seedHistory: HistoryItem[] = [
  {
    id: "h1",
    customer: "Nusrat Jahan",
    initials: "NJ",
    channel: "messenger",
    question: "এই শাড়ির দাম কত আপু?",
    reply:
      "আসসালামু আলাইকুম 🌸 এই শাড়িটি ৳২,৪৫০ টাকা এবং ঢাকার ভিতরে ফ্রি ডেলিভারি।",
    confidence: 96,
    intent: "Price",
    status: "auto",
    at: "2m ago",
    feedback: "up",
  },
  {
    id: "h2",
    customer: "Rakib Hasan",
    initials: "RH",
    channel: "whatsapp",
    question: "Can I get a discount on bulk order of 10 pcs?",
    reply: "Let me connect you with our sales team for a custom bulk quote.",
    confidence: 58,
    intent: "Bulk / Negotiation",
    status: "handover",
    at: "14m ago",
  },
  {
    id: "h3",
    customer: "Tasnim Ahmed",
    initials: "TA",
    channel: "instagram",
    question: "Do you ship to Chittagong?",
    reply:
      "Yes! We deliver to Chittagong within 2–3 working days via Steadfast. Delivery charge is ৳120.",
    confidence: 92,
    intent: "Shipping zone",
    status: "auto",
    at: "1h ago",
    feedback: "up",
  },
  {
    id: "h4",
    customer: "Farzana Akter",
    initials: "FA",
    channel: "messenger",
    question: "Color is not matching with photo, I want to return.",
    reply: "I'm sorry to hear that. Routing to our human team for return processing.",
    confidence: 64,
    intent: "Return / Complaint",
    status: "review",
    at: "3h ago",
    feedback: "down",
  },
];

const seedFaqs = [
  { q: "What's your delivery time?", count: 312, coverage: 96 },
  { q: "ফেরত পলিসি কী?", count: 248, coverage: 92 },
  { q: "Do you have COD?", count: 197, coverage: 99 },
  { q: "Size chart কোথায়?", count: 154, coverage: 88 },
  { q: "Discount available?", count: 121, coverage: 71 },
];

const seedRecs = [
  { name: "Linen Trouser — Beige", reason: "Pairs with viewed Panjabi", boost: "+18% AOV" },
  { name: "Silk Scarf — Mint", reason: "Often bought with Saree", boost: "+12% AOV" },
  { name: "Premium Wallet — Black", reason: "Cross-sell with Leather Belt", boost: "+9% AOV" },
];

// -------------------- Helpers --------------------

function ConfidenceRing({ value }: { value: number }) {
  const color =
    value >= 85
      ? "text-emerald-500"
      : value >= 65
      ? "text-amber-500"
      : "text-rose-500";
  const bg =
    value >= 85
      ? "stroke-emerald-500"
      : value >= 65
      ? "stroke-amber-500"
      : "stroke-rose-500";
  const r = 16;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative inline-flex h-10 w-10 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={r} className="fill-none stroke-muted" strokeWidth="3" />
        <circle
          cx="20"
          cy="20"
          r={r}
          className={cn("fill-none transition-all", bg)}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <span className={cn("text-[10px] font-bold tabular-nums", color)}>{value}</span>
    </div>
  );
}

function ToneBadge({ tone }: { tone: Tone }) {
  const m = TONE_META[tone];
  const Icon = m.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-gradient-to-br px-2 py-0.5 text-[10px] font-semibold ring-1",
        m.tone,
      )}
    >
      <Icon className="h-2.5 w-2.5" />
      {m.label}
    </span>
  );
}

function ChannelBadge({ channel }: { channel: PageChannel }) {
  const m = channelMeta[channel];
  const Icon = m.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1",
        m.tone,
      )}
    >
      <Icon className="h-2.5 w-2.5" />
      {m.label}
    </span>
  );
}

// -------------------- Page --------------------

function AiRepliesPage() {
  const [pages, setPages] = useState<Page[]>(seedPages);
  const [activePageId, setActivePageId] = useState<string>(seedPages[0].id);
  const [quick, setQuick] = useState<QuickReply[]>(seedQuickReplies);
  const [training, setTraining] = useState<TrainingPair[]>(seedTraining);
  const [history, setHistory] = useState<HistoryItem[]>(seedHistory);
  const [globalEnabled, setGlobalEnabled] = useState(true);
  const [filterChannel, setFilterChannel] = useState<"all" | PageChannel>("all");

  const [newTrigger, setNewTrigger] = useState("");
  const [newReply, setNewReply] = useState("");
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");

  const [playground, setPlayground] = useState("ভাইয়া এই শাড়িটার দাম কত?");
  const [playgroundResp, setPlaygroundResp] = useState<SuggestedReply | null>(null);

  const activePage = pages.find((p) => p.id === activePageId)!;

  const updatePage = (id: string, patch: Partial<Page>) =>
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const stats = useMemo(() => {
    const replies = history.length;
    const auto = history.filter((h) => h.status === "auto").length;
    const avgConf = Math.round(
      history.reduce((s, h) => s + h.confidence, 0) / replies,
    );
    return {
      replies: 1284,
      auto: Math.round((auto / replies) * 100),
      avgConf,
      handoffs: history.filter((h) => h.status !== "auto").length * 27,
      saved: "412h",
    };
  }, [history]);

  const filteredHistory = useMemo(
    () =>
      filterChannel === "all"
        ? history
        : history.filter((h) => h.channel === filterChannel),
    [history, filterChannel],
  );

  const generatePreview = () => {
    const tone = activePage.tone;
    const conf = Math.floor(78 + Math.random() * 18);
    const intent = "Price inquiry";
    const text =
      activePage.lang === "bn"
        ? "আসসালামু আলাইকুম 🌸 ধন্যবাদ যোগাযোগ করার জন্য। এই প্রোডাক্টটির দাম ৳২,২৫০ এবং ঢাকার ভিতরে ফ্রি ডেলিভারি।"
        : "Hi there! 🌸 Thanks for reaching out. This product is ৳2,250 with free delivery inside Dhaka — shall I confirm your order?";
    setPlaygroundResp({ id: "live", text, confidence: conf, tone, intent });
    toast.success("Nova generated a reply", {
      description: `${conf}% confidence · ${TONE_META[tone].label} tone`,
    });
  };

  const addQuick = () => {
    if (!newTrigger.trim() || !newReply.trim()) return;
    setQuick((prev) => [
      { id: crypto.randomUUID(), trigger: newTrigger, reply: newReply, channel: "all" },
      ...prev,
    ]);
    setNewTrigger("");
    setNewReply("");
    toast.success("Quick reply added");
  };

  const addTraining = () => {
    if (!newQ.trim() || !newA.trim()) return;
    setTraining((prev) => [
      { id: crypto.randomUUID(), question: newQ, answer: newA, tone: activePage.tone },
      ...prev,
    ]);
    setNewQ("");
    setNewA("");
    toast.success("Training example saved", { description: "Nova will use this in future replies." });
  };

  const feedback = (id: string, f: "up" | "down") => {
    setHistory((prev) => prev.map((h) => (h.id === id ? { ...h, feedback: f } : h)));
    toast.success(f === "up" ? "Marked as good reply" : "Marked for review");
  };

  return (
    <AppLayout
      title="AI Auto-Reply"
      subtitle="Train, monitor, and orchestrate Nova across your social inboxes"
      actions={
        <>
          <div className="hidden md:flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                globalEnabled ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground",
              )}
            />
            <span className="font-medium">
              Nova is {globalEnabled ? "online" : "paused"}
            </span>
            <Switch
              checked={globalEnabled}
              onCheckedChange={(v) => {
                setGlobalEnabled(v);
                toast.success(v ? "AI replies enabled" : "AI replies paused");
              }}
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <History className="h-4 w-4" /> Logs
          </Button>
          <Button size="sm" className="gap-1.5 bg-gradient-primary shadow-elegant">
            <Sparkles className="h-4 w-4" /> Train Nova
          </Button>
        </>
      }
    >
      {/* Hero analytics */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5">
        <StatTile
          icon={MessageSquare}
          label="AI replies (30d)"
          value={stats.replies.toLocaleString()}
          tone="from-sky-500/15 to-sky-500/0 text-sky-600"
          trend="+24%"
        />
        <StatTile
          icon={Zap}
          label="Auto-resolved"
          value={`${stats.auto}%`}
          tone="from-emerald-500/15 to-emerald-500/0 text-emerald-600"
          trend="+8%"
        />
        <StatTile
          icon={Gauge}
          label="Avg confidence"
          value={`${stats.avgConf}%`}
          tone="from-violet-500/15 to-violet-500/0 text-violet-600"
          progress={stats.avgConf}
        />
        <StatTile
          icon={HandMetal}
          label="Human handoffs"
          value={stats.handoffs.toString()}
          tone="from-amber-500/15 to-amber-500/0 text-amber-600"
          trend="-12%"
        />
        <StatTile
          icon={Clock}
          label="Time saved"
          value={stats.saved}
          tone="from-rose-500/15 to-rose-500/0 text-rose-600"
          trend="this month"
        />
      </div>

      {/* Per-page rail + main */}
      <div className="mt-6 grid gap-5 lg:grid-cols-[300px_1fr]">
        {/* Pages list */}
        <Card className="border-border/70 overflow-hidden">
          <div className="border-b border-border bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Connected pages
              </div>
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                {pages.length}
              </Badge>
            </div>
          </div>
          <div className="divide-y divide-border/60">
            {pages.map((p) => {
              const active = p.id === activePageId;
              const m = channelMeta[p.channel];
              const Icon = m.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePageId(p.id)}
                  className={cn(
                    "flex w-full items-center gap-3 p-3 text-left transition-colors",
                    active
                      ? "bg-primary/5 ring-1 ring-inset ring-primary/30"
                      : "hover:bg-muted/40",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1",
                      m.tone,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-semibold">{p.name}</span>
                      {p.enabled ? (
                        <CircleCheck className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <CirclePause className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <span>{m.label}</span>
                      <span>·</span>
                      <span>{p.followers} followers</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <ToneBadge tone={p.tone} />
                      <span className="rounded bg-muted px-1 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                        {p.lang === "auto" ? "Auto" : p.lang === "bn" ? "বাংলা" : "English"}
                      </span>
                    </div>
                  </div>
                  {active && <ChevronRight className="h-4 w-4 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>
          <div className="p-3">
            <Button variant="outline" size="sm" className="w-full gap-1.5">
              <Plus className="h-4 w-4" /> Connect new page
            </Button>
          </div>
        </Card>

        {/* Main column */}
        <div className="space-y-5">
          {/* Active page personality card */}
          <Card className="overflow-hidden border-border/70">
            <div className="relative border-b border-border bg-gradient-mesh p-5">
              <div className="absolute right-5 top-5 flex items-center gap-2">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    activePage.enabled
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-muted-foreground",
                  )}
                />
                <span className="text-xs font-medium">
                  {activePage.enabled ? "AI active" : "Paused"}
                </span>
                <Switch
                  checked={activePage.enabled}
                  onCheckedChange={(v) => updatePage(activePage.id, { enabled: v })}
                />
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold tracking-tight">
                      Nova for {activePage.name}
                    </h2>
                    <ChannelBadge channel={activePage.channel} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Personality, language, and behavior for this page only.
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="p-5 space-y-5">
              {/* Tone selector */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    AI tone
                  </label>
                  <ToneBadge tone={activePage.tone} />
                </div>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {(Object.keys(TONE_META) as Tone[]).map((t) => {
                    const m = TONE_META[t];
                    const Icon = m.icon;
                    const active = activePage.tone === t;
                    return (
                      <button
                        key={t}
                        onClick={() => updatePage(activePage.id, { tone: t })}
                        className={cn(
                          "group rounded-xl border p-3 text-left transition-all",
                          active
                            ? "border-primary bg-primary/5 shadow-elegant"
                            : "border-border/70 hover:border-primary/40 hover:bg-muted/40",
                        )}
                      >
                        <div
                          className={cn(
                            "mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ring-1",
                            m.tone,
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="text-sm font-semibold">{m.label}</div>
                        <div className="mt-0.5 text-[10px] text-muted-foreground line-clamp-2">
                          {m.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Language + sliders */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Reply language
                  </label>
                  <div className="mt-2 flex gap-2">
                    {(
                      [
                        { id: "bn", label: "বাংলা", desc: "Native Bengali" },
                        { id: "en", label: "English", desc: "English only" },
                        { id: "auto", label: "Auto", desc: "Detect & match" },
                      ] as { id: Lang; label: string; desc: string }[]
                    ).map((l) => {
                      const active = activePage.lang === l.id;
                      return (
                        <button
                          key={l.id}
                          onClick={() => updatePage(activePage.id, { lang: l.id })}
                          className={cn(
                            "flex-1 rounded-lg border px-3 py-2 text-left transition-colors",
                            active
                              ? "border-primary bg-primary/5"
                              : "border-border/70 hover:bg-muted/40",
                          )}
                        >
                          <div className="flex items-center gap-1.5 text-sm font-semibold">
                            <Languages className="h-3.5 w-3.5" />
                            {l.label}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {l.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Auto-reply confidence threshold
                      </label>
                      <span className="text-xs font-bold tabular-nums">
                        {activePage.confidence}%
                      </span>
                    </div>
                    <Slider
                      value={[activePage.confidence]}
                      onValueChange={(v) =>
                        updatePage(activePage.id, { confidence: v[0] })
                      }
                      min={40}
                      max={99}
                      step={1}
                    />
                    <div className="mt-1 text-[10px] text-muted-foreground">
                      Replies above this score are sent automatically.
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Handoff trigger
                      </label>
                      <span className="text-xs font-bold tabular-nums">
                        {activePage.handoff}%
                      </span>
                    </div>
                    <Slider
                      value={[activePage.handoff]}
                      onValueChange={(v) =>
                        updatePage(activePage.id, { handoff: v[0] })
                      }
                      min={30}
                      max={95}
                      step={1}
                    />
                    <div className="mt-1 text-[10px] text-muted-foreground">
                      Below this score, route to human agent automatically.
                    </div>
                  </div>
                </div>
              </div>

              {/* Prompt editor */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Personality prompt
                  </label>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs">
                      <Wand2 className="h-3 w-3" /> Improve
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs">
                      <Copy className="h-3 w-3" /> Copy
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={activePage.prompt}
                  onChange={(e) => updatePage(activePage.id, { prompt: e.target.value })}
                  className="min-h-[100px] font-mono text-xs leading-relaxed"
                />
                <div className="mt-2 flex flex-wrap gap-1">
                  {["{{shop_name}}", "{{customer_name}}", "{{product}}", "{{price}}"].map(
                    (v) => (
                      <button
                        key={v}
                        onClick={() =>
                          updatePage(activePage.id, {
                            prompt: activePage.prompt + " " + v,
                          })
                        }
                        className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      >
                        {v}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs: suggestions / training / quick / faq / recs / history */}
          <Tabs defaultValue="suggested">
            <TabsList className="flex flex-wrap h-auto">
              <TabsTrigger value="suggested" className="gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Suggested
              </TabsTrigger>
              <TabsTrigger value="quick" className="gap-1.5">
                <Zap className="h-3.5 w-3.5" /> Quick replies
              </TabsTrigger>
              <TabsTrigger value="training" className="gap-1.5">
                <Brain className="h-3.5 w-3.5" /> Training
              </TabsTrigger>
              <TabsTrigger value="faq" className="gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> FAQ auto-detect
              </TabsTrigger>
              <TabsTrigger value="recs" className="gap-1.5">
                <ShoppingBag className="h-3.5 w-3.5" /> Product recs
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-1.5">
                <History className="h-3.5 w-3.5" /> History
              </TabsTrigger>
            </TabsList>

            {/* SUGGESTED */}
            <TabsContent value="suggested" className="mt-4 space-y-4">
              <Card className="border-border/70">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Live preview playground</div>
                      <div className="text-[11px] text-muted-foreground">
                        Send a sample customer message — Nova drafts a suggested reply.
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Input
                      value={playground}
                      onChange={(e) => setPlayground(e.target.value)}
                      placeholder="Type a customer message..."
                    />
                    <Button onClick={generatePreview} className="gap-1.5 bg-gradient-primary shadow-elegant">
                      <Send className="h-4 w-4" /> Generate
                    </Button>
                  </div>
                  {playgroundResp && (
                    <div className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
                      <div className="flex items-start gap-3">
                        <ConfidenceRing value={playgroundResp.confidence} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold">Nova</span>
                            <ToneBadge tone={playgroundResp.tone} />
                            <Badge variant="secondary" className="h-4 px-1 text-[9px]">
                              {playgroundResp.intent}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm leading-relaxed">{playgroundResp.text}</p>
                          <div className="mt-2 flex gap-1.5">
                            <Button size="sm" variant="outline" className="h-7 gap-1 text-xs">
                              <CheckCircle2 className="h-3 w-3" /> Send
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs">
                              <PencilLine className="h-3 w-3" /> Edit
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs">
                              <HandMetal className="h-3 w-3" /> Human takeover
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {seedSuggestions.map((s) => (
                  <SuggestionCard key={s.id} suggestion={s} />
                ))}
              </div>
            </TabsContent>

            {/* QUICK REPLIES */}
            <TabsContent value="quick" className="mt-4 space-y-3">
              <Card className="border-border/70 border-dashed">
                <CardContent className="p-4">
                  <div className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
                    <Input
                      value={newTrigger}
                      onChange={(e) => setNewTrigger(e.target.value)}
                      placeholder="Trigger (e.g. Price?)"
                    />
                    <Input
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      placeholder="Quick reply text..."
                    />
                    <Button onClick={addQuick} className="gap-1.5 bg-gradient-primary shadow-elegant">
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <div className="grid gap-2 md:grid-cols-2">
                {quick.map((q) => (
                  <Card key={q.id} className="border-border/70">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <Zap className="h-3 w-3 text-primary" />
                            <span className="text-xs font-semibold">{q.trigger}</span>
                            <Badge variant="secondary" className="h-4 px-1 text-[9px]">
                              {q.channel === "all" ? "All channels" : channelMeta[q.channel].label}
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{q.reply}</p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 shrink-0"
                          onClick={() => setQuick((prev) => prev.filter((x) => x.id !== q.id))}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* TRAINING */}
            <TabsContent value="training" className="mt-4 space-y-3">
              <Card className="border-border/70 border-dashed">
                <CardContent className="p-4 space-y-2">
                  <Input
                    value={newQ}
                    onChange={(e) => setNewQ(e.target.value)}
                    placeholder="Customer asks…"
                  />
                  <Textarea
                    value={newA}
                    onChange={(e) => setNewA(e.target.value)}
                    placeholder="Nova should reply…"
                    className="min-h-[70px]"
                  />
                  <div className="flex justify-end">
                    <Button onClick={addTraining} className="gap-1.5 bg-gradient-primary shadow-elegant">
                      <Brain className="h-4 w-4" /> Save example
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-2">
                {training.map((t) => (
                  <Card key={t.id} className="border-border/70">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold">Customer</span>
                            <ToneBadge tone={t.tone} />
                          </div>
                          <p className="mt-0.5 text-xs">{t.question}</p>
                          <div className="mt-2 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 p-2">
                            <div className="flex items-center gap-1.5">
                              <Bot className="h-3 w-3 text-primary" />
                              <span className="text-[11px] font-semibold text-primary">Nova reply</span>
                            </div>
                            <p className="mt-0.5 text-xs leading-relaxed">{t.answer}</p>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 shrink-0"
                          onClick={() => setTraining((prev) => prev.filter((x) => x.id !== t.id))}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* FAQ */}
            <TabsContent value="faq" className="mt-4">
              <Card className="border-border/70 overflow-hidden">
                <div className="border-b border-border bg-muted/30 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">Top FAQ auto-detected</span>
                    <Badge variant="secondary" className="ml-auto h-5 text-[10px]">
                      Last 30 days
                    </Badge>
                  </div>
                </div>
                <div className="divide-y divide-border/60">
                  {seedFaqs.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Search className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{f.q}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {f.count} times asked
                        </div>
                      </div>
                      <div className="hidden md:block w-32">
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>Coverage</span>
                          <span className="font-bold text-foreground">{f.coverage}%</span>
                        </div>
                        <Progress value={f.coverage} className="mt-1 h-1.5" />
                      </div>
                      <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs">
                        <PencilLine className="h-3 w-3" /> Train
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* PRODUCT RECS */}
            <TabsContent value="recs" className="mt-4">
              <Card className="border-border/70 overflow-hidden">
                <div className="border-b border-border bg-gradient-to-r from-primary/5 to-transparent p-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">Product recommendation AI</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Nova suggests upsells & cross-sells inside replies based on viewed products and order history.
                  </p>
                </div>
                <div className="grid gap-2 p-3 md:grid-cols-2 xl:grid-cols-3">
                  {seedRecs.map((r, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border/70 bg-card p-3 hover-lift"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-mesh">
                          <Star className="h-4 w-4 text-amber-500" />
                        </div>
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20">
                          {r.boost}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm font-semibold">{r.name}</div>
                      <div className="text-[11px] text-muted-foreground">{r.reason}</div>
                      <Button size="sm" variant="ghost" className="mt-2 h-7 gap-1 px-2 text-xs">
                        Configure rule <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* HISTORY */}
            <TabsContent value="history" className="mt-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5" /> Channel:
                </div>
                <Select
                  value={filterChannel}
                  onValueChange={(v) => setFilterChannel(v as typeof filterChannel)}
                >
                  <SelectTrigger className="h-8 w-[160px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All channels</SelectItem>
                    <SelectItem value="messenger">Messenger</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                {filteredHistory.map((h) => (
                  <HistoryRow key={h.id} item={h} onFeedback={feedback} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}

// -------------------- Small components --------------------

function StatTile({
  icon: Icon,
  label,
  value,
  tone,
  trend,
  progress,
}: {
  icon: typeof MessageSquare;
  label: string;
  value: string;
  tone: string;
  trend?: string;
  progress?: number;
}) {
  return (
    <Card className="relative overflow-hidden border-border/70">
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", tone)} />
      <CardContent className="relative p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <Icon className={cn("h-4 w-4", tone.split(" ").pop())} />
        </div>
        <div className="mt-2 text-2xl font-bold tabular-nums">{value}</div>
        {trend && <div className="text-[11px] text-muted-foreground">{trend}</div>}
        {typeof progress === "number" && (
          <Progress value={progress} className="mt-2 h-1.5" />
        )}
      </CardContent>
    </Card>
  );
}

function SuggestionCard({ suggestion }: { suggestion: SuggestedReply }) {
  return (
    <Card className="border-border/70 hover-lift">
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <ConfidenceRing value={suggestion.confidence} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <ToneBadge tone={suggestion.tone} />
              <Badge variant="secondary" className="h-4 px-1 text-[9px]">
                {suggestion.intent}
              </Badge>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed">{suggestion.text}</p>
          </div>
        </div>
        <div className="mt-2 flex gap-1.5">
          <Button size="sm" className="h-7 flex-1 gap-1 bg-gradient-primary text-xs shadow-elegant">
            <Send className="h-3 w-3" /> Send
          </Button>
          <Button size="sm" variant="outline" className="h-7 gap-1 text-xs">
            <PencilLine className="h-3 w-3" /> Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function HistoryRow({
  item,
  onFeedback,
}: {
  item: HistoryItem;
  onFeedback: (id: string, f: "up" | "down") => void;
}) {
  const statusMeta = {
    auto: {
      label: "Auto-replied",
      icon: Zap,
      tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-500/20",
    },
    handover: {
      label: "Handed to human",
      icon: HandMetal,
      tone: "bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-amber-500/20",
    },
    review: {
      label: "Needs review",
      icon: CircleAlert,
      tone: "bg-rose-500/10 text-rose-700 dark:text-rose-300 ring-rose-500/20",
    },
  }[item.status];
  const StatusIcon = statusMeta.icon;

  return (
    <Card className="border-border/70 overflow-hidden">
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-gradient-primary text-[10px] font-semibold text-primary-foreground">
              {item.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-semibold">{item.customer}</span>
              <ChannelBadge channel={item.channel} />
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ring-1",
                  statusMeta.tone,
                )}
              >
                <StatusIcon className="h-2.5 w-2.5" />
                {statusMeta.label}
              </span>
              <Badge variant="secondary" className="h-4 px-1 text-[9px]">
                {item.intent}
              </Badge>
              <span className="ml-auto text-[10px] text-muted-foreground">{item.at}</span>
            </div>

            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-muted/30 p-2">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Customer
                </div>
                <p className="mt-0.5 text-xs leading-relaxed">{item.question}</p>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    <Bot className="h-3 w-3" /> Nova reply
                  </div>
                  <ConfidenceRing value={item.confidence} />
                </div>
                <p className="mt-0.5 text-xs leading-relaxed">{item.reply}</p>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-1">
              <Button
                size="sm"
                variant={item.feedback === "up" ? "default" : "ghost"}
                className={cn(
                  "h-7 gap-1 px-2 text-xs",
                  item.feedback === "up" && "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20",
                )}
                onClick={() => onFeedback(item.id, "up")}
              >
                <ThumbsUp className="h-3 w-3" /> Good
              </Button>
              <Button
                size="sm"
                variant={item.feedback === "down" ? "default" : "ghost"}
                className={cn(
                  "h-7 gap-1 px-2 text-xs",
                  item.feedback === "down" && "bg-rose-500/15 text-rose-700 hover:bg-rose-500/20",
                )}
                onClick={() => onFeedback(item.id, "down")}
              >
                <ThumbsDown className="h-3 w-3" /> Improve
              </Button>
              <Button size="sm" variant="ghost" className="h-7 gap-1 px-2 text-xs">
                <HandMetal className="h-3 w-3" /> Takeover
              </Button>
              <Button size="sm" variant="ghost" className="ml-auto h-7 gap-1 px-2 text-xs">
                <Copy className="h-3 w-3" /> Copy
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
