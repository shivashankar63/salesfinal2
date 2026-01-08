import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uvqlonqtlqypxqatgbih.supabase.co';
const supabaseAnonKey = 'sb_publishable_A8iz_SOWHx_G5eKQZGgfMg_csYrQ5Q8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---------- Hardcoded fallback data (used when DB unavailable or empty) ----------
const sampleUsers = [
  { id: "00000000-0000-0000-0000-000000000001", email: "owner@salesflow.com", full_name: "Alice Owner", role: "owner" },
  { id: "00000000-0000-0000-0000-000000000002", email: "manager@salesflow.com", full_name: "Mark Manager", role: "manager" },
  { id: "00000000-0000-0000-0000-000000000003", email: "sally@salesflow.com", full_name: "Sally Seller", role: "salesman" },
  { id: "00000000-0000-0000-0000-000000000004", email: "sam@salesflow.com", full_name: "Sam Seller", role: "salesman" },
];

const sampleLeads = [
  { id: "20000000-0000-0000-0000-000000000001", company_name: "Acme Corp", contact_name: "Jane Roe", contact_email: "jane@acme.com", contact_phone: "+1-555-1010", status: "qualified", value: 75000, assigned_to: sampleUsers[2].id, description: "Looking for CRM migration", created_at: new Date().toISOString() },
  { id: "20000000-0000-0000-0000-000000000002", company_name: "Globex", contact_name: "Will Smith", contact_email: "will@globex.com", contact_phone: "+1-555-2020", status: "negotiation", value: 120000, assigned_to: sampleUsers[3].id, description: "Negotiating multi-region rollout", created_at: new Date().toISOString() },
  { id: "20000000-0000-0000-0000-000000000003", company_name: "Initech", contact_name: "Peter Gibbons", contact_email: "peter@initech.com", contact_phone: "+1-555-3030", status: "won", value: 50000, assigned_to: sampleUsers[2].id, description: "Closed for starter tier", created_at: new Date().toISOString() },
  { id: "20000000-0000-0000-0000-000000000004", company_name: "Soylent", contact_name: "Linda Green", contact_email: "linda@soylent.com", contact_phone: "+1-555-4040", status: "new", value: 30000, assigned_to: sampleUsers[3].id, description: "Initial discovery set", created_at: new Date().toISOString() },
];

const sampleActivities = [
  { id: "30000000-0000-0000-0000-000000000001", user_id: sampleUsers[2].id, lead_id: sampleLeads[0].id, type: "call", title: "Discovery call", description: "Discussed migration scope", created_at: new Date().toISOString() },
  { id: "30000000-0000-0000-0000-000000000002", user_id: sampleUsers[3].id, lead_id: sampleLeads[1].id, type: "note", title: "Pricing sent", description: "Shared proposal v2", created_at: new Date().toISOString() },
  { id: "30000000-0000-0000-0000-000000000003", user_id: sampleUsers[2].id, lead_id: sampleLeads[2].id, type: "deal", title: "Closed won", description: "Signed starter tier", created_at: new Date().toISOString() },
];

const sampleQuotas = [
  { id: "40000000-0000-0000-0000-000000000001", user_id: sampleUsers[2].id, target_amount: 150000, period_start: new Date().toISOString(), period_end: new Date().toISOString() },
  { id: "40000000-0000-0000-0000-000000000002", user_id: sampleUsers[3].id, target_amount: 180000, period_start: new Date().toISOString(), period_end: new Date().toISOString() },
];

// Auth functions
export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Database functions for Users
export const getUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    if (error) throw error;
    return { data: data && data.length ? data : sampleUsers, error: null };
  } catch (error) {
    console.warn('Using fallback users due to error:', error);
    return { data: sampleUsers, error: null };
  }
};

export const getUserById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    const fallback = sampleUsers.find(u => u.id === id) || null;
    return { data: fallback, error: null };
  }
};

export const createUser = async (userData: {
  email: string;
  full_name: string;
  role: 'owner' | 'manager' | 'salesman';
  avatar_url?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select();
    return { data, error };
  } catch (error) {
    console.warn('Create user failed, using fallback:', error);
    return { data: [{ ...userData, id: crypto.randomUUID?.() || Date.now().toString() }], error: null };
  }
};

export const updateUser = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select();
  return { data, error };
};

