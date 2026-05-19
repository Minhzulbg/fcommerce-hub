import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Inbox,
  ShoppingBag,
  Users,
  BarChart3,
  CreditCard,
  Settings,
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  Sparkles,
  X,
  ChevronDown,
  User,
  LogOut,
  HelpCircle,
  Keyboard,
  CheckCheck,
  MessageSquare,
  Truck,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
};

const nav: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inbox", label: "Inbox", icon: Inbox, badge: 8 },
  { to: "/orders", label: "Orders", icon: ShoppingBag },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/subscription", label: "Subscription", icon: CreditCard },
  { to: "/settings", label: "Settings", icon: Settings },
];

const notifications = [
  { icon: ShoppingBag, color: "bg-blue-500/15 text-blue-600", title: "New order #FC-10428", desc: "Nusrat Jahan · ৳ 1,250", time: "2m" },
  { icon: MessageSquare, color: "bg-amber-500/15 text-amber-600", title: "3 new messages", desc: "Messenger inbox", time: "12m" },
  { icon: Truck, color: "bg-emerald-500/15 text-emerald-600", title: "Pathao delivered", desc: "Order #FC-10422 marked delivered", time: "1h" },
  { icon: DollarSign, color: "bg-violet-500/15 text-violet-600", title: "Payment received", desc: "৳ 6,200 from bKash", time: "3h" },
];

export function AppLayout({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const SidebarInner = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-sidebar-border">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="font-bold text-sidebar-foreground tracking-tight">FCommerce</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Commerce Suite</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Workspace
        </div>
        <ul className="space-y-0.5">
          {nav.map((item) => {
            const active = item.to === "/dashboard" ? path === "/dashboard" || path === "/" : path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-gradient-primary text-primary-foreground shadow-elegant"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:translate-x-0.5",
                  )}
                >
                  <Icon className={cn("h-[18px] w-[18px] shrink-0 transition-transform", !active && "group-hover:scale-110 group-hover:text-primary")} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                        active
                          ? "bg-white/25 text-primary-foreground"
                          : "bg-primary/10 text-primary",
                      )}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="m-3 overflow-hidden rounded-2xl border border-sidebar-border bg-gradient-mesh p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-primary" /> Upgrade to Pro
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Unlock AI replies, advanced analytics, and unlimited orders.
        </p>
        <Button size="sm" className="mt-3 w-full bg-gradient-primary shadow-elegant hover:opacity-95">
          Upgrade now
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        {SidebarInner}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-sidebar border-r border-sidebar-border shadow-2xl animate-slide-in-right">
            <div className="absolute right-2 top-3">
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            {SidebarInner}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/70 glass-strong px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="relative hidden md:block max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders, customers, messages…"
              className="pl-9 pr-16 bg-muted/40 border-transparent focus-visible:bg-background"
            />
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme" className="rounded-full">
              {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <Bell className="h-[18px] w-[18px]" />
                  <span className="absolute right-2 top-2 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold">Notifications</div>
                    <div className="text-[11px] text-muted-foreground">You have 4 unread</div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                    <CheckCheck className="h-3.5 w-3.5" /> Mark read
                  </Button>
                </div>
                <div className="max-h-80 overflow-y-auto py-1">
                  {notifications.map((n, i) => {
                    const Icon = n.icon;
                    return (
                      <button key={i} className="flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/50">
                        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", n.color)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <div className="truncate text-sm font-medium">{n.title}</div>
                            <div className="shrink-0 text-[10px] text-muted-foreground">{n.time}</div>
                          </div>
                          <div className="truncate text-xs text-muted-foreground">{n.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="border-t border-border p-2">
                  <Button variant="ghost" size="sm" className="w-full justify-center text-xs">
                    View all notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 flex items-center gap-2 rounded-full border border-border bg-card/60 pl-1 pr-2 py-1 transition-colors hover:bg-muted">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-semibold">
                      AR
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block leading-tight text-left">
                    <div className="text-xs font-semibold">Arif Rahman</div>
                    <div className="text-[10px] text-muted-foreground">Admin</div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <div className="flex items-center gap-3 px-2 py-2">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm font-semibold">AR</AvatarFallback>
                  </Avatar>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold">Arif Rahman</div>
                    <div className="text-xs text-muted-foreground">arif@fcommerce.app</div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Account
                </DropdownMenuLabel>
                <DropdownMenuItem><User className="h-4 w-4" /> Profile</DropdownMenuItem>
                <DropdownMenuItem><Settings className="h-4 w-4" /> Settings</DropdownMenuItem>
                <DropdownMenuItem><Keyboard className="h-4 w-4" /> Keyboard shortcuts</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem><HelpCircle className="h-4 w-4" /> Help & support</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page header */}
        <div className="border-b border-border bg-background px-4 py-6 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </div>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

export { Badge };
