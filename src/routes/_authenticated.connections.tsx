import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Facebook,
  Instagram,
  MessageCircle,
  ShieldCheck,
  Webhook,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  Copy,
  RefreshCw,
  Settings2,
  Sparkles,
  Users,
  Inbox,
  ShoppingBag,
  ChevronRight,
  Link2,
  Activity,
  Clock,
  Zap,
  Lock,
  Globe,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/connections")({
  head: () => ({
    meta: [
      { title: "Connections — FCommerce" },
      { name: "description", content: "Connect your Facebook Pages, Messenger, Instagram, and WhatsApp to FCommerce." },
    ],
  }),
  component: ConnectionsPage,
});

type ConnectionStatus = "connected" | "warning" | "disconnected";

type Page = {
  id: string;
  name: string;
  handle: string;
  category: string;
  followers: string;
  initials: string;
  cover: string;
  status: ConnectionStatus;
  permissions: {
    messenger: ConnectionStatus;
    webhook: ConnectionStatus;
    insights: ConnectionStatus;
    publish: ConnectionStatus;
  };
  unread: number;
  lastSync: string;
};

const pages: Page[] = [
  {
    id: "1",
    name: "Dhaka Threads",
    handle: "@dhakathreads",
    category: "Fashion & Apparel",
    followers: "184K",
    initials: "DT",
    cover: "linear-gradient(135deg,#6366f1,#a855f7)",
    status: "connected",
    permissions: { messenger: "connected", webhook: "connected", insights: "connected", publish: "connected" },
    unread: 8,
    lastSync: "Synced 2 min ago",
  },
  {
    id: "2",
    name: "Chittagong Kitchen",
    handle: "@ctgkitchen",
    category: "Food & Beverage",
    followers: "62.4K",
    initials: "CK",
    cover: "linear-gradient(135deg,#f97316,#ef4444)",
    status: "warning",
    permissions: { messenger: "connected", webhook: "warning", insights: "connected", publish: "disconnected" },
    unread: 2,
    lastSync: "Synced 14 min ago",
  },
  {
    id: "3",
    name: "Bagh Sports BD",
    handle: "@baghsportsbd",
    category: "Sportswear",
    followers: "28.1K",
    initials: "BS",
    cover: "linear-gradient(135deg,#10b981,#0ea5e9)",
    status: "connected",
    permissions: { messenger: "connected", webhook: "connected", insights: "warning", publish: "connected" },
    unread: 0,
    lastSync: "Synced just now",
  },
];

function StatusDot({ status }: { status: ConnectionStatus }) {
  const map = {
    connected: "bg-emerald-500 shadow-[0_0_0_3px_oklch(0.7_0.17_162/0.18)]",
    warning: "bg-amber-500 shadow-[0_0_0_3px_oklch(0.78_0.16_70/0.18)]",
    disconnected: "bg-rose-500 shadow-[0_0_0_3px_oklch(0.65_0.22_27/0.18)]",
  } as const;
  return <span className={cn("inline-block h-2 w-2 rounded-full", map[status])} />;
}

function StatusBadge({ status, label }: { status: ConnectionStatus; label?: string }) {
  const cfg = {
    connected: { icon: CheckCircle2, cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", text: "Connected" },
    warning: { icon: AlertTriangle, cls: "bg-amber-500/10 text-amber-600 border-amber-500/20", text: "Action needed" },
    disconnected: { icon: AlertTriangle, cls: "bg-rose-500/10 text-rose-600 border-rose-500/20", text: "Disconnected" },
  } as const;
  const c = cfg[status];
  const Icon = c.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", c.cls)}>
      <Icon className="h-3 w-3" /> {label ?? c.text}
    </span>
  );
}

