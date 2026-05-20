import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Send,
  Search,
  Facebook,
  Plus,
  Loader2,
  CheckCheck,
  MessageCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { suggestReply } from "@/lib/ai.functions";

export const Route = createFileRoute("/_authenticated/inbox")({
  component: InboxPage,
});

type Conversation = {
  id: string;
  customer_name: string;
  customer_avatar: string | null;
  last_message: string | null;
  last_message_at: string;
  unread_count: number;
  page_id: string;
  fb_user_id: string;
};

type Message = {
  id: string;
  sender: "customer" | "agent" | "system";
  content: string | null;
  created_at: string;
  is_read: boolean;
};

function InboxPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);

  const convQ = useQuery({
    queryKey: ["conversations", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .order("last_message_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data ?? []) as Conversation[];
    },
  });

  // Realtime: conversations
  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel(`conv-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations", filter: `user_id=eq.${user.id}` },
        () => qc.invalidateQueries({ queryKey: ["conversations"] }),
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, qc]);

  const filtered = useMemo(() => {
    if (!convQ.data) return [];
    const q = search.toLowerCase();
    return q ? convQ.data.filter((c) => c.customer_name.toLowerCase().includes(q)) : convQ.data;
  }, [convQ.data, search]);

  // Auto-select first
  useEffect(() => {
    if (!selectedId && filtered.length > 0) setSelectedId(filtered[0].id);
  }, [filtered, selectedId]);

  const selected = filtered.find((c) => c.id === selectedId) ?? null;

  return (
    <AppLayout
      title="Inbox"
      subtitle="All your customer conversations in one place"
      actions={
        <Button size="sm" onClick={() => setShowNew(true)} className="gap-2">
          <Plus className="h-4 w-4" /> New conversation
        </Button>
      }
    >
      <div className="grid h-[calc(100vh-200px)] grid-cols-12 gap-0 overflow-hidden rounded-2xl border bg-card shadow-sm">
        {/* Threads list */}
        <div className="col-span-4 flex flex-col border-r border-border">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {convQ.isLoading && (
              <div className="flex justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}
            {!convQ.isLoading && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
                <MessageCircle className="h-8 w-8 text-muted-foreground" />
                <div className="text-sm font-medium">No conversations</div>
                <p className="text-xs text-muted-foreground">
                  Page connect করে customer messages এখানে দেখা যাবে।
                </p>
                <Button size="sm" variant="outline" onClick={() => setShowNew(true)} className="mt-2">
                  Create test conversation
                </Button>
              </div>
            )}
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-border/50 p-3 text-left transition-colors hover:bg-muted/40",
                  selectedId === c.id && "bg-muted/60",
                )}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {c.customer_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{c.customer_name}</span>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {timeAgo(c.last_message_at)}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-muted-foreground">
                      {c.last_message ?? "No messages yet"}
                    </span>
                    {c.unread_count > 0 && (
                      <Badge className="h-5 min-w-[20px] shrink-0 rounded-full px-1.5 text-[10px]">
                        {c.unread_count}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat pane */}
        <div className="col-span-8 flex flex-col">
          {selected ? (
            <ChatPane conversation={selected} />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
              <MessageCircle className="h-10 w-10 text-muted-foreground" />
              <div className="text-sm font-medium">Select a conversation</div>
            </div>
          )}
        </div>
      </div>

      {showNew && <NewConversationDialog onClose={() => setShowNew(false)} />}
    </AppLayout>
  );
}

function ChatPane({ conversation }: { conversation: Conversation }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const msgQ = useQuery({
    queryKey: ["messages", conversation.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversation.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Message[];
    },
  });

  // Mark read on open
  useEffect(() => {
    if (conversation.unread_count > 0) {
      supabase.rpc("mark_conversation_read", { _conversation_id: conversation.id }).then(() => {
        qc.invalidateQueries({ queryKey: ["conversations"] });
      });
    }
  }, [conversation.id]);

  // Realtime: messages for this conversation
  useEffect(() => {
    const ch = supabase
      .channel(`msg-${conversation.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversation.id}` },
        () => qc.invalidateQueries({ queryKey: ["messages", conversation.id] }),
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [conversation.id, qc]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [msgQ.data]);

  const send = useMutation({
    mutationFn: async () => {
      if (!text.trim()) return;
      const { error } = await supabase.rpc("send_agent_reply", {
        _conversation_id: conversation.id,
        _text: text.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setText("");
      qc.invalidateQueries({ queryKey: ["messages", conversation.id] });
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Send failed"),
  });

  const simulate = useMutation({
    mutationFn: async () => {
      const sample = [
        "Apu, ei dress er price koto?",
        "Stock ache?",
        "COD available?",
        "Delivery koto din lagbe?",
      ][Math.floor(Math.random() * 4)];
      const { error } = await supabase.rpc("simulate_incoming_message", {
        _conversation_id: conversation.id,
        _text: sample,
      });
      if (error) throw error;
    },
    onSuccess: () => toast.success("Incoming message simulated"),
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  const suggestFn = useServerFn(suggestReply);
  const suggest = useMutation({
    mutationFn: async () => {
      const res = await suggestFn({ data: { conversationId: conversation.id } });
      return res.reply;
    },
    onSuccess: (reply) => {
      setText(reply);
      toast.success("AI reply drafted — review & send");
    },
    onError: (e: any) => toast.error(e.message ?? "AI failed"),
  });

  return (
    <>
      <div className="flex items-center justify-between border-b border-border p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {conversation.customer_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-semibold">{conversation.customer_name}</div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Facebook className="h-3 w-3 text-[#1877F2]" /> Messenger
            </div>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={() => simulate.mutate()} disabled={simulate.isPending} className="gap-2">
          <Zap className="h-3.5 w-3.5" /> Simulate incoming
        </Button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-muted/20 p-4">
        {msgQ.isLoading && (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {msgQ.data?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-xs text-muted-foreground">
            <Sparkles className="h-6 w-6" />
            No messages yet. Type below to start.
          </div>
        )}
        {msgQ.data?.map((m) => {
          const mine = m.sender === "agent";
          return (
            <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                  mine
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card rounded-bl-md border",
                )}
              >
                <div className="whitespace-pre-wrap break-words">{m.content}</div>
                <div className={cn("mt-1 flex items-center gap-1 text-[10px]", mine ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  {mine && <CheckCheck className="h-3 w-3" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => suggest.mutate()}
            disabled={suggest.isPending}
            className="gap-1.5 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border-violet-500/30 text-violet-700 dark:text-violet-300 hover:from-violet-500/20 hover:to-fuchsia-500/20"
          >
            {suggest.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            Suggest reply
          </Button>
          {text && (
            <Button size="sm" variant="ghost" onClick={() => setText("")} className="text-xs text-muted-foreground">
              Clear
            </Button>
          )}
        </div>
        <div className="flex items-end gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a reply..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send.mutate();
              }
            }}
          />
          <Button onClick={() => send.mutate()} disabled={send.isPending || !text.trim()} className="gap-2">
            {send.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send
          </Button>
        </div>
      </div>
    </>
  );
}

function NewConversationDialog({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [fbId, setFbId] = useState("");

  const pagesQ = useQuery({
    queryKey: ["fb_pages_picker", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("facebook_pages").select("*").limit(10);
      if (error) throw error;
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!name.trim()) throw new Error("Customer name দিন");
      const page = pagesQ.data?.[0];
      if (!page) throw new Error("আগে একটি page connect করুন");
      const fakeFbId = fbId.trim() || `fb_${Math.random().toString(36).slice(2, 12)}`;
      const { error } = await supabase.from("conversations").insert({
        user_id: user!.id,
        page_id: page.id,
        fb_user_id: fakeFbId,
        customer_name: name.trim(),
        last_message: null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Conversation created");
      qc.invalidateQueries({ queryKey: ["conversations"] });
      onClose();
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New conversation</DialogTitle>
          <DialogDescription>Test conversation create করুন।</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="cname">Customer name</Label>
            <Input id="cname" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Nusrat Jahan" />
          </div>
          <div>
            <Label htmlFor="fbid">FB User ID (optional)</Label>
            <Input id="fbid" value={fbId} onChange={(e) => setFbId(e.target.value)} placeholder="auto-generate" />
          </div>
          {(pagesQ.data?.length ?? 0) === 0 && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400">
              No page connected. Connections page থেকে আগে page connect করুন।
            </div>
          )}
          <Button className="w-full" onClick={() => create.mutate()} disabled={create.isPending}>
            {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}
