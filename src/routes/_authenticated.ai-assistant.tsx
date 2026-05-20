import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bot,
  Sparkles,
  Eye,
  EyeOff,
  Copy,
  CheckCircle2,
  Zap,
  Languages,
  MessageSquare,
  Plus,
  Trash2,
  Wand2,
  ShieldCheck,
  Activity,
  Brain,
  Send,
  Lightbulb,
  RotateCcw,
  Save,
  Play,
  AlertTriangle,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/ai-assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant · FCommerce" },
      { name: "description", content: "Configure your AI assistant — API keys, tone, Bengali support, prompts, and training examples." },
    ],
  }),
  component: AiAssistantPage,
});

type Tone = "friendly" | "professional" | "playful" | "empathetic" | "concise";
type TrainingExample = { id: string; question: string; answer: string };

const toneOptions: { id: Tone; label: string; desc: string; emoji: string }[] = [
  { id: "friendly", label: "Friendly", desc: "Warm, conversational, uses emojis", emoji: "😊" },
  { id: "professional", label: "Professional", desc: "Polished, brand-safe, formal", emoji: "💼" },
  { id: "playful", label: "Playful", desc: "Witty, casual, light humor", emoji: "🎉" },
  { id: "empathetic", label: "Empathetic", desc: "Patient, understanding, soft", emoji: "💜" },
  { id: "concise", label: "Concise", desc: "Short, direct, no fluff", emoji: "⚡" },
];

function SecretField({
  id,
  label,
  placeholder,
  help,
  brandColor,
}: {
  id: string;
  label: string;
  placeholder: string;
  help: string;
  brandColor: string;
}) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "fail">("idle");

  const test = async () => {
    if (!value) {
      toast.error("Enter an API key first");
      return;
    }
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1100));
    const ok = value.length > 10;
    setStatus(ok ? "ok" : "fail");
    ok ? toast.success(`${label} connected`) : toast.error("Invalid key — check and retry");
  };

  return (
    <div className="rounded-2xl border border-border bg-card/50 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-elegant", brandColor)}>
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <Label htmlFor={id} className="text-sm font-semibold">{label}</Label>
            <p className="text-xs text-muted-foreground">{help}</p>
          </div>
        </div>
        {status === "ok" && (
          <Badge variant="secondary" className="gap-1 bg-emerald-500/15 text-emerald-600 border-0">
            <CheckCircle2 className="h-3 w-3" /> Connected
          </Badge>
        )}
        {status === "fail" && (
          <Badge variant="secondary" className="gap-1 bg-destructive/15 text-destructive border-0">
            <AlertTriangle className="h-3 w-3" /> Failed
          </Badge>
        )}
      </div>
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Input
            id={id}
            type={show ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="pr-20 font-mono text-xs"
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex">
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShow((s) => !s)}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                navigator.clipboard.writeText(value);
                toast.success("Copied");
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button onClick={test} disabled={status === "loading"} className="shrink-0">
          {status === "loading" ? (
            <><RotateCcw className="h-4 w-4 animate-spin" /> Testing…</>
          ) : (
            <><Zap className="h-4 w-4" /> Test connection</>
          )}
        </Button>
      </div>
    </div>
  );
}

