
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.subscription_status AS ENUM ('trial', 'active', 'expired', 'cancelled', 'pending');
CREATE TYPE public.payment_method AS ENUM ('bkash', 'nagad', 'rocket', 'bank');
CREATE TYPE public.payment_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.page_status AS ENUM ('active', 'disconnected', 'error');
CREATE TYPE public.message_sender AS ENUM ('customer', 'agent', 'ai', 'system');
CREATE TYPE public.order_status AS ENUM (
  'pending','awaiting_confirmation','confirmed','packing',
  'ready_for_courier','shipped','delivered','returned','cancelled'
);

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  business_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  price_bdt INTEGER NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 30,
  page_limit INTEGER NOT NULL DEFAULT 1,
  message_limit INTEGER NOT NULL DEFAULT 1000,
  order_limit INTEGER NOT NULL DEFAULT 100,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

INSERT INTO public.subscription_plans (name, slug, price_bdt, page_limit, message_limit, order_limit, features, sort_order) VALUES
  ('Basic','basic',500,1,1000,100,'["1 Facebook Page","Live Inbox","Basic Orders","Email Support"]'::jsonb,1),
  ('Pro','pro',1500,3,10000,1000,'["3 Facebook Pages","AI Auto-Reply","Courier Integration","Priority Support","Analytics"]'::jsonb,2),
  ('Business','business',3000,10,50000,10000,'["10 Facebook Pages","Advanced AI","Multi-user","All Couriers","24/7 Support","Custom Branding"]'::jsonb,3);

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.subscription_plans(id),
  status subscription_status NOT NULL DEFAULT 'trial',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_subs_user ON public.subscriptions(user_id);

-- RLS for first batch
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "plans_select_all" ON public.subscription_plans FOR SELECT USING (true);
CREATE POLICY "plans_admin_write" ON public.subscription_plans FOR ALL USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "subs_select_own" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "subs_admin_write" ON public.subscriptions FOR ALL USING (public.has_role(auth.uid(),'admin'));
