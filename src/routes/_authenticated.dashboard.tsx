import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ShoppingBag,
  DollarSign,
  MessageSquare,
  Bot,
  Truck,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Plus,
  Download,
  CheckCircle2,
  Package,
  Clock,
  MapPin,
  Sparkles,
  Zap,
  Target,
  ThumbsUp,
  Timer,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

type Stat = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  icon: typeof ShoppingBag;
  hint: string;
  accent: string;
  ring: string;
  spark: number[];
};

const stats: Stat[] = [
  {
    label: "Total Orders",
    value: "2,847",
    delta: "+12.4%",
    trend: "up",
    icon: ShoppingBag,
    hint: "vs last month",
    accent: "from-blue-500/25 via-blue-500/5 to-transparent",
    ring: "text-blue-600 dark:text-blue-400",
    spark: [12, 18, 14, 22, 19, 26, 24, 30, 28, 34],
  },
  {
    label: "Revenue",
    value: "৳ 8,42,560",
    delta: "+18.2%",
    trend: "up",
    icon: DollarSign,
    hint: "this month",
    accent: "from-emerald-500/25 via-emerald-500/5 to-transparent",
    ring: "text-emerald-600 dark:text-emerald-400",
    spark: [20, 24, 19, 28, 32, 30, 36, 38, 42, 48],
  },
  {
    label: "Unread Messages",
    value: "126",
    delta: "-4.1%",
    trend: "down",
    icon: MessageSquare,
    hint: "in inbox",
    accent: "from-amber-500/25 via-amber-500/5 to-transparent",
    ring: "text-amber-600 dark:text-amber-400",
    spark: [30, 28, 32, 25, 27, 22, 24, 20, 22, 18],
  },
  {
    label: "AI Replies",
    value: "1,032",
    delta: "+34.6%",
    trend: "up",
    icon: Bot,
    hint: "auto-handled",
    accent: "from-violet-500/25 via-violet-500/5 to-transparent",
    ring: "text-violet-600 dark:text-violet-400",
    spark: [8, 12, 10, 16, 18, 22, 26, 30, 34, 40],
  },
  {
    label: "Courier Success",
    value: "94.2%",
    delta: "+1.8%",
    trend: "up",
    icon: Truck,
    hint: "delivery rate",
    accent: "from-pink-500/25 via-pink-500/5 to-transparent",
    ring: "text-pink-600 dark:text-pink-400",
    spark: [88, 90, 89, 91, 90, 92, 93, 92, 94, 94],
  },
];

// 12 months of revenue + last year for comparison
const revenueThisYear = [320, 380, 360, 440, 520, 480, 600, 640, 580, 720, 760, 842];
const revenueLastYear = [260, 300, 290, 340, 380, 360, 420, 460, 440, 520, 540, 600];
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Weekly orders (last 7 days) with paid vs pending split
const weekly = [
  { day: "Mon", paid: 38, pending: 12 },
  { day: "Tue", paid: 52, pending: 18 },
  { day: "Wed", paid: 44, pending: 14 },
  { day: "Thu", paid: 68, pending: 22 },
  { day: "Fri", paid: 84, pending: 26 },
  { day: "Sat", paid: 96, pending: 30 },
  { day: "Sun", paid: 72, pending: 20 },
];

const recentOrders = [
  { id: "#FC-10428", name: "Nusrat Jahan", item: "Cotton Kurti — M", amount: "৳ 1,250", status: "Paid", channel: "Messenger" },
  { id: "#FC-10427", name: "Tanvir Ahmed", item: "Sneakers Size 42", amount: "৳ 3,400", status: "Pending", channel: "Instagram" },
  { id: "#FC-10426", name: "Sadia Islam", item: "Hijab Set (3pcs)", amount: "৳ 980", status: "Shipped", channel: "WhatsApp" },
  { id: "#FC-10425", name: "Rakib Hasan", item: "Smart Watch", amount: "৳ 4,750", status: "Paid", channel: "Messenger" },
  { id: "#FC-10424", name: "Mehzabin Rahman", item: "Saree — Jamdani", amount: "৳ 6,200", status: "Delivered", channel: "Messenger" },
];

const statusStyle: Record<string, string> = {
  Paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Shipped: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Delivered: "bg-violet-500/10 text-violet-600 border-violet-500/20",
};