function AiAssistantPage() {
  const [autoReply, setAutoReply] = useState(true);
  const [bengali, setBengali] = useState(true);
  const [banglish, setBanglish] = useState(true);
  const [orderQueries, setOrderQueries] = useState(true);
  const [faq, setFaq] = useState(true);
  const [escalate, setEscalate] = useState(true);
  const [tone, setTone] = useState<Tone>("friendly");
  const [creativity, setCreativity] = useState([60]);
  const [responseLength, setResponseLength] = useState([40]);
  const [model, setModel] = useState("claude-sonnet-4");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are Nova, the AI assistant for {{shop_name}}, a Bangladeshi fashion brand.\n\n• Reply in the customer's language (Bangla, Banglish, or English).\n• Be warm and helpful. Use the customer's name when known.\n• For order status, ask for the order ID (e.g. FC-10428).\n• For pricing, always include currency in BDT (৳).\n• If a question is sensitive, complex, or you are not sure, hand off to a human agent.",
  );
  const [examples, setExamples] = useState<TrainingExample[]>([
    { id: "1", question: "Apnar shop er delivery koto din lage?", answer: "Dhaka'r vitor 1-2 din, Dhaka'r baire 2-4 din. Pathao o Steadfast diye send kori 🚚" },
    { id: "2", question: "ভাই অর্ডার কনফার্ম হইছে?", answer: "জ্বি ভাই! Order ID ta din, ekhuni check kore janachhi ✨" },
    { id: "3", question: "Do you accept returns?", answer: "Yes — 7-day easy returns on unused items. Just message us with your order ID and we'll arrange the pickup." },
  ]);
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");

  const addExample = () => {
    if (!newQ.trim() || !newA.trim()) {
      toast.error("Fill both question and answer");
      return;
    }
    setExamples((e) => [...e, { id: Date.now().toString(), question: newQ, answer: newA }]);
    setNewQ("");
    setNewA("");
    toast.success("Training example added");
  };

  const removeExample = (id: string) => setExamples((e) => e.filter((x) => x.id !== id));

  return (
    <AppLayout
      title="AI Assistant"
      subtitle="Train Nova to reply to your customers — in Bangla, English, or anything in between."
      actions={
        <>
          <Button variant="outline" className="gap-2">
            <Play className="h-4 w-4" /> Test in playground
          </Button>
          <Button className="gap-2 bg-gradient-primary shadow-elegant">
            <Save className="h-4 w-4" /> Save changes
          </Button>
        </>
      }
    >
      {/* Hero status */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-mesh p-6 md:p-8 mb-6 shadow-sm">
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Bot className="h-7 w-7" />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 border-2 border-background" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Nova is online</h2>
                <Badge className="bg-emerald-500/15 text-emerald-600 border-0 gap-1">
                  <Activity className="h-3 w-3" /> Auto-replying
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Handled <span className="font-semibold text-foreground">1,284</span> messages this week · <span className="font-semibold text-emerald-600">92%</span> resolved without human help
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { label: "Avg reply", value: "1.4s", icon: Zap },
              { label: "CSAT", value: "4.8", icon: Sparkles },
              { label: "Tokens", value: "182k", icon: Brain },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-xl border border-border bg-card/70 backdrop-blur px-3 py-2 min-w-[80px]">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <Icon className="h-3 w-3" /> {s.label}
                  </div>
                  <div className="mt-0.5 text-lg font-bold tabular-nums">{s.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted/60 p-1 h-auto flex-wrap">
          <TabsTrigger value="general" className="gap-1.5"><Wand2 className="h-3.5 w-3.5" /> General</TabsTrigger>
          <TabsTrigger value="keys" className="gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> API Keys</TabsTrigger>
          <TabsTrigger value="prompt" className="gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Prompt</TabsTrigger>
          <TabsTrigger value="training" className="gap-1.5"><Brain className="h-3.5 w-3.5" /> Training</TabsTrigger>
        </TabsList>

        {/* GENERAL */}
        <TabsContent value="general" className="space-y-6 m-0">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Auto-reply + behavior */}
            <Card className="lg:col-span-2 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" /> Auto-reply behavior
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {[
                  { v: autoReply, set: setAutoReply, title: "Enable auto-reply", desc: "Let Nova reply automatically to incoming messages 24/7" },
                  { v: orderQueries, set: setOrderQueries, title: "Handle order queries", desc: "Look up order status when customers ask" },
                  { v: faq, set: setFaq, title: "Answer FAQs", desc: "Use your knowledge base to answer common questions" },
                  { v: escalate, set: setEscalate, title: "Escalate to human", desc: "Hand off when Nova isn't confident or sentiment turns negative" },
                ].map((row, i) => (
                  <div key={row.title}>
                    {i > 0 && <Separator />}
                    <div className="flex items-start justify-between gap-4 py-4">
                      <div>
                        <div className="text-sm font-medium">{row.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{row.desc}</div>
                      </div>
                      <Switch checked={row.v} onCheckedChange={row.set} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Language */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Languages className="h-4 w-4 text-primary" /> Language
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-border bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🇧🇩</span>
                      <div>
                        <div className="text-sm font-semibold">Bengali (বাংলা)</div>
                        <div className="text-[11px] text-muted-foreground">Native script support</div>
                      </div>
                    </div>
                    <Switch checked={bengali} onCheckedChange={setBengali} />
                  </div>
                </div>
                <div className="flex items-start justify-between gap-3 px-1">
                  <div>
                    <div className="text-sm font-medium">Banglish</div>
                    <div className="text-[11px] text-muted-foreground">Romanized Bangla (e.g. "vai")</div>
                  </div>
                  <Switch checked={banglish} onCheckedChange={setBanglish} />
                </div>
                <Separator />
                <div>
                  <Label className="text-xs text-muted-foreground">Default reply language</Label>
                  <Select defaultValue="auto">
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-detect from customer</SelectItem>
                      <SelectItem value="bn">Bengali (বাংলা)</SelectItem>
                      <SelectItem value="banglish">Banglish</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tone */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> AI tone & personality
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {toneOptions.map((t) => {
                  const active = tone === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className={cn(
                        "group relative overflow-hidden rounded-2xl border p-4 text-left transition-all",
                        active
                          ? "border-primary bg-primary/5 shadow-elegant"
                          : "border-border bg-card/50 hover:border-primary/40 hover:-translate-y-0.5",
                      )}
                    >
                      <div className="text-2xl">{t.emoji}</div>
                      <div className="mt-2 text-sm font-semibold">{t.label}</div>
                      <div className="text-[11px] text-muted-foreground leading-snug">{t.desc}</div>
                      {active && (
                        <div className="absolute right-2 top-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-2">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <Label>Creativity</Label>
                    <span className="text-xs text-muted-foreground tabular-nums">{creativity[0]}%</span>
                  </div>
                  <Slider value={creativity} onValueChange={setCreativity} max={100} step={5} />
                  <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
                    <span>Predictable</span><span>Imaginative</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <Label>Reply length</Label>
                    <span className="text-xs text-muted-foreground tabular-nums">{responseLength[0]}%</span>
                  </div>
                  <Slider value={responseLength} onValueChange={setResponseLength} max={100} step={5} />
                  <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
                    <span>Short & snappy</span><span>Detailed</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API KEYS */}
        <TabsContent value="keys" className="space-y-6 m-0">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> Model providers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Active model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claude-sonnet-4">Claude Sonnet 4 — best for nuance</SelectItem>
                    <SelectItem value="claude-haiku">Claude Haiku — fast & cheap</SelectItem>
                    <SelectItem value="gpt-5">GPT-5 — best for reasoning</SelectItem>
                    <SelectItem value="gpt-5-mini">GPT-5 Mini — balanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <SecretField
                id="claude-key"
                label="Anthropic Claude API key"
                placeholder="sk-ant-api03-••••••••••••••••••••"
                help="Used when a Claude model is selected. Find yours at console.anthropic.com"
                brandColor="bg-gradient-to-br from-orange-500 to-amber-600"
              />
              <SecretField
                id="openai-key"
                label="OpenAI API key"
                placeholder="sk-proj-••••••••••••••••••••"
                help="Used when a GPT model is selected. Find yours at platform.openai.com/api-keys"
                brandColor="bg-gradient-to-br from-emerald-600 to-teal-700"
              />

              <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  Keys are encrypted at rest and never exposed to the browser. Nova falls back to the next provider automatically if one is rate-limited.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PROMPT */}
        <TabsContent value="prompt" className="space-y-6 m-0">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-sm">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" /> System prompt
                </CardTitle>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => toast.success("Prompt enhanced with AI")}>
                  <Wand2 className="h-3.5 w-3.5" /> Enhance with AI
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={14}
                  className="font-mono text-xs leading-relaxed resize-none"
                />
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{systemPrompt.length} characters · ~{Math.ceil(systemPrompt.length / 4)} tokens</span>
                  <div className="flex items-center gap-1">
                    {["{{shop_name}}", "{{customer_name}}", "{{order_id}}"].map((v) => (
                      <button
                        key={v}
                        onClick={() => setSystemPrompt((p) => p + " " + v)}
                        className="rounded-md border border-border bg-muted/50 px-1.5 py-0.5 font-mono hover:bg-muted"
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" /> Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                {[
                  "Give Nova a clear name and role in the first line.",
                  "Use bullet points for rules — easier for the model to follow.",
                  "Mention currency (৳ BDT) and Bangladesh-specific context.",
                  "Tell Nova when to escalate (refunds, complaints, sensitive issues).",
                  "Use variables like {{customer_name}} for personalization.",
                ].map((tip, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                      {i + 1}
                    </div>
                    <p className="leading-relaxed text-muted-foreground pt-0.5">{tip}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TRAINING */}
        <TabsContent value="training" className="space-y-6 m-0">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" /> Add training example
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Customer asks…</Label>
                  <Textarea
                    value={newQ}
                    onChange={(e) => setNewQ(e.target.value)}
                    placeholder="e.g. Apnar shop e cash on delivery ase?"
                    rows={3}
                    className="mt-1.5 resize-none"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Nova replies…</Label>
                  <Textarea
                    value={newA}
                    onChange={(e) => setNewA(e.target.value)}
                    placeholder="e.g. Jee bhai! COD ase, sob jelay 🚚"
                    rows={3}
                    className="mt-1.5 resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={addExample} className="gap-2">
                  <Plus className="h-4 w-4" /> Add example
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" /> Training examples
                <Badge variant="secondary" className="ml-1">{examples.length}</Badge>
              </CardTitle>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <Play className="h-3.5 w-3.5" /> Retrain Nova
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {examples.map((ex) => (
                <div
                  key={ex.id}
                  className="group rounded-2xl border border-border bg-card/50 p-4 transition-all hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Customer</div>
                      <p className="text-sm mt-0.5">{ex.question}</p>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-elegant">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-primary font-semibold">Nova</div>
                      <p className="text-sm mt-0.5">{ex.answer}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                      onClick={() => removeExample(ex.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {examples.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-10 text-center">
                  <Brain className="h-8 w-8 mx-auto text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">No training examples yet. Add a few to teach Nova your brand voice.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick playground */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Play className="h-4 w-4 text-primary" /> Quick test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input placeholder="Type a customer message to preview Nova's reply…" className="flex-1" />
                <Button className="gap-2 bg-gradient-primary"><Send className="h-4 w-4" /> Send</Button>
              </div>
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-elegant">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="text-sm text-muted-foreground italic">
                  Nova's preview reply will appear here…
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
