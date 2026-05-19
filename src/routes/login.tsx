import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, EyeOff, Mail, Lock, Sparkles, Moon, Sun, ArrowRight, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — FCommerce" },
      { name: "description", content: "Sign in to your FCommerce dashboard to manage Facebook orders, conversations, and analytics." },
    ],
  }),
  component: LoginPage,
});

function AuthShell({ children, side }: { children: React.ReactNode; side: React.ReactNode }) {
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        {/* Left – form */}
        <div className="relative flex flex-col px-6 py-8 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-white shadow-elegant">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <span className="text-base font-bold tracking-tight">FCommerce</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme" className="rounded-full">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>

          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
            {children}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} FCommerce · <Link to="/" className="hover:text-foreground">Terms</Link> · <Link to="/" className="hover:text-foreground">Privacy</Link>
          </p>
        </div>

        {/* Right – marketing panel */}
        <div className="relative hidden overflow-hidden lg:block">
          <div className="absolute inset-0 bg-gradient-primary" />
          <div className="absolute inset-0 bg-gradient-mesh opacity-70 mix-blend-overlay" />
          <div className="absolute inset-0 grid-fade opacity-20" />
          <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-fuchsia-400/30 blur-3xl" />
          <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
            {side}
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketingSide() {
  return (
    <>
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-white/80">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-white/15 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        FCommerce · Business Suite
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-4xl font-bold leading-tight tracking-tight">
            Run your Facebook<br />commerce on autopilot.
          </h2>
          <p className="mt-4 max-w-md text-white/85">
            AI replies, courier sync, and one inbox for every conversation — built for Bangladesh's fastest growing brands.
          </p>
        </div>

        {/* Glass stat card */}
        <div className="grid max-w-md grid-cols-2 gap-3">
          {[
            { icon: BarChart3, label: "Avg. revenue ↑", value: "+38%" },
            { icon: Zap, label: "AI response time", value: "1.2s" },
            { icon: ShieldCheck, label: "Order accuracy", value: "99.4%" },
            { icon: Sparkles, label: "Active brands", value: "2,400+" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl border border-white/20 bg-white/10 p-4 text-white">
              <s.icon className="h-4 w-4 text-white/80" />
              <div className="mt-3 text-2xl font-semibold tracking-tight">{s.value}</div>
              <div className="text-xs text-white/75">{s.label}</div>
            </div>
          ))}
        </div>

        <figure className="max-w-md rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
          <blockquote className="text-sm leading-relaxed text-white/95">
            "We replaced 3 tools with FCommerce. Our cart-to-delivery flow now runs without us touching the keyboard."
          </blockquote>
          <figcaption className="mt-3 flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-xs font-semibold">RA</div>
            <div className="text-xs">
              <div className="font-semibold">Rafia Ahmed</div>
              <div className="text-white/70">Founder · Dhaka Threads</div>
            </div>
          </figcaption>
        </figure>
      </div>

      <div className="flex items-center gap-2 text-xs text-white/70">
        <ShieldCheck className="h-3.5 w-3.5" /> SOC 2 · GDPR · 256-bit encryption
      </div>
    </>
  );
}

export function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        className="group flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-all hover:border-foreground/30 hover:shadow-sm"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.95l3.66-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
        </svg>
        Google
      </button>
      <button
        type="button"
        className="group flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-all hover:border-foreground/30 hover:shadow-sm"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
          <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.95.93-1.95 1.87V12h3.32l-.53 3.47h-2.79v8.38A12 12 0 0 0 24 12z" />
        </svg>
        Facebook
      </button>
    </div>
  );
}

export function DividerWithText({ text }: { text: string }) {
  return (
    <div className="relative my-6">
      <Separator />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs uppercase tracking-wider text-muted-foreground">
        {text}
      </span>
    </div>
  );
}

function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);

  return (
    <AuthShell side={<MarketingSide />}>
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> All systems operational
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your FCommerce workspace to keep selling.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        <SocialButtons />
        <DividerWithText text="or continue with email" />

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" type="email" placeholder="you@brand.com" className="h-11 pl-9" autoComplete="email" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                className="h-11 px-9"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <Checkbox id="remember" /> Remember me for 30 days
          </label>

          <Button
            type="submit"
            className={cn(
              "h-11 w-full rounded-xl bg-gradient-primary text-white shadow-elegant transition hover:shadow-glow",
            )}
          >
            Sign in <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          New to FCommerce?{" "}
          <Link to="/register" className="font-semibold text-foreground hover:text-primary">
            Create an account
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export { AuthShell, MarketingSide };