const timeline = [
  { icon: CheckCircle2, color: "bg-emerald-500/15 text-emerald-600", title: "Delivered", desc: "Pathao rider handed over to Mehzabin Rahman, Dhanmondi", time: "Today · 11:42 AM", done: true },
  { icon: Truck, color: "bg-blue-500/15 text-blue-600", title: "Out for delivery", desc: "Picked up by Pathao Hub · Dhaka North", time: "Today · 09:10 AM", done: true },
  { icon: Package, color: "bg-violet-500/15 text-violet-600", title: "Packed & dispatched", desc: "Warehouse scan complete — courier assigned", time: "Yesterday · 06:30 PM", done: true },
  { icon: Clock, color: "bg-amber-500/15 text-amber-600", title: "Payment confirmed", desc: "bKash payment ৳ 6,200 received", time: "Yesterday · 02:15 PM", done: true },
  { icon: MapPin, color: "bg-muted text-muted-foreground", title: "Order placed", desc: "Order #FC-10424 created from Messenger", time: "May 17 · 11:08 AM", done: false },
];

const aiStats = [
  { icon: Zap, label: "Auto-replied", value: "1,032", sub: "this month", color: "from-violet-500 to-fuchsia-500" },
  { icon: Target, label: "Accuracy", value: "96.4%", sub: "intent match", color: "from-emerald-500 to-teal-500" },
  { icon: Timer, label: "Avg response", value: "1.8s", sub: "vs 4m human", color: "from-blue-500 to-cyan-500" },
  { icon: ThumbsUp, label: "CSAT", value: "4.8/5", sub: "from 412 chats", color: "from-amber-500 to-orange-500" },
];

function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100, h = 30;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => [i * step, h - ((v - min) / range) * h]);
  const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const area = `${d} L${w},${h} L0,${h} Z`;
  const id = Math.random().toString(36).slice(2, 8);
  const stroke = up ? "oklch(0.65 0.18 162)" : "oklch(0.65 0.22 22)";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={d} stroke={stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Smooth area chart for revenue with two series
function RevenueAreaChart() {
  const w = 720;
  const h = 240;
  const padX = 36;
  const padY = 24;
  const all = [...revenueThisYear, ...revenueLastYear];
  const max = Math.max(...all) * 1.1;
  const stepX = (w - padX * 2) / (revenueThisYear.length - 1);
  const toPts = (arr: number[]) =>
    arr.map((v, i) => [padX + i * stepX, h - padY - (v / max) * (h - padY * 2)] as [number, number]);

  // Catmull-Rom -> cubic bezier for smooth curve
  const smooth = (pts: [number, number][]) => {
    if (pts.length < 2) return "";
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
      const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
    }
    return d;
  };

  const ptsA = toPts(revenueThisYear);
  const ptsB = toPts(revenueLastYear);
  const dA = smooth(ptsA);
  const dB = smooth(ptsB);
  const areaA = `${dA} L${ptsA[ptsA.length - 1][0]},${h - padY} L${ptsA[0][0]},${h - padY} Z`;

  const yTicks = 4;
  const gridLines = Array.from({ length: yTicks + 1 }, (_, i) => padY + ((h - padY * 2) / yTicks) * i);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-64 w-full">
      <defs>
        <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.62 0.21 280)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="oklch(0.62 0.21 280)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rev-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.62 0.21 280)" />
          <stop offset="100%" stopColor="oklch(0.7 0.18 200)" />
        </linearGradient>
      </defs>
      {gridLines.map((y, i) => (
        <line key={i} x1={padX} x2={w - padX} y1={y} y2={y} stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 4" />
      ))}
      {months.map((m, i) => (
        <text key={m} x={padX + i * stepX} y={h - 4} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>{m}</text>
      ))}
      {/* last year (dashed) */}
      <path d={dB} fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="5 5" />
      {/* this year */}
      <path d={areaA} fill="url(#rev-fill)" />
      <path d={dA} fill="none" stroke="url(#rev-stroke)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {ptsA.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="3" fill="hsl(var(--background))" stroke="oklch(0.62 0.21 280)" strokeWidth="2" />
        </g>
      ))}
    </svg>
  );
}

