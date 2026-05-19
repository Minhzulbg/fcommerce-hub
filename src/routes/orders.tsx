import { useMemo, useState } from "react";
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
  XCircle,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  MoreHorizontal,
  Copy,
  MessageSquare,
  User,
  Banknote,
  LayoutGrid,
  List,
  GripVertical,
  ClipboardCheck,
  RotateCcw,
  Hourglass,
  PackageCheck,
  PackageOpen,
  Send,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Activity,
  CalendarDays,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});

// -------------------- Types & data --------------------

type Status =
  | "Pending"
  | "Awaiting Confirmation"
  | "Confirmed"
  | "Packing"
  | "Ready for Courier"
  | "Shipped"
  | "Delivered"
  | "Returned"
  | "Cancelled";

type Courier = "Pathao" | "Steadfast" | "RedX" | "Paperfly" | "Unassigned";

type TimelineEvent = {
  status: Status | "Created" | "Note";
  at: string;
  by: string;
  note?: string;
};

type Order = {
  id: string;
  customer: string;
  phone: string;
  address: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  cod: number; // amount to collect on delivery
  paid: boolean;
  status: Status;
  courier: Courier;
  trackingId?: string;
  createdAt: string;
  channel: "Messenger" | "Instagram" | "WhatsApp" | "Manual";
  packingChecklist: { label: string; done: boolean }[];
  timeline: TimelineEvent[];
  returnReason?: string;
};

const STATUSES: Status[] = [
  "Pending",
  "Awaiting Confirmation",
  "Confirmed",
  "Packing",
  "Ready for Courier",
  "Shipped",
  "Delivered",
  "Returned",
  "Cancelled",
];

const STATUS_META: Record<
  Status,
  { icon: typeof Clock; tone: string; ring: string; dot: string; soft: string }
