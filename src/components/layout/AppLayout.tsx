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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
      <div className="flex h-16 items-center gap-2 px-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="font-semibold text-sidebar-foreground">FCommerce</div>
          <div className="text-[11px] text-muted-foreground">Commerce Suite</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Workspace
        </div>
        <ul className="space-y-1">
          {nav.map((item) => {
            const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        active
                          ? "bg-primary-foreground/20 text-primary-foreground"
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
      <div className="m-3 rounded-xl border border-sidebar-border bg-gradient-to-br from-primary/10 via-card to-card p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-primary" /> Upgrade to Pro
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Unlock AI replies, advanced analytics, and unlimited orders.
        </p>
        <Button size="sm" className="mt-3 w-full">
          Upgrade
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
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-sidebar border-r border-sidebar-border shadow-xl">
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
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
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
              className="pl-9 bg-muted/50 border-transparent focus-visible:bg-background"
            />
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <div className="ml-2 flex items-center gap-2 rounded-full border border-border bg-card pl-1 pr-3 py-1">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  AR
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block leading-tight">
                <div className="text-xs font-semibold">Arif Rahman</div>
                <div className="text-[10px] text-muted-foreground">Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page header */}
        <div className="border-b border-border bg-background px-4 py-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
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
