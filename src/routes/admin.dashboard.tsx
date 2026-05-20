import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Users, Wallet, Clock, TrendingUp, ShieldCheck } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const stats = useQuery({
    queryKey: ["admin_stats"],
    queryFn: async () => {
      const [pending, approved, users, activeSub] = await Promise.all([
        supabase.from("payment_requests").select("id, amount", { count: "exact" }).eq("status", "pending"),
        supabase.from("payment_requests").select("amount").eq("status", "approved"),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
      ]);
      const pendingAmount = (pending.data ?? []).reduce((s, r: any) => s + Number(r.amount ?? 0), 0);
      const totalRevenue = (approved.data ?? []).reduce((s, r: any) => s + Number(r.amount ?? 0), 0);
      return {
        pendingCount: pending.count ?? 0,
        pendingAmount,
        totalRevenue,
        userCount: users.count ?? 0,
        activeSubs: activeSub.count ?? 0,
      };
    },
  });

  const recent = useQuery({
    queryKey: ["admin_recent_payments"],
    queryFn: async () => {
      const { data } = await supabase
        .from("payment_requests")
        .select("*, plan:subscription_plans(name)")
        .order("created_at", { ascending: false })
        .limit(6);
      return data ?? [];
    },
  });

  const cards = [
    { label: "Pending payments", value: stats.data?.pendingCount ?? "—", sub: `৳ ${(stats.data?.pendingAmount ?? 0).toLocaleString()}`, icon: Clock, color: "from-amber-400 to-orange-500" },
    { label: "Total revenue", value: `৳ ${(stats.data?.totalRevenue ?? 0).toLocaleString()}`, sub: "approved payments", icon: Wallet, color: "from-emerald-400 to-teal-500" },
    { label: "Active subscribers", value: stats.data?.activeSubs ?? "—", sub: "currently paid", icon: TrendingUp, color: "from-violet-400 to-indigo-500" },
    { label: "Total users", value: stats.data?.userCount ?? "—", sub: "registered accounts", icon: Users, color: "from-sky-400 to-blue-500" },
  ];

  return (
    <AdminLayout title="Admin Overview" subtitle="Platform-wide metrics & controls">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="p-5 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-white shadow-sm`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 text-2xl font-bold tabular-nums">{c.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{c.label}</div>
              <div className="mt-2 text-[11px] text-muted-foreground">{c.sub}</div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 rounded-2xl p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Recent payment requests</h2>
              <p className="text-xs text-muted-foreground">Latest 6 submissions</p>
            </div>
            <Link to="/admin/payments" className="text-xs font-medium text-primary hover:underline">View all →</Link>
          </div>
          <div className="space-y-2">
            {recent.isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
            {!recent.isLoading && recent.data?.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No payment requests yet</div>
            )}
            {recent.data?.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <div className="text-sm font-medium">{p.plan?.name ?? "—"} · ৳ {p.amount}</div>
                  <div className="text-[11px] text-muted-foreground font-mono">{p.transaction_id} · {p.method}</div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                  p.status === "approved" ? "bg-emerald-500/10 text-emerald-600" :
                  p.status === "rejected" ? "bg-red-500/10 text-red-600" :
                  "bg-amber-500/10 text-amber-600"
                }`}>{p.status}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-semibold">Quick actions</h2>
          <div className="mt-4 space-y-2">
            <Link to="/admin/payments" className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/40">
              <CreditCard className="h-4 w-4 text-primary" />
              <div className="text-sm font-medium">Review payments</div>
            </Link>
            <Link to="/admin/users" className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/40">
              <Users className="h-4 w-4 text-primary" />
              <div className="text-sm font-medium">Manage users</div>
            </Link>
            <Link to="/dashboard" className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/40">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <div className="text-sm font-medium">Back to user app</div>
            </Link>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
