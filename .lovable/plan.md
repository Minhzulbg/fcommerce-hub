## Phase 1 Continue — Authentication, Route Guards, এবং Live Data

বর্তমান অবস্থা: Database schema + RLS সম্পূর্ণ। এখন auth এবং UI কে real data-র সাথে connect করব।

### ১. Authentication Setup
- `supabase--configure_auth` — auto-confirm email signups **off** (default), HIBP password check **on**
- `supabase--configure_social_auth` — Google provider enable (Lovable managed OAuth)
- `src/routes/login.tsx` — email/password + Google sign-in button, redirect-back support
- `src/routes/register.tsx` — signup form (full_name, business_name, email, password) + Google
- `src/routes/forgot-password.tsx` — `resetPasswordForEmail` flow
- `src/routes/reset-password.tsx` (নতুন) — recovery flow, `updateUser({ password })`

### ২. Route Guards
- `src/routes/__root.tsx` — `onAuthStateChange` listener (router.invalidate + queryClient.invalidateQueries)
- `src/routes/_authenticated.tsx` (নতুন pathless layout) — `beforeLoad` checks session, redirect to `/login?redirect=...`
- সব protected route move: `dashboard.tsx → _authenticated/dashboard.tsx`, একইভাবে `inbox`, `orders`, `customers`, `connections`, `analytics`, `settings`, `subscription`, `ai-assistant`, `ai-replies`

### ৩. Client-side Auth Wiring
- `src/start.ts` — verify `attachSupabaseAuth` registered in `functionMiddleware`
- `AppLayout.tsx` — show real user (profile + business_name), logout button wired to `supabase.auth.signOut()`

### ৪. Live Data (Server Functions)
সব mock data সরিয়ে `createServerFn` + `requireSupabaseAuth` দিয়ে real Supabase queries:
- `src/lib/dashboard.functions.ts` — stats (total messages, orders, pages, revenue)
- `src/lib/inbox.functions.ts` — list conversations, get messages, send reply (stub for now — real FB Send API Phase 4-এ)
- `src/lib/orders.functions.ts` — list/create/update orders + items + timeline
- `src/lib/customers.functions.ts` — list customers
- `src/lib/pages.functions.ts` — list connected Facebook pages (Phase 3-এ connect flow)
- `src/lib/subscription.functions.ts` — current subscription + plans list

Routes-এ `useServerFn` + `@tanstack/react-query` দিয়ে data fetch।

### ৫. Realtime Inbox
- Migration: `ALTER PUBLICATION supabase_realtime ADD TABLE conversations, messages;`
- `inbox.tsx`-এ supabase channel subscription — new message এলে query invalidate

### ৬. Index/Landing
- `src/routes/index.tsx` — যদি logged in হয় → `/dashboard`-এ redirect, না হলে landing page with Login/Register CTA

### Technical notes
- সব server function `*.functions.ts` extension-এ thin file (শুধু `createServerFn` declarations)
- Loaders শুধু `_authenticated/` layout-এর under-এ data fetch করবে (SSR 401 avoid করতে)
- Conversation/order create-এর সময় `user_id = auth.uid()` set করতে হবে (RLS requirement)

### Out of scope (পরের Phase-এ)
- Facebook OAuth + webhook (Phase 3-4)
- Payment submission UI + admin approval (Phase 2)
- Order pipeline UI polish, courier (Phase 5)

এই Phase শেষ হলে: user signup → login → empty dashboard দেখবে, navigation কাজ করবে, কিন্তু Facebook না connect করা পর্যন্ত inbox/orders খালি থাকবে।