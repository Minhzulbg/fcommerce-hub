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
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
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
};

const stats: Stat[] = [
  {
    label: "Total Orders",
    value: "2,847",
    delta: "+12.4%",
    trend: "up",
    icon: ShoppingBag,
    hint: "vs last month",
    accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    label: "Revenue",
    value: "৳ 8,42,560",
    delta: "+18.2%",
    trend: "up",
    icon: DollarSign,
    hint: "this month",
    accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Unread Messages",
    value: "126",
    delta: "-4.1%",
    trend: "down",
    icon: MessageSquare,
    hint: "in inbox",
    accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    label: "AI Replies",
    value: "1,032",
    delta: "+34.6%",
    trend: "up",
    icon: Bot,
    hint: "auto-handled",
    accent: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    label: "Courier Status",
    value: "94.2%",
    delta: "+1.8%",
    trend: "up",
    icon: Truck,
    hint: "delivery success",
    accent: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
];

const chartData = [40, 62, 48, 75, 58, 84, 70, 92, 78, 96, 88, 110];

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

function Dashboard() {
  const max = Math.max(...chartData);
  return (
    <AppLayout
      title="Dashboard"
      subtitle="Welcome back, Arif. Here's what's happening today."
      actions={
        <>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm">
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
              className="rounded-2xl border-border/70 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", s.accent)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                      s.trend === "up"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-rose-500/10 text-rose-600",
                    )}
                  >
                    <Trend className="h-3 w-3" />
                    {s.delta}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                  <div className="mt-1 text-2xl font-semibold tracking-tight">{s.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.hint}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart + Courier */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Revenue Overview</CardTitle>
              <p className="text-xs text-muted-foreground">Last 12 months performance</p>
            </div>
            <Badge variant="outline" className="gap-1">
              <ArrowUpRight className="h-3 w-3" /> +18.2%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex h-56 items-end gap-2 sm:gap-3">
              {chartData.map((v, i) => (
                <div key={i} className="group flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-primary/60 to-primary transition-all group-hover:opacity-90"
                    style={{ height: `${(v / max) * 100}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {["J","F","M","A","M","J","J","A","S","O","N","D"][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Courier Performance</CardTitle>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Pathao", value: 96, color: "bg-emerald-500" },
              { name: "Steadfast", value: 92, color: "bg-blue-500" },
              { name: "RedX", value: 88, color: "bg-rose-500" },
              { name: "Paperfly", value: 81, color: "bg-amber-500" },
            ].map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-muted-foreground">{c.value}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full rounded-full", c.color)} style={{ width: `${c.value}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="mt-6 rounded-2xl shadow-sm">
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
                <tr className="border-y border-border bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-6 py-3 font-medium">Order</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Item</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-6 py-3 font-mono text-xs">{o.id}</td>
                    <td className="px-6 py-3 font-medium">{o.name}</td>
                    <td className="px-6 py-3 text-muted-foreground">{o.item}</td>
                    <td className="px-6 py-3 font-medium">{o.amount}</td>
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
    </AppLayout>
  );
}
