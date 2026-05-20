import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Facebook,
  Plus,
  CheckCircle2,
  Trash2,
  Loader2,
  Webhook,
  Copy,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/connections")({
  head: () => ({
    meta: [
      { title: "Connections — FCommerce" },
      { name: "description", content: "Connect your Facebook Pages to FCommerce." },
    ],
  }),
  component: ConnectionsPage,
});

function ConnectionsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const pagesQ = useQuery({
    queryKey: ["fb_pages", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facebook_pages")
        .select("*")
        .order("connected_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const disconnect = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("facebook_pages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Page disconnected");
      qc.invalidateQueries({ queryKey: ["fb_pages"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  const webhookUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/public/webhooks/facebook`
    : "";

  return (
    <AppLayout
      title="Connections"
      subtitle="Connect your Facebook Pages to start receiving messages"
      actions={
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Connect Page
        </Button>
      }
    >
      {/* Mock-mode banner */}
      <Card className="mb-6 rounded-2xl border-amber-500/30 bg-amber-500/5 shadow-sm">
        <CardContent className="flex items-start gap-3 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="text-sm">
            <div className="font-medium text-amber-700 dark:text-amber-400">Mock mode — Facebook OAuth not connected yet</div>
            <p className="mt-1 text-muted-foreground">
              এখন manually page details add করতে পারবেন (testing-এর জন্য)। Real Facebook OAuth পরে enable করলে এই page automatic populate হবে।
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Webhook info */}
      <Card className="mb-6 rounded-2xl shadow-sm">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Webhook className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold">Webhook endpoint</div>
              <div className="text-xs text-muted-foreground">Use this URL when configuring Facebook Webhook</div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
            <code className="flex-1 truncate font-mono text-xs">{webhookUrl}</code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(webhookUrl);
                toast.success("Copied");
              }}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pages list */}
      <div className="mb-3 text-sm font-semibold">Connected Pages</div>
      {pagesQ.isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      {!pagesQ.isLoading && (pagesQ.data?.length ?? 0) === 0 && (
        <Card className="rounded-2xl border-dashed shadow-sm">
          <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="text-sm font-medium">No pages connected yet</div>
            <p className="max-w-sm text-xs text-muted-foreground">
              একটি Facebook page connect করে inbox messages, customers, এবং orders manage করা শুরু করুন।
            </p>
            <Button onClick={() => setOpen(true)} className="mt-2 gap-2">
              <Plus className="h-4 w-4" /> Connect your first page
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {pagesQ.data?.map((p) => (
          <Card key={p.id} className="rounded-2xl shadow-sm">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1877F2]/10 text-[#1877F2]">
                <Facebook className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{p.page_name}</div>
                  <Badge variant="outline" className="gap-1 text-[10px]">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {p.status}
                  </Badge>
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">{p.category ?? "Page"}</div>
                <div className="mt-1 font-mono text-[11px] text-muted-foreground">ID: {p.page_id}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  Connected {new Date(p.connected_at).toLocaleDateString()}
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (confirm(`Disconnect ${p.page_name}?`)) disconnect.mutate(p.id);
                }}
                disabled={disconnect.isPending}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {open && <ConnectPageDialog onClose={() => setOpen(false)} />}
    </AppLayout>
  );
}

function ConnectPageDialog({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [pageId, setPageId] = useState("");
  const [pageName, setPageName] = useState("");
  const [category, setCategory] = useState("E-commerce");

  const create = useMutation({
    mutationFn: async () => {
      if (!pageId.trim() || !pageName.trim()) throw new Error("Page ID এবং Name দিন");
      const { error } = await supabase.from("facebook_pages").insert({
        user_id: user!.id,
        page_id: pageId.trim(),
        page_name: pageName.trim(),
        category,
        access_token: "mock_token_" + Math.random().toString(36).slice(2, 10),
        status: "active",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Page connected!");
      qc.invalidateQueries({ queryKey: ["fb_pages"] });
      onClose();
    },
    onError: (e: any) => {
      if (e.message?.includes("duplicate")) toast.error("এই page already connected");
      else toast.error(e.message ?? "Failed to connect");
    },
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Connect a Facebook Page</DialogTitle>
          <DialogDescription>
            Mock mode — manually page details enter করুন। Real OAuth এ এটা automatic হবে।
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="pid">Facebook Page ID</Label>
            <Input id="pid" value={pageId} onChange={(e) => setPageId(e.target.value)} placeholder="e.g. 1234567890" />
          </div>
          <div>
            <Label htmlFor="pname">Page Name</Label>
            <Input id="pname" value={pageName} onChange={(e) => setPageName(e.target.value)} placeholder="e.g. Bibi's Boutique" />
          </div>
          <div>
            <Label htmlFor="cat">Category</Label>
            <Input id="cat" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <Button className="w-full" onClick={() => create.mutate()} disabled={create.isPending}>
            {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Connect Page
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
