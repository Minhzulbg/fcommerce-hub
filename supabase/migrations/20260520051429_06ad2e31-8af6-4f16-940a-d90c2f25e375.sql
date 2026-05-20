-- Unique page per user
CREATE UNIQUE INDEX IF NOT EXISTS facebook_pages_user_page_unique
  ON public.facebook_pages(user_id, page_id);

-- Simulate an incoming customer message for testing
CREATE OR REPLACE FUNCTION public.simulate_incoming_message(
  _conversation_id uuid,
  _text text
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _conv conversations%ROWTYPE;
  _msg_id uuid;
BEGIN
  SELECT * INTO _conv FROM conversations WHERE id = _conversation_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Conversation not found'; END IF;
  IF _conv.user_id <> auth.uid() THEN RAISE EXCEPTION 'Not authorized'; END IF;

  INSERT INTO messages(conversation_id, user_id, sender, content, is_read)
  VALUES (_conversation_id, _conv.user_id, 'customer', _text, false)
  RETURNING id INTO _msg_id;

  UPDATE conversations
    SET last_message = _text,
        last_message_at = now(),
        unread_count = unread_count + 1
    WHERE id = _conversation_id;

  RETURN _msg_id;
END;
$$;

-- Send agent reply (mock send — just persists)
CREATE OR REPLACE FUNCTION public.send_agent_reply(
  _conversation_id uuid,
  _text text
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _conv conversations%ROWTYPE;
  _msg_id uuid;
BEGIN
  SELECT * INTO _conv FROM conversations WHERE id = _conversation_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Conversation not found'; END IF;
  IF _conv.user_id <> auth.uid() THEN RAISE EXCEPTION 'Not authorized'; END IF;

  INSERT INTO messages(conversation_id, user_id, sender, content, is_read)
  VALUES (_conversation_id, _conv.user_id, 'agent', _text, true)
  RETURNING id INTO _msg_id;

  UPDATE conversations
    SET last_message = _text,
        last_message_at = now(),
        unread_count = 0
    WHERE id = _conversation_id;

  RETURN _msg_id;
END;
$$;

-- Mark conversation as read
CREATE OR REPLACE FUNCTION public.mark_conversation_read(_conversation_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE conversations
    SET unread_count = 0
    WHERE id = _conversation_id AND user_id = auth.uid();
  UPDATE messages
    SET is_read = true
    WHERE conversation_id = _conversation_id AND user_id = auth.uid() AND sender = 'customer';
END;
$$;