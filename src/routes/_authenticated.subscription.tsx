import { createFileRoute } from "@tanstack/react-router";
import { Check, Sparkles, Zap } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/subscription")({
  component: SubscriptionPage,
});

const plans = [
  {
    name: "Starter",
    price: "৳ 0",
    period: "forever",
    description: "Get started with core tools",
    features: ["Up to 50 orders/mo", "1 Facebook Page", "Basic analytics", "Email support"],
  },
  {
    name: "Growth",
    price: "৳ 1,499",
    period: "/ month",
    description: "Best for growing pages",
    features: ["Unlimited orders", "5 Facebook Pages", "AI auto-replies", "All courier integrations", "Priority support"],
    popular: true,
  },
  {
    name: "Business",
    price: "৳ 3,999",
    period: "/ month",
    description: "For high-volume sellers",
    features: ["Everything in Growth", "Multi-user team (10 seats)", "Advanced AI insights", "Dedicated manager", "Custom integrations"],
  },
];

function SubscriptionPage() {
  return (
    <AppLayout title="Subscription" subtitle="Choose the plan that fits your business">
      {/* Current plan */}
      <Card className="rounded-2xl border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card shadow-sm">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-primary">Current Plan</div>
              <div className="text-xl font-semibold">Growth · ৳ 1,499/month</div>
              <div className="text-xs text-muted-foreground">Renews on June 19, 2026</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Manage billing</Button>
            <Button size="sm">Upgrade</Button>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {plans.map((p) => (
          <Card
            key={p.name}
            className={cn(
              "relative rounded-2xl shadow-sm",
              p.popular && "border-primary/40 shadow-lg ring-1 ring-primary/20",
            )}
          >
            {p.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow-sm">
                  <Zap className="h-3 w-3" /> Most Popular
                </span>
              </div>
            )}
            <CardContent className="p-6">
              <div className="text-sm font-semibold">{p.name}</div>
              <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.period}</span>
              </div>
              <Button className="mt-4 w-full" variant={p.popular ? "default" : "outline"}>
                {p.popular ? "Upgrade now" : "Choose plan"}
              </Button>
              <ul className="mt-5 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Invoices */}
      <Card className="mt-6 rounded-2xl shadow-sm">
        <div className="border-b border-border p-5">
          <h2 className="text-sm font-semibold">Billing History</h2>
          <p className="text-xs text-muted-foreground">Recent invoices</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-6 py-3 font-medium">Invoice</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "INV-2026-005", date: "May 19, 2026", amount: "৳ 1,499", status: "Paid" },
                { id: "INV-2026-004", date: "Apr 19, 2026", amount: "৳ 1,499", status: "Paid" },
                { id: "INV-2026-003", date: "Mar 19, 2026", amount: "৳ 1,499", status: "Paid" },
              ].map((i) => (
                <tr key={i.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-6 py-3 font-mono text-xs">{i.id}</td>
                  <td className="px-6 py-3 text-muted-foreground">{i.date}</td>
                  <td className="px-6 py-3 font-medium">{i.amount}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                      {i.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppLayout>
  );
}