function WeeklyOrdersChart() {
  const max = Math.max(...weekly.map((d) => d.paid + d.pending));
  return (
    <div className="flex h-56 items-end gap-3 px-1">
      {weekly.map((d) => {
        const total = d.paid + d.pending;
        const totalPct = (total / max) * 100;
        const paidPct = (d.paid / total) * 100;
        return (
          <div key={d.day} className="group/bar relative flex flex-1 flex-col items-center gap-2">
            <div className="absolute -top-9 z-10 hidden flex-col items-center rounded-md bg-foreground px-2 py-1 text-[10px] font-medium text-background shadow-lg group-hover/bar:flex">
              <span className="tabular-nums">{total} orders</span>
              <span className="text-background/70">৳ {(total * 1450).toLocaleString()}</span>
            </div>
            <div
              className="relative w-full overflow-hidden rounded-t-lg bg-muted/60 transition-all"
              style={{ height: `${totalPct}%` }}
            >
              <div
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary via-primary to-violet-500 transition-all group-hover/bar:from-primary group-hover/bar:to-fuchsia-500"
                style={{ height: `${paidPct}%` }}
              />
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}

function Dashboard() {
  return (
    <AppLayout
      title="Dashboard"
      subtitle="Welcome back, Arif. Here's what's happening today."
      actions={
        <>
          <Button variant="outline" size="sm" className="rounded-full">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm" className="rounded-full bg-gradient-primary shadow-elegant">
            <Plus className="h-4 w-4" /> New Order
          </Button>
        </>
      }
    >
      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((s) => {
          const Icon = s.icon;
          const Trend = s.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <Card
              key={s.label}
              className="group relative overflow-hidden rounded-2xl border-border/70 shadow-sm hover-lift"
            >
              <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80", s.accent)} />
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl" />
              <CardContent className="relative p-5">
                <div className="flex items-start justify-between">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-card/70 backdrop-blur ring-1 ring-border", s.ring)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
                      s.trend === "up"
                        ? "bg-emerald-500/15 text-emerald-600"
                        : "bg-rose-500/15 text-rose-600",
                    )}
                  >
                    <Trend className="h-3 w-3" />
                    {s.delta}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-xs font-medium text-muted-foreground">{s.label}</div>
                  <div className="mt-1 text-2xl font-bold tracking-tight tabular-nums">{s.value}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{s.hint}</div>
                </div>
                <div className="mt-3">
                  <Sparkline data={s.spark} up={s.trend === "up"} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue chart + Weekly orders */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl shadow-sm lg:col-span-2 overflow-hidden">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Revenue Overview</CardTitle>
              <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> This year</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-muted-foreground/50" /> Last year</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex rounded-lg bg-muted/60 p-0.5 text-xs">
                {["12M","6M","30D","7D"].map((p, i) => (
                  <button key={p} className={cn("rounded-md px-2.5 py-1 font-medium transition", i===0 ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground")}>{p}</button>
                ))}
              </div>
              <Badge variant="outline" className="gap-1 rounded-full bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                <ArrowUpRight className="h-3 w-3" /> +18.2%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 border-b border-border pb-4 mb-2">
              <div>
                <div className="text-xs text-muted-foreground">This year</div>
                <div className="text-xl font-bold tabular-nums">৳ 84.2L</div>
                <div className="text-[11px] text-emerald-600">+18.2% YoY</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Avg / month</div>
                <div className="text-xl font-bold tabular-nums">৳ 7.02L</div>
                <div className="text-[11px] text-muted-foreground">across 12 months</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Best month</div>
                <div className="text-xl font-bold tabular-nums">৳ 8.42L</div>
                <div className="text-[11px] text-muted-foreground">December</div>
              </div>
            </div>
            <RevenueAreaChart />
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Weekly Orders</CardTitle>
              <p className="text-xs text-muted-foreground">Last 7 days · paid vs pending</p>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold tabular-nums">454</div>
              <div className="text-xs font-semibold text-emerald-600">+22.6%</div>
            </div>
            <p className="text-[11px] text-muted-foreground mb-4">orders this week</p>
            <WeeklyOrdersChart />
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-primary" /> Paid <b className="ml-1 tabular-nums">{weekly.reduce((a,d)=>a+d.paid,0)}</b></span>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground"><span className="h-2 w-2 rounded-sm bg-muted-foreground/40" /> Pending <b className="ml-1 tabular-nums text-foreground">{weekly.reduce((a,d)=>a+d.pending,0)}</b></span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI performance + Courier delivery */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl shadow-sm lg:col-span-2 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/10 pointer-events-none" />
          <CardHeader className="relative flex flex-row items-start justify-between space-y-0">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">AI Assistant Performance</CardTitle>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Real-time metrics from your auto-reply engine</p>
            </div>
            <Badge className="rounded-full bg-violet-500/15 text-violet-600 border-0 gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-500 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-500" />
              </span>
              Live
            </Badge>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {aiStats.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.label} className="rounded-xl border border-border/70 bg-card/70 backdrop-blur p-3">
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm", a.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="mt-2.5 text-lg font-bold tabular-nums">{a.value}</div>
                    <div className="text-[11px] font-medium text-foreground">{a.label}</div>
                    <div className="text-[10px] text-muted-foreground">{a.sub}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">AI handled vs Human handled</span>
                <span className="text-xs text-muted-foreground">last 30 days</span>
              </div>
              <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: "72%" }} />
                <div className="bg-gradient-to-r from-blue-400 to-cyan-400" style={{ width: "28%" }} />
              </div>
              <div className="mt-2 flex justify-between text-[11px]">
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500" /> AI · <b className="tabular-nums">1,032 (72%)</b></span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-400" /> Human · <b className="tabular-nums">412 (28%)</b></span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Courier Delivery Stats</CardTitle>
            <p className="text-xs text-muted-foreground">Last 30 days · success rate</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Pathao", value: 96, total: 842, color: "from-emerald-400 to-emerald-600", badge: "bg-emerald-500/10 text-emerald-600" },
              { name: "Steadfast", value: 92, total: 614, color: "from-blue-400 to-blue-600", badge: "bg-blue-500/10 text-blue-600" },
              { name: "RedX", value: 88, total: 458, color: "from-rose-400 to-rose-600", badge: "bg-rose-500/10 text-rose-600" },
              { name: "Paperfly", value: 81, total: 312, color: "from-amber-400 to-amber-600", badge: "bg-amber-500/10 text-amber-600" },
            ].map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={cn("flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold", c.badge)}>{c.name[0]}</span>
                    <span className="font-medium">{c.name}</span>
                    <span className="text-[10px] text-muted-foreground tabular-nums">· {c.total} orders</span>
                  </div>
                  <span className="font-semibold tabular-nums">{c.value}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full rounded-full bg-gradient-to-r transition-all", c.color)} style={{ width: `${c.value}%` }} />
                </div>
              </div>
            ))}
            <div className="mt-2 rounded-xl border border-dashed border-border bg-muted/30 p-3 text-xs text-muted-foreground flex items-start gap-2">
              <Sparkles className="h-3.5 w-3.5 mt-0.5 text-primary" />
              <span><b className="text-foreground">AI tip:</b> Pathao is performing 4% better in Dhaka — auto-route there for faster delivery.</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent + Timeline */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Recent Orders</CardTitle>
              <p className="text-xs text-muted-foreground">Latest 5 transactions</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1"><Eye className="h-4 w-4" /> View all</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-border bg-muted/30 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-3 font-semibold">Order</th>
                    <th className="px-6 py-3 font-semibold">Customer</th>
                    <th className="px-6 py-3 font-semibold">Item</th>
                    <th className="px-6 py-3 font-semibold">Amount</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                      <td className="px-6 py-3 font-mono text-xs">{o.id}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary text-[10px] font-bold text-primary-foreground">
                            {o.name.split(" ").map((n) => n[0]).slice(0,2).join("")}
                          </div>
                          <div className="leading-tight">
                            <div className="font-medium">{o.name}</div>
                            <div className="text-[10px] text-muted-foreground">{o.channel}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">{o.item}</td>
                      <td className="px-6 py-3 font-semibold tabular-nums">{o.amount}</td>
                      <td className="px-6 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
                            statusStyle[o.status],
                          )}
                        >
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Order Tracking</CardTitle>
              <p className="text-xs text-muted-foreground font-mono">#FC-10424 · Pathao</p>
            </div>
            <Badge className="rounded-full bg-emerald-500/15 text-emerald-600 border-0">Delivered</Badge>
          </CardHeader>
          <CardContent>
            <ol className="relative space-y-5">
              <span className="absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-border to-border" />
              {timeline.map((t, i) => {
                const Icon = t.icon;
                return (
                  <li key={i} className="relative flex gap-3">
                    <div className={cn("relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4 ring-card", t.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className={cn("text-sm font-semibold", !t.done && "text-muted-foreground")}>{t.title}</div>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                      <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{t.time}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
