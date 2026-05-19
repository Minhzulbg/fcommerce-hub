import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  User, Bell, Lock, Facebook, Truck, Palette,
  Eye, EyeOff, Copy, CheckCircle2, AlertTriangle, Loader2,
  Zap, RefreshCw, Star, Plug, ShieldCheck, Wallet, MapPin,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "integrations", label: "Integrations", icon: Facebook },
  { id: "couriers", label: "Couriers", icon: Truck },
  { id: "appearance", label: "Appearance", icon: Palette },
];

function SettingsPage() {
  const [active, setActive] = useState("profile");
  const { theme, setTheme } = useTheme();

  return (
    <AppLayout title="Settings" subtitle="Manage your account and store preferences">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <Card className="h-fit rounded-2xl p-2 shadow-sm">
          <nav className="space-y-1">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active === s.id ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {s.label}
                </button>
              );
            })}
          </nav>
        </Card>

        <div className="space-y-6">
          {active === "profile" && (
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-base font-semibold">Profile Information</h3>
                <p className="text-xs text-muted-foreground">Update your personal details</p>
                <div className="mt-5 flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">AR</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button size="sm" variant="outline">Upload photo</Button>
                    <p className="mt-1 text-[11px] text-muted-foreground">JPG or PNG, max 2MB</p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Full Name</Label>
                    <Input defaultValue="Arif Rahman" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input defaultValue="arif@fcommerce.app" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Phone</Label>
                    <Input defaultValue="01711-234567" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Business Name</Label>
                    <Input defaultValue="FCommerce Store" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {active === "notifications" && (
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-base font-semibold">Notification Preferences</h3>
                <p className="text-xs text-muted-foreground">Choose what you want to be notified about</p>
                <div className="mt-5 divide-y divide-border">
                  {[
                    { t: "New orders", d: "Get notified when a new order comes in" },
                    { t: "New messages", d: "Facebook inbox new message alerts" },
                    { t: "Courier updates", d: "Delivery status change notifications" },
                    { t: "Weekly reports", d: "Receive performance summary every Monday" },
                  ].map((n, i) => (
                    <div key={n.t} className="flex items-center justify-between py-4">
                      <div>
                        <div className="text-sm font-medium">{n.t}</div>
                        <div className="text-xs text-muted-foreground">{n.d}</div>
                      </div>
                      <Switch defaultChecked={i !== 3} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {active === "security" && (
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-base font-semibold">Security</h3>
                <p className="text-xs text-muted-foreground">Manage your password and 2FA</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Current Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>New Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <div className="text-sm font-medium">Two-factor authentication</div>
                    <div className="text-xs text-muted-foreground">Add an extra layer of security</div>
                  </div>
                  <Switch />
                </div>
                <div className="flex justify-end"><Button>Update password</Button></div>
              </CardContent>
            </Card>
          )}

          {active === "integrations" && (
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-base font-semibold">Connected Pages</h3>
                <p className="text-xs text-muted-foreground">Facebook Pages connected to FCommerce</p>
                <div className="mt-5 space-y-3">
                  {["FCommerce Store", "Dhaka Fashion Hub", "Sneaker World BD"].map((p, i) => (
                    <div key={p} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                          <Facebook className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{p}</div>
                          <div className="text-xs text-muted-foreground">{i === 0 ? "Primary · 12.4K followers" : `${(Math.random() * 30 + 5).toFixed(1)}K followers`}</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">{i === 0 ? "Connected" : "Manage"}</Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">+ Connect another Page</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {active === "couriers" && <CourierSettings />}

          {active === "appearance" && (
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-base font-semibold">Appearance</h3>
                <p className="text-xs text-muted-foreground">Customize how FCommerce looks</p>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {(["light", "dark"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={cn(
                        "rounded-xl border-2 p-3 text-left transition-all",
                        theme === t ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40",
                      )}
                    >
                      <div
                        className={cn(
                          "h-20 w-full rounded-md border border-border",
                          t === "light" ? "bg-white" : "bg-zinc-900",
                        )}
                      />
                      <div className="mt-2 text-sm font-medium capitalize">{t}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

type CourierKey = "pathao" | "steadfast" | "redx" | "paperfly";
type Status = "connected" | "error" | "disconnected";

type Courier = {
  key: CourierKey;
  name: string;
  tagline: string;
  initials: string;
  gradient: string; // tailwind classes
  brandColor: string; // tailwind text color
  coverage: string;
  baseRate: number;
  status: Status;
  successRate: string;
  avgDelivery: string;
  fields: { id: string; label: string; placeholder: string; secret?: boolean }[];
};

const couriers: Courier[] = [
  {
    key: "pathao",
    name: "Pathao Courier",
    tagline: "Same-day & next-day delivery across Bangladesh",
    initials: "PA",
    gradient: "from-[#E5322D] to-[#B71C1C]",
    brandColor: "text-[#E5322D]",
    coverage: "64 districts · 4,800+ areas",
    baseRate: 60,
    status: "connected",
    successRate: "97.4%",
    avgDelivery: "1.2 days",
    fields: [
      { id: "client_id", label: "Client ID", placeholder: "pathao_xxxx" },
      { id: "client_secret", label: "Client Secret", placeholder: "secret_xxxx", secret: true },
      { id: "username", label: "Username (Email)", placeholder: "you@brand.com" },
      { id: "password", label: "Password", placeholder: "••••••••", secret: true },
    ],
  },
  {
    key: "steadfast",
    name: "Steadfast Courier",
    tagline: "Reliable cash-on-delivery for FCommerce brands",
    initials: "SF",
    gradient: "from-[#0EA5E9] to-[#1E40AF]",
    brandColor: "text-[#0EA5E9]",
    coverage: "All Bangladesh · 24/7 pickup",
    baseRate: 70,
    status: "connected",
    successRate: "96.1%",
    avgDelivery: "1.6 days",
    fields: [
      { id: "api_key", label: "API Key", placeholder: "sf_live_xxxx" },
      { id: "secret_key", label: "Secret Key", placeholder: "sk_xxxx", secret: true },
    ],
  },
  {
    key: "redx",
    name: "RedX",
    tagline: "Fast intra-city & ZIP-based delivery",
    initials: "RX",
    gradient: "from-[#EF4444] to-[#7F1D1D]",
    brandColor: "text-[#EF4444]",
    coverage: "Dhaka, Ctg, Sylhet + 40 districts",
    baseRate: 65,
    status: "error",
    successRate: "94.2%",
    avgDelivery: "1.8 days",
    fields: [
      { id: "api_token", label: "API Token", placeholder: "rx_xxxx", secret: true },
    ],
  },
  {
    key: "paperfly",
    name: "Paperfly",
    tagline: "Nationwide last-mile delivery",
    initials: "PF",
    gradient: "from-[#10B981] to-[#065F46]",
    brandColor: "text-[#10B981]",
    coverage: "All 64 districts",
    baseRate: 80,
    status: "disconnected",
    successRate: "—",
    avgDelivery: "—",
    fields: [
      { id: "merchant_id", label: "Merchant ID", placeholder: "pf_merchant_xxxx" },
      { id: "api_key", label: "API Key", placeholder: "pf_api_xxxx", secret: true },
    ],
  },
];

function StatusPill({ status }: { status: Status }) {
  const map = {
    connected: { cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", text: "Connected", icon: CheckCircle2 },
    error: { cls: "bg-amber-500/10 text-amber-600 border-amber-500/20", text: "Reconnect needed", icon: AlertTriangle },
    disconnected: { cls: "bg-muted text-muted-foreground border-border", text: "Not connected", icon: Plug },
  } as const;
  const c = map[status];
  const Icon = c.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", c.cls)}>
      <Icon className="h-3 w-3" /> {c.text}
    </span>
  );
}

function SecretField({ id, label, placeholder, secret }: { id: string; label: string; placeholder: string; secret?: boolean }) {
  const [show, setShow] = useState(false);
  const [val, setVal] = useState("");
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium">{label}</Label>
      <div className="relative">
        <Input
          id={id}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          type={secret && !show ? "password" : "text"}
          placeholder={placeholder}
          className="h-10 pr-20 font-mono text-xs"
        />
        <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
          {secret && (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={show ? "Hide" : "Show"}
            >
              {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (!val) return;
              navigator.clipboard.writeText(val);
              toast.success(`${label} copied`);
            }}
            className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Copy"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CourierCard({
  c,
  isDefault,
  onMakeDefault,
}: {
  c: Courier;
  isDefault: boolean;
  onMakeDefault: () => void;
}) {
  const [enabled, setEnabled] = useState(c.status === "connected");
  const [testing, setTesting] = useState<"idle" | "loading" | "ok" | "fail">("idle");
  const [charge, setCharge] = useState(c.baseRate);

  const runTest = () => {
    setTesting("loading");
    setTimeout(() => {
      const ok = c.status !== "disconnected";
      setTesting(ok ? "ok" : "fail");
      if (ok) toast.success(`${c.name} connection verified`, { description: `Latency 184ms · API v2 reachable` });
      else toast.error(`${c.name} test failed`, { description: "Add API credentials to test." });
    }, 1100);
  };

  return (
    <Card className={cn(
      "relative overflow-hidden rounded-2xl border-border/70 shadow-sm transition-all hover-lift",
      isDefault && "ring-2 ring-primary/40"
    )}>
      {isDefault && (
        <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-gradient-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-elegant">
          <Star className="h-3 w-3 fill-current" /> Default
        </div>
      )}
      <div className={cn("h-1.5 w-full bg-gradient-to-r", c.gradient)} />
      <CardContent className="space-y-5 p-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={cn("grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br text-sm font-bold text-white shadow-elegant", c.gradient)}>
            {c.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold tracking-tight">{c.name}</h3>
              <StatusPill status={c.status} />
            </div>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.tagline}</p>
            <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3" /> {c.coverage}
            </div>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>

        {/* Performance */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { l: "Success", v: c.successRate, i: CheckCircle2 },
            { l: "Avg time", v: c.avgDelivery, i: Zap },
            { l: "Base rate", v: `৳${c.baseRate}`, i: Wallet },
          ].map((m) => (
            <div key={m.l} className="rounded-xl border border-border bg-card/60 p-2.5 text-center">
              <m.i className={cn("mx-auto h-3.5 w-3.5", c.brandColor)} />
              <div className="mt-1 text-sm font-semibold tracking-tight">{m.v}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.l}</div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Credentials */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">API credentials</div>
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-emerald-500" /> Encrypted at rest
            </span>
          </div>
          <div className={cn("grid gap-3", c.fields.length > 1 ? "sm:grid-cols-2" : "")}>
            {c.fields.map((f) => (
              <SecretField key={f.id} {...f} />
            ))}
          </div>
        </div>

        {/* Delivery charge */}
        <div className="rounded-xl border border-border bg-muted/30 p-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Delivery charge (Inside Dhaka)</Label>
            <span className="font-mono text-sm font-semibold">৳ {charge}</span>
          </div>
          <input
            type="range" min={40} max={200} step={5}
            value={charge}
            onChange={(e) => setCharge(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--primary)]"
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>৳40</span><span>Outside Dhaka: ৳{charge + 60}</span><span>৳200</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={runTest}
            disabled={testing === "loading"}
            className={cn(
              "rounded-lg",
              testing === "ok" && "border-emerald-500/40 text-emerald-600",
              testing === "fail" && "border-rose-500/40 text-rose-600",
            )}
          >
            {testing === "loading" && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
            {testing === "ok" && <CheckCircle2 className="mr-1 h-3.5 w-3.5" />}
            {testing === "fail" && <AlertTriangle className="mr-1 h-3.5 w-3.5" />}
            {testing === "idle" && <Zap className="mr-1 h-3.5 w-3.5" />}
            {testing === "loading" ? "Testing…" : testing === "ok" ? "Connection OK" : testing === "fail" ? "Test failed" : "Test connection"}
          </Button>
          <Button variant="ghost" size="sm" className="rounded-lg">
            <RefreshCw className="mr-1 h-3.5 w-3.5" /> Resync
          </Button>
          <div className="ml-auto">
            {isDefault ? (
              <Badge variant="secondary" className="rounded-full">Default courier</Badge>
            ) : (
              <Button variant="ghost" size="sm" onClick={onMakeDefault} className="rounded-lg">
                <Star className="mr-1 h-3.5 w-3.5" /> Make default
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CourierSettings() {
  const [defaultKey, setDefaultKey] = useState<CourierKey>("pathao");
  const [codFee, setCodFee] = useState(1.0);
  const [freeOver, setFreeOver] = useState(2000);

  return (
    <div className="space-y-5">
      {/* Header card */}
      <Card className="relative overflow-hidden rounded-2xl border-border/70">
        <div className="absolute inset-0 bg-gradient-primary opacity-90" />
        <div className="absolute inset-0 bg-gradient-mesh mix-blend-overlay opacity-70" />
        <CardContent className="relative z-10 flex flex-col gap-4 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] backdrop-blur">
              <Truck className="h-3 w-3" /> Courier hub
            </div>
            <h3 className="mt-2 text-xl font-bold tracking-tight">Delivery partners</h3>
            <p className="mt-1 max-w-md text-xs text-white/85">
              Connect Bangladesh's top couriers, set delivery rates and pick a default. We auto-route every order for best success rate.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:max-w-sm">
            {[
              { l: "Connected", v: "2 / 4" },
              { l: "Avg success", v: "95.9%" },
              { l: "Avg ETA", v: "1.5d" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-white/20 bg-white/10 p-2.5 text-center backdrop-blur">
                <div className="text-sm font-semibold">{s.v}</div>
                <div className="text-[10px] uppercase tracking-wider text-white/80">{s.l}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Global delivery settings */}
      <Card className="rounded-2xl border-border/70 shadow-sm">
        <CardContent className="space-y-4 p-5">
          <div>
            <h3 className="text-sm font-semibold">Default delivery rules</h3>
            <p className="text-xs text-muted-foreground">Applied to every order unless a courier override exists.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card/60 p-3">
              <Label className="text-xs">Default courier</Label>
              <select
                value={defaultKey}
                onChange={(e) => setDefaultKey(e.target.value as CourierKey)}
                className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-2 text-sm"
              >
                {couriers.map((c) => (
                  <option key={c.key} value={c.key}>{c.name}</option>
                ))}
              </select>
              <p className="mt-1.5 text-[10px] text-muted-foreground">Used when AI auto-routing is off.</p>
            </div>
            <div className="rounded-xl border border-border bg-card/60 p-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs">COD fee %</Label>
                <span className="font-mono text-sm font-semibold">{codFee.toFixed(1)}%</span>
              </div>
              <input
                type="range" min={0} max={3} step={0.1} value={codFee}
                onChange={(e) => setCodFee(Number(e.target.value))}
                className="mt-2 w-full accent-[var(--primary)]"
              />
              <p className="mt-1 text-[10px] text-muted-foreground">Added on top of the courier's base rate.</p>
            </div>
            <div className="rounded-xl border border-border bg-card/60 p-3">
              <Label className="text-xs">Free delivery over (৳)</Label>
              <Input
                type="number"
                value={freeOver}
                onChange={(e) => setFreeOver(Number(e.target.value))}
                className="mt-1.5 h-10 font-mono"
              />
              <p className="mt-1 text-[10px] text-muted-foreground">Waive delivery charge above this order value.</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between rounded-xl border border-border bg-card/60 p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary text-white">
                <Zap className="h-4 w-4" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">AI smart routing</div>
                <div className="text-[11px] text-muted-foreground">Auto-pick the courier with the highest historical success in each ZIP.</div>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Courier cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {couriers.map((c) => (
          <CourierCard
            key={c.key}
            c={c}
            isDefault={defaultKey === c.key}
            onMakeDefault={() => {
              setDefaultKey(c.key);
              toast.success(`${c.name} set as default courier`);
            }}
          />
        ))}
      </div>
    </div>
  );
}
