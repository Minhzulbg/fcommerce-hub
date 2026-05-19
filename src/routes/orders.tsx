import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Plus,
  Filter,
  Download,
  Search,
  Phone,
  MapPin,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  CreditCard,
  XCircle,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Calendar,
  MoreHorizontal,
  Copy,
  MessageSquare,
  User,
  ChevronRight,
  Banknote,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});

type Status = "Pending" | "Paid" | "Shipped" | "Delivered" | "Cancelled";
type Courier = "Pathao" | "Steadfast" | "RedX" | "Paperfly";

type Order = {
  id: string;
  customer: string;
  phone: string;
  address: string;
  area: string;
  product: string;
  variant: string;
  qty: number;
  total: string;
  payment: "COD" | "bKash" | "Nagad" | "Card";
  courier: Courier;
  status: Status;
  date: string;
  thumb: string;
};

const orders: Order[] = [
  { id: "#FC-10428", customer: "Nusrat Jahan", phone: "01711-234567", address: "House 42, Road 7, Dhanmondi", area: "Dhaka", product: "Cotton Kurti", variant: "Red · M", qty: 1, total: "৳ 1,250", payment: "bKash", courier: "Pathao", status: "Paid", date: "May 19", thumb: "from-rose-300 to-pink-400" },
  { id: "#FC-10427", customer: "Tanvir Ahmed", phone: "01812-345678", address: "Block C, Bashundhara R/A", area: "Dhaka", product: "Sneakers", variant: "Black · 42", qty: 1, total: "৳ 3,400", payment: "COD", courier: "Steadfast", status: "Pending", date: "May 19", thumb: "from-slate-400 to-slate-600" },
  { id: "#FC-10426", customer: "Sadia Islam", phone: "01913-456789", address: "GEC Circle, Nasirabad", area: "Chattogram", product: "Hijab Set", variant: "Pastel · 3pcs", qty: 1, total: "৳ 980", payment: "Nagad", courier: "RedX", status: "Shipped", date: "May 18", thumb: "from-violet-300 to-fuchsia-400" },
  { id: "#FC-10425", customer: "Rakib Hasan", phone: "01614-567890", address: "Section 12, Mirpur", area: "Dhaka", product: "Smart Watch", variant: "Silver · S5", qty: 1, total: "৳ 4,750", payment: "Card", courier: "Pathao", status: "Paid", date: "May 18", thumb: "from-sky-300 to-blue-500" },
  { id: "#FC-10424", customer: "Mehzabin Rahman", phone: "01515-678901", address: "Zindabazar, Sylhet Sadar", area: "Sylhet", product: "Jamdani Saree", variant: "Maroon", qty: 1, total: "৳ 6,200", payment: "bKash", courier: "Paperfly", status: "Delivered", date: "May 17", thumb: "from-amber-300 to-rose-400" },
  { id: "#FC-10423", customer: "Imran Khan", phone: "01716-789012", address: "Kotwali, Khulna", area: "Khulna", product: "Punjabi Set", variant: "White · L", qty: 4, total: "৳ 2,800", payment: "COD", courier: "Steadfast", status: "Cancelled", date: "May 17", thumb: "from-stone-300 to-stone-500" },
  { id: "#FC-10422", customer: "Farhana Akter", phone: "01817-890123", address: "Halishahar, Chattogram", area: "Chattogram", product: "Three Piece", variant: "Sky Blue · M", qty: 2, total: "৳ 1,990", payment: "bKash", courier: "Pathao", status: "Delivered", date: "May 16", thumb: "from-cyan-300 to-sky-400" },
];

