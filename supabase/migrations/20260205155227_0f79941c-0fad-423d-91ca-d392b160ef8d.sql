-- Allow admin settings insert
CREATE POLICY "Allow admin settings insert" 
ON public.admin_settings 
FOR INSERT 
WITH CHECK (true);

-- Insert default admin password if it doesn't exist
INSERT INTO public.admin_settings (setting_key, setting_value) 
VALUES ('admin_password', 'matrix2024')
ON CONFLICT DO NOTHING;