import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Users,
  UserPlus,
  Repeat,
  Crown,
  ShoppingBag,
  MessageSquare,
  Facebook,
  Star,
  Tag,
  TrendingUp,
  Calendar,
  ChevronRight,
  Filter,
  Download,
  Copy,
  X,
  Package,
  DollarSign,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/customers")({
  component: CustomersPage,
});

type Tag = "VIP" | "Loyal" | "New" | "At Risk";

type Customer = {
  name: string;
  fb: string;
  email: string;
  phone: string;
  city: string;
  area: string;
  orders: number;
  spent: number;
  aov: number;
  lastOrder: string;
  joined: string;
  tag: Tag;
  cover: string;
  spark: number[];
};

const customers: Customer[] = [
  { name: "Nusrat Jahan", fb: "nusrat.j", email: "nusrat@example.com", phone: "01711-234567", city: "Dhaka", area: "Dhanmondi", orders: 12, spent: 24500, aov: 2042, lastOrder: "2 days ago", joined: "Mar 2024", tag: "VIP", cover: "from-rose-400 via-pink-400 to-fuchsia-500", spark: [4,6,5,8,7,10,9,12] },
  { name: "Tanvir Ahmed", fb: "tanvir.ahmed", email: "tanvir@example.com", phone: "01812-345678", city: "Chattogram", area: "Nasirabad", orders: 8, spent: 12650, aov: 1581, lastOrder: "1 week ago", joined: "Jan 2024", tag: "Loyal", cover: "from-sky-400 via-blue-500 to-indigo-500", spark: [2,3,4,3,5,6,7,8] },
  { name: "Sadia Islam", fb: "sadia.islam", email: "sadia@example.com", phone: "01913-456789", city: "Sylhet", area: "Zindabazar", orders: 5, spent: 6200, aov: 1240, lastOrder: "3 days ago", joined: "Apr 2025", tag: "New", cover: "from-emerald-400 via-teal-400 to-cyan-500", spark: [1,2,2,3,3,4,5,5] },
  { name: "Rakib Hasan", fb: "rakib.h", email: "rakib@example.com", phone: "01614-567890", city: "Khulna", area: "Kotwali", orders: 14, spent: 38900, aov: 2779, lastOrder: "Yesterday", joined: "Aug 2023", tag: "VIP", cover: "from-amber-400 via-orange-400 to-rose-500", spark: [5,7,6,9,11,10,13,14] },
  { name: "Mehzabin Rahman", fb: "mehzabin.r", email: "mehzabin@example.com", phone: "01515-678901", city: "Dhaka", area: "Gulshan", orders: 3, spent: 4100, aov: 1366, lastOrder: "5 days ago", joined: "May 2025", tag: "New", cover: "from-violet-400 via-purple-500 to-fuchsia-500", spark: [1,1,2,2,2,3,3,3] },
  { name: "Imran Khan", fb: "imran.k", email: "imran@example.com", phone: "01716-789012", city: "Rajshahi", area: "Boalia", orders: 7, spent: 9800, aov: 1400, lastOrder: "2 weeks ago", joined: "Nov 2024", tag: "Loyal", cover: "from-lime-400 via-green-400 to-emerald-500", spark: [2,3,3,4,5,5,6,7] },
  { name: "Farhana Akter", fb: "farhana.a", email: "farhana@example.com", phone: "01817-890123", city: "Chattogram", area: "Halishahar", orders: 2, spent: 1990, aov: 995, lastOrder: "2 months ago", joined: "Feb 2025", tag: "At Risk", cover: "from-slate-400 via-slate-500 to-zinc-600", spark: [1,2,2,2,2,2,2,2] },
  { name: "Shakib Hossain", fb: "shakib.h", email: "shakib@example.com", phone: "01918-901234", city: "Dhaka", area: "Mirpur", orders: 6, spent: 11200, aov: 1866, lastOrder: "1 week ago", joined: "Jul 2024", tag: "Loyal", cover: "from-cyan-400 via-sky-500 to-blue-600", spark: [2,3,3,4,4,5,5,6] },
];