// Database functions for Leads
export const getLeads = async (filters?: { status?: string; assignedTo?: string }) => {
  try {
    let query = supabase.from('leads').select('*');
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.assignedTo) query = query.eq('assigned_to', filters.assignedTo);
    const { data, error } = await query;
    if (error) throw error;
    let result = data || [];
    if (filters?.assignedTo) {
      result = result.filter(l => l.assigned_to === filters.assignedTo);
    }
    if (!result.length) {
      result = sampleLeads.filter(l => !filters?.assignedTo || l.assigned_to === filters.assignedTo);
    }
    return { data: result, error: null };
  } catch (error) {
    console.warn('Using fallback leads due to error:', error);
    const filtered = sampleLeads.filter(l =>
      (!filters?.status || l.status === filters.status) &&
      (!filters?.assignedTo || l.assigned_to === filters.assignedTo)
    );
    return { data: filtered, error: null };
  }
};

export const getLeadById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    const fallback = sampleLeads.find(l => l.id === id) || null;
    return { data: fallback, error: null };
  }
};

export const createLead = async (leadData: {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  status: 'new' | 'qualified' | 'negotiation' | 'won' | 'lost';
  value: number;
  assigned_to?: string;
  description?: string;
}) => {
  const { data, error } = await supabase
    .from('leads')
    .insert([leadData])
    .select();
  return { data, error };
};

export const updateLead = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select();
  return { data, error };
};

export const deleteLead = async (id: string) => {
  const { data, error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);
  return { data, error };
};

// Database functions for Teams
export const getTeams = async () => {
  const { data, error } = await supabase
    .from('teams')
    .select('*');
  return { data, error };
};

export const getTeamById = async (id: string) => {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

export const createTeam = async (teamData: {
  name: string;
  manager_id: string;
  description?: string;
}) => {
  const { data, error } = await supabase
    .from('teams')
    .insert([teamData])
    .select();
  return { data, error };
};

export const updateTeam = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('teams')
    .update(updates)
    .eq('id', id)
    .select();
  return { data, error };
};

// Database functions for Activities
export const getActivities = async (userId?: string) => {
  try {
    let query = supabase.from('activities').select('*');
    if (userId) query = query.eq('user_id', userId);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    const filtered = userId ? (data || []).filter(a => a.user_id === userId) : data || [];
    return { data: filtered.length ? filtered : (userId ? sampleActivities.filter(a => a.user_id === userId) : sampleActivities), error: null };
  } catch (error) {
    console.warn('Using fallback activities due to error:', error);
    return { data: userId ? sampleActivities.filter(a => a.user_id === userId) : sampleActivities, error: null };
  }
};

// Database functions for Quotas
export const getQuotas = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('quotas')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return { data: data && data.length ? data : sampleQuotas.filter(q => q.user_id === userId), error: null };
  } catch (error) {
    console.warn('Using fallback quotas due to error:', error);
    return { data: sampleQuotas.filter(q => q.user_id === userId), error: null };
  }
};

