import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Send,
  Bot,
  Paperclip,
  Smile,
  Search,
  Facebook,
  Phone,
  Video,
  Info,
  Image as ImageIcon,
  MapPin,
  ShoppingBag,
  Star,
  CheckCheck,
  Sparkles,
  Mic,
  ThumbsUp,
  X,
  ArrowLeft,
  MoreHorizontal,
  Filter,
  Tag,
  Clock,
  Package,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inbox")({
  component: InboxPage,
});

type Thread = {
  id: number;
  name: string;
  last: string;
  time: string;
  unread: number;
  online: boolean;
  channel: "messenger" | "instagram" | "whatsapp";
  tag?: "VIP" | "New" | "Repeat";
};

const threads: Thread[] = [
  { id: 1, name: "Nusrat Jahan", last: "Apu, ei dress er stock ache?", time: "2m", unread: 3, online: true, channel: "messenger", tag: "VIP" },
  { id: 2, name: "Tanvir Ahmed", last: "Order confirm korlam ✓", time: "12m", unread: 0, online: true, channel: "messenger", tag: "Repeat" },
  { id: 3, name: "Sadia Islam", last: "Delivery koto din lagbe?", time: "1h", unread: 1, online: false, channel: "instagram" },
  { id: 4, name: "Rakib Hasan", last: "Thanks for the quick reply!", time: "3h", unread: 0, online: false, channel: "whatsapp", tag: "Repeat" },
  { id: 5, name: "Mehzabin R.", last: "Cash on delivery available?", time: "5h", unread: 2, online: true, channel: "messenger", tag: "New" },
  { id: 6, name: "Imran Khan", last: "Bhaiya size chart ta pathan", time: "1d", unread: 0, online: false, channel: "messenger" },
  { id: 7, name: "Farhana Akter", last: "Color option ki ki ache?", time: "1d", unread: 0, online: false, channel: "instagram" },
  { id: 8, name: "Shakib Al Hasan", last: "Order ta cancel kora jabe?", time: "2d", unread: 0, online: false, channel: "messenger" },
];

type Message =
  | { from: "them" | "me"; type: "text"; text: string; time: string; seen?: boolean }
  | { from: "them" | "me"; type: "image"; url: string; time: string; seen?: boolean }
  | { from: "them" | "me"; type: "product"; title: string; price: string; image: string; time: string; seen?: boolean };

const messages: Message[] = [
  { from: "them", type: "text", text: "Assalamu alaikum apu 👋", time: "10:24" },
  { from: "them", type: "text", text: "Ei red cotton kurti tar stock ache?", time: "10:24" },
  { from: "them", type: "image", url: "kurti", time: "10:25" },
  { from: "me", type: "text", text: "Walaikum assalam! Yes apu, size M, L, XL available ache 🌸", time: "10:25", seen: true },
  { from: "me", type: "product", title: "Cotton Kurti — Red", price: "৳ 1,250", image: "kurti", time: "10:26", seen: true },
  { from: "them", type: "text", text: "Price koto?", time: "10:26" },
  { from: "me", type: "text", text: "৳ 1,250 only. Free delivery inside Dhaka 🚚", time: "10:26", seen: true },
  { from: "them", type: "text", text: "Ok, ami order korte chai. Cash on delivery hobe?", time: "10:28" },
];

const aiSuggestions = [
  { tone: "Friendly", text: "Ji apu! COD available. Address ta diye din, ami order confirm korchi 😊" },
  { tone: "Professional", text: "Yes, Cash on Delivery available across Bangladesh. Please share your full delivery address." },
  { tone: "Short", text: "Yes apu, COD available 👍 Address din please." },
];

const channelStyle: Record<Thread["channel"], { icon: typeof Facebook; color: string; label: string }> = {
  messenger: { icon: Facebook, color: "bg-blue-500", label: "Messenger" },
  instagram: { icon: Sparkles, color: "bg-gradient-to-br from-pink-500 to-amber-500", label: "Instagram" },
  whatsapp: { icon: Phone, color: "bg-emerald-500", label: "WhatsApp" },
};

const tagStyle: Record<NonNullable<Thread["tag"]>, string> = {
  VIP: "bg-amber-500/15 text-amber-600 border-amber-500/20",
  New: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  Repeat: "bg-blue-500/15 text-blue-600 border-blue-500/20",
};

