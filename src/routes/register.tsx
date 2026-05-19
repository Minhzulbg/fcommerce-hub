import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, EyeOff, Mail, Lock, User, Building2, ArrowRight, Check, ShieldCheck, Sparkles, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { AuthShell, MarketingSide, SocialButtons, DividerWithText } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — FCommerce" },
      { name: "description", content: "Start your FCommerce account and grow your Facebook business in minutes." },
    ],
  }),
  component: RegisterPage,
});

function pwdScore(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0..4
}

function RegisterPage() {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const score = pwdScore(pwd);
  const meterColor = ["bg-muted", "bg-red-500", "bg-amber-500", "bg-yellow-500", "bg-emerald-500"][score];
  const meterLabel = ["", "Weak", "Fair", "Good", "Strong"][score];

  return (
    <AuthShell side={<MarketingSide />}>
      {step === "form" ? (
        <>
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Create your account</h1>
            <p className="text-sm text-muted-foreground">
              14-day free trial · No credit card required · Cancel anytime.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <SocialButtons />
            <DividerWithText text="or sign up with email" />

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setStep("otp");
              }}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="name" placeholder="Tanvir Hossain" className="h-11 pl-9" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="brand">Brand / Page</Label>
                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="brand" placeholder="Dhaka Threads" className="h-11 pl-9" required />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Work email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@brand.com" className="h-11 pl-9" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="h-11 px-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex h-1.5 flex-1 gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-full flex-1 rounded-full transition-colors",
                          i < score ? meterColor : "bg-muted",
                        )}
                      />
                    ))}
                  </div>
                  <span className="w-12 text-right text-xs text-muted-foreground">{meterLabel}</span>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-2 text-sm text-muted-foreground">
                <Checkbox id="terms" className="mt-0.5" required />
                <span>
                  I agree to FCommerce's{" "}
                  <Link to="/" className="font-medium text-foreground hover:text-primary">Terms of Service</Link>{" "}
                  and{" "}
                  <Link to="/" className="font-medium text-foreground hover:text-primary">Privacy Policy</Link>.
                </span>
              </label>

              <Button type="submit" className="h-11 w-full rounded-xl bg-gradient-primary text-white shadow-elegant hover:shadow-glow">
                Create account <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-foreground hover:text-primary">
                Sign in
              </Link>
            </p>
          </div>
        </>
      ) : (
        <OtpStep onBack={() => setStep("form")} />
      )}
    </AuthShell>
  );
}

function OtpStep({ onBack }: { onBack: () => void }) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));

  const filled = useMemo(() => digits.every((d) => d.length === 1), [digits]);

  const setDigit = (i: number, v: string) => {
    const clean = v.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = clean;
      return next;
    });
    if (clean && i < 5) {
      const el = document.getElementById(`otp-${i + 1}`) as HTMLInputElement | null;
      el?.focus();
    }
  };

  return (
    <>
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-elegant">
          <KeyRound className="h-5 w-5" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Verify your email</h1>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to <span className="font-medium text-foreground">you@brand.com</span>. Enter it below to continue.
        </p>
      </div>

      <form
        className="mt-8 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex justify-between gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !digits[i] && i > 0) {
                  const el = document.getElementById(`otp-${i - 1}`) as HTMLInputElement | null;
                  el?.focus();
                }
              }}
              className={cn(
                "h-14 w-full rounded-xl border border-border bg-card text-center text-2xl font-semibold tracking-tight outline-none transition",
                "focus:border-primary focus:ring-2 focus:ring-primary/30",
                d && "border-primary/60 bg-primary/5",
              )}
            />
          ))}
        </div>

        <Button
          type="submit"
          disabled={!filled}
          className="h-11 w-full rounded-xl bg-gradient-primary text-white shadow-elegant hover:shadow-glow disabled:opacity-50"
        >
          <Check className="mr-1 h-4 w-4" /> Verify & continue
        </Button>

        <div className="flex items-center justify-between text-sm">
          <button type="button" onClick={onBack} className="text-muted-foreground hover:text-foreground">
            ← Use a different email
          </button>
          <button type="button" className="font-medium text-primary hover:underline">
            Resend code
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          Codes expire after 10 minutes. Never share it with anyone — not even FCommerce support.
        </div>
      </form>
    </>
  );
}
