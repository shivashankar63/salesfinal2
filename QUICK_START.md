# SalesFlow Hub - Quick Start Guide

## ✅ Current Status: Development Ready

### Dev Server
- **URL:** http://localhost:8083/
- **Status:** Running ✅
- **Framework:** Vite v5.4.21 + React 18 + TypeScript

### What Works Now
✅ Three role-based dashboards (Owner, Manager, Salesman)
✅ Real-time data fetching from Supabase
✅ Authentication system (Login/Sign-up)
✅ 10 dashboard components with real data binding
✅ Search/filter functionality on all lead tables
✅ Performance charts and metrics
✅ Quota progress tracking

### Components Connected to Database
1. **OwnerDashboard** - All leads, team metrics
2. **ManagerDashboard** - Team leads, team performance
3. **SalesmanDashboard** - Personal leads, quota tracking
4. **OwnerLeadsOverview** - All leads table
5. **ManagerLeadsTable** - Team leads table
6. **SalesmanLeadsTable** - Personal leads table
7. **PerformanceChart** - Team performance bar chart
8. **TeamPerformance** - Top performers list
9. **ActivityTimeline** - Recent activity feed
10. **QuotaProgress** - Monthly quota tracker

### Environment
```
Node.js: v22.16.0
npm: v10.9.2
Vite: v5.4.21
React: v18.3.1
TypeScript: v5.8.3
```

### Installed Packages
- Supabase: @supabase/supabase-js v2.43.0 ✅
- UI Components: shadcn/ui + Radix UI ✅
- Styling: Tailwind CSS ✅
- Routing: React Router v6.30.1 ✅
- Charts: Recharts v2.15.4 ✅
- Forms: React Hook Form v7.61.1 ✅
- Utilities: Zod, date-fns, clsx ✅

### Database Connection
**Supabase Project:** uvqlonqtlqypxqatgbih
**Status:** Ready to connect
**Tables:** users, leads, teams, team_members, activities, quotas

### What's Missing for Production
- Test data in Supabase database
- Environment variables configured
- Database schema deployed to Supabase
- Email/notification configuration
- Error monitoring setup
- Performance optimization

---

## Quick Commands

### Start Development Server
```bash
npm run dev
```
Starts server on http://localhost:8083

### Build for Production
```bash
npm run build
```
Creates optimized production bundle

### Preview Build
```bash
npm run preview
```
Previews production build locally

### Run Linter
```bash
npm run lint
```
Checks code quality with ESLint

---

## Project Structure

```
salesflow-hub/
├── src/
│   ├── pages/
│   │   ├── Login.tsx                 (Authentication)
│   │   ├── OwnerDashboard.tsx        (Executive dashboard)
│   │   ├── ManagerDashboard.tsx      (Team dashboard)
│   │   └── SalesmanDashboard.tsx     (Personal dashboard)
│   ├── components/
│   │   └── dashboard/
│   │       ├── OwnerLeadsOverview.tsx
│   │       ├── ManagerLeadsTable.tsx
│   │       ├── SalesmanLeadsTable.tsx
│   │       ├── PerformanceChart.tsx
│   │       ├── TeamPerformance.tsx
│   │       ├── ActivityTimeline.tsx
│   │       └── QuotaProgress.tsx
│   ├── lib/
│   │   └── supabase.ts              (Database queries)
│   ├── hooks/
│   │   └── useAuth.ts               (Auth hook)
│   └── ui/                          (shadcn components)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Database Schema Reference

### users table
```sql
- id (UUID, PK)
- email (VARCHAR)
- full_name (VARCHAR)
- role (owner|manager|salesman)
- avatar_url (VARCHAR)
- created_at (TIMESTAMP)
```

### leads table
```sql
- id (UUID, PK)
- company_name (VARCHAR)
- contact_name (VARCHAR)
- contact_email (VARCHAR)
- contact_phone (VARCHAR)
- status (new|qualified|negotiation|won|lost)
- value (NUMERIC)
- assigned_to (UUID, FK users)
- description (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### activities table
```sql
- id (UUID, PK)
- user_id (UUID, FK users)
- activity_type (call|email|note|deal)
- description (TEXT)
- lead_id (UUID, FK leads)
- created_at (TIMESTAMP)
```

### quotas table
```sql
- id (UUID, PK)
- user_id (UUID, FK users)
- target (NUMERIC)
- period (VARCHAR)
- created_at (TIMESTAMP)
```

---

## Testing the Application

### 1. Login Page
- Navigate to http://localhost:8083
- Should see Login/Sign-up form

### 2. Test Authentication
- Create new account with test email
- Or login with existing credentials
- Should redirect to role-based dashboard

### 3. Owner Dashboard
- Should show all leads in pipeline
- Total revenue, active leads, team size metrics
- Leads overview table with search/filter

### 4. Manager Dashboard
- Should show team's leads
- Team performance chart
- Team members and their metrics
- Leads table for team management

### 5. Salesman Dashboard
- Should show only assigned leads
- Personal metrics and quota progress
- Activity timeline
- All actions and notes

---

## Common Issues & Solutions

### Issue: Port Already in Use
**Solution:** Kill process on port or change port in vite.config.ts

### Issue: Module Not Found Errors
**Solution:** Run `npm install` to install all dependencies

### Issue: Supabase Connection Fails
**Solution:** Check environment variables, verify Supabase URL and key

### Issue: Data Not Loading
**Solution:** Verify database schema exists in Supabase, check RLS policies

### Issue: TypeScript Errors
**Solution:** Run `npm run lint` and fix any reported errors

---

## Deployment Checklist

- [ ] Environment variables configured (.env.local)
- [ ] Supabase database schema deployed
- [ ] Test users created in database
- [ ] Test data (leads, activities) created
- [ ] RLS policies configured
- [ ] Email notifications setup
- [ ] Error monitoring enabled
- [ ] Performance optimized
- [ ] Security audit passed
- [ ] Full end-to-end testing completed

---

## Support Resources

- Vite Docs: https://vitejs.dev
- React Docs: https://react.dev
- Supabase Docs: https://supabase.com/docs
- shadcn/ui: https://ui.shadcn.com
- Tailwind CSS: https://tailwindcss.com

---

**Last Updated:** January 6, 2026
**Version:** 1.0.0 (Development)
**Status:** Development Ready ✅
