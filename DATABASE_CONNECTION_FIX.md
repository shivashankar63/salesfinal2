# 🔧 Fix: Database Connection Issue

## Problem
Leads are not being saved to the database because the Supabase API key is invalid.

## Solution

### Step 1: Get Your Supabase Anon Key

1. Go to **[Supabase Dashboard](https://supabase.com/dashboard)**
2. Sign in to your account
3. Select your project: **uvqlonqtlqypxqatgbih**
4. Navigate to **Settings** (gear icon in the sidebar)
5. Click on **API** in the settings menu
6. Find the **Project API keys** section
7. Copy the **`anon` `public`** key (NOT the service_role key)
   - It should start with `eyJ...` and be very long (200+ characters)

### Step 2: Update Your .env.local File

1. Open the file: `e:\hello_leads\salesflow-hub\.env.local`
2. Replace `YOUR_SUPABASE_ANON_KEY_HERE` with your actual key:

```env
VITE_SUPABASE_URL=https://uvqlonqtlqypxqatgbih.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...YOUR_ACTUAL_KEY_HERE
```

### Step 3: Restart the Dev Server

1. Stop the running dev server (Ctrl+C in terminal)
2. Run: `npm run dev`
3. The app should now connect to the database successfully

## How to Verify It's Working

1. Open the browser console (F12 → Console tab)
2. You should see: `[Supabase] Connection successful!`
3. Try adding a lead - you should see detailed logs about the creation process
4. The lead should now appear in both:
   - The Leads dashboard
   - Your Supabase database (check the `leads` table)

## Troubleshooting

### If you still see connection errors:

1. **Check the key format**: The anon key should be a JWT token starting with `eyJ`
2. **Verify the project URL**: Make sure it matches your Supabase project
3. **Check RLS policies**: Ensure your Supabase tables have proper Row Level Security policies
4. **Clear cache**: Try clearing browser cache and restarting dev server

### Console Logs to Look For:

✅ **Success:**
- `[Supabase] Testing connection...`
- `[Supabase] Connection successful!`
- `[createLead] Successfully created lead:`

❌ **Error:**
- `[Supabase] Connection test failed:`
- `[Supabase Error in createLead]`
- Check the error details for specific issues

## Need the Supabase Credentials?

If you don't have access to the Supabase dashboard or don't know the login:
1. Contact the project admin who set up the Supabase project
2. Or create a new Supabase project at https://supabase.com
3. Create the necessary tables (users, leads, projects, etc.)

---

**Note:** The `.env.local` file is git-ignored for security. Never commit API keys to version control!
