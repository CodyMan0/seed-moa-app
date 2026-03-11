CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  content text NOT NULL,
  email text,
  status text DEFAULT 'pending' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own inquiries"
  ON public.inquiries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own inquiries"
  ON public.inquiries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