const tagMeta: Record<Tag, { color: string; icon: typeof Crown; bg: string }> = {
  VIP: { color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-500/15 border-amber-500/30", icon: Crown },
  Loyal: { color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-500/15 border-blue-500/30", icon: Repeat },
  New: { color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/30", icon: UserPlus },
  "At Risk": { color: "text-rose-700 dark:text-rose-400", bg: "bg-rose-500/15 border-rose-500/30", icon: TrendingUp },
};

const stats = [
  { label: "Total Customers", value: "4,328", delta: "+12%", icon: Users, accent: "from-blue-500/20 to-blue-500/0 text-blue-600" },
  { label: "New This Month", value: "248", delta: "+34", icon: UserPlus, accent: "from-emerald-500/20 to-emerald-500/0 text-emerald-600" },
  { label: "Repeat Buyers", value: "1,612", delta: "+8%", icon: Repeat, accent: "from-violet-500/20 to-violet-500/0 text-violet-600" },
  { label: "VIP Members", value: "184", delta: "+12", icon: Crown, accent: "from-amber-500/20 to-amber-500/0 text-amber-600" },
];

const filters: { label: string; count: number }[] = [
  { label: "All", count: 4328 },
  { label: "VIP", count: 184 },
  { label: "Loyal", count: 1612 },
  { label: "New", count: 248 },
  { label: "At Risk", count: 96 },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const w = 100, h = 24, step = w / (data.length - 1);
  const pts = data.map((v, i) => [i * step, h - ((v - min) / range) * h]);
  const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-6 w-full" preserveAspectRatio="none">
      <path d={d} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CustomerCard({ c, onSelect }: { c: Customer; onSelect: () => void }) {
  const t = tagMeta[c.tag];
  const TagIcon = t.icon;
  return (
    <Card className="group overflow-hidden rounded-2xl border-border/70 shadow-sm hover-lift cursor-pointer" onClick={onSelect}>
      <div className={cn("relative h-20 bg-gradient-to-br", c.cover)}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.25),transparent)]" />
        <div className="absolute right-3 top-3">
          <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold backdrop-blur bg-white/20 text-white border-white/30")}>
            <TagIcon className="h-2.5 w-2.5" /> {c.tag}
          </span>
        </div>
      </div>
      <CardContent className="relative px-5 pb-5 pt-0">
        <Avatar className="-mt-8 h-14 w-14 ring-4 ring-card shadow-elegant">
          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-base font-bold">
            {c.name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div className="mt-3">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold tracking-tight">{c.name}</h3>
            {c.tag === "VIP" && <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />}
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
            <Facebook className="h-3 w-3" /> @{c.fb} · {c.city}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-border bg-muted/30 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Orders</div>
            <div className="text-lg font-bold tabular-nums">{c.orders}</div>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">LTV</div>
            <div className="text-lg font-bold tabular-nums">৳ {(c.spent/1000).toFixed(1)}K</div>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-border bg-muted/20 p-2.5">
          <div className="mb-0.5 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Activity</span>
            <span className="text-emerald-600 font-bold normal-case">↑ {c.lastOrder}</span>
          </div>
          <Sparkline data={c.spark} color="oklch(0.65 0.18 162)" />
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          <Button size="sm" variant="outline" className="flex-1 rounded-full h-8 text-xs gap-1.5"
            onClick={(e) => { e.stopPropagation(); }}>
            <MessageSquare className="h-3 w-3" /> Message
          </Button>
          <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={(e) => e.stopPropagation()}>
            <Phone className="h-3 w-3" />
          </Button>
          <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={(e) => e.stopPropagation()}>
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CustomerDrawer({ c, open, onClose }: { c: Customer | null; open: boolean; onClose: () => void }) {
  if (!c) return null;
  const t = tagMeta[c.tag];
  const TagIcon = t.icon;
  const orderHistory = [
    { id: "#FC-10428", item: "Cotton Kurti — M", amt: "৳ 1,250", status: "Paid", color: "bg-emerald-500/15 text-emerald-600", date: "May 19" },
    { id: "#FC-10401", item: "Hijab Set (3pcs)", amt: "৳ 980", status: "Delivered", color: "bg-violet-500/15 text-violet-600", date: "May 12" },
    { id: "#FC-10387", item: "Saree — Jamdani", amt: "৳ 6,200", status: "Delivered", color: "bg-violet-500/15 text-violet-600", date: "May 02" },
    { id: "#FC-10342", item: "Punjabi Set", amt: "৳ 2,800", status: "Delivered", color: "bg-violet-500/15 text-violet-600", date: "Apr 18" },
    { id: "#FC-10318", item: "Smart Watch", amt: "৳ 4,750", status: "Delivered", color: "bg-violet-500/15 text-violet-600", date: "Apr 04" },
  ];

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-xl p-0 overflow-y-auto">
        {/* Messenger-style profile preview */}
        <div className={cn("relative h-32 bg-gradient-to-br", c.cover)}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.25),transparent)]" />
          <button onClick={onClose} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50">
            <X className="h-4 w-4" />
          </button>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <Avatar className="h-20 w-20 ring-4 ring-card shadow-elegant">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
                {c.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="px-6 pt-12 pb-4 text-center">
          <SheetHeader className="space-y-0">
            <SheetTitle className="text-xl flex items-center justify-center gap-1.5">
              {c.name}
              {c.tag === "VIP" && <Star className="h-4 w-4 fill-amber-500 text-amber-500" />}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Facebook className="h-3 w-3 text-blue-500" /> @{c.fb}
          </div>
          <Badge className={cn("mt-2 rounded-full border", t.bg, t.color)}>
            <TagIcon className="h-3 w-3 mr-1" /> {c.tag} Customer
          </Badge>
          <div className="mt-4 flex gap-2 justify-center">
            <Button size="sm" className="rounded-full bg-gradient-primary shadow-elegant gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Message</Button>
            <Button size="sm" variant="outline" className="rounded-full gap-1.5"><Phone className="h-3.5 w-3.5" /> Call</Button>
            <Button size="sm" variant="outline" className="rounded-full gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</Button>
          </div>
        </div>

        {/* LTV stats */}
        <div className="px-6">
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: c.orders.toString(), l: "Orders", icon: ShoppingBag, color: "text-blue-600 bg-blue-500/15" },
              { v: `৳ ${(c.spent/1000).toFixed(1)}K`, l: "Lifetime", icon: DollarSign, color: "text-emerald-600 bg-emerald-500/15" },
              { v: `৳ ${c.aov.toLocaleString()}`, l: "Avg Order", icon: TrendingUp, color: "text-violet-600 bg-violet-500/15" },
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

        {/* Contact */}
        <div className="px-6 mt-5">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Contact Info</div>
          <div className="space-y-2 rounded-2xl border border-border bg-card p-3 text-sm">
            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /><span className="font-mono">{c.phone}</span><button className="ml-auto text-muted-foreground hover:text-foreground"><Copy className="h-3.5 w-3.5" /></button></div>
            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /><span className="truncate">{c.email}</span></div>
            <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{c.area}, {c.city}</span></div>
            <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground" /><span>Customer since {c.joined}</span></div>
          </div>
        </div>

        {/* Tags */}
        <div className="px-6 mt-5">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tags</div>
          <div className="flex flex-wrap gap-1.5">
            {[c.tag, c.city, c.area, "Cotton", "Repeat buyer"].map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-muted/60 border border-border px-2.5 py-1 text-[11px] font-medium">
                <Tag className="h-2.5 w-2.5" /> {tag}
              </span>
            ))}
            <button className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted/40">
              <Plus className="h-2.5 w-2.5" /> Add tag
            </button>
          </div>
        </div>

        {/* Order history */}
        <div className="px-6 mt-5 pb-6">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Order History</div>
            <button className="text-[10px] font-semibold text-primary">View all ({c.orders})</button>
          </div>
          <div className="space-y-2">
            {orderHistory.slice(0, c.orders).map((o) => (
              <div key={o.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition-colors hover:bg-muted/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-chart-4/20 text-primary">
                  <Package className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground">{o.id}</span>
                    <span className="text-[10px] text-muted-foreground">{o.date}</span>
                  </div>
                  <div className="truncate text-sm font-semibold">{o.item}</div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className={cn("rounded-full px-1.5 py-0 text-[9px] font-bold", o.color)}>{o.status}</span>
                    <span className="text-sm font-bold tabular-nums">{o.amt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CustomersPage() {
  const [selected, setSelected] = useState<Customer | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const visible = customers.filter((c) => {
    if (filter !== "All" && c.tag !== filter) return false;
    if (query && !`${c.name} ${c.phone} ${c.city} ${c.fb}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <AppLayout
      title="Customers"
      subtitle="Your CRM — relationships, lifetime value, and engagement"
      actions={
        <>
          <Button variant="outline" size="sm" className="rounded-full"><Download className="h-4 w-4" /> Export</Button>
          <Button size="sm" className="rounded-full bg-gradient-primary shadow-elegant"><Plus className="h-4 w-4" /> Add Customer</Button>
        </>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="relative overflow-hidden rounded-2xl border-border/70 shadow-sm hover-lift">
              <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60", s.accent)} />
              <CardContent className="relative p-4">
                <div className="flex items-center justify-between">
                  <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl bg-card/70 backdrop-blur ring-1 ring-border", s.accent.split(" ").find(c=>c.startsWith("text-")))}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">{s.delta}</span>
                </div>
                <div className="mt-3 text-xs font-medium text-muted-foreground">{s.label}</div>
                <div className="text-xl font-bold tracking-tight tabular-nums">{s.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-1 rounded-xl bg-muted/50 p-1 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f.label}
              onClick={() => setFilter(f.label)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap",
                filter === f.label ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
              <span className={cn(
                "rounded-full px-1.5 py-0 text-[10px] font-bold tabular-nums",
                filter === f.label ? "bg-primary/10 text-primary" : "bg-background/70 text-muted-foreground"
              )}>{f.count.toLocaleString()}</span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 sm:max-w-xs sm:ml-auto">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, city…"
            className="pl-9 h-9 bg-muted/40 border-transparent rounded-full"
          />
        </div>
        <Button variant="outline" size="sm" className="rounded-full h-9"><Filter className="h-4 w-4" /> More</Button>
      </div>

      {/* Cards grid */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((c) => (
          <CustomerCard key={c.fb} c={c} onSelect={() => setSelected(c)} />
        ))}
      </div>

      {visible.length === 0 && (
        <div className="mt-12 text-center text-sm text-muted-foreground">No customers match your filters.</div>
      )}

      <CustomerDrawer c={selected} open={!!selected} onClose={() => setSelected(null)} />
    </AppLayout>
  );
}