> = {
  Pending: {
    icon: Hourglass,
    tone: "text-slate-700 dark:text-slate-200",
    ring: "ring-slate-200 dark:ring-slate-800",
    dot: "bg-slate-400",
    soft: "bg-slate-500/10 text-slate-700 dark:text-slate-200",
  },
  "Awaiting Confirmation": {
    icon: Clock,
    tone: "text-amber-700 dark:text-amber-300",
    ring: "ring-amber-200 dark:ring-amber-900/50",
    dot: "bg-amber-500",
    soft: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  Confirmed: {
    icon: CheckCircle2,
    tone: "text-sky-700 dark:text-sky-300",
    ring: "ring-sky-200 dark:ring-sky-900/50",
    dot: "bg-sky-500",
    soft: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  },
  Packing: {
    icon: PackageOpen,
    tone: "text-violet-700 dark:text-violet-300",
    ring: "ring-violet-200 dark:ring-violet-900/50",
    dot: "bg-violet-500",
    soft: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
  "Ready for Courier": {
    icon: PackageCheck,
    tone: "text-indigo-700 dark:text-indigo-300",
    ring: "ring-indigo-200 dark:ring-indigo-900/50",
    dot: "bg-indigo-500",
    soft: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  },
  Shipped: {
    icon: Truck,
    tone: "text-blue-700 dark:text-blue-300",
    ring: "ring-blue-200 dark:ring-blue-900/50",
    dot: "bg-blue-500",
    soft: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  },
  Delivered: {
    icon: CheckCircle2,
    tone: "text-emerald-700 dark:text-emerald-300",
    ring: "ring-emerald-200 dark:ring-emerald-900/50",
    dot: "bg-emerald-500",
    soft: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  Returned: {
    icon: RotateCcw,
    tone: "text-orange-700 dark:text-orange-300",
    ring: "ring-orange-200 dark:ring-orange-900/50",
    dot: "bg-orange-500",
    soft: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  },
  Cancelled: {
    icon: XCircle,
    tone: "text-rose-700 dark:text-rose-300",
    ring: "ring-rose-200 dark:ring-rose-900/50",
    dot: "bg-rose-500",
    soft: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
};

const COURIERS: Courier[] = ["Unassigned", "Pathao", "Steadfast", "RedX", "Paperfly"];

const COURIER_TONE: Record<Courier, string> = {
  Pathao: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20",
  Steadfast: "bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/20",
  RedX: "bg-rose-500/10 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/20",
  Paperfly: "bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/20",
  Unassigned: "bg-muted text-muted-foreground ring-1 ring-border",
};

const defaultChecklist = () => [
  { label: "Verified customer phone", done: false },
  { label: "Picked all items from SKU", done: false },
  { label: "Quality check passed", done: false },
  { label: "Invoice printed", done: false },
  { label: "Sealed & labeled", done: false },
];

const seedOrders: Order[] = [
  {
    id: "FC-10428",
    customer: "Nusrat Jahan",
    phone: "+8801712345678",
    address: "House 12, Road 5, Dhanmondi, Dhaka",
    items: [
      { name: "Silk Saree — Royal Blue", qty: 1, price: 2200 },
      { name: "Matching Blouse Piece", qty: 1, price: 450 },
    ],
    total: 2650,
    cod: 2650,
    paid: false,
    status: "Awaiting Confirmation",
    courier: "Unassigned",
    createdAt: "2 min ago",
    channel: "Messenger",
    packingChecklist: defaultChecklist(),
    timeline: [
      { status: "Created", at: "2 min ago", by: "Nova AI" },
      { status: "Awaiting Confirmation", at: "1 min ago", by: "System" },
    ],
  },
  {
    id: "FC-10427",
    customer: "Md. Rakib Hasan",
    phone: "+8801911223344",
    address: "Plot 33, Sector 7, Uttara, Dhaka",
    items: [{ name: "Premium Panjabi — White", qty: 2, price: 1800 }],
    total: 3600,
    cod: 0,
    paid: true,
    status: "Confirmed",
    courier: "Pathao",
    createdAt: "18 min ago",
    channel: "WhatsApp",
    packingChecklist: defaultChecklist().map((c, i) => ({ ...c, done: i < 2 })),
    timeline: [
      { status: "Created", at: "1h ago", by: "Arif R." },
      { status: "Awaiting Confirmation", at: "55m ago", by: "Nova AI" },
      { status: "Confirmed", at: "18m ago", by: "Arif R." },
    ],
  },
  {
    id: "FC-10426",
    customer: "Tasnim Ahmed",
    phone: "+8801555667788",
    address: "Apt 4B, Banani DOHS, Dhaka",
    items: [{ name: "Hijab Bundle — 3 pcs", qty: 1, price: 1200 }],
    total: 1320,
    cod: 1320,
    paid: false,
    status: "Packing",
    courier: "Steadfast",
    createdAt: "1h ago",
    channel: "Instagram",
    packingChecklist: defaultChecklist().map((c, i) => ({ ...c, done: i < 4 })),
    timeline: [
      { status: "Created", at: "3h ago", by: "Nova AI" },
      { status: "Confirmed", at: "2h ago", by: "Arif R." },
      { status: "Packing", at: "1h ago", by: "Mahin K." },
    ],
  },
  {
    id: "FC-10425",
    customer: "Shahriar Karim",
    phone: "+8801877665544",
    address: "Road 11, Block C, Bashundhara R/A",
    items: [{ name: "Leather Wallet — Black", qty: 1, price: 950 }],
    total: 1050,
    cod: 1050,
    paid: false,
    status: "Ready for Courier",
    courier: "Pathao",
    trackingId: "PTH-AX982174",
    createdAt: "3h ago",
    channel: "Messenger",
    packingChecklist: defaultChecklist().map((c) => ({ ...c, done: true })),
    timeline: [
      { status: "Created", at: "5h ago", by: "Arif R." },
      { status: "Confirmed", at: "4h ago", by: "Arif R." },
      { status: "Packing", at: "3h 30m ago", by: "Mahin K." },
      { status: "Ready for Courier", at: "3h ago", by: "Mahin K." },
    ],
  },
  {
    id: "FC-10424",
    customer: "Farzana Akter",
    phone: "+8801633221100",
    address: "Mirpur 10, Dhaka",
    items: [{ name: "Cotton Three Piece — Pink", qty: 1, price: 1850 }],
    total: 1990,
    cod: 1990,
    paid: false,
    status: "Shipped",
    courier: "RedX",
    trackingId: "RDX-7710283",
    createdAt: "Yesterday",
    channel: "Messenger",
    packingChecklist: defaultChecklist().map((c) => ({ ...c, done: true })),
    timeline: [
      { status: "Created", at: "2d ago", by: "Nova AI" },
      { status: "Confirmed", at: "2d ago", by: "Arif R." },
      { status: "Packing", at: "1d ago", by: "Mahin K." },
      { status: "Ready for Courier", at: "1d ago", by: "Mahin K." },
      { status: "Shipped", at: "10h ago", by: "RedX" },
    ],
  },
  {
    id: "FC-10423",
    customer: "Imran Hossain",
    phone: "+8801744556677",
    address: "Chittagong GEC Circle",
    items: [{ name: "Sports Shoe — Size 42", qty: 1, price: 2400 }],
    total: 2520,
    cod: 2520,
    paid: false,
    status: "Delivered",
    courier: "Steadfast",
    trackingId: "STF-09812",
    createdAt: "2d ago",
    channel: "WhatsApp",
    packingChecklist: defaultChecklist().map((c) => ({ ...c, done: true })),
    timeline: [
      { status: "Created", at: "3d ago", by: "Arif R." },
      { status: "Shipped", at: "2d ago", by: "Steadfast" },
      { status: "Delivered", at: "5h ago", by: "Steadfast" },
    ],
  },
  {
    id: "FC-10422",
    customer: "Sumaiya Islam",
    phone: "+8801822334455",
    address: "Sylhet Zindabazar",
    items: [{ name: "Handbag — Beige", qty: 1, price: 1650 }],
    total: 1790,
    cod: 0,
    paid: true,
    status: "Returned",
    courier: "Paperfly",
    trackingId: "PPF-55129",
    createdAt: "4d ago",
    channel: "Instagram",
    packingChecklist: defaultChecklist().map((c) => ({ ...c, done: true })),
    returnReason: "Color mismatch with product photo",
    timeline: [
      { status: "Shipped", at: "3d ago", by: "Paperfly" },
      { status: "Delivered", at: "2d ago", by: "Paperfly" },
      { status: "Returned", at: "8h ago", by: "Customer" },
    ],
  },
  {
    id: "FC-10421",
    customer: "Rezaul Karim",
    phone: "+8801611998877",
    address: "Khulna New Market",
    items: [{ name: "Wrist Watch — Silver", qty: 1, price: 3200 }],
    total: 3320,
    cod: 3320,
    paid: false,
    status: "Cancelled",
    courier: "Unassigned",
    createdAt: "5d ago",
    channel: "Messenger",
    packingChecklist: defaultChecklist(),
    timeline: [
      { status: "Created", at: "5d ago", by: "Nova AI" },
      { status: "Cancelled", at: "5d ago", by: "Customer" },
    ],
  },
  {
    id: "FC-10420",
    customer: "Adiba Rahman",
    phone: "+8801511224466",
    address: "Mohammadpur, Dhaka",
    items: [{ name: "Skincare Combo", qty: 1, price: 1450 }],
    total: 1570,
    cod: 1570,
    paid: false,
    status: "Pending",
    courier: "Unassigned",
    createdAt: "Just now",
    channel: "Messenger",
    packingChecklist: defaultChecklist(),
    timeline: [{ status: "Created", at: "Just now", by: "Nova AI" }],
  },
];

// -------------------- Helpers --------------------

const bdt = (n: number) =>
  "৳ " + n.toLocaleString("en-BD", { maximumFractionDigits: 0 });

function StatusBadge({ status, size = "sm" }: { status: Status; size?: "sm" | "md" }) {
  const m = STATUS_META[status];
  const Icon = m.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium ring-1",
        m.soft,
        m.ring,
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
      )}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

function CourierPill({ courier }: { courier: Courier }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
        COURIER_TONE[courier],
      )}
    >
      <Truck className="h-3 w-3" />
      {courier}
    </span>
  );
}