const statusMeta: Record<Status, { color: string; dot: string; icon: typeof Clock }> = {
  Pending: { color: "bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-400", dot: "bg-amber-500", icon: Clock },
  Paid: { color: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400", dot: "bg-emerald-500", icon: CreditCard },
  Shipped: { color: "bg-blue-500/15 text-blue-700 border-blue-500/30 dark:text-blue-400", dot: "bg-blue-500", icon: Truck },
  Delivered: { color: "bg-violet-500/15 text-violet-700 border-violet-500/30 dark:text-violet-400", dot: "bg-violet-500", icon: CheckCircle2 },
  Cancelled: { color: "bg-rose-500/15 text-rose-700 border-rose-500/30 dark:text-rose-400", dot: "bg-rose-500", icon: XCircle },
};

const courierMeta: Record<Courier, { color: string; bg: string }> = {
  Pathao: { color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-500/15" },
  Steadfast: { color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-500/15" },
  RedX: { color: "text-rose-700 dark:text-rose-400", bg: "bg-rose-500/15" },
  Paperfly: { color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-500/15" },
};

const paymentMeta: Record<Order["payment"], string> = {
  COD: "bg-slate-500/15 text-slate-700 dark:text-slate-300",
  bKash: "bg-pink-500/15 text-pink-700 dark:text-pink-400",
  Nagad: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  Card: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400",
};

const tabs: { label: string; count?: number }[] = [
  { label: "All", count: 2847 },
  { label: "Pending", count: 24 },
  { label: "Paid", count: 312 },
  { label: "Shipped", count: 184 },
  { label: "Delivered", count: 2280 },
  { label: "Cancelled", count: 47 },
];

const kpis = [
  { label: "Today's Orders", value: "47", delta: "+12%", icon: ShoppingBag, accent: "from-blue-500/20 to-blue-500/0 text-blue-600" },
  { label: "Revenue (Today)", value: "৳ 84,250", delta: "+18%", icon: DollarSign, accent: "from-emerald-500/20 to-emerald-500/0 text-emerald-600" },
  { label: "Avg Order Value", value: "৳ 1,792", delta: "+6%", icon: TrendingUp, accent: "from-violet-500/20 to-violet-500/0 text-violet-600" },
  { label: "Pending Shipment", value: "24", delta: "Action needed", icon: Truck, accent: "from-amber-500/20 to-amber-500/0 text-amber-600" },
];

function StatusBadge({ status }: { status: Status }) {
  const m = statusMeta[status];
  const Icon = m.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold", m.color)}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

function CourierBadge({ courier }: { courier: Courier }) {
  const m = courierMeta[courier];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold", m.bg, m.color)}>
      <span className={cn("flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold bg-white/60 dark:bg-black/30", m.color)}>
        {courier[0]}
      </span>
      {courier}
    </span>
  );
}

function TimelineStep({
  icon: Icon, title, desc, time, done, active,
}: { icon: typeof Clock; title: string; desc: string; time: string; done: boolean; active?: boolean }) {
  return (
    <li className="relative flex gap-3">
      <div className={cn(
        "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4 ring-card",
        done ? "bg-gradient-primary text-primary-foreground shadow-elegant" :
        active ? "bg-amber-500/15 text-amber-600 animate-pulse" :
        "bg-muted text-muted-foreground"
      )}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1 pb-1">
        <div className={cn("text-sm font-semibold", !done && !active && "text-muted-foreground")}>{title}</div>
        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{desc}</p>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{time}</p>
      </div>
    </li>
  );
}

function OrderDetailsDrawer({ order, open, onClose }: { order: Order | null; open: boolean; onClose: () => void }) {
  if (!order) return null;
  const timeline = [
    { icon: ShoppingBag, title: "Order placed", desc: `Created from Messenger by ${order.customer}`, time: "May 17 · 11:08 AM", done: true },
    { icon: CreditCard, title: "Payment confirmed", desc: `${order.payment} payment ${order.total} received`, time: "May 17 · 02:15 PM", done: ["Paid","Shipped","Delivered"].includes(order.status) },
    { icon: Package, title: "Packed & ready", desc: "Warehouse scan complete — courier assigned", time: "May 18 · 06:30 PM", done: ["Shipped","Delivered"].includes(order.status) },
    { icon: Truck, title: "Out for delivery", desc: `Picked up by ${order.courier} hub`, time: "May 19 · 09:10 AM", done: order.status === "Delivered" || order.status === "Shipped", active: order.status === "Shipped" },
    { icon: CheckCircle2, title: "Delivered", desc: `Handed over to ${order.customer}`, time: "May 19 · 11:42 AM", done: order.status === "Delivered" },
  ];
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0">
        {/* Header */}
        <div className="relative bg-gradient-mesh border-b border-border px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{order.id}</span>
                <button className="text-muted-foreground hover:text-foreground"><Copy className="h-3 w-3" /></button>
              </div>
              <SheetHeader className="space-y-0">
                <SheetTitle className="text-xl">{order.product}</SheetTitle>
              </SheetHeader>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" /> {order.date} · {order.qty} item{order.qty > 1 ? "s" : ""}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold tracking-tight">{order.total}</div>
              <span className={cn("mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold", paymentMeta[order.payment])}>
                <Banknote className="h-3 w-3 mr-1" /> {order.payment}
              </span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge status={order.status} />
            <CourierBadge courier={order.courier} />
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Product */}
          <div className="flex gap-3 rounded-2xl border border-border bg-card p-3">
            <div className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br", order.thumb)}>
              <ShoppingBag className="h-7 w-7 text-white/80" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{order.product}</div>
              <div className="text-xs text-muted-foreground">{order.variant}</div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Qty {order.qty}</span>
                <span className="text-sm font-bold tabular-nums">{order.total}</span>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Customer</div>
              <button className="text-[10px] font-semibold text-primary inline-flex items-center gap-1">View profile <ChevronRight className="h-3 w-3" /></button>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm font-bold">
                    {order.customer.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{order.customer}</div>
                  <div className="text-[11px] text-muted-foreground">12 orders · ৳ 24,500 lifetime</div>
                </div>
                <Button size="icon" variant="outline" className="h-8 w-8 rounded-full"><MessageSquare className="h-3.5 w-3.5" /></Button>
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-mono">{order.phone}</span>
                  <button className="ml-auto text-muted-foreground hover:text-foreground"><Copy className="h-3 w-3" /></button>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-muted/40 px-3 py-2">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  <span>{order.address}, {order.area}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Order Timeline</div>
            <ol className="relative space-y-4">
              <span className="absolute left-[18px] top-2 bottom-2 w-px bg-border" />
              {timeline.map((t, i) => (
                <TimelineStep key={i} {...t} />
              ))}
            </ol>
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm space-y-1.5">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="tabular-nums">{order.total}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Delivery ({order.area})</span><span className="tabular-nums">৳ 60</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Discount</span><span className="tabular-nums">— ৳ 0</span></div>
            <div className="my-2 border-t border-border" />
            <div className="flex justify-between font-bold text-base"><span>Total</span><span className="tabular-nums">{order.total}</span></div>
          </div>

          <div className="flex gap-2 sticky bottom-0 bg-card/80 backdrop-blur -mx-6 px-6 py-3 border-t border-border">
            <Button variant="outline" className="flex-1 rounded-full">Print Invoice</Button>
            <Button className="flex-1 rounded-full bg-gradient-primary shadow-elegant">Update Status</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [selected, setSelected] = useState<Order | null>(null);
  const [query, setQuery] = useState("");

  const visible = orders.filter((o) => {
    if (activeTab !== "All" && o.status !== activeTab) return false;
    if (query && !`${o.id} ${o.customer} ${o.phone} ${o.product}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <AppLayout
      title="Orders"
      subtitle="Track and manage all customer orders across Bangladesh"
      actions={
        <>
          <Button variant="outline" size="sm" className="rounded-full"><Download className="h-4 w-4" /> Export</Button>
          <Button size="sm" className="rounded-full bg-gradient-primary shadow-elegant"><Plus className="h-4 w-4" /> New Order</Button>
        </>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="relative overflow-hidden rounded-2xl border-border/70 shadow-sm hover-lift">
              <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60", k.accent)} />
              <CardContent className="relative p-4">
                <div className="flex items-center justify-between">
                  <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl bg-card/70 backdrop-blur ring-1 ring-border", k.accent.split(" ").find(c=>c.startsWith("text-")))}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground">{k.delta}</span>
                </div>
                <div className="mt-3 text-xs font-medium text-muted-foreground">{k.label}</div>
                <div className="text-xl font-bold tracking-tight tabular-nums">{k.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Orders table */}
      <Card className="mt-6 rounded-2xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-border p-3 sm:p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1 rounded-xl bg-muted/50 p-1 overflow-x-auto">
              {tabs.map((t) => (
                <button
                  key={t.label}
                  onClick={() => setActiveTab(t.label)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap",
                    activeTab === t.label
                      ? "bg-card shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t.label}
                  {t.count !== undefined && (
                    <span className={cn(
                      "rounded-full px-1.5 py-0 text-[10px] font-bold tabular-nums",
                      activeTab === t.label ? "bg-primary/10 text-primary" : "bg-background/70 text-muted-foreground"
                    )}>
                      {t.count.toLocaleString()}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by ID, customer, phone…"
                className="pl-9 h-9 bg-muted/40 border-transparent rounded-full"
              />
            </div>
            <Button variant="outline" size="sm" className="rounded-full h-9"><Filter className="h-4 w-4" /> Courier</Button>
            <Button variant="outline" size="sm" className="rounded-full h-9"><MapPin className="h-4 w-4" /> Area</Button>
            <Button variant="outline" size="sm" className="rounded-full h-9"><Calendar className="h-4 w-4" /> Date</Button>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3 font-bold">Order</th>
                <th className="px-6 py-3 font-bold">Product</th>
                <th className="px-6 py-3 font-bold">Customer</th>
                <th className="px-6 py-3 font-bold">Total</th>
                <th className="px-6 py-3 font-bold">Courier</th>
                <th className="px-6 py-3 font-bold">Status</th>
                <th className="px-6 py-3 font-bold w-12"></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => setSelected(o)}
                  className="group border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-muted/40"
                >
                  <td className="px-6 py-3">
                    <div className="font-mono text-xs font-semibold">{o.id}</div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar className="h-2.5 w-2.5" />{o.date}</div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm", o.thumb)}>
                        <ShoppingBag className="h-4 w-4 text-white/80" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-semibold">{o.product}</div>
                        <div className="text-[11px] text-muted-foreground">{o.variant} · Qty {o.qty}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                          {o.customer.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{o.customer}</div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Phone className="h-2.5 w-2.5" />{o.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="font-bold tabular-nums">{o.total}</div>
                    <span className={cn("mt-0.5 inline-flex rounded-full px-1.5 py-0 text-[9px] font-bold", paymentMeta[o.payment])}>{o.payment}</span>
                  </td>
                  <td className="px-6 py-3"><CourierBadge courier={o.courier} /></td>
                  <td className="px-6 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-6 py-3 text-right">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity rounded-md p-1 hover:bg-muted">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-border">
          {visible.map((o) => (
            <button
              key={o.id}
              onClick={() => setSelected(o)}
              className="w-full p-4 text-left transition-colors hover:bg-muted/40"
            >
              <div className="flex items-start gap-3">
                <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br", o.thumb)}>
                  <ShoppingBag className="h-5 w-5 text-white/80" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground">{o.id}</span>
                    <span className="font-bold tabular-nums text-sm">{o.total}</span>
                  </div>
                  <div className="truncate text-sm font-semibold">{o.product}</div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <User className="h-2.5 w-2.5" />{o.customer} · {o.area}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <StatusBadge status={o.status} />
                    <CourierBadge courier={o.courier} />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 sm:px-6 py-3 text-xs text-muted-foreground">
          <span>Showing 1–{visible.length} of 2,847 orders</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="rounded-full">Previous</Button>
            <Button variant="outline" size="sm" className="rounded-full">Next</Button>
          </div>
        </div>
      </Card>

      <OrderDetailsDrawer order={selected} open={!!selected} onClose={() => setSelected(null)} />
    </AppLayout>
  );
}
