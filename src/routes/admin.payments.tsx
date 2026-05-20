import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/payments")({
  component: AdminPaymentsPage,
});

function AdminPaymentsPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const q = useQuery({
    queryKey: ["admin_payments", filter],
    queryFn: async () => {
      let query = supabase
        .from("payment_requests")
        .select("*, plan:subscription_plans(name, price_bdt, duration_days)")
        .order("created_at", { ascending: false })
        .limit(200);
      if (filter !== "all") query = query.eq("status", filter);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });

  const userIds = Array.from(new Set((q.data ?? []).map((r: any) => r.user_id)));
  const profilesQ = useQuery({
    queryKey: ["admin_payment_profiles", userIds.join(",")],
    enabled: userIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, business_name")
        .in("id", userIds);
      if (error) throw error;
      return Object.fromEntries((data ?? []).map((p) => [p.id, p]));
    },
  });

  const approve = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc("approve_payment_request", { _request_id: id, _note: note || undefined });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Payment approved & subscription activated");
      setNoteFor(null); setNote("");
      qc.invalidateQueries({ queryKey: ["admin_payments"] });
      qc.invalidateQueries({ queryKey: ["admin_stats"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Approve failed"),
  });

  const reject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc("reject_payment_request", { _request_id: id, _note: note || undefined });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Payment rejected");
      setNoteFor(null); setNote("");
      qc.invalidateQueries({ queryKey: ["admin_payments"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Reject failed"),
  });

  return (
    <AdminLayout title="Payment Approvals" subtitle="Review and approve subscription payments">
      <div className="mb-4 flex gap-2">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">
            {f}
          </Button>
        ))}
      </div>

      <Card className="rounded-2xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Method</th>
                <th className="px-4 py-3 font-medium">Sender</th>
                <th className="px-4 py-3 font-medium">TrxID</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {q.isLoading && (
                <tr><td colSpan={9} className="p-8 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></td></tr>
              )}
              {!q.isLoading && q.data?.length === 0 && (
                <tr><td colSpan={9} className="p-8 text-center text-muted-foreground">No payment requests</td></tr>
              )}
              {q.data?.map((p: any) => {
                const prof = profilesQ.data?.[p.user_id];
                return (
                  <tr key={p.id} className="border-b border-border last:border-0 align-top hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="font-medium">{prof?.full_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{prof?.business_name ?? ""}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{p.plan?.name}</div>
                      <div className="text-xs text-muted-foreground">{p.plan?.duration_days}d</div>
                    </td>
                    <td className="px-4 py-3 capitalize">{p.method}</td>
                    <td className="px-4 py-3 font-mono text-xs">{p.sender_number}</td>
                    <td className="px-4 py-3 font-mono text-xs">{p.transaction_id}</td>
                    <td className="px-4 py-3 font-medium">৳ {p.amount}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {p.status === "pending" ? (
                        noteFor === p.id ? (
                          <div className="flex flex-col gap-2 min-w-[200px]">
                            <Input placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} className="h-8 text-xs" />
                            <div className="flex gap-1">
                              <Button size="sm" className="h-7 text-xs" onClick={() => approve.mutate(p.id)} disabled={approve.isPending}>Approve</Button>
                              <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => reject.mutate(p.id)} disabled={reject.isPending}>Reject</Button>
                              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setNoteFor(null); setNote(""); }}>Cancel</Button>
                            </div>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setNoteFor(p.id)}>Review</Button>
                        )
                      ) : (
                        <span className="text-xs text-muted-foreground">{p.admin_note ?? "—"}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved")
    return <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600"><CheckCircle2 className="h-3 w-3" /> Approved</span>;
  if (status === "rejected")
    return <span className="inline-flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-600"><XCircle className="h-3 w-3" /> Rejected</span>;
  return <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600"><Clock className="h-3 w-3" /> Pending</span>;
}
