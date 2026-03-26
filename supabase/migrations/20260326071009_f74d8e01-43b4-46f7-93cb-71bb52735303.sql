
-- Page views tracking
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  referrer text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert page views
CREATE POLICY "Anyone can insert page views"
ON public.page_views FOR INSERT TO public
WITH CHECK (true);

-- Tool usage tracking
CREATE TABLE public.tool_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name text NOT NULL,
  tool_path text NOT NULL,
  file_count integer DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tool_usage ENABLE ROW LEVEL SECURITY;

-- Anyone can insert tool usage
CREATE POLICY "Anyone can insert tool usage"
ON public.tool_usage FOR INSERT TO public
WITH CHECK (true);

-- User roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Admins can read their own roles
CREATE POLICY "Users can read own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Admins can read all page_views
CREATE POLICY "Admins can read page views"
ON public.page_views FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can read all tool_usage
CREATE POLICY "Admins can read tool usage"
ON public.tool_usage FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can read contact_submissions (for survey data)
CREATE POLICY "Admins can read submissions"
ON public.contact_submissions FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Auto-assign admin role to specific email on signup
CREATE OR REPLACE FUNCTION public.handle_admin_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'merge.pdf.st@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_admin_assignment();
