import { createFileRoute } from "@tanstack/react-router";
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
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
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
    accent: "from-blue-500/20 to-blue-500/0 text-blue-600 dark:text-blue-400",
    spark: [12, 18, 14, 22, 19, 26, 24, 30, 28, 34],
  },
  {
    label: "Revenue",
    value: "৳ 8,42,560",
    delta: "+18.2%",
    trend: "up",
    icon: DollarSign,
    hint: "this month",
    accent: "from-emerald-500/20 to-emerald-500/0 text-emerald-600 dark:text-emerald-400",
    spark: [20, 24, 19, 28, 32, 30, 36, 38, 42, 48],
  },
  {
    label: "Unread Messages",
    value: "126",
    delta: "-4.1%",
    trend: "down",
    icon: MessageSquare,
    hint: "in inbox",
    accent: "from-amber-500/20 to-amber-500/0 text-amber-600 dark:text-amber-400",
    spark: [30, 28, 32, 25, 27, 22, 24, 20, 22, 18],
  },
  {
    label: "AI Replies",
    value: "1,032",
    delta: "+34.6%",
    trend: "up",
    icon: Bot,
    hint: "auto-handled",
    accent: "from-violet-500/20 to-violet-500/0 text-violet-600 dark:text-violet-400",
    spark: [8, 12, 10, 16, 18, 22, 26, 30, 34, 40],
  },
  {
    label: "Courier Success",
    value: "94.2%",
    delta: "+1.8%",
    trend: "up",
    icon: Truck,
    hint: "delivery rate",
    accent: "from-pink-500/20 to-pink-500/0 text-pink-600 dark:text-pink-400",
    spark: [88, 90, 89, 91, 90, 92, 93, 92, 94, 94],
  },
];

const chartData = [40, 62, 48, 75, 58, 84, 70, 92, 78, 96, 88, 110];
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const recentOrders = [
  { id: "#FC-10428", name: "Nusrat Jahan", item: "Cotton Kurti — M", amount: "৳ 1,250", status: "Paid" },
  { id: "#FC-10427", name: "Tanvir Ahmed", item: "Sneakers Size 42", amount: "৳ 3,400", status: "Pending" },
  { id: "#FC-10426", name: "Sadia Islam", item: "Hijab Set (3pcs)", amount: "৳ 980", status: "Shipped" },
  { id: "#FC-10425", name: "Rakib Hasan", item: "Smart Watch", amount: "৳ 4,750", status: "Paid" },
  { id: "#FC-10424", name: "Mehzabin Rahman", item: "Saree — Jamdani", amount: "৳ 6,200", status: "Delivered" },
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

function Dashboard() {
  const max = Math.max(...chartData);
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
              <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60", s.accent)} />
              <CardContent className="relative p-5">
                <div className="flex items-start justify-between">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-card/70 backdrop-blur ring-1 ring-border", s.accent.split(" ").filter(c=>c.startsWith("text-")).join(" "))}>
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

      {/* Chart + Courier */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl shadow-sm lg:col-span-2 overflow-hidden">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Revenue Overview</CardTitle>
              <p className="text-xs text-muted-foreground">Last 12 months · BDT</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex rounded-lg bg-muted/60 p-0.5 text-xs">
                {["12M","6M","30D","7D"].map((p, i) => (
                  <button key={p} className={cn("rounded-md px-2.5 py-1 font-medium", i===0 ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground")}>{p}</button>
                ))}
              </div>
              <Badge variant="outline" className="gap-1 rounded-full bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                <ArrowUpRight className="h-3 w-3" /> +18.2%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-end gap-2 sm:gap-3">
              {chartData.map((v, i) => (
                <div key={i} className="group/bar relative flex flex-1 flex-col items-center gap-2">
                  <div className="absolute -top-7 hidden rounded-md bg-foreground px-2 py-0.5 text-[10px] font-medium text-background shadow group-hover/bar:block">
                    ৳ {(v * 7600).toLocaleString()}
                  </div>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary/40 via-primary/70 to-primary transition-all duration-300 group-hover/bar:from-primary/60 group-hover/bar:to-violet-500"
                    style={{ height: `${(v / max) * 100}%` }}
                  />
                  <span className="text-[10px] font-medium text-muted-foreground">{months[i]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Courier Performance</CardTitle>
            <p className="text-xs text-muted-foreground">Last 30 days · success rate</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Pathao", value: 96, color: "from-emerald-400 to-emerald-600", badge: "bg-emerald-500/10 text-emerald-600" },
              { name: "Steadfast", value: 92, color: "from-blue-400 to-blue-600", badge: "bg-blue-500/10 text-blue-600" },
              { name: "RedX", value: 88, color: "from-rose-400 to-rose-600", badge: "bg-rose-500/10 text-rose-600" },
              { name: "Paperfly", value: 81, color: "from-amber-400 to-amber-600", badge: "bg-amber-500/10 text-amber-600" },
            ].map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={cn("flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold", c.badge)}>{c.name[0]}</span>
                    <span className="font-medium">{c.name}</span>
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
            <Button variant="ghost" size="sm">View all</Button>
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
                      <td className="px-6 py-3 font-medium">{o.name}</td>
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
