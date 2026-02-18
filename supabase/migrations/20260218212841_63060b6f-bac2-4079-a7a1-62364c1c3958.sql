
-- Add plan column to profiles
ALTER TABLE public.profiles ADD COLUMN plan text NOT NULL DEFAULT 'Orbit';
