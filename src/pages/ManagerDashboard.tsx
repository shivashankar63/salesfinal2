import { useState, useEffect } from "react";
import { Users, TrendingUp, DollarSign, Target, CheckCircle2, AlertCircle, Clock, Zap, Loader } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ManagerTeamOverview from "@/components/dashboard/ManagerTeamOverview";
import ManagerLeadsTable from "@/components/dashboard/ManagerLeadsTable";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLeads, getCurrentUser, getUsers, getActivities } from "@/lib/supabase";
import { Progress } from "@/components/ui/progress";

const ManagerDashboard = () => {
  const [stats, setStats] = useState([
    {
      title: "Team Revenue",
      value: "$0",
      icon: DollarSign,
      trend: { value: 0, isPositive: true },
    },
    {
      title: "Active Leads",
      value: "0",
      icon: Target,
      trend: { value: 0, isPositive: true },
    },
    {
      title: "Team Size",
      value: "0",
      icon: Users,
      trend: { value: 0, isPositive: true },
    },
    {
      title: "Conversion Rate",
      value: "0%",
      icon: TrendingUp,
      trend: { value: 0, isPositive: true },
      variant: "success" as const,
    },
    {
      title: "Tasks Completed",
      value: "0",
      icon: CheckCircle2,
      trend: { value: 0, isPositive: true },
    },
    {
      title: "At Risk Deals",
      value: "0",
      icon: AlertCircle,
      variant: "warning" as const,
    },
  ]);
  const [loading, setLoading] = useState(true);
  const pipelineByStage = [
    { stage: "New", count: 18, value: 240000 },
    { stage: "Qualified", count: 12, value: 310000 },
    { stage: "Negotiation", count: 7, value: 195000 },
    { stage: "Closed Won", count: 5, value: 175000 },
  ];

  const activityFeed = [
    { id: 1, title: "Proposal sent to Acme Corp", owner: "Sally", time: "1h ago", type: "proposal" },
    { id: 2, title: "Call with Globex scheduled", owner: "Sam", time: "3h ago", type: "call" },
    { id: 3, title: "Demo booked for Initech", owner: "Steve", time: "5h ago", type: "demo" },
    { id: 4, title: "Pricing review for Umbrella", owner: "Emma", time: "Yesterday", type: "note" },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = await getCurrentUser();
        let leadsRes = { data: [] };
        let usersRes = { data: [] };
        let activitiesRes = { data: [] };
        
        if (user) {
          leadsRes = await getLeads();
          usersRes = await getUsers();
          activitiesRes = await getActivities(user.id);
        }

        const leads = leadsRes.data || [];
        const users = usersRes.data || [];
        const activities = activitiesRes.data || [];
        const teamMembers = users.filter((u: any) => u.role === 'salesman').length;
        const teamRevenue = leads.reduce((sum: number, lead: any) => 
          lead.status === 'won' ? sum + (lead.value || 0) : sum, 0
        );
        const activeLeads = leads.filter((l: any) => 
          ['new', 'qualified', 'negotiation'].includes(l.status)
        ).length;
        const atRiskDeals = leads.filter((l: any) => l.status === 'negotiation').length;
        const wonLeads = leads.filter((l: any) => l.status === 'won').length;
        const conversionRate = leads.length > 0 ? ((wonLeads / leads.length) * 100).toFixed(1) : 0;
        const tasksCount = activities.filter((a: any) => a.type === 'task' || a.type === 'call').length;

        setStats([
          {
            title: "Team Revenue",
            value: `$${(teamRevenue / 1000000).toFixed(1)}M`,
            icon: DollarSign,
            trend: { value: 18, isPositive: true },
          },
          {
            title: "Active Leads",
            value: activeLeads.toString(),
            icon: Target,
            trend: { value: 8, isPositive: true },
          },
          {
            title: "Team Size",
            value: teamMembers.toString(),
            icon: Users,
            trend: { value: 2, isPositive: true },
          },
          {
            title: "Conversion Rate",
            value: `${conversionRate}%`,
            icon: TrendingUp,
            trend: { value: 5, isPositive: true },
            variant: "success" as const,
          },
          {
            title: "Tasks Completed",
            value: tasksCount.toString(),
            icon: CheckCircle2,
            trend: { value: 12, isPositive: true },
          },
          {
            title: "At Risk Deals",
            value: atRiskDeals.toString(),
            icon: AlertCircle,
            variant: "warning" as const,
          },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <DashboardSidebar role="manager" />
      
      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-auto">
        {loading && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <Loader className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
              <p className="text-gray-700">Loading dashboard data...</p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            {/* Header Section */}
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Team Command Center
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Manage your team's performance and lead pipeline in real-time
                  </p>
                </div>
                <Badge className="bg-purple-600 text-white px-4 py-2 text-base">
                  <Clock className="w-4 h-4 mr-2 inline" />
                  Last updated: 5 min ago
                </Badge>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={stat.title} style={{ animationDelay: `${0.1 * index}s` }}>
                  <StatsCard {...stat} />
                </div>
              ))}
            </div>

            {/* Team Status & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <PerformanceChart />
              </div>
              <div className="space-y-6">
                <ManagerTeamOverview />
                <Card className="p-6 bg-white border border-purple-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => window.location.href = '/leads'}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      Add New Lead
                    </button>
                    <button 
                      onClick={() => alert('Generate Report feature coming soon!')}
                      className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
                    >
                      Generate Report
                    </button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Pipeline & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2 p-6 bg-white border border-purple-200">
                <h3 className="font-semibold text-gray-900 mb-4">Pipeline by Stage</h3>
                <div className="space-y-4">
                  {pipelineByStage.map((stage) => {
                    const percent = Math.min(100, Math.round((stage.value / 400000) * 100));
                    return (
                      <div key={stage.stage} className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-700">
                          <div className="font-medium">{stage.stage}</div>
                          <div className="text-gray-500">{stage.count} deals · ${(stage.value / 1000).toFixed(0)}k</div>
                        </div>
                        <Progress value={percent} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6 bg-white border border-purple-200">
                <h3 className="font-semibold text-gray-900 mb-4">Team Activity</h3>
                <div className="space-y-3">
                  {activityFeed.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-500">Owner: {item.owner}</p>
                        </div>
                        <span className="text-xs text-gray-400">{item.time}</span>
                      </div>
                      <Badge variant="outline" className="mt-2 capitalize">
                        {item.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Team Leads */}
            <ManagerLeadsTable />
          </>
        )}
      </main>
    </div>
  );
};

export default ManagerDashboard;
