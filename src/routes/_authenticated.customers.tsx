import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Users,
  UserPlus,
  Crown,
  ShoppingBag,
  Facebook,
  Tag,
  TrendingUp,
  Calendar,
  X,
  DollarSign,
  Loader2,
  Download,
  Filter,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/customers")({
  component: CustomersPage,
});

type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  address: string | null;
  fb_user_id: string | null;
  total_orders: number;
  total_spent: number;
  tags: string[];
  notes: string | null;
  created_at: string;
};

const GRADIENTS = [
  "from-rose-400 via-pink-400 to-fuchsia-500",
  "from-sky-400 via-blue-500 to-indigo-500",
  "from-emerald-400 via-teal-400 to-cyan-500",
  "from-amber-400 via-orange-400 to-rose-500",
  "from-violet-400 via-purple-500 to-fuchsia-500",
  "from-lime-400 via-green-400 to-emerald-500",
  "from-cyan-400 via-sky-500 to-blue-600",
];

const gradientFor = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
};

const tagFor = (c: Customer): { label: string; color: string; icon: typeof Crown } => {
  if (c.total_spent >= 20000) return { label: "VIP", color: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30", icon: Crown };
  if (c.total_orders >= 3) return { label: "Loyal", color: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30", icon: TrendingUp };
  return { label: "New", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30", icon: UserPlus };
};

const initials = (n: string) =>
  n.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

function CustomerCard({ c, onSelect }: { c: Customer; onSelect: () => void }) {
  const t = tagFor(c);
  const TagIcon = t.icon;
  return (
    <Card className="group overflow-hidden rounded-2xl border-border/70 shadow-sm hover-lift cursor-pointer" onClick={onSelect}>
      <div className={cn("relative h-20 bg-gradient-to-br", gradientFor(c.id))}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.25),transparent)]" />
        <div className="absolute right-3 top-3">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
            <TagIcon className="h-2.5 w-2.5" /> {t.label}
          </span>
        </div>
      </div>
      <CardContent className="relative px-5 pb-5 pt-0">
        <Avatar className="-mt-8 h-14 w-14 ring-4 ring-card shadow-elegant">
          <AvatarFallback className="bg-gradient-primary text-base font-bold text-primary-foreground">
            {initials(c.name)}
          </AvatarFallback>
        </Avatar>
        <div className="mt-3">
          <h3 className="font-bold tracking-tight">{c.name}</h3>
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
            {c.fb_user_id ? (
              <>
                <Facebook className="h-3 w-3" /> {c.fb_user_id.slice(0, 12)}
              </>
            ) : (
              <>
                <Phone className="h-3 w-3" /> {c.phone ?? "—"}
              </>
            )}
            {c.city && <> · {c.city}</>}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-border bg-muted/30 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Orders</div>
            <div className="text-lg font-bold tabular-nums">{c.total_orders}</div>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">LTV</div>
            <div className="text-lg font-bold tabular-nums">
              ৳ {c.total_spent >= 1000 ? (c.total_spent / 1000).toFixed(1) + "K" : c.total_spent}
            </div>
          </div>
        </div>

        {c.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {c.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AddCustomerDialog({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", address: "", tags: "", notes: "" });

  const create = useMutation({
    mutationFn: async () => {
      if (!form.name.trim()) throw new Error("Name required");
      const { error } = await supabase.from("customers").insert({
        user_id: user!.id,
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        city: form.city.trim() || null,
        address: form.address.trim() || null,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        notes: form.notes.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Customer added");
      qc.invalidateQueries({ queryKey: ["customers"] });
      onClose();
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Customer</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Name *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nusrat Jahan" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="017xxxxxxxx" />
            </div>
            <div>
              <Label>City</Label>
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Dhaka" />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" />
          </div>
          <div>
            <Label>Address</Label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="House, Road, Area" />
          </div>
          <div>
            <Label>Tags <span className="text-muted-foreground">(comma-separated)</span></Label>
            <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="VIP, Repeat" />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
          </div>
          <Button className="w-full" onClick={() => create.mutate()} disabled={create.isPending}>
            {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Customer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CustomerDrawer({ c, open, onClose }: { c: Customer | null; open: boolean; onClose: () => void }) {
  if (!c) return null;
  const t = tagFor(c);
  const TagIcon = t.icon;
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-xl">
        <div className={cn("relative h-32 bg-gradient-to-br", gradientFor(c.id))}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.25),transparent)]" />
          <button onClick={onClose} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50">
            <X className="h-4 w-4" />
          </button>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <Avatar className="h-20 w-20 ring-4 ring-card shadow-elegant">
              <AvatarFallback className="bg-gradient-primary text-2xl font-bold text-primary-foreground">
                {initials(c.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="px-6 pb-4 pt-12 text-center">
          <SheetHeader className="space-y-0">
            <SheetTitle className="text-xl">{c.name}</SheetTitle>
          </SheetHeader>
          <Badge className={cn("mt-2 rounded-full border", t.color)}>
            <TagIcon className="mr-1 h-3 w-3" /> {t.label} Customer
          </Badge>
        </div>

        <div className="px-6">
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: c.total_orders.toString(), l: "Orders", icon: ShoppingBag, color: "text-blue-600 bg-blue-500/15" },
              { v: `৳ ${c.total_spent >= 1000 ? (c.total_spent / 1000).toFixed(1) + "K" : c.total_spent}`, l: "Lifetime", icon: DollarSign, color: "text-emerald-600 bg-emerald-500/15" },
              { v: c.total_orders > 0 ? `৳ ${Math.round(c.total_spent / c.total_orders).toLocaleString()}` : "—", l: "Avg", icon: TrendingUp, color: "text-violet-600 bg-violet-500/15" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-border bg-card p-3 text-center">
                <div className={cn("mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-xl", s.color)}>
                  <s.icon className="h-4 w-4" />
                </div>
                <div className="text-base font-bold tabular-nums">{s.v}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 px-6">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Contact Info</div>
          <div className="space-y-2 rounded-2xl border border-border bg-card p-3 text-sm">
            {c.phone && <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /><span className="font-mono">{c.phone}</span></div>}
            {c.email && <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /><span className="truncate">{c.email}</span></div>}
            {(c.city || c.address) && <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{[c.address, c.city].filter(Boolean).join(", ")}</span></div>}
            <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground" /><span>Since {new Date(c.created_at).toLocaleDateString()}</span></div>
          </div>
        </div>

        {c.tags.length > 0 && (
          <div className="mt-5 px-6">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tags</div>
            <div className="flex flex-wrap gap-1.5">
              {c.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[11px] font-medium">
                  <Tag className="h-2.5 w-2.5" /> {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {c.notes && (
          <div className="mt-5 px-6 pb-6">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Notes</div>
            <div className="whitespace-pre-wrap rounded-2xl border border-border bg-card p-3 text-sm">{c.notes}</div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CustomersPage() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<Customer | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "VIP" | "Loyal" | "New">("All");
  const [showAdd, setShowAdd] = useState(false);

  const q = useQuery({
    queryKey: ["customers", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Customer[];
    },
  });

  const all = q.data ?? [];
  const visible = useMemo(() => {
    return all.filter((c) => {
      if (filter !== "All" && tagFor(c).label !== filter) return false;
      if (query) {
        const hay = `${c.name} ${c.phone ?? ""} ${c.city ?? ""} ${c.email ?? ""}`.toLowerCase();
        if (!hay.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [all, filter, query]);

  const stats = useMemo(() => {
    const total = all.length;
    const newMonth = all.filter((c) => {
      const d = new Date(c.created_at);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    const loyal = all.filter((c) => c.total_orders >= 3).length;
    const vip = all.filter((c) => c.total_spent >= 20000).length;
    return [
      { label: "Total Customers", value: total.toLocaleString(), icon: Users, accent: "from-blue-500/20 to-blue-500/0 text-blue-600" },
      { label: "New This Month", value: newMonth.toLocaleString(), icon: UserPlus, accent: "from-emerald-500/20 to-emerald-500/0 text-emerald-600" },
      { label: "Loyal Buyers", value: loyal.toLocaleString(), icon: TrendingUp, accent: "from-violet-500/20 to-violet-500/0 text-violet-600" },
      { label: "VIP Members", value: vip.toLocaleString(), icon: Crown, accent: "from-amber-500/20 to-amber-500/0 text-amber-600" },
    ];
  }, [all]);

  const filters: { label: typeof filter; count: number }[] = [
    { label: "All", count: all.length },
    { label: "VIP", count: all.filter((c) => tagFor(c).label === "VIP").length },
    { label: "Loyal", count: all.filter((c) => tagFor(c).label === "Loyal").length },
    { label: "New", count: all.filter((c) => tagFor(c).label === "New").length },
  ];

  return (
    <AppLayout
      title="Customers"
      subtitle="Your CRM — relationships, lifetime value, and engagement"
      actions={
        <>
          <Button variant="outline" size="sm" className="rounded-full"><Download className="h-4 w-4" /> Export</Button>
          <Button size="sm" onClick={() => setShowAdd(true)} className="rounded-full bg-gradient-primary shadow-elegant">
            <Plus className="h-4 w-4" /> Add Customer
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="hover-lift relative overflow-hidden rounded-2xl border-border/70 shadow-sm">
              <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60", s.accent)} />
              <CardContent className="relative p-4">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl bg-card/70 ring-1 ring-border backdrop-blur", s.accent.split(" ").find((c) => c.startsWith("text-")))}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="mt-3 text-xs font-medium text-muted-foreground">{s.label}</div>
                <div className="text-xl font-bold tabular-nums tracking-tight">{s.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-1 overflow-x-auto rounded-xl bg-muted/50 p-1">
          {filters.map((f) => (
            <button
              key={f.label}
              onClick={() => setFilter(f.label)}
              className={cn(
                "inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                filter === f.label ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
              <span className={cn(
                "rounded-full px-1.5 py-0 text-[10px] font-bold tabular-nums",
                filter === f.label ? "bg-primary/10 text-primary" : "bg-background/70 text-muted-foreground",
              )}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 sm:ml-auto sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, city…"
            className="h-9 rounded-full border-transparent bg-muted/40 pl-9"
          />
        </div>
        <Button variant="outline" size="sm" className="h-9 rounded-full"><Filter className="h-4 w-4" /> More</Button>
      </div>

      {q.isLoading && (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!q.isLoading && all.length === 0 && (
        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <Users className="h-10 w-10 text-muted-foreground" />
          <div className="text-sm font-medium">No customers yet</div>
          <p className="max-w-sm text-xs text-muted-foreground">
            Customers এখানে যোগ করুন বা inbox-এ conversation শুরু হলে automatic যোগ হবে।
          </p>
          <Button size="sm" onClick={() => setShowAdd(true)} className="mt-2 gap-2">
            <Plus className="h-4 w-4" /> Add your first customer
          </Button>
        </div>
      )}

      {visible.length > 0 && (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((c) => (
            <CustomerCard key={c.id} c={c} onSelect={() => setSelected(c)} />
          ))}
        </div>
      )}

      {!q.isLoading && all.length > 0 && visible.length === 0 && (
        <div className="mt-12 text-center text-sm text-muted-foreground">
          No customers match your filters.
        </div>
      )}

      {showAdd && <AddCustomerDialog onClose={() => setShowAdd(false)} />}
      <CustomerDrawer c={selected} open={!!selected} onClose={() => setSelected(null)} />
      {/* Unused imports retained: MessageSquare */}
      <span className="hidden"><MessageSquare /></span>
    </AppLayout>
  );
}
