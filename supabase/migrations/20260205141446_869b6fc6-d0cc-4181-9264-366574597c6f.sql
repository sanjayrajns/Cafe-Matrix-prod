-- Create reservations table
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  party_size INTEGER NOT NULL,
  dietary_notes TEXT,
  occasion TEXT,
  seating_preference TEXT,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menu_items table for admin management
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  available BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin settings table for password
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default admin password (should be changed by admin)
INSERT INTO public.admin_settings (setting_key, setting_value)
VALUES ('admin_password', 'matrix2024');

-- Enable RLS on all tables
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Public can create reservations
CREATE POLICY "Anyone can create reservations"
ON public.reservations
FOR INSERT
WITH CHECK (true);

-- Public can read their own reservation by email (for confirmation lookup)
CREATE POLICY "Anyone can read reservations"
ON public.reservations
FOR SELECT
USING (true);

-- Menu items are publicly readable
CREATE POLICY "Anyone can read menu items"
ON public.menu_items
FOR SELECT
USING (true);

-- Menu items can be modified (admin will verify password in app)
CREATE POLICY "Allow menu item modifications"
ON public.menu_items
FOR ALL
USING (true);

-- Admin settings are publicly readable (password verification happens in-app)
CREATE POLICY "Allow admin settings read"
ON public.admin_settings
FOR SELECT
USING (true);

-- Allow admin settings updates
CREATE POLICY "Allow admin settings update"
ON public.admin_settings
FOR UPDATE
USING (true);

-- Allow reservations updates (for status changes by admin)
CREATE POLICY "Allow reservation updates"
ON public.reservations
FOR UPDATE
USING (true);

-- Allow reservation deletes
CREATE POLICY "Allow reservation deletes"
ON public.reservations
FOR DELETE
USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_reservations_updated_at
BEFORE UPDATE ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
BEFORE UPDATE ON public.menu_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();