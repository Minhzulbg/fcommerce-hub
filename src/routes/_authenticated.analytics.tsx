import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Users, ShoppingBag, Eye } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/analytics")({
  component: AnalyticsPage,
});

const kpi = [
  { label: "Page Views", value: "248K", delta: "+22%", icon: Eye },
  { label: "Conversion Rate", value: "4.8%", delta: "+0.6%", icon: TrendingUp },
  { label: "New Customers", value: "1,284", delta: "+12%", icon: Users },
  { label: "Avg Order Value", value: "৳ 2,140", delta: "+8%", icon: ShoppingBag },
];

const revenue = [38, 52, 41, 68, 55, 79, 65, 88, 72, 94, 82, 105];

const products = [
  { name: "Cotton Kurti", sales: 412, revenue: "৳ 5,15,000" },
  { name: "Jamdani Saree", sales: 188, revenue: "৳ 11,65,600" },
  { name: "Hijab Set", sales: 356, revenue: "৳ 3,48,880" },
  { name: "Sneakers", sales: 124, revenue: "৳ 4,21,600" },
  { name: "Smart Watch", sales: 96, revenue: "৳ 4,56,000" },
];

function AnalyticsPage() {
  const max = Math.max(...revenue);
  return (
    <AppLayout title="Analytics" subtitle="Deep insights into your store performance">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpi.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="rounded-2xl shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium text-emerald-600">{k.delta}</span>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">{k.label}</div>
                <div className="text-2xl font-semibold">{k.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Revenue Trend</CardTitle>
            <p className="text-xs text-muted-foreground">Monthly revenue, last 12 months</p>
          </CardHeader>
          <CardContent>
            <svg viewBox="0 0 600 220" className="h-56 w-full">
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
              </defs>
              {(() => {
                const w = 600, h = 220, p = 20;
                const step = (w - p * 2) / (revenue.length - 1);
                const pts = revenue.map((v, i) => [p + i * step, h - p - (v / max) * (h - p * 2)]);
                const d = pts.map((pt, i) => (i === 0 ? `M${pt[0]},${pt[1]}` : `L${pt[0]},${pt[1]}`)).join(" ");
                const area = `${d} L${pts[pts.length - 1][0]},${h - p} L${pts[0][0]},${h - p} Z`;
                return (
                  <>
                    <path d={area} fill="url(#g)" />
                    <path d={d} fill="none" stroke="oklch(0.55 0.20 262)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {pts.map(([x, y], i) => (
                      <circle key={i} cx={x} cy={y} r="3" fill="oklch(0.55 0.20 262)" />
                    ))}
                  </>
                );
              })()}
            </svg>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Traffic Sources</CardTitle>
            <p className="text-xs text-muted-foreground">Where buyers come from</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Facebook Page", value: 58, color: "bg-blue-500" },
              { name: "Instagram", value: 22, color: "bg-pink-500" },
              { name: "WhatsApp", value: 12, color: "bg-emerald-500" },
              { name: "Direct", value: 8, color: "bg-amber-500" },
            ].map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground">{s.value}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full rounded-full", s.color)} style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Top Products</CardTitle>
          <p className="text-xs text-muted-foreground">By revenue this month</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-border bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Units Sold</th>
                  <th className="px-6 py-3 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.name} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-6 py-3 font-medium">{p.name}</td>
                    <td className="px-6 py-3 text-muted-foreground">{p.sales}</td>
                    <td className="px-6 py-3 font-semibold">{p.revenue}</td>
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