function PermRow({
  icon: Icon,
  title,
  desc,
  status,
}: {
  icon: typeof Inbox;
  title: string;
  desc: string;
  status: ConnectionStatus;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/60 px-3 py-2.5">
      <div className="flex items-center gap-3">
        <div className={cn("grid h-8 w-8 place-items-center rounded-lg",
          status === "connected" && "bg-emerald-500/10 text-emerald-600",
          status === "warning" && "bg-amber-500/10 text-amber-600",
          status === "disconnected" && "bg-rose-500/10 text-rose-600",
        )}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-medium">{title}</div>
          <div className="text-[11px] text-muted-foreground">{desc}</div>
        </div>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}

function ChannelCard({
  brand,
  name,
  status,
  description,
  accent,
  icon: Icon,
  onConnect,
  count,
}: {
  brand: string;
  name: string;
  status: ConnectionStatus;
  description: string;
  accent: string;
  icon: typeof Facebook;
  onConnect: () => void;
  count?: string;
}) {
  const connected = status === "connected";
  return (
    <Card className="group relative overflow-hidden border-border/70 transition-all hover-lift">
      <div className={cn("absolute inset-x-0 top-0 h-1", accent)} />
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between">
          <div className={cn("grid h-11 w-11 place-items-center rounded-xl text-white shadow-elegant", accent)}>
            <Icon className="h-5 w-5" />
          </div>
          <StatusBadge status={status} />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{brand}</div>
          <div className="text-base font-semibold tracking-tight">{name}</div>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        {count && (
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs">
            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">{count}</span>
          </div>
        )}
        <Button
          onClick={onConnect}
          variant={connected ? "outline" : "default"}
          className={cn("w-full rounded-xl", !connected && "bg-gradient-primary text-white shadow-elegant hover:shadow-glow")}
        >
          {connected ? <>Manage <Settings2 className="ml-1 h-4 w-4" /></> : <>Connect <ArrowRight className="ml-1 h-4 w-4" /></>}
        </Button>
      </CardContent>
    </Card>
  );
}

const onboardingSteps = [
  { title: "Connect Meta Business account", desc: "Sign in with the admin of your Facebook Pages.", done: true },
  { title: "Select Pages to manage", desc: "Choose one or more Pages to sync into FCommerce.", done: true },
  { title: "Grant Messenger permissions", desc: "Allow inbox access, message sending and quick replies.", done: true },
  { title: "Verify webhook delivery", desc: "We auto-subscribe to message, postback and feed events.", done: false },
  { title: "Connect Instagram & WhatsApp", desc: "Optional. Unify all DMs into one inbox.", done: false },
];

function ConnectionsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const completed = onboardingSteps.filter((s) => s.done).length;
  const pct = Math.round((completed / onboardingSteps.length) * 100);

  const handleConnect = (channel: string) => {
    toast.success(`Opening ${channel} OAuth…`, { description: "You'll be redirected to Meta to authorize FCommerce." });
  };

  return (
    <AppLayout
      title="Connections"
      subtitle="Connect your Facebook Pages, Messenger, Instagram and WhatsApp to FCommerce."
      actions={
        <>
          <Button variant="outline" className="rounded-xl">
            <RefreshCw className="mr-1.5 h-4 w-4" /> Sync all
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl bg-gradient-primary text-white shadow-elegant hover:shadow-glow">
                <Plus className="mr-1.5 h-4 w-4" /> Connect Facebook Page
              </Button>
            </DialogTrigger>
            <ConnectDialog onClose={() => setDialogOpen(false)} />
          </Dialog>
        </>
      }
    >
      <div className="space-y-6">
        {/* Hero / Onboarding */}
        <Card className="relative overflow-hidden border-border/70">
          <div className="absolute inset-0 bg-gradient-primary opacity-95" />
          <div className="absolute inset-0 bg-gradient-mesh mix-blend-overlay opacity-70" />
          <div className="absolute inset-0 grid-fade opacity-20" />
          <CardContent className="relative z-10 grid gap-6 p-7 text-white lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> Meta Business Setup
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  One inbox. Every Meta channel.
                </h2>
                <p className="mt-2 max-w-xl text-sm text-white/85">
                  Connect Facebook, Messenger, Instagram and WhatsApp Business in under 2 minutes — we'll keep the webhooks alive and reauthorize tokens automatically.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={() => setDialogOpen(true)}
                  className="rounded-xl bg-white text-[oklch(0.25_0.03_260)] hover:bg-white/90"
                >
                  <Facebook className="mr-1.5 h-4 w-4 text-[#1877F2]" /> Connect with Facebook
                </Button>
                <Button variant="ghost" className="rounded-xl text-white hover:bg-white/10">
                  Read setup guide <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4 text-xs text-white/80">
                <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> OAuth 2.0</span>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Meta verified app</span>
                <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> 99.99% uptime</span>
              </div>
            </div>

            {/* Onboarding progress card */}
            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Setup progress</div>
                <div className="text-xs text-white/80">{completed} of {onboardingSteps.length} steps</div>
              </div>
              <Progress value={pct} className="mt-3 h-1.5 bg-white/20" />
              <ol className="mt-4 space-y-2.5">
                {onboardingSteps.map((s, i) => (
                  <li key={s.title} className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold",
                        s.done ? "bg-white text-emerald-600" : "border border-white/40 text-white/80",
                      )}
                    >
                      {s.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <div className="leading-tight">
                      <div className={cn("text-sm font-medium", s.done && "line-through opacity-80")}>{s.title}</div>
                      <div className="text-[11px] text-white/75">{s.desc}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Channel cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ChannelCard
            brand="Meta"
            name="Facebook Pages"
            description="Sync posts, comments and orders from your Pages."
            status="connected"
            accent="bg-[#1877F2]"
            icon={Facebook}
            count="3 Pages connected"
            onConnect={() => handleConnect("Facebook")}
          />
          <ChannelCard
            brand="Meta"
            name="Messenger"
            description="Receive and reply to Page conversations with AI."
            status="connected"
            accent="bg-gradient-to-br from-[#0084FF] to-[#A100FF]"
            icon={MessageCircle}
            count="8 unread conversations"
            onConnect={() => handleConnect("Messenger")}
          />
          <ChannelCard
            brand="Meta"
            name="Instagram"
            description="Unify Instagram DMs and story replies into one inbox."
            status="warning"
            accent="bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]"
            icon={Instagram}
            count="Pending Instagram link"
            onConnect={() => handleConnect("Instagram")}
          />
          <ChannelCard
            brand="Meta"
            name="WhatsApp Business"
            description="Send order updates and AI replies on WhatsApp."
            status="disconnected"
            accent="bg-[#25D366]"
            icon={MessageCircle}
            onConnect={() => handleConnect("WhatsApp")}
          />
        </div>

        {/* Two-column: connected pages list + webhook/api panel */}
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Connected pages */}
          <Card className="border-border/70">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-base">Connected Pages</CardTitle>
                <p className="text-xs text-muted-foreground">Manage permissions and webhooks for each Page.</p>
              </div>
              <Badge variant="secondary" className="rounded-full">{pages.length} active</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {pages.map((p) => (
                <PageRow key={p.id} page={p} />
              ))}
            </CardContent>
          </Card>

          {/* Webhook & API */}
          <div className="space-y-4">
            <Card className="border-border/70">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Webhook className="h-4 w-4 text-primary" /> Webhook status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-xl border border-border bg-card p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      <span className="text-sm font-medium">Receiving events</span>
                    </div>
                    <Badge className="rounded-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15">Live</Badge>
                  </div>
                  <Separator className="my-3" />
                  <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Callback URL</Label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-muted/60 px-2.5 py-2 font-mono text-[11px]">
                    <Link2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">https://api.fcommerce.io/webhooks/meta/v1</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("https://api.fcommerce.io/webhooks/meta/v1");
                        toast.success("Webhook URL copied");
                      }}
                      className="ml-auto text-muted-foreground hover:text-foreground"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Events / min", value: "142", icon: Zap },
                    { label: "Avg latency", value: "84ms", icon: Clock },
                    { label: "Success rate", value: "99.8%", icon: CheckCircle2 },
                  ].map((m) => (
                    <div key={m.label} className="rounded-xl border border-border bg-card/60 p-3">
                      <m.icon className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
                      <div className="mt-1 text-base font-semibold tracking-tight">{m.value}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 rounded-xl border border-border bg-card/60 p-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Subscribed fields</div>
                  <div className="flex flex-wrap gap-1.5">
                    {["messages", "message_postbacks", "feed", "messaging_handovers", "messaging_referrals"].map((f) => (
                      <Badge key={f} variant="outline" className="rounded-md font-mono text-[10px]">{f}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Token health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Long-lived Page token</span>
                  <Badge className="rounded-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15">Valid · 58d left</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Auto-refresh</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Webhook signature check</span>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <Button variant="outline" className="w-full rounded-xl">
                  <RefreshCw className="mr-1.5 h-4 w-4" /> Re-authorize Meta
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-base">Connection instructions</CardTitle>
            <p className="text-xs text-muted-foreground">Follow these steps if a Page didn't appear after authorizing.</p>
          </CardHeader>
          <CardContent>
            <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { n: 1, t: "Open Meta Business Suite", d: "Go to business.facebook.com and sign in with the admin account that owns the Page." },
                { n: 2, t: "Add FCommerce as a partner", d: "Settings → Business Assets → Add Asset → Apps → Search for “FCommerce”." },
                { n: 3, t: "Grant full Messenger access", d: "Tick pages_messaging, pages_show_list and pages_manage_metadata in the permissions dialog." },
                { n: 4, t: "Return here and click Sync", d: "Within 30s your Pages, Instagram and WhatsApp numbers will appear above." },
              ].map((s) => (
                <li key={s.n} className="relative rounded-2xl border border-border bg-card/60 p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-primary text-sm font-bold text-white shadow-elegant">
                    {s.n}
                  </div>
                  <div className="mt-3 text-sm font-semibold">{s.t}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{s.d}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function PageRow({ page }: { page: Page }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/60 transition-all hover:border-foreground/15 hover:shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 p-3 text-left"
      >
        <div
          className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl text-sm font-bold text-white shadow-elegant"
          style={{ background: page.cover }}
        >
          {page.initials}
          <span className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-card">
            <StatusDot status={page.status} />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold">{page.name}</span>
            <Badge variant="secondary" className="rounded-full text-[10px]">{page.category}</Badge>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
            <span className="font-mono">{page.handle}</span>
            <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {page.followers}</span>
            <span className="inline-flex items-center gap-1"><Inbox className="h-3 w-3" /> {page.unread} unread</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {page.lastSync}</span>
          </div>
        </div>
        <StatusBadge status={page.status} />
        <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-90")} />
      </button>
      {open && (
        <div className="grid gap-2 border-t border-border bg-muted/30 p-3 sm:grid-cols-2">
          <PermRow icon={MessageCircle} title="Messenger access" desc="pages_messaging" status={page.permissions.messenger} />
          <PermRow icon={Webhook} title="Webhook subscription" desc="messages, feed, postbacks" status={page.permissions.webhook} />
          <PermRow icon={Activity} title="Insights & analytics" desc="read_insights" status={page.permissions.insights} />
          <PermRow icon={ShoppingBag} title="Publish & comments" desc="pages_manage_posts" status={page.permissions.publish} />
          <div className="sm:col-span-2 flex flex-wrap items-center justify-end gap-2 pt-1">
            <Button variant="ghost" size="sm" className="rounded-lg">
              <RefreshCw className="mr-1 h-3.5 w-3.5" /> Resync Page
            </Button>
            <Button variant="outline" size="sm" className="rounded-lg">
              <Settings2 className="mr-1 h-3.5 w-3.5" /> Permissions
            </Button>
            <Button size="sm" className="rounded-lg bg-gradient-primary text-white">
              Open inbox <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ConnectDialog({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"login" | "select" | "perms" | "done">("login");

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#1877F2] text-white">
            <Facebook className="h-3.5 w-3.5" />
          </div>
          Connect with Meta
        </DialogTitle>
        <DialogDescription>
          You'll be redirected to Meta to authorize FCommerce. We never see your password.
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center gap-1.5 px-1">
        {["login", "select", "perms", "done"].map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-1.5">
            <div
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                ["login", "select", "perms", "done"].indexOf(step) >= i ? "bg-primary" : "bg-muted",
              )}
            />
          </div>
        ))}
      </div>

      {step === "login" && (
        <div className="space-y-3">
          <Label>Meta Business email</Label>
          <Input placeholder="admin@yourbrand.com" />
          <p className="text-xs text-muted-foreground">
            Make sure this account is an admin on every Page you want to connect.
          </p>
        </div>
      )}
      {step === "select" && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Select the Pages to import.</p>
          {pages.map((p) => (
            <label
              key={p.id}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-foreground/20"
            >
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--primary)]" />
              <div className="grid h-8 w-8 place-items-center rounded-lg text-xs font-bold text-white" style={{ background: p.cover }}>
                {p.initials}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-[11px] text-muted-foreground">{p.followers} followers · {p.category}</div>
              </div>
            </label>
          ))}
        </div>
      )}
      {step === "perms" && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Grant the permissions FCommerce needs.</p>
          {[
            { p: "pages_messaging", d: "Send and receive Messenger conversations." },
            { p: "pages_show_list", d: "List the Pages you manage." },
            { p: "pages_manage_metadata", d: "Subscribe webhooks for live events." },
            { p: "instagram_basic", d: "Read Instagram profile and media." },
            { p: "whatsapp_business_messaging", d: "Send order updates on WhatsApp." },
          ].map((s) => (
            <div key={s.p} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <div>
                <div className="font-mono text-xs font-medium">{s.p}</div>
                <div className="text-[11px] text-muted-foreground">{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {step === "done" && (
        <div className="space-y-3 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <div className="text-base font-semibold">3 Pages connected</div>
            <p className="text-xs text-muted-foreground">Webhooks are live. You'll receive new messages instantly.</p>
          </div>
        </div>
      )}

      <DialogFooter className="gap-2">
        {step !== "done" ? (
          <>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button
              className="bg-gradient-primary text-white shadow-elegant hover:shadow-glow"
              onClick={() => {
                setStep(step === "login" ? "select" : step === "select" ? "perms" : "done");
              }}
            >
              {step === "perms" ? "Authorize" : "Continue"} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button className="w-full bg-gradient-primary text-white" onClick={onClose}>Done</Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
}
