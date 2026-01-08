import { useState, useEffect } from "react";
import { Target, DollarSign, TrendingUp, Clock, CheckCircle2, Phone, Flame, Award, Loader } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import SalesmanLeadsTable from "@/components/dashboard/SalesmanLeadsTable";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import QuotaProgress from "@/components/dashboard/QuotaProgress";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getLeads, getCurrentUser, getActivities, getQuotas, getUsers } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

const SalesmanDashboard = () => {
  const [stats, setStats] = useState([
    {
      title: "My Quota",
      value: "$0",
      icon: Target,
      trend: { value: 0, isPositive: true },
    },
    {
      title: "Sales Pipeline",
      value: "$0",
      icon: DollarSign,
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
      title: "Active Leads",
      value: "0",
      icon: Phone,
      trend: { value: 0, isPositive: true },
    },
    {
      title: "Calls Made",
      value: "0",
      icon: Clock,
    },
    {
      title: "Deals Closed",
      value: "0",
      icon: CheckCircle2,
      variant: "success" as const,
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [leaderboardRank, setLeaderboardRank] = useState(3);
  const [quotaAchievement, setQuotaAchievement] = useState(85);
  const todayTasks = [
    { id: 1, title: "Call Jane @ Globex", time: "10:30 AM", type: "call" },
    { id: 2, title: "Send proposal to Initech", time: "1:00 PM", type: "email" },
    { id: 3, title: "Demo with Umbrella", time: "3:00 PM", type: "demo" },
  ];

  const meetings = [
    { id: 1, title: "Discovery - Acme Corp", time: "Tomorrow 9:00 AM", location: "Zoom" },
    { id: 2, title: "Pricing Review - Wayne", time: "Thu 2:00 PM", location: "Google Meet" },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = await getCurrentUser();
        let leadsRes = { data: [] };
        let activitiesRes = { data: [] };
        let quotasRes = { data: [] };
        let allUsersRes = { data: [] };
        let allLeadsRes = { data: [] };
        
        if (user) {
          leadsRes = await getLeads({ assignedTo: user.id });
          activitiesRes = await getActivities(user.id);
          quotasRes = await getQuotas(user.id);
          allUsersRes = await getUsers();
          allLeadsRes = await getLeads();
        }

        const leads = leadsRes.data || [];
        const activities = activitiesRes.data || [];
        const quotas = quotasRes.data || [];
        const allUsers = allUsersRes.data || [];
        const allLeads = allLeadsRes.data || [];
        const userQuota = quotas.length > 0 ? quotas[0].target_amount : 250000;
        
        const pipelineValue = leads.filter((l: any) => 
          ['qualified', 'negotiation'].includes(l.status)
        ).reduce((sum: number, lead: any) => sum + (lead.value || 0), 0);
        const activeLeads = leads.filter((l: any) => 
          ['qualified', 'negotiation'].includes(l.status)
        ).length;
        const wonLeads = leads.filter((l: any) => l.status === 'won').length;
        const wonValue = leads.filter((l: any) => l.status === 'won').reduce((sum: number, lead: any) => sum + (lead.value || 0), 0);
        const conversionRate = leads.length > 0 ? ((wonLeads / leads.length) * 100).toFixed(1) : 0;
        const callsCount = activities.filter((a: any) => a.type === 'call').length;
        const quotaProgress = Math.min(Math.round((wonValue / userQuota) * 100), 100);

        // Calculate leaderboard position dynamically
        const salespeople = allUsers.filter((u: any) => u.role === 'salesman');
        const salesPerformance = salespeople.map((salesperson: any) => {
          const userLeads = allLeads.filter((l: any) => l.assigned_to === salesperson.id && l.status === 'won');
          const revenue = userLeads.reduce((sum: number, l: any) => sum + (l.value || 0), 0);
          return { id: salesperson.id, revenue };
        }).sort((a: any, b: any) => b.revenue - a.revenue);
        
        const userRank = salesPerformance.findIndex((p: any) => p.id === user?.id) + 1;
        setLeaderboardRank(userRank > 0 ? userRank : salespeople.length);

        setQuotaAchievement(quotaProgress);

        setStats([
          {
            title: "My Quota",
            value: `$${(userQuota / 1000).toFixed(0)}K`,
            icon: Target,
            trend: { value: 8, isPositive: true },
          },
          {
            title: "Sales Pipeline",
            value: `$${(pipelineValue / 1000).toFixed(0)}K`,
            icon: DollarSign,
            trend: { value: 15, isPositive: true },
          },
          {
            title: "Conversion Rate",
            value: `${conversionRate}%`,
            icon: TrendingUp,
            trend: { value: 3, isPositive: true },
            variant: "success" as const,
          },
          {
            title: "Active Leads",
            value: activeLeads.toString(),
            icon: Phone,
            trend: { value: 4, isPositive: true },
          },
          {
            title: "Calls Made",
            value: callsCount.toString(),
            icon: Clock,
          },
          {
            title: "Deals Closed",
            value: wonLeads.toString(),
            icon: CheckCircle2,
            variant: "success" as const,
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
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <DashboardSidebar role="salesman" />
      
      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-auto">
        {loading && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <Loader className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
              <p className="text-gray-700">Loading your dashboard...</p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            {/* Motivational Header */}
            <div className="mb-8 animate-fade-in">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">Let's Close Some Deals! 🔥</h1>
                    <p className="text-orange-100 text-lg">
                      You're on fire this month. Keep up the momentum!
                    </p>
                  </div>
                  <Flame className="w-16 h-16 opacity-30" />
                </div>
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

            {/* Achievement Badge & Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <SalesmanLeadsTable />
              </div>
              <div className="space-y-6">
                <Card className="p-6 bg-gradient-to-br from-yellow-400 to-amber-500 border-0 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-8 h-8" />
                    <h3 className="text-lg font-bold">Leaderboard Position</h3>
                  </div>
                  <p className="text-4xl font-bold mb-2">#{leaderboardRank}</p>
                  <Progress value={quotaAchievement} className="mb-2" />
                  <p className="text-sm opacity-90">{quotaAchievement}% of top performer's quota</p>
                </Card>

                <QuotaProgress />
                <ActivityTimeline />
                  {/* Sample Tasks */}
                  <Card className="p-4 bg-white">
                    <h3 className="text-lg font-bold mb-3">Today's Tasks</h3>
                    <div className="space-y-3">
                      {todayTasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                          <div>
                            <p className="font-semibold text-gray-900">{task.title}</p>
                            <p className="text-xs text-gray-500">{task.time}</p>
                          </div>
                          <Button size="sm" variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                            Done
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Sample Meetings */}
                  <Card className="p-4 bg-white">
                    <h3 className="text-lg font-bold mb-3">Upcoming Meetings</h3>
                    <div className="space-y-3">
                      {meetings.map(meeting => (
                        <div key={meeting.id} className="p-3 bg-gray-50 rounded-lg border">
                          <p className="font-semibold text-gray-900">{meeting.title}</p>
                          <p className="text-xs text-gray-500">{meeting.time}</p>
                          <p className="text-xs text-gray-500">{meeting.location}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SalesmanDashboard;
