
REVOKE EXECUTE ON FUNCTION public.approve_payment_request(uuid, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.reject_payment_request(uuid, text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.promote_to_admin(text) FROM anon, public;
