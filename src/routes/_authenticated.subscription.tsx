import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Sparkles, Zap, Loader2, Clock, XCircle, CheckCircle2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/subscription")({
  component: SubscriptionPage,
});

// Merchant numbers — change here as needed
const MERCHANT = {
  bkash: "01XXX-XXXXXX",
  nagad: "01XXX-XXXXXX",
  rocket: "01XXX-XXXXXX",
};

type Plan = {
  id: string;
  name: string;
  slug: string;
  price_bdt: number;
  duration_days: number;
  page_limit: number;
  message_limit: number;
  order_limit: number;
  features: string[];
  sort_order: number;
};

function SubscriptionPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const plansQ = useQuery({
    queryKey: ["subscription_plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data as unknown as Plan[];
    },
  });

  const currentQ = useQuery({
    queryKey: ["my_subscription", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*, plan:subscription_plans(*)")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const paymentsQ = useQuery({
    queryKey: ["my_payment_requests", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_requests")
        .select("*, plan:subscription_plans(name, price_bdt)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
  });

  const current = currentQ.data;
  const plan = current?.plan as Plan | undefined;

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
              <div className="text-xs font-medium uppercase tracking-wider text-primary">
                {current?.status === "trial" ? "Free Trial" : "Current Plan"}
              </div>
              <div className="text-xl font-semibold">
                {plan ? `${plan.name} · ৳ ${plan.price_bdt}/${plan.duration_days}d` : "No active plan"}
              </div>
              <div className="text-xs text-muted-foreground">
                {current?.expires_at
                  ? `${current.status === "trial" ? "Trial ends" : "Renews on"} ${new Date(current.expires_at).toLocaleDateString()}`
                  : "—"}
              </div>
            </div>
          </div>
          <Badge variant="outline" className="capitalize">
            {current?.status ?? "—"}
          </Badge>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {plansQ.isLoading && (
          <div className="col-span-3 flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {plansQ.data?.map((p, idx) => {
          const popular = idx === 1;
          const isCurrent = plan?.id === p.id && current?.status === "active";
          return (
            <Card
              key={p.id}
              className={cn(
                "relative rounded-2xl shadow-sm",
                popular && "border-primary/40 shadow-lg ring-1 ring-primary/20",
              )}
            >
              {popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow-sm">
                    <Zap className="h-3 w-3" /> Most Popular
                  </span>
                </div>
              )}
              <CardContent className="p-6">
                <div className="text-sm font-semibold">{p.name}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.page_limit} pages · {p.message_limit} msgs · {p.order_limit} orders
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tight">৳ {p.price_bdt}</span>
                  <span className="text-sm text-muted-foreground">/ {p.duration_days}d</span>
                </div>
                <Button
                  className="mt-4 w-full"
                  variant={popular ? "default" : "outline"}
                  disabled={isCurrent}
                  onClick={() => setSelectedPlan(p)}
                >
                  {isCurrent ? "Current plan" : "Subscribe"}
                </Button>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {(p.features ?? []).map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment history */}
      <Card className="mt-6 rounded-2xl shadow-sm">
        <div className="border-b border-border p-5">
          <h2 className="text-sm font-semibold">Payment Requests</h2>
          <p className="text-xs text-muted-foreground">Your submitted payments</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Method</th>
                <th className="px-6 py-3 font-medium">TrxID</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {paymentsQ.data?.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">No payments yet</td></tr>
              )}
              {paymentsQ.data?.map((p: any) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-6 py-3 font-medium">{p.plan?.name ?? "—"}</td>
                  <td className="px-6 py-3 capitalize">{p.method}</td>
                  <td className="px-6 py-3 font-mono text-xs">{p.transaction_id}</td>
                  <td className="px-6 py-3">৳ {p.amount}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedPlan && (
        <PaymentDialog
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onDone={() => {
            qc.invalidateQueries({ queryKey: ["my_payment_requests"] });
            setSelectedPlan(null);
          }}
        />
      )}
    </AppLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved")
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
        <CheckCircle2 className="h-3 w-3" /> Approved
      </span>
    );
  if (status === "rejected")
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-600">
        <XCircle className="h-3 w-3" /> Rejected
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600">
      <Clock className="h-3 w-3" /> Pending
    </span>
  );
}

function PaymentDialog({
  plan,
  onClose,
  onDone,
}: {
  plan: Plan;
  onClose: () => void;
  onDone: () => void;
}) {
  const { user } = useAuth();
  const [method, setMethod] = useState<"bkash" | "nagad" | "rocket">("bkash");
  const [senderNumber, setSenderNumber] = useState("");
  const [trxId, setTrxId] = useState("");

  const submit = useMutation({
    mutationFn: async () => {
      if (!senderNumber.trim() || !trxId.trim())
        throw new Error("Sender number এবং Transaction ID দিন");
      const { error } = await supabase.from("payment_requests").insert({
        user_id: user!.id,
        plan_id: plan.id,
        method,
        sender_number: senderNumber.trim(),
        transaction_id: trxId.trim(),
        amount: plan.price_bdt,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Payment request submitted! Admin শীঘ্রই review করবে।");
      onDone();
    },
    onError: (e: any) => toast.error(e.message ?? "Submission failed"),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Subscribe to {plan.name}</DialogTitle>
          <DialogDescription>
            ৳ {plan.price_bdt} send করুন নিচের নাম্বারে, তারপর Transaction ID submit করুন।
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Payment method</Label>
            <RadioGroup value={method} onValueChange={(v) => setMethod(v as any)} className="grid grid-cols-3 gap-2">
              {(["bkash", "nagad", "rocket"] as const).map((m) => (
                <Label
                  key={m}
                  htmlFor={m}
                  className={cn(
                    "flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm font-medium capitalize",
                    method === m && "border-primary bg-primary/5",
                  )}
                >
                  <RadioGroupItem value={m} id={m} className="sr-only" />
                  {m}
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm">
            <div className="text-xs text-muted-foreground">Send Money to ({method}):</div>
            <div className="mt-1 font-mono text-lg font-semibold">{MERCHANT[method]}</div>
            <div className="mt-2 text-xs text-muted-foreground">Amount: ৳ {plan.price_bdt}</div>
          </div>

          <div>
            <Label htmlFor="sender">Your {method} number</Label>
            <Input id="sender" value={senderNumber} onChange={(e) => setSenderNumber(e.target.value)} placeholder="01XXXXXXXXX" />
          </div>

          <div>
            <Label htmlFor="trx">Transaction ID</Label>
            <Input id="trx" value={trxId} onChange={(e) => setTrxId(e.target.value)} placeholder="e.g. 8N7A2K9P" />
          </div>

          <Button className="w-full" onClick={() => submit.mutate()} disabled={submit.isPending}>
            {submit.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