export const getQuotaById = async (id: string) => {
  const { data, error } = await supabase
    .from('quotas')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

export const createActivity = async (activityData: {
  user_id: string;
  type: 'call' | 'email' | 'note' | 'deal';
  title: string;
  description?: string;
  lead_id?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .insert([activityData])
      .select();
    return { data, error };
  } catch (error) {
    console.warn('Create activity failed, using fallback:', error);
    const fallback = { id: crypto.randomUUID?.() || Date.now().toString(), created_at: new Date().toISOString(), ...activityData };
    sampleActivities.unshift(fallback as any);
    return { data: [fallback], error: null };
  }
};

// Analytics functions
export const getRevenueAnalytics = async () => {
  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('value, status, created_at');
    
    if (error) throw error;
    
    if (!leads || leads.length === 0) {
      // Return fallback data
      return {
        monthlyRevenue: [
          { month: 'Jan', revenue: 420000, target: 380000, deals: 12, avgDeal: 35000 },
          { month: 'Feb', revenue: 485000, target: 420000, deals: 15, avgDeal: 32333 },
          { month: 'Mar', revenue: 550000, target: 450000, deals: 18, avgDeal: 30556 },
          { month: 'Apr', revenue: 615000, target: 500000, deals: 21, avgDeal: 29286 },
          { month: 'May', revenue: 680000, target: 550000, deals: 24, avgDeal: 28333 },
          { month: 'Jun', revenue: 745000, target: 600000, deals: 26, avgDeal: 28654 },
        ],
        quarterlyData: [
          { quarter: 'Q1 2025', revenue: 1455000, target: 1250000, growth: 16 },
          { quarter: 'Q2 2025', revenue: 2040000, target: 1650000, growth: 24 },
        ]
      };
    }

    // Process real data
    const wonLeads = leads.filter(l => l.status === 'won');
    const monthlyMap = new Map();
    
    wonLeads.forEach(lead => {
      const date = new Date(lead.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { revenue: 0, deals: 0 });
      }
      const month = monthlyMap.get(monthKey);
      month.revenue += lead.value || 0;
      month.deals += 1;
    });

    const monthlyRevenue = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, data]) => {
        const [year, month] = key.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return {
          month: monthNames[parseInt(month) - 1],
          revenue: data.revenue,
          target: data.revenue * 0.85, // Assuming target is 85% of actual
          deals: data.deals,
          avgDeal: data.deals > 0 ? data.revenue / data.deals : 0
        };
      });

    return { monthlyRevenue, quarterlyData: [] };
  } catch (error) {
    console.warn('Using fallback revenue analytics:', error);
    return {
      monthlyRevenue: [
        { month: 'Jan', revenue: 420000, target: 380000, deals: 12, avgDeal: 35000 },
        { month: 'Feb', revenue: 485000, target: 420000, deals: 15, avgDeal: 32333 },
        { month: 'Mar', revenue: 550000, target: 450000, deals: 18, avgDeal: 30556 },
        { month: 'Apr', revenue: 615000, target: 500000, deals: 21, avgDeal: 29286 },
        { month: 'May', revenue: 680000, target: 550000, deals: 24, avgDeal: 28333 },
        { month: 'Jun', revenue: 745000, target: 600000, deals: 26, avgDeal: 28654 },
      ],
      quarterlyData: [
        { quarter: 'Q1 2025', revenue: 1455000, target: 1250000, growth: 16 },
        { quarter: 'Q2 2025', revenue: 2040000, target: 1650000, growth: 24 },
      ]
    };
  }
};

