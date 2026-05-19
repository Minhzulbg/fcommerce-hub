import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Mail, Phone, MapPin } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/customers")({
  component: CustomersPage,
});

const customers = [
  { name: "Nusrat Jahan", email: "nusrat@example.com", phone: "01711-234567", city: "Dhaka", orders: 12, spent: "৳ 18,420", tag: "VIP" },
  { name: "Tanvir Ahmed", email: "tanvir@example.com", phone: "01812-345678", city: "Chattogram", orders: 8, spent: "৳ 12,650", tag: "Loyal" },
  { name: "Sadia Islam", email: "sadia@example.com", phone: "01913-456789", city: "Sylhet", orders: 5, spent: "৳ 6,200", tag: "New" },
  { name: "Rakib Hasan", email: "rakib@example.com", phone: "01614-567890", city: "Khulna", orders: 14, spent: "৳ 24,900", tag: "VIP" },
  { name: "Mehzabin R.", email: "mehzabin@example.com", phone: "01515-678901", city: "Dhaka", orders: 3, spent: "৳ 4,100", tag: "New" },
  { name: "Imran Khan", email: "imran@example.com", phone: "01716-789012", city: "Rajshahi", orders: 7, spent: "৳ 9,800", tag: "Loyal" },
];

const tagStyle: Record<string, string> = {
  VIP: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  Loyal: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  New: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

function CustomersPage() {
  return (
    <AppLayout
      title="Customers"
      subtitle="View and manage your customer base"
      actions={<Button size="sm"><Plus className="h-4 w-4" /> Add Customer</Button>}
    >
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Customers", value: "4,328" },
          { label: "New This Month", value: "248" },
          { label: "Repeat Buyers", value: "1,612" },
        ].map((s) => (
          <Card key={s.label} className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
              <div className="text-sm text-muted-foreground">{s.label}</div>
              <div className="mt-1 text-2xl font-semibold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl shadow-sm">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-sm font-semibold">All Customers</h2>
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search customers" className="pl-9 bg-muted/40 border-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 xl:grid-cols-3">
          {customers.map((c) => (
            <div key={c.email} className="bg-card p-5 transition-colors hover:bg-muted/30">
              <div className="flex items-start gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold">{c.name}</div>
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${tagStyle[c.tag]}`}>
                      {c.tag}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 truncate"><Mail className="h-3 w-3" /> {c.email}</div>
                    <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {c.phone}</div>
                    <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {c.city}</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                <div>
                  <div className="text-muted-foreground">Orders</div>
                  <div className="font-semibold text-foreground">{c.orders}</div>
                </div>
                <div className="text-right">
                  <div className="text-muted-foreground">Spent</div>
                  <div className="font-semibold text-foreground">{c.spent}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </AppLayout>
  );
}
