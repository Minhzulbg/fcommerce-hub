import { createFileRoute } from "@tanstack/react-router";
import { Plus, Filter, Download, Search } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});

const orders = [
  { id: "#FC-10428", customer: "Nusrat Jahan", phone: "01711-234567", items: 2, total: "৳ 1,250", courier: "Pathao", status: "Paid", date: "May 19" },
  { id: "#FC-10427", customer: "Tanvir Ahmed", phone: "01812-345678", items: 1, total: "৳ 3,400", courier: "Steadfast", status: "Pending", date: "May 19" },
  { id: "#FC-10426", customer: "Sadia Islam", phone: "01913-456789", items: 3, total: "৳ 980", courier: "RedX", status: "Shipped", date: "May 18" },
  { id: "#FC-10425", customer: "Rakib Hasan", phone: "01614-567890", items: 1, total: "৳ 4,750", courier: "Pathao", status: "Paid", date: "May 18" },
  { id: "#FC-10424", customer: "Mehzabin R.", phone: "01515-678901", items: 1, total: "৳ 6,200", courier: "Paperfly", status: "Delivered", date: "May 17" },
  { id: "#FC-10423", customer: "Imran Khan", phone: "01716-789012", items: 4, total: "৳ 2,800", courier: "Steadfast", status: "Cancelled", date: "May 17" },
  { id: "#FC-10422", customer: "Farhana Akter", phone: "01817-890123", items: 2, total: "৳ 1,990", courier: "Pathao", status: "Delivered", date: "May 16" },
];

const statusStyle: Record<string, string> = {
  Paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Shipped: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Delivered: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  Cancelled: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

const tabs = ["All", "Pending", "Paid", "Shipped", "Delivered", "Cancelled"];

function OrdersPage() {
  return (
    <AppLayout
      title="Orders"
      subtitle="Track and manage all customer orders"
      actions={
        <>
          <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Export</Button>
          <Button size="sm"><Plus className="h-4 w-4" /> New Order</Button>
        </>
      }
    >
      <Card className="rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
          <div className="flex flex-wrap gap-1 rounded-lg bg-muted/50 p-1">
            {tabs.map((t, i) => (
              <button
                key={t}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  i === 0 ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative ml-auto w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search orders" className="pl-9 bg-muted/40 border-transparent" />
          </div>
          <Button variant="outline" size="sm"><Filter className="h-4 w-4" /> Filter</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Items</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Courier</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-6 py-3 font-mono text-xs">{o.id}</td>
                  <td className="px-6 py-3">
                    <div className="font-medium">{o.customer}</div>
                    <div className="text-xs text-muted-foreground">{o.phone}</div>
                  </td>
                  <td className="px-6 py-3">{o.items}</td>
                  <td className="px-6 py-3 font-medium">{o.total}</td>
                  <td className="px-6 py-3 text-muted-foreground">{o.courier}</td>
                  <td className="px-6 py-3">
                    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium", statusStyle[o.status])}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-3 text-xs text-muted-foreground">
          <span>Showing 1–7 of 2,847 orders</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>
    </AppLayout>
  );
}
