import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, ArrowLeft, ArrowRight, MailCheck, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell, MarketingSide } from "./login";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password — FCommerce" },
      { name: "description", content: "Reset your FCommerce password securely." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <AuthShell side={<MarketingSide />}>
      <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </Link>

      {!sent ? (
        <>
          <div className="space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-elegant">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Forgot your password?</h1>
            <p className="text-sm text-muted-foreground">
              No worries — enter the email tied to your workspace and we'll send a secure reset link.
            </p>
          </div>

          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@brand.com"
                  className="h-11 pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="h-11 w-full rounded-xl bg-gradient-primary text-white shadow-elegant hover:shadow-glow">
              Send reset link <ArrowRight className="ml-1 h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              For your security, the link expires in 30 minutes and can only be used once.
            </div>
          </form>
        </>
      ) : (
        <div className="space-y-6 text-center">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
            <MailCheck className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Check your inbox</h1>
            <p className="text-sm text-muted-foreground">
              We sent a reset link to <span className="font-medium text-foreground">{email || "your email"}</span>.
              Click the link to set a new password.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 text-left text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Didn't receive it?</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
              <li>Check your spam or promotions folder</li>
              <li>Make sure the email is correct</li>
              <li>Wait a minute — delivery can take up to 60 seconds</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="h-11 flex-1 rounded-xl" onClick={() => setSent(false)}>
              Try another email
            </Button>
            <Button className="h-11 flex-1 rounded-xl bg-gradient-primary text-white shadow-elegant hover:shadow-glow" onClick={() => setSent(false)}>
              Resend link
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Remembered it?{" "}
            <Link to="/login" className="font-semibold text-foreground hover:text-primary">Sign in</Link>
          </p>
        </div>
      )}
    </AuthShell>
  );
}