function Bubble({ m, name }: { m: Message; name: string }) {
  const me = m.from === "me";
  return (
    <div className={cn("flex gap-2", me ? "justify-end" : "justify-start")}>
      {!me && (
        <Avatar className="h-7 w-7 self-end mb-1">
          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
            {name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
      )}
      <div className={cn("max-w-[75%] space-y-0.5", me && "items-end flex flex-col")}>
        {m.type === "text" && (
          <div
            className={cn(
              "px-4 py-2 text-sm shadow-sm leading-relaxed",
              me
                ? "rounded-2xl rounded-br-md bg-gradient-primary text-primary-foreground"
                : "rounded-2xl rounded-bl-md bg-card border border-border",
            )}
          >
            {m.text}
          </div>
        )}
        {m.type === "image" && (
          <div className={cn("overflow-hidden rounded-2xl border border-border shadow-sm", me ? "rounded-br-md" : "rounded-bl-md")}>
            <div className="flex h-44 w-60 items-center justify-center bg-gradient-to-br from-rose-200 via-pink-200 to-amber-200 text-rose-700">
              <ImageIcon className="h-10 w-10 opacity-60" />
            </div>
          </div>
        )}
        {m.type === "product" && (
          <div className={cn("flex w-64 gap-3 rounded-2xl border border-border bg-card p-2.5 shadow-sm", me ? "rounded-br-md" : "rounded-bl-md")}>
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-200 via-pink-200 to-amber-200">
              <ShoppingBag className="h-6 w-6 text-rose-700/70" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Product</div>
              <div className="truncate text-sm font-semibold">{m.title}</div>
              <div className="mt-0.5 text-sm font-bold text-primary">{m.price}</div>
            </div>
          </div>
        )}
        <div className={cn("flex items-center gap-1 px-1 text-[10px] text-muted-foreground", me ? "justify-end" : "justify-start")}>
          <span>{m.time}</span>
          {me && m.seen && <CheckCheck className="h-3 w-3 text-primary" />}
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-end gap-2">
      <Avatar className="h-7 w-7">
        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">NJ</AvatarFallback>
      </Avatar>
      <div className="rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

function InboxPage() {
  const [active, setActive] = useState<Thread>(threads[0]);
  const [showProfile, setShowProfile] = useState(true);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [attachment, setAttachment] = useState<{ name: string; size: string } | null>(null);
  const [draft, setDraft] = useState("");

  const ChannelIcon = channelStyle[active.channel].icon;

  return (
    <AppLayout title="Inbox" subtitle="Manage Facebook, Instagram & WhatsApp conversations">
      <Card className="overflow-hidden rounded-2xl shadow-elegant border-border/70 h-[calc(100vh-13rem)] min-h-[520px]">
        <div className={cn(
          "grid h-full grid-cols-1",
          showProfile
            ? "md:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_300px]"
            : "md:grid-cols-[300px_minmax(0,1fr)]"
        )}>
          {/* Threads list */}
          <div className={cn(
            "flex min-h-0 flex-col border-r border-border bg-card",
            mobileView === "chat" && "hidden md:flex",
          )}>
            <div className="border-b border-border p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold tracking-tight">Conversations</div>
                <Button variant="ghost" size="icon" className="h-7 w-7"><Filter className="h-3.5 w-3.5" /></Button>
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search messages" className="pl-9 h-9 bg-muted/50 border-transparent rounded-full" />
              </div>
              <div className="flex gap-1 text-xs">
                {["All", "Unread", "VIP", "Open"].map((t, i) => (
                  <button key={t} className={cn(
                    "rounded-full px-3 py-1 font-medium transition-colors",
                    i === 0 ? "bg-gradient-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:text-foreground"
                  )}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
              {threads.map((t) => {
                const Ch = channelStyle[t.channel].icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => { setActive(t); setMobileView("chat"); }}
                    className={cn(
                      "flex w-full items-start gap-3 border-l-2 px-3 py-3 text-left transition-all",
                      active.id === t.id
                        ? "border-l-primary bg-primary/5"
                        : "border-l-transparent hover:bg-muted/40",
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-11 w-11">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-chart-4/20 text-primary text-sm font-semibold">
                          {t.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className={cn(
                        "absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-card",
                        channelStyle[t.channel].color
                      )}>
                        <Ch className="h-2 w-2 text-white" />
                      </span>
                      {t.online && (
                        <span className="absolute -left-0.5 top-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn("truncate text-sm", t.unread > 0 ? "font-bold" : "font-semibold")}>{t.name}</span>
                        <span className={cn("text-[10px] shrink-0", t.unread > 0 ? "font-bold text-primary" : "text-muted-foreground")}>{t.time}</span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <p className={cn("truncate text-xs", t.unread > 0 ? "font-medium text-foreground" : "text-muted-foreground")}>{t.last}</p>
                        {t.unread > 0 && (
                          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-primary px-1.5 text-[10px] font-bold text-primary-foreground shadow-sm">
                            {t.unread}
                          </span>
                        )}
                      </div>
                      {t.tag && (
                        <span className={cn("mt-1.5 inline-flex rounded-full border px-1.5 py-0 text-[10px] font-semibold", tagStyle[t.tag])}>
                          {t.tag}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat pane */}
          <div className={cn(
            "flex min-h-0 flex-col bg-muted/10",
            mobileView === "list" && "hidden md:flex",
          )}>
            {/* Chat header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border bg-card px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={() => setMobileView("list")}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-chart-4/20 text-primary text-sm font-semibold">
                      {active.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  {active.online && <span className="absolute -right-0 -bottom-0 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold">{active.name}</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <ChannelIcon className="h-3 w-3" />
                    {channelStyle[active.channel].label} · {active.online ? <span className="text-emerald-600 font-medium">Active now</span> : "Last seen 2h ago"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-primary"><Phone className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-primary"><Video className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => setShowProfile(v => !v)}>
                  <Info className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full"><MoreHorizontal className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 min-h-0 space-y-4 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
              <div className="mx-auto w-fit rounded-full bg-muted/70 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Today
              </div>
              {messages.map((m, i) => (
                <Bubble key={i} m={m} name={active.name} />
              ))}
              <TypingDots />
            </div>

            {/* AI Suggestions */}
            <div className="border-t border-border bg-card/60 px-4 py-2.5">
              <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                <Sparkles className="h-3 w-3 text-primary" /> AI SUGGESTED REPLIES
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {aiSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setDraft(s.text)}
                    className="group shrink-0 max-w-[280px] rounded-xl border border-border bg-background px-3 py-2 text-left text-xs transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
                  >
                    <div className="mb-0.5 flex items-center gap-1">
                      <span className="rounded-full bg-primary/10 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider text-primary">{s.tone}</span>
                    </div>
                    <p className="line-clamp-2 leading-relaxed text-foreground/90">{s.text}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Attachment preview */}
            {attachment && (
              <div className="border-t border-border bg-card px-4 py-2">
                <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-semibold">{attachment.name}</div>
                    <div className="text-[10px] text-muted-foreground">{attachment.size}</div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setAttachment(null)}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Composer */}
            <div className="border-t border-border bg-card p-3">
              <div className="flex items-end gap-2">
                <div className="flex gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full text-primary"
                    onClick={() => setAttachment({ name: "size-chart.png", size: "248 KB" })}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-primary"><ImageIcon className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-primary hidden sm:inline-flex"><Mic className="h-4 w-4" /></Button>
                </div>
                <div className="flex flex-1 items-center gap-1 rounded-full border border-border bg-muted/30 px-3 py-1">
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Aa  Type a message…"
                    className="border-0 bg-transparent h-9 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Smile className="h-4 w-4" /></Button>
                </div>
                {draft.trim() ? (
                  <Button size="icon" className="h-9 w-9 rounded-full bg-gradient-primary shadow-elegant shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full text-primary shrink-0">
                    <ThumbsUp className="h-5 w-5 fill-current" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Customer profile */}
          {showProfile && (
            <aside className="hidden xl:flex flex-col border-l border-border bg-card overflow-y-auto">
              <div className="relative">
                <div className="h-20 bg-gradient-mesh" />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                  <Avatar className="h-16 w-16 ring-4 ring-card shadow-elegant">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg font-bold">
                      {active.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="px-5 pt-10 pb-4 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <h3 className="font-bold tracking-tight">{active.name}</h3>
                  {active.tag === "VIP" && <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />}
                </div>
                <div className="mt-0.5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                  <ChannelIcon className="h-3 w-3" /> {channelStyle[active.channel].label}
                </div>
                {active.tag && (
                  <Badge className={cn("mt-2 rounded-full border", tagStyle[active.tag])}>{active.tag} Customer</Badge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 px-4">
                {[
                  { v: "12", l: "Orders" },
                  { v: "৳ 24.5K", l: "Spent" },
                  { v: "4.9", l: "Rating" },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl border border-border bg-muted/30 p-2.5 text-center">
                    <div className="text-sm font-bold tabular-nums">{s.v}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 px-5">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Contact</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> 01711-234567</div>
                  <div className="flex items-start gap-2"><MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" /> House 42, Road 7, Dhanmondi, Dhaka 1209</div>
                  <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-muted-foreground" /> Customer since Mar 2024</div>
                </div>
              </div>

              <div className="mt-5 px-5">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Recent Orders</div>
                  <button className="text-[10px] font-semibold text-primary">View all</button>
                </div>
                <div className="space-y-2">
                  {[
                    { id: "#FC-10428", item: "Cotton Kurti — M", amt: "৳ 1,250", status: "Paid", color: "bg-emerald-500/10 text-emerald-600" },
                    { id: "#FC-10401", item: "Hijab Set (3pcs)", amt: "৳ 980", status: "Delivered", color: "bg-violet-500/10 text-violet-600" },
                    { id: "#FC-10387", item: "Saree — Jamdani", amt: "৳ 6,200", status: "Delivered", color: "bg-violet-500/10 text-violet-600" },
                  ].map((o) => (
                    <div key={o.id} className="flex items-center gap-2.5 rounded-xl border border-border p-2.5 transition-colors hover:bg-muted/40">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Package className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] text-muted-foreground">{o.id}</span>
                          <span className={cn("rounded-full px-1.5 py-0 text-[9px] font-semibold", o.color)}>{o.status}</span>
                        </div>
                        <div className="truncate text-xs font-semibold">{o.item}</div>
                        <div className="text-[10px] font-bold tabular-nums text-primary">{o.amt}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 px-5 pb-5">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tags</div>
                <div className="flex flex-wrap gap-1.5">
                  {["VIP", "Dhaka", "Wholesale", "Loyal"].map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-medium">
                      <Tag className="h-2.5 w-2.5" /> {t}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      </Card>
    </AppLayout>
  );
}
