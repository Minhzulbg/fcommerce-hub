import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, ShieldCheck, Search, UserPlus } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [promoteEmail, setPromoteEmail] = useState("");
  const [open, setOpen] = useState(false);

  const usersQ = useQuery({
    queryKey: ["admin_users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, full_name, business_name, created_at")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      const ids = (profiles ?? []).map((p) => p.id);
      const [{ data: roles }, { data: subs }] = await Promise.all([
        supabase.from("user_roles").select("user_id, role").in("user_id", ids),
        supabase.from("subscriptions").select("user_id, status, expires_at, plan:subscription_plans(name)").in("user_id", ids),
      ]);
      const roleMap = new Map<string, string[]>();
      (roles ?? []).forEach((r: any) => {
        const arr = roleMap.get(r.user_id) ?? [];
        arr.push(r.role);
        roleMap.set(r.user_id, arr);
      });
      const subMap = new Map<string, any>();
      (subs ?? []).forEach((s: any) => subMap.set(s.user_id, s));
      return (profiles ?? []).map((p) => ({
        ...p,
        roles: roleMap.get(p.id) ?? [],
        sub: subMap.get(p.id),
      }));
    },
  });

  const promote = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.rpc("promote_to_admin", { _email: email });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("User promoted to admin");
      setOpen(false); setPromoteEmail("");
      qc.invalidateQueries({ queryKey: ["admin_users"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Promote failed"),
  });

  const filtered = (usersQ.data ?? []).filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (u.full_name ?? "").toLowerCase().includes(q) ||
           (u.business_name ?? "").toLowerCase().includes(q) ||
           u.id.toLowerCase().includes(q);
  });

  return (
    <AdminLayout
      title="Users"
      subtitle="All registered accounts"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><UserPlus className="h-4 w-4" /> Promote admin</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Promote user to admin</DialogTitle>
              <DialogDescription>Enter the email of an existing user to grant admin privileges.</DialogDescription>
            </DialogHeader>
            <Input type="email" placeholder="user@example.com" value={promoteEmail} onChange={(e) => setPromoteEmail(e.target.value)} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => promote.mutate(promoteEmail)} disabled={!promoteEmail || promote.isPending}>
                {promote.isPending ? "Promoting…" : "Promote"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="mb-4 relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by name, business, or ID…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card className="rounded-2xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Business</th>
                <th className="px-4 py-3 font-medium">Subscription</th>
                <th className="px-4 py-3 font-medium">Roles</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {usersQ.isLoading && (
                <tr><td colSpan={5} className="p-8 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></td></tr>
              )}
              {!usersQ.isLoading && filtered.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No users found</td></tr>
              )}
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="font-medium">{u.full_name ?? "—"}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{u.id.slice(0, 8)}…</div>
                  </td>
                  <td className="px-4 py-3">{u.business_name ?? <span className="text-muted-foreground">—</span>}</td>
                  <td className="px-4 py-3">
                    {u.sub ? (
                      <div>
                        <div className="text-sm">{u.sub.plan?.name ?? "—"}</div>
                        <div className="text-[11px] text-muted-foreground capitalize">{u.sub.status}</div>
                      </div>
                    ) : <span className="text-muted-foreground">None</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.length === 0 && <span className="text-xs text-muted-foreground">user</span>}
                      {u.roles.map((r) => (
                        <span key={r} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          r === "admin" ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" : "bg-muted text-muted-foreground"
                        }`}>
                          {r === "admin" && <ShieldCheck className="h-3 w-3" />}{r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  );
}
