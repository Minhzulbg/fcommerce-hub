import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Send, Bot, Paperclip, Smile, Search, Facebook } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inbox")({
  component: InboxPage,
});

const threads = [
  { id: 1, name: "Nusrat Jahan", last: "Apu, ei dress er stock ache?", time: "2m", unread: 3, online: true },
  { id: 2, name: "Tanvir Ahmed", last: "Order confirm korlam", time: "12m", unread: 0, online: true },
  { id: 3, name: "Sadia Islam", last: "Delivery koto din lagbe?", time: "1h", unread: 1, online: false },
  { id: 4, name: "Rakib Hasan", last: "Thanks for the quick reply!", time: "3h", unread: 0, online: false },
  { id: 5, name: "Mehzabin R.", last: "Cash on delivery available?", time: "5h", unread: 2, online: true },
  { id: 6, name: "Imran Khan", last: "Bhaiya size chart ta pathan", time: "1d", unread: 0, online: false },
];

const messages = [
  { from: "them", text: "Hi, ei red kurti tar stock ache?", time: "10:24" },
  { from: "me", text: "Hello! Yes apu, size M, L, XL available ache.", time: "10:25" },
  { from: "them", text: "Price koto?", time: "10:26" },
  { from: "me", text: "৳ 1,250 only. Free delivery inside Dhaka.", time: "10:26" },
  { from: "them", text: "Ok, ami order korte chai. Cash on delivery hobe?", time: "10:28" },
];

function InboxPage() {
  const [active, setActive] = useState(threads[0]);
  return (
    <AppLayout title="Inbox" subtitle="Manage Facebook Page conversations">
      <Card className="overflow-hidden rounded-2xl shadow-sm">
        <div className="grid h-[70vh] grid-cols-1 md:grid-cols-[320px_1fr]">
          {/* Threads */}
          <div className="flex flex-col border-r border-border">
            <div className="border-b border-border p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search conversations" className="pl-9 bg-muted/40 border-transparent" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {threads.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActive(t)}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-border/60 px-4 py-3 text-left transition-colors",
                    active.id === t.id ? "bg-muted/60" : "hover:bg-muted/40",
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {t.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    {t.online && (
                      <span className="absolute -right-0 -bottom-0 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold">{t.name}</span>
                      <span className="text-[10px] text-muted-foreground">{t.time}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-xs text-muted-foreground">{t.last}</p>
                      {t.unread > 0 && (
                        <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                          {t.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {active.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-semibold">{active.name}</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Facebook className="h-3 w-3" /> Messenger · {active.online ? "Active now" : "Offline"}
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="gap-1.5">
                <Bot className="h-4 w-4" /> AI Suggest
              </Button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-muted/20 px-5 py-4">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                      m.from === "me"
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-card border border-border",
                    )}
                  >
                    <p>{m.text}</p>
                    <div
                      className={cn(
                        "mt-1 text-[10px]",
                        m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground",
                      )}
                    >
                      {m.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border p-3">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Smile className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a reply…"
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button size="icon" className="h-8 w-8">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </AppLayout>
  );
}
