import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Bell, Lock, Facebook, Truck, Palette } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

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

          {active === "couriers" && (
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-base font-semibold">Courier Integrations</h3>
                <p className="text-xs text-muted-foreground">Enable delivery partners</p>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {["Pathao", "Steadfast", "RedX", "Paperfly"].map((c, i) => (
                    <div key={c} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <div className="text-sm font-medium">{c}</div>
                        <div className="text-xs text-muted-foreground">{i < 2 ? "Active" : "Not connected"}</div>
                      </div>
                      <Switch defaultChecked={i < 2} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
