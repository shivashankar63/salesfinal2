# Quick Test Setup Guide

## 1. Deploy Database Schema to Supabase

First, create the database tables in your Supabase project:

1. Go to: `https://supabase.com/dashboard/project/[your-project-id]/sql`
2. Click "New Query"
3. Copy and paste the content from `SUPABASE_SCHEMA.sql`
4. Click "Run"

## 2. Create Test Users

After deploying the schema, create test users for each role:

### Using Supabase Dashboard

1. Go to: **Authentication → Users**
2. Click "Add User"
3. Enter test user credentials

### Test Users to Create

```
Role: Owner
Email: owner@salesflow.com
Password: Test@12345
Full Name: Sarah Johnson

Role: Manager
Email: manager@salesflow.com
Password: Test@12345
Full Name: Mike Chen

Role: Salesman
Email: salesman@salesflow.com
Password: Test@12345
Full Name: Alex Rivera
```

### Insert User Profiles

After creating Auth users, insert their profiles using SQL:

```sql
-- Insert Owner Profile
INSERT INTO users (id, email, full_name, role)
SELECT 
  id,
  'owner@salesflow.com',
  'Sarah Johnson',
  'owner'
FROM auth.users 
WHERE email = 'owner@salesflow.com';

-- Insert Manager Profile
INSERT INTO users (id, email, full_name, role)
SELECT 
  id,
  'manager@salesflow.com',
  'Mike Chen',
  'manager'
FROM auth.users 
WHERE email = 'manager@salesflow.com';

-- Insert Salesman Profile
INSERT INTO users (id, email, full_name, role)
SELECT 
  id,
  'salesman@salesflow.com',
  'Alex Rivera',
  'salesman'
FROM auth.users 
WHERE email = 'salesman@salesflow.com';
```

## 3. Test the Authentication Flow

### Test Sign In

1. Open browser: `http://localhost:8081/login`
2. Sign in with:
   ```
   Email: salesman@salesflow.com
   Password: Test@12345
   ```
3. Should redirect to `/salesman` dashboard

### Test Each Role

Repeat login test for each role and verify:

- **Owner** logs in → redirects to `/owner` (dark blue gradient)
- **Manager** logs in → redirects to `/manager` (purple gradient)
- **Salesman** logs in → redirects to `/salesman` (orange gradient)

### Test Sign Up

1. Click "Sign up here"
2. Fill in:
   ```
   Full Name: Test User
   Email: testuser@salesflow.com
   Password: Test@12345
   Role: Salesman
   ```
3. Click "Create Account"
4. See success message
5. Sign in with new credentials

### Test Session Persistence

1. Log in as a user
2. Close browser tab
3. Open `http://localhost:8081/login` again
4. Should automatically redirect to dashboard (no login required)

### Test Log Out

To log out, you'll need to add a logout button to the dashboard. For now, manually clear browser cookies:

1. Open DevTools (F12)
2. Go to Application → Cookies
3. Delete `sb-` cookies
4. Refresh page
5. Should redirect back to login

## 4. Verify Database Tables

Check that all tables were created:

```sql
-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected tables:
- `users` (user profiles with roles)
- `teams` (team information)
- `team_members` (team membership)
- `leads` (sales leads)
- `activities` (user activities)
- `quotas` (sales quotas)

## 5. Sample Data (Optional)

To populate sample data for testing dashboards, run:

```sql
-- Insert sample teams
INSERT INTO teams (name, description) VALUES
  ('North America Sales', 'US and Canada region'),
  ('Europe Sales', 'EU and UK region'),
  ('APAC Sales', 'Asia Pacific region');

-- Insert sample team members (assign to users created above)
-- First get user IDs from auth.users table
SELECT id, email FROM auth.users;

-- Then link them to teams (example with actual UUIDs)
INSERT INTO team_members (user_id, team_id, role) VALUES
  ((SELECT id FROM auth.users WHERE email='manager@salesflow.com'), 
   (SELECT id FROM teams WHERE name='North America Sales'), 
   'team_lead'),
  ((SELECT id FROM auth.users WHERE email='salesman@salesflow.com'), 
   (SELECT id FROM teams WHERE name='North America Sales'), 
   'member');

-- Insert sample leads
INSERT INTO leads (title, status, value, assigned_to) VALUES
  ('Acme Corp Demo', 'in_progress', 50000, (SELECT id FROM auth.users WHERE email='salesman@salesflow.com')),
  ('TechStart Project', 'qualified', 75000, (SELECT id FROM auth.users WHERE email='salesman@salesflow.com')),
  ('Enterprise Solution', 'proposal', 150000, (SELECT id FROM auth.users WHERE email='salesman@salesflow.com'));

-- Insert sample activities
INSERT INTO activities (user_id, activity_type, lead_id, notes) VALUES
  ((SELECT id FROM auth.users WHERE email='salesman@salesflow.com'), 'call', (SELECT id FROM leads LIMIT 1), 'Discussed pricing'),
  ((SELECT id FROM auth.users WHERE email='salesman@salesflow.com'), 'email', (SELECT id FROM leads LIMIT 1 OFFSET 1), 'Sent proposal'),
  ((SELECT id FROM auth.users WHERE email='salesman@salesflow.com'), 'meeting', (SELECT id FROM leads LIMIT 1 OFFSET 2), 'Demo scheduled');

-- Insert sample quotas
INSERT INTO quotas (user_id, month, target_amount, achieved_amount) VALUES
  ((SELECT id FROM auth.users WHERE email='salesman@salesflow.com'), '2024-01', 100000, 85000),
  ((SELECT id FROM auth.users WHERE email='salesman@salesflow.com'), '2024-02', 100000, 120000),
  ((SELECT id FROM auth.users WHERE email='salesman@salesflow.com'), '2024-03', 100000, 75000);
```

## Troubleshooting

### Issue: "Users table not found" error
**Solution:** 
1. Verify schema was deployed successfully
2. Check Supabase SQL Editor for any errors
3. Ensure you're connected to correct project

### Issue: "User not found" after sign up
**Solution:** 
1. Check if user was created in `auth.users` table
2. Verify user profile was inserted into `public.users` table
3. Run: `SELECT * FROM auth.users;` to verify

### Issue: Can't authenticate
**Solution:**
1. Verify `.env.local` has correct Supabase credentials
2. Check browser console for CORS errors
3. Verify RLS policies are enabled on tables

### Issue: Users can't access after creation
**Solution:**
1. Verify user role is set correctly in `users` table
2. Check RLS policies in Supabase dashboard
3. Ensure role values are lowercase: 'owner', 'manager', 'salesman'

