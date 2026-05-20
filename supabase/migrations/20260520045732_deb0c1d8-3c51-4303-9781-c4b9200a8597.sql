
-- Approve payment: requires caller to be admin
CREATE OR REPLACE FUNCTION public.approve_payment_request(_request_id uuid, _note text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _req payment_requests%ROWTYPE;
  _plan subscription_plans%ROWTYPE;
  _current_expires timestamptz;
  _base timestamptz;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can approve payments';
  END IF;

  SELECT * INTO _req FROM public.payment_requests WHERE id = _request_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Payment request not found'; END IF;
  IF _req.status <> 'pending' THEN RAISE EXCEPTION 'Already reviewed'; END IF;

  SELECT * INTO _plan FROM public.subscription_plans WHERE id = _req.plan_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Plan not found'; END IF;

  UPDATE public.payment_requests
    SET status='approved', reviewed_by=auth.uid(), reviewed_at=now(), admin_note=_note
    WHERE id=_request_id;

  SELECT expires_at INTO _current_expires FROM public.subscriptions WHERE user_id=_req.user_id;
  _base := GREATEST(COALESCE(_current_expires, now()), now());

  UPDATE public.subscriptions
    SET plan_id=_plan.id,
        status='active',
        started_at=now(),
        expires_at=_base + (_plan.duration_days || ' days')::interval,
        cancelled_at=NULL,
        updated_at=now()
    WHERE user_id=_req.user_id;

  IF NOT FOUND THEN
    INSERT INTO public.subscriptions(user_id, plan_id, status, started_at, expires_at)
    VALUES (_req.user_id, _plan.id, 'active', now(), now() + (_plan.duration_days || ' days')::interval);
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_payment_request(_request_id uuid, _note text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can reject payments';
  END IF;
  UPDATE public.payment_requests
    SET status='rejected', reviewed_by=auth.uid(), reviewed_at=now(), admin_note=_note
    WHERE id=_request_id AND status='pending';
  IF NOT FOUND THEN RAISE EXCEPTION 'Request not found or already reviewed'; END IF;
END;
$$;

-- Helper to promote a user to admin by email (callable by existing admin OR if no admins exist yet)
CREATE OR REPLACE FUNCTION public.promote_to_admin(_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid;
  _admin_count int;
BEGIN
  SELECT COUNT(*) INTO _admin_count FROM public.user_roles WHERE role='admin';
  IF _admin_count > 0 AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can promote other admins';
  END IF;
  SELECT id INTO _uid FROM auth.users WHERE email = _email;
  IF _uid IS NULL THEN RAISE EXCEPTION 'User not found: %', _email; END IF;
  INSERT INTO public.user_roles(user_id, role) VALUES (_uid, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;
