import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthShell, MarketingSide, SocialButtons, DividerWithText } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — FCommerce" },
      { name: "description", content: "Sign in to your FCommerce dashboard to manage Facebook orders, conversations, and analytics." },
    ],
  }),
  component: LoginPage,
});

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

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
            className="h-11 w-full rounded-xl bg-gradient-primary text-white shadow-elegant transition hover:shadow-glow"
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
