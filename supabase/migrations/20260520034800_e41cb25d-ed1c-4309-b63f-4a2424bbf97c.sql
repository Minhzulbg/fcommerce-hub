
CREATE TABLE public.payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  method payment_method NOT NULL,
  sender_number TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  admin_note TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_pr_user ON public.payment_requests(user_id);
CREATE INDEX idx_pr_status ON public.payment_requests(status);

CREATE POLICY "pr_select_own" ON public.payment_requests FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "pr_insert_own" ON public.payment_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pr_admin_update" ON public.payment_requests FOR UPDATE
  USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.facebook_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_id TEXT NOT NULL,
  page_name TEXT NOT NULL,
  page_avatar TEXT,
  category TEXT,
  access_token TEXT NOT NULL,
  status page_status NOT NULL DEFAULT 'active',
  connected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_sync_at TIMESTAMPTZ,
  UNIQUE (user_id, page_id)
);
ALTER TABLE public.facebook_pages ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_fbp_user ON public.facebook_pages(user_id);

CREATE POLICY "fbp_all_own" ON public.facebook_pages FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_id UUID REFERENCES public.facebook_pages(id) ON DELETE SET NULL,
  fb_user_id TEXT,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  avatar_url TEXT,
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_spent INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_cust_user ON public.customers(user_id);
CREATE INDEX idx_cust_phone ON public.customers(user_id, phone);

CREATE POLICY "cust_all_own" ON public.customers FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
