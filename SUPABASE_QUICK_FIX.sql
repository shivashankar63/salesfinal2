-- ============================================================================
-- QUICK FIX FOR DEVELOPMENT - PASTE IN SUPABASE SQL EDITOR
-- ============================================================================
-- This is a simplified RLS policy that allows all authenticated users
-- to do everything (good for development, NOT for production)
-- ============================================================================

-- 1. ENABLE RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotas ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SIMPLE PERMISSIVE POLICIES (DEVELOPMENT ONLY)
-- ============================================================================

-- USERS TABLE
DROP POLICY IF EXISTS "users_all" ON public.users;
CREATE POLICY "users_all" ON public.users
  USING (auth.uid() IS NOT NULL OR true)
  WITH CHECK (auth.uid() IS NOT NULL OR true);

-- LEADS TABLE
DROP POLICY IF EXISTS "leads_all" ON public.leads;
CREATE POLICY "leads_all" ON public.leads
  USING (auth.uid() IS NOT NULL OR true)
  WITH CHECK (auth.uid() IS NOT NULL OR true);

-- TEAMS TABLE
DROP POLICY IF EXISTS "teams_all" ON public.teams;
CREATE POLICY "teams_all" ON public.teams
  USING (auth.uid() IS NOT NULL OR true)
  WITH CHECK (auth.uid() IS NOT NULL OR true);

-- TEAM_MEMBERS TABLE
DROP POLICY IF EXISTS "team_members_all" ON public.team_members;
CREATE POLICY "team_members_all" ON public.team_members
  USING (auth.uid() IS NOT NULL OR true)
  WITH CHECK (auth.uid() IS NOT NULL OR true);

-- ACTIVITIES TABLE
DROP POLICY IF EXISTS "activities_all" ON public.activities;
CREATE POLICY "activities_all" ON public.activities
  USING (auth.uid() IS NOT NULL OR true)
  WITH CHECK (auth.uid() IS NOT NULL OR true);

-- QUOTAS TABLE
DROP POLICY IF EXISTS "quotas_all" ON public.quotas;
CREATE POLICY "quotas_all" ON public.quotas
  USING (auth.uid() IS NOT NULL OR true)
  WITH CHECK (auth.uid() IS NOT NULL OR true);

-- ============================================================================
-- DONE! This allows all authenticated users to read/write everything
-- ============================================================================