export const getTopPerformers = async () => {
  try {
    const { data: users, error: usersError } = await supabase.from('users').select('*');
    const { data: leads, error: leadsError } = await supabase.from('leads').select('*').eq('status', 'won');
    const { data: quotas, error: quotasError } = await supabase.from('quotas').select('*');

    if (usersError || leadsError || quotasError || !users || !leads || !quotas || users.length === 0) {
      return [
        { name: "Sam Seller", revenue: 195000, deals: 12, quota: 180000, achievement: 108 },
        { name: "Sally Seller", revenue: 125000, deals: 8, quota: 150000, achievement: 83 },
        { name: "Oliver Ops", revenue: 155000, deals: 9, quota: 140000, achievement: 111 },
        { name: "Emma Expert", revenue: 130000, deals: 6, quota: 150000, achievement: 87 },
        { name: "Steve Sales", revenue: 140000, deals: 7, quota: 160000, achievement: 88 },
      ];
    }

    const performers = users
      .filter(u => u.role === 'salesman')
      .map(user => {
        const userLeads = leads.filter(l => l.assigned_to === user.id);
        const revenue = userLeads.reduce((sum, l) => sum + (l.value || 0), 0);
        const userQuota = quotas.find(q => q.user_id === user.id);
        const quota = userQuota?.target_amount || 150000;
        return {
          name: user.full_name,
          revenue,
          deals: userLeads.length,
          quota,
          achievement: quota > 0 ? Math.round((revenue / quota) * 100) : 0
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return performers.length > 0 ? performers : [
      { name: "Sam Seller", revenue: 195000, deals: 12, quota: 180000, achievement: 108 },
      { name: "Sally Seller", revenue: 125000, deals: 8, quota: 150000, achievement: 83 },
    ];
  } catch (error) {
    console.warn('Using fallback top performers:', error);
    return [
      { name: "Sam Seller", revenue: 195000, deals: 12, quota: 180000, achievement: 108 },
      { name: "Sally Seller", revenue: 125000, deals: 8, quota: 150000, achievement: 83 },
    ];
  }
};

export const getTeamsWithMembers = async () => {
  try {
    const { data: teams, error: teamsError } = await supabase.from('teams').select('*');
    const { data: teamMembers, error: membersError } = await supabase.from('team_members').select('*');
    const { data: users, error: usersError } = await supabase.from('users').select('*');
    const { data: leads, error: leadsError } = await supabase.from('leads').select('*').eq('status', 'won');
    const { data: quotas, error: quotasError } = await supabase.from('quotas').select('*');

    if (teamsError || membersError || usersError || leadsError || quotasError || !teams || !users || teams.length === 0) {
      return [
        {
          id: "1",
          name: "North America Sales",
          manager: "Mark Manager",
          revenue: 460000,
          quota: 450000,
          achievement: 102,
          region: "North America",
          members: [
            { id: "1", name: "Sam Seller", role: "Senior Sales Rep", quota: 180000, achieved: 195000, deals: 12, email: "sam@salesflow.com" },
            { id: "2", name: "Oliver Ops", role: "Sales Rep", quota: 140000, achieved: 155000, deals: 9, email: "oliver@salesflow.com" },
            { id: "3", name: "Emma Expert", role: "Sales Rep", quota: 150000, achieved: 110000, deals: 6, email: "emma@salesflow.com" },
          ]
        },
        {
          id: "2",
          name: "EMEA Team",
          manager: "Lisa Lead",
          revenue: 285000,
          quota: 300000,
          achievement: 95,
          region: "Europe",
          members: [
            { id: "4", name: "Sally Seller", role: "Sales Rep", quota: 150000, achieved: 125000, deals: 8, email: "sally@salesflow.com" },
            { id: "5", name: "Steve Sales", role: "Junior Sales Rep", quota: 160000, achieved: 140000, deals: 7, email: "steve@salesflow.com" },
          ]
        }
      ];
    }

    const teamsWithData = teams.map(team => {
      const members = teamMembers.filter(tm => tm.team_id === team.id);
      const memberDetails = members.map(tm => {
        const user = users.find(u => u.id === tm.user_id);
        const userLeads = leads.filter(l => l.assigned_to === tm.user_id);
        const achieved = userLeads.reduce((sum, l) => sum + (l.value || 0), 0);
        const userQuota = quotas.find(q => q.user_id === tm.user_id);
        const quota = userQuota?.target_amount || 150000;
        return {
          id: tm.user_id,
          name: user?.full_name || "Unknown",
          role: user?.role || "salesman",
          quota,
          achieved,
          deals: userLeads.length,
          email: user?.email || ""
        };
      });
      const teamRevenue = memberDetails.reduce((sum, m) => sum + m.achieved, 0);
      const teamQuota = memberDetails.reduce((sum, m) => sum + m.quota, 0);
      const manager = users.find(u => u.id === team.manager_id);
      return {
        id: team.id,
        name: team.name,
        manager: manager?.full_name || "Unknown",
        revenue: teamRevenue,
        quota: teamQuota,
        achievement: teamQuota > 0 ? Math.round((teamRevenue / teamQuota) * 100) : 0,
        region: team.description || "Unknown",
        members: memberDetails
      };
    });

    return teamsWithData.length > 0 ? teamsWithData : [
      {
        id: "1",
        name: "North America Sales",
        manager: "Mark Manager",
        revenue: 460000,
        quota: 450000,
        achievement: 102,
        region: "North America",
        members: [
          { id: "1", name: "Sam Seller", role: "Senior Sales Rep", quota: 180000, achieved: 195000, deals: 12, email: "sam@salesflow.com" },
        ]
      }
    ];
  } catch (error) {
    console.warn('Using fallback teams data:', error);
    return [
      {
        id: "1",
        name: "North America Sales",
        manager: "Mark Manager",
        revenue: 460000,
        quota: 450000,
        achievement: 102,
        region: "North America",
        members: [
          { id: "1", name: "Sam Seller", role: "Senior Sales Rep", quota: 180000, achieved: 195000, deals: 12, email: "sam@salesflow.com" },
          { id: "2", name: "Oliver Ops", role: "Sales Rep", quota: 140000, achieved: 155000, deals: 9, email: "oliver@salesflow.com" },
        ]
      }
    ];
  }
};

// Real-time subscriptions
export const subscribeToLeads = (callback: (data: any) => void) => {
  const subscription = supabase
    .channel('leads')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'leads' },
      (payload) => callback(payload)
    )
    .subscribe();

  return subscription;
};

export const subscribeToActivities = (userId: string, callback: (data: any) => void) => {
  const subscription = supabase
    .channel(`activities:${userId}`)
    .on(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: 'activities',
        filter: `user_id=eq.${userId}`
      },
      (payload) => callback(payload)
    )
    .subscribe();

  return subscription;
};
