# Database Setup Guide for SalesFlow Hub

## Important: Missing `projects` Table

The `projects` table was missing from your Supabase database. This is required for the leads management system to work.

## Setup Instructions

### Step 1: Run the Database Schema in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **uvqlonqtlqypxqatgbih**
3. Navigate to **SQL Editor** (left sidebar)
4. Click **"New Query"**
5. Open the file: `SUPABASE_SCHEMA.sql` from your project folder
6. Copy ALL the SQL code
7. Paste it into the Supabase SQL editor
8. Click **"Run"** (⏵ button)

### Step 2: Verify the Tables Were Created

In Supabase, go to **Table Editor** and verify you see these tables:

✅ `users` - User accounts and profiles  
✅ `projects` - Projects/campaigns (THIS WAS MISSING!)  
✅ `leads` - Sales leads  
✅ `teams` - Team management  
✅ `team_members` - Team membership  
✅ `activities` - Activity log  
✅ `quotas` - Sales quotas

### Step 3: Check for Column Constraints

The `leads` table MUST have a `created_by` column with NOT NULL constraint. This is what was causing the error:
```
null value in column "created_by" of relation "leads" violates not-null constraint
```

To verify, click on the `leads` table and check that `created_by` is marked as "Required" (NOT NULL).

## What Was Fixed

| Issue | Solution |
|-------|----------|
| `projects` table missing | Added table definition to SUPABASE_SCHEMA.sql |
| `leads.project_id` references missing table | Now properly references the projects table |
| Missing indexes | Added indexes for better performance |
| Missing RLS policies | Added security policies for projects |

## Now You Can:

✅ Create Projects (Projects page in Manager dashboard)  
✅ Add Leads to Projects (Leads Management page)  
✅ Assign Leads to Salespeople (Sales Man page)  
✅ Track Sales Performance (Sales Man dashboard)  

## If You Still Get Errors

1. **Error: "relation 'projects' does not exist"**
   - Run the SUPABASE_SCHEMA.sql file again
   - Verify all tables appear in Table Editor

2. **Error: "null value in column 'created_by'"**
   - Make sure you're logged in (session exists)
   - Check that the `created_by` column is NOT NULL in the `leads` table

3. **Error: "table doesn't exist"**
   - Refresh your browser
   - Check that the table shows up in Supabase Table Editor

## Database Structure

```
users (stores people: managers, salespeople)
  ├── id (UUID)
  ├── email
  ├── full_name
  ├── role (owner, manager, salesman)
  └── ... other fields

projects (stores campaigns/projects)
  ├── id (UUID)
  ├── name
  ├── budget
  ├── status
  ├── created_by (FK → users)
  └── ... other fields

leads (stores sales leads)
  ├── id (UUID)
  ├── project_id (FK → projects) ← NEWLY ADDED FOREIGN KEY
  ├── company_name
  ├── contact_name
  ├── email
  ├── value
  ├── status (new, qualified, negotiation, won, lost)
  ├── assigned_to (FK → users)
  ├── created_by (FK → users) ← NOT NULL, causes the error if null
  └── ... other fields

teams (optional: for team management)
  ├── id (UUID)
  ├── name
  ├── manager_id (FK → users)
  └── ... other fields
```

---

**Questions?** Check the browser console (F12) for detailed error messages with hints about what's missing.
