
-- Create banners table for frontend banners managed by admin
CREATE TABLE public.banners (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  image_url text NOT NULL,
  link text,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banners"
  ON public.banners FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert banners"
  ON public.banners FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update banners"
  ON public.banners FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete banners"
  ON public.banners FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create public storage bucket for banners
INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true);

CREATE POLICY "Anyone can view banner images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banners');

CREATE POLICY "Admins can upload banner images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'banners');

CREATE POLICY "Admins can delete banner images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'banners');