// -------------------- Page --------------------

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [view, setView] = useState<"kanban" | "list" | "returns">("kanban");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<Status | null>(null);
  const [bulkCourierOpen, setBulkCourierOpen] = useState(false);
  const [bulkCourier, setBulkCourier] = useState<Courier>("Pathao");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.phone.includes(q),
    );
  }, [orders, query]);

  const activeOrder = activeOrderId
    ? orders.find((o) => o.id === activeOrderId) ?? null
    : null;

  const stats = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const returned = orders.filter((o) => o.status === "Returned").length;
    const codPending = orders
      .filter((o) =>
        ["Shipped", "Ready for Courier", "Packing", "Confirmed"].includes(o.status),
      )
      .reduce((s, o) => s + o.cod, 0);
    const successRate = total
      ? Math.round((delivered / (delivered + returned + 1)) * 100)
      : 0;
    return { total, delivered, returned, codPending, successRate };
  }, [orders]);

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const clearSelection = () => setSelected(new Set());

  const updateOrder = (id: string, patch: Partial<Order>, eventNote?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const next: Order = { ...o, ...patch };
        if (patch.status && patch.status !== o.status) {
          next.timeline = [
            ...o.timeline,
            { status: patch.status, at: "Just now", by: "Arif R.", note: eventNote },
          ];
        }
        return next;
      }),
    );
  };

  const onDropToColumn = (status: Status) => {
    if (!dragId) return;
    updateOrder(dragId, { status });
    toast.success(`Moved ${dragId} → ${status}`);
    setDragId(null);
    setDragOverCol(null);
  };

  const bulkAssignCourier = () => {
    const ids = Array.from(selected);
    setOrders((prev) =>
      prev.map((o) =>
        ids.includes(o.id)
          ? {
              ...o,
              courier: bulkCourier,
              status:
                o.status === "Pending" || o.status === "Awaiting Confirmation"
                  ? "Ready for Courier"
                  : o.status,
              trackingId:
                o.trackingId ??
                `${bulkCourier.slice(0, 3).toUpperCase()}-${Math.floor(
                  Math.random() * 9_000_000 + 1_000_000,
                )}`,
              timeline: [
                ...o.timeline,
                {
                  status: "Note",
                  at: "Just now",
                  by: "System",
                  note: `Booked with ${bulkCourier}`,
                },
              ],
            }
          : o,
      ),
    );
    toast.success(`Booked ${ids.length} order${ids.length > 1 ? "s" : ""} with ${bulkCourier}`);
    setBulkCourierOpen(false);
    clearSelection();
  };

  const bulkSetStatus = (status: Status) => {
    const ids = Array.from(selected);
    setOrders((prev) =>
      prev.map((o) =>
        ids.includes(o.id)
          ? {
              ...o,
              status,
              timeline: [...o.timeline, { status, at: "Just now", by: "Arif R." }],
            }
          : o,
      ),
    );
    toast.success(`${ids.length} order${ids.length > 1 ? "s" : ""} → ${status}`);
    clearSelection();
  };

  // -------------------- Render --------------------

  return (
    <AppLayout
      title="Orders"
      subtitle="End-to-end fulfillment — from inquiry to doorstep"
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Filter className="h-4 w-4" /> Filters
          </Button>
          <Button size="sm" className="gap-1.5 bg-gradient-primary shadow-elegant">
            <Plus className="h-4 w-4" /> New order
          </Button>
        </>
      }
    >
      {/* Top analytics strip */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5">
        <StatCard
          icon={ShoppingBag}
          label="Total orders"
          value={stats.total.toString()}
          hint="last 30 days"
          tone="from-sky-500/15 to-sky-500/0 text-sky-600"
        />
        <StatCard
          icon={CheckCircle2}
          label="Delivered"
          value={stats.delivered.toString()}
          hint="successful"
          tone="from-emerald-500/15 to-emerald-500/0 text-emerald-600"
        />
        <StatCard
          icon={RotateCcw}
          label="Returned"
          value={stats.returned.toString()}
          hint="needs review"
          tone="from-orange-500/15 to-orange-500/0 text-orange-600"
        />
        <StatCard
          icon={Banknote}
          label="COD pending"
          value={bdt(stats.codPending)}
          hint="to collect"
          tone="from-violet-500/15 to-violet-500/0 text-violet-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Delivery success"
          value={`${stats.successRate}%`}
          hint="vs returns"
          tone="from-blue-500/15 to-blue-500/0 text-blue-600"
          progress={stats.successRate}
        />
      </div>

      {/* Toolbar */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order, customer, phone…"
            className="pl-9 bg-muted/40 border-transparent focus-visible:bg-background"
          />
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
          <TabsList>
            <TabsTrigger value="kanban" className="gap-1.5">
              <LayoutGrid className="h-4 w-4" /> Kanban
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-1.5">
              <List className="h-4 w-4" /> List
            </TabsTrigger>
            <TabsTrigger value="returns" className="gap-1.5">
              <RotateCcw className="h-4 w-4" /> Returns
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 shadow-sm animate-fade-in">
          <Badge className="bg-gradient-primary text-primary-foreground">
            {selected.size} selected
          </Badge>
          <span className="text-xs text-muted-foreground">Bulk actions:</span>
          <Button
            size="sm"
            className="h-8 gap-1.5 bg-gradient-primary shadow-elegant"
            onClick={() => setBulkCourierOpen(true)}
          >
            <Truck className="h-3.5 w-3.5" /> Book courier
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5"
            onClick={() => bulkSetStatus("Confirmed")}
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Confirm
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5"
            onClick={() => bulkSetStatus("Packing")}
          >
            <PackageOpen className="h-3.5 w-3.5" /> Move to packing
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5"
            onClick={() => bulkSetStatus("Cancelled")}
          >
            <XCircle className="h-3.5 w-3.5" /> Cancel
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 ml-auto"
            onClick={clearSelection}
          >
            Clear
          </Button>
        </div>
      )}

      {/* Views */}
      <div className="mt-5">
        {view === "kanban" && (
          <KanbanBoard
            orders={filtered}
            selected={selected}
            onToggleSelect={toggleSelect}
            onOpen={setActiveOrderId}
            dragId={dragId}
            setDragId={setDragId}
            dragOverCol={dragOverCol}
            setDragOverCol={setDragOverCol}
            onDropTo={onDropToColumn}
          />
        )}
        {view === "list" && (
          <ListView
            orders={filtered}
            selected={selected}
            onToggleSelect={toggleSelect}
            onOpen={setActiveOrderId}
            onChangeCourier={(id, c) =>
              updateOrder(id, { courier: c }, `Assigned to ${c}`)
            }
          />
        )}
        {view === "returns" && (
          <ReturnsView
            orders={orders.filter((o) => o.status === "Returned")}
            onOpen={setActiveOrderId}
          />
        )}
      </div>

      {/* Detail sheet */}
      <Sheet
        open={!!activeOrder}
        onOpenChange={(open) => !open && setActiveOrderId(null)}
      >
        <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col">
          {activeOrder && (
            <OrderDetail
              order={activeOrder}
              onUpdate={(patch, note) => updateOrder(activeOrder.id, patch, note)}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Bulk courier dialog */}
      <Dialog open={bulkCourierOpen} onOpenChange={setBulkCourierOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" /> Bulk courier booking
            </DialogTitle>
            <DialogDescription>
              Assign {selected.size} order{selected.size > 1 ? "s" : ""} to a courier
              and auto-generate tracking IDs.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <label className="text-xs font-medium text-muted-foreground">
              Select courier partner
            </label>
            <Select value={bulkCourier} onValueChange={(v) => setBulkCourier(v as Courier)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COURIERS.filter((c) => c !== "Unassigned").map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Smart routing
              </div>
              Pickup will be scheduled automatically based on your default warehouse and
              today's cutoff time (6:00 PM).
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkCourierOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-gradient-primary shadow-elegant" onClick={bulkAssignCourier}>
              Book {selected.size} order{selected.size > 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

// -------------------- Stat card --------------------

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone,
  progress,
}: {
  icon: typeof ShoppingBag;
  label: string;
  value: string;
  hint?: string;
  tone: string;
  progress?: number;
}) {
  return (
    <Card className="relative overflow-hidden border-border/70">
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", tone)} />
      <CardContent className="relative p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <Icon className={cn("h-4 w-4", tone.split(" ").pop())} />
        </div>
        <div className="mt-2 text-2xl font-bold tabular-nums">{value}</div>
        {hint && <div className="text-[11px] text-muted-foreground">{hint}</div>}
        {typeof progress === "number" && (
          <Progress value={progress} className="mt-2 h-1.5" />
        )}
      </CardContent>
    </Card>
  );
}

// -------------------- Kanban --------------------

function KanbanBoard({
  orders,
  selected,
  onToggleSelect,
  onOpen,
  dragId,
  setDragId,
  dragOverCol,
  setDragOverCol,
  onDropTo,
}: {
  orders: Order[];
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  onOpen: (id: string) => void;
  dragId: string | null;
  setDragId: (id: string | null) => void;
  dragOverCol: Status | null;
  setDragOverCol: (s: Status | null) => void;
  onDropTo: (s: Status) => void;
}) {
  const grouped: Record<Status, Order[]> = useMemo(() => {
    const g = Object.fromEntries(STATUSES.map((s) => [s, [] as Order[]])) as Record<
      Status,
      Order[]
    >;
    orders.forEach((o) => g[o.status].push(o));
    return g;
  }, [orders]);

  return (
    <div className="overflow-x-auto -mx-4 px-4 md:-mx-8 md:px-8 pb-4">
      <div className="flex gap-3 min-w-max">
        {STATUSES.map((status) => {
          const m = STATUS_META[status];
          const Icon = m.icon;
          const list = grouped[status];
          const total = list.reduce((s, o) => s + o.total, 0);
          const isOver = dragOverCol === status;
          return (
            <div
              key={status}
              className={cn(
                "flex w-[300px] shrink-0 flex-col rounded-2xl border bg-card/40 transition-all",
                isOver
                  ? "border-primary/60 bg-primary/5 shadow-elegant"
                  : "border-border/70",
              )}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragOverCol !== status) setDragOverCol(status);
              }}
              onDragLeave={() => dragOverCol === status && setDragOverCol(null)}
              onDrop={() => onDropTo(status)}
            >
              <div className="flex items-center justify-between gap-2 border-b border-border/70 p-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn("h-2 w-2 rounded-full", m.dot)} />
                  <Icon className={cn("h-4 w-4", m.tone)} />
                  <span className="truncate text-sm font-semibold">{status}</span>
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                    {list.length}
                  </Badge>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground tabular-nums">
                  {bdt(total)}
                </span>
              </div>
              <div className="flex flex-col gap-2 p-2 min-h-[120px]">
                {list.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-6 text-center text-xs text-muted-foreground">
                    <Package className="mb-1 h-5 w-5 opacity-50" />
                    Drop orders here
                  </div>
                )}
                {list.map((o) => (
                  <KanbanCard
                    key={o.id}
                    order={o}
                    selected={selected.has(o.id)}
                    onToggleSelect={() => onToggleSelect(o.id)}
                    onOpen={() => onOpen(o.id)}
                    onDragStart={() => setDragId(o.id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setDragOverCol(null);
                    }}
                    isDragging={dragId === o.id}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KanbanCard({
  order,
  selected,
  onToggleSelect,
  onOpen,
  onDragStart,
  onDragEnd,
  isDragging,
}: {
  order: Order;
  selected: boolean;
  onToggleSelect: () => void;
  onOpen: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
}) {
  const initials = order.customer
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        "group relative cursor-grab rounded-xl border bg-card p-3 shadow-sm transition-all hover:shadow-elegant active:cursor-grabbing",
        selected ? "border-primary ring-2 ring-primary/30" : "border-border/70",
        isDragging && "opacity-50 rotate-1",
      )}
    >
      <div className="flex items-start gap-2">
        <Checkbox
          checked={selected}
          onCheckedChange={onToggleSelect}
          onClick={(e) => e.stopPropagation()}
          className="mt-0.5"
        />
        <button
          onClick={onOpen}
          className="flex-1 min-w-0 text-left"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] font-semibold text-primary">
              #{order.id}
            </span>
            <span className="text-[10px] text-muted-foreground">{order.createdAt}</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-gradient-primary text-[10px] font-semibold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{order.customer}</div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Phone className="h-2.5 w-2.5" /> {order.phone}
              </div>
            </div>
          </div>
          <div className="mt-2 line-clamp-1 text-[11px] text-muted-foreground">
            {order.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-bold tabular-nums">{bdt(order.total)}</span>
            {order.cod > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/20">
                <Banknote className="h-2.5 w-2.5" /> COD
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20">
                <CheckCircle2 className="h-2.5 w-2.5" /> Paid
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <CourierPill courier={order.courier} />
            {order.trackingId && (
              <span className="truncate font-mono text-[10px] text-muted-foreground">
                {order.trackingId}
              </span>
            )}
          </div>
        </button>
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </div>
  );
}

// -------------------- List view --------------------

function ListView({
  orders,
  selected,
  onToggleSelect,
  onOpen,
  onChangeCourier,
}: {
  orders: Order[];
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  onOpen: (id: string) => void;
  onChangeCourier: (id: string, c: Courier) => void;
}) {
  return (
    <Card className="overflow-hidden border-border/70">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="w-10 p-3"></th>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Courier</th>
              <th className="p-3 text-left">Tracking</th>
              <th className="p-3 text-right">Total</th>
              <th className="w-10 p-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr
                key={o.id}
                className={cn(
                  "border-t border-border/60 transition-colors hover:bg-muted/30",
                  selected.has(o.id) && "bg-primary/5",
                )}
              >
                <td className="p-3">
                  <Checkbox
                    checked={selected.has(o.id)}
                    onCheckedChange={() => onToggleSelect(o.id)}
                  />
                </td>
                <td className="p-3">
                  <button
                    onClick={() => onOpen(o.id)}
                    className="font-mono text-xs font-semibold text-primary hover:underline"
                  >
                    #{o.id}
                  </button>
                  <div className="text-[10px] text-muted-foreground">{o.createdAt}</div>
                </td>
                <td className="p-3">
                  <div className="font-medium">{o.customer}</div>
                  <div className="text-[11px] text-muted-foreground">{o.phone}</div>
                </td>
                <td className="p-3">
                  <StatusBadge status={o.status} />
                </td>
                <td className="p-3">
                  <Select
                    value={o.courier}
                    onValueChange={(v) => onChangeCourier(o.id, v as Courier)}
                  >
                    <SelectTrigger className="h-8 w-[140px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COURIERS.map((c) => (
                        <SelectItem key={c} value={c} className="text-xs">
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3">
                  {o.trackingId ? (
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {o.trackingId}
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground/60">—</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <div className="font-semibold tabular-nums">{bdt(o.total)}</div>
                  {o.cod > 0 && (
                    <div className="text-[10px] text-amber-600">
                      COD {bdt(o.cod)}
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onOpen(o.id)}>
                        <User className="h-4 w-4" /> View details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4" /> Copy order ID
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="h-4 w-4" /> Message customer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// -------------------- Returns --------------------

function ReturnsView({
  orders,
  onOpen,
}: {
  orders: Order[];
  onOpen: (id: string) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {orders.length === 0 && (
        <Card className="col-span-full p-10 text-center text-sm text-muted-foreground">
          No returns. 🎉
        </Card>
      )}
      {orders.map((o) => (
        <Card
          key={o.id}
          className="overflow-hidden border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-transparent"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-[11px] font-semibold text-orange-700 dark:text-orange-300">
                  #{o.id}
                </div>
                <div className="mt-1 text-sm font-semibold">{o.customer}</div>
                <div className="text-[11px] text-muted-foreground">{o.phone}</div>
              </div>
              <StatusBadge status="Returned" />
            </div>
            <div className="mt-3 rounded-lg border border-orange-500/20 bg-background/60 p-2.5 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-orange-700 dark:text-orange-300">
                <AlertTriangle className="h-3.5 w-3.5" /> Return reason
              </div>
              <div className="mt-1 text-muted-foreground">
                {o.returnReason ?? "No reason provided"}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <CourierPill courier={o.courier} />
              <span className="font-semibold tabular-nums">{bdt(o.total)}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 flex-1 gap-1.5"
                onClick={() => onOpen(o.id)}
              >
                <ClipboardCheck className="h-3.5 w-3.5" /> Process
              </Button>
              <Button size="sm" variant="outline" className="h-8 gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" /> Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// -------------------- Order detail sheet --------------------

function OrderDetail({
  order,
  onUpdate,
}: {
  order: Order;
  onUpdate: (patch: Partial<Order>, note?: string) => void;
}) {
  const packDone = order.packingChecklist.filter((c) => c.done).length;
  const packPct = Math.round((packDone / order.packingChecklist.length) * 100);

  const toggleChecklist = (idx: number) => {
    const next = order.packingChecklist.map((c, i) =>
      i === idx ? { ...c, done: !c.done } : c,
    );
    onUpdate({ packingChecklist: next });
  };

  return (
    <>
      <SheetHeader className="border-b border-border bg-gradient-mesh px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <SheetTitle className="flex items-center gap-2">
              <span className="font-mono text-base">#{order.id}</span>
              <StatusBadge status={order.status} size="md" />
            </SheetTitle>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3" /> Created {order.createdAt} · via{" "}
              {order.channel}
            </div>
          </div>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Customer */}
        <section>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Customer
          </div>
          <div className="mt-2 flex items-center gap-3 rounded-xl border border-border/70 bg-card p-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-primary text-xs font-semibold text-primary-foreground">
                {order.customer
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="font-medium">{order.customer}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" /> {order.phone}
              </div>
              <div className="mt-1 flex items-start gap-1 text-xs text-muted-foreground">
                <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                <span className="line-clamp-2">{order.address}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Items + totals */}
        <section>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Items
          </div>
          <div className="mt-2 rounded-xl border border-border/70 bg-card divide-y divide-border/60">
            {order.items.map((it, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 text-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">{it.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      Qty {it.qty} · {bdt(it.price)}
                    </div>
                  </div>
                </div>
                <div className="font-semibold tabular-nums">
                  {bdt(it.qty * it.price)}
                </div>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2 p-3 text-xs">
              <div className="rounded-lg bg-muted/40 p-2">
                <div className="text-muted-foreground">Order total</div>
                <div className="text-sm font-bold tabular-nums">{bdt(order.total)}</div>
              </div>
              <div
                className={cn(
                  "rounded-lg p-2",
                  order.cod > 0
                    ? "bg-amber-500/10 ring-1 ring-amber-500/20"
                    : "bg-emerald-500/10 ring-1 ring-emerald-500/20",
                )}
              >
                <div className="text-muted-foreground">
                  {order.cod > 0 ? "COD to collect" : "Paid online"}
                </div>
                <div className="text-sm font-bold tabular-nums">
                  {order.cod > 0 ? bdt(order.cod) : bdt(order.total)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Courier */}
        <section>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Courier & tracking
          </div>
          <div className="mt-2 grid gap-2 rounded-xl border border-border/70 bg-card p-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-muted-foreground">Partner</label>
                <Select
                  value={order.courier}
                  onValueChange={(v) =>
                    onUpdate({ courier: v as Courier }, `Assigned to ${v}`)
                  }
                >
                  <SelectTrigger className="h-9 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COURIERS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Tracking ID</label>
                <Input
                  value={order.trackingId ?? ""}
                  onChange={(e) => onUpdate({ trackingId: e.target.value })}
                  placeholder="e.g. PTH-AX982174"
                  className="h-9 mt-1 font-mono text-xs"
                />
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => {
                const id = `${order.courier.slice(0, 3).toUpperCase()}-${Math.floor(
                  Math.random() * 9_000_000 + 1_000_000,
                )}`;
                onUpdate(
                  { trackingId: id, status: "Shipped" },
                  `Booked & shipped via ${order.courier}`,
                );
                toast.success(`Booked ${order.id} with ${order.courier}`);
              }}
            >
              <Send className="h-4 w-4" /> Book pickup & generate tracking
            </Button>
          </div>
        </section>

        {/* Packing checklist */}
        <section>
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Packing checklist
            </div>
            <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
              {packDone}/{order.packingChecklist.length}
            </span>
          </div>
          <div className="mt-2 rounded-xl border border-border/70 bg-card p-3">
            <Progress value={packPct} className="h-1.5" />
            <ul className="mt-3 space-y-2">
              {order.packingChecklist.map((c, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={c.done}
                    onCheckedChange={() => toggleChecklist(i)}
                  />
                  <span
                    className={cn(
                      c.done && "text-muted-foreground line-through",
                    )}
                  >
                    {c.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Status quick actions */}
        <section>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Move to status
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => onUpdate({ status: s })}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 transition-colors",
                  order.status === s
                    ? "bg-gradient-primary text-primary-foreground ring-transparent shadow-sm"
                    : "bg-muted/40 text-muted-foreground ring-border hover:bg-muted",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Timeline
          </div>
          <ol className="mt-3 relative space-y-3 border-l border-border/70 pl-4">
            {order.timeline
              .slice()
              .reverse()
              .map((e, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-gradient-primary ring-4 ring-background" />
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{e.status}</span>
                    <span className="text-[10px] text-muted-foreground">{e.at}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    by {e.by}
                    {e.note && ` · ${e.note}`}
                  </div>
                </li>
              ))}
          </ol>
        </section>

        {/* Return mgmt */}
        {order.status === "Returned" && (
          <section>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Return management
            </div>
            <div className="mt-2 rounded-xl border border-orange-500/30 bg-orange-500/5 p-3 space-y-2">
              <label className="text-[11px] font-medium text-orange-700 dark:text-orange-300">
                Reason
              </label>
              <Input
                value={order.returnReason ?? ""}
                onChange={(e) => onUpdate({ returnReason: e.target.value })}
                placeholder="Describe customer's reason…"
                className="h-9"
              />
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" className="flex-1 gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" /> Refund
                </Button>
                <Button size="sm" variant="outline" className="flex-1 gap-1.5">
                  <Activity className="h-3.5 w-3.5" /> Restock
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>

      <div className="border-t border-border bg-card/50 p-3 flex items-center gap-2">
        <Button variant="outline" className="gap-1.5 flex-1">
          <MessageSquare className="h-4 w-4" /> Message
        </Button>
        <Button className="gap-1.5 flex-1 bg-gradient-primary shadow-elegant">
          Save changes <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
