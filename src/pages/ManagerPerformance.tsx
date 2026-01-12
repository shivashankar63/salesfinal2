
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { BarChart3, TrendingUp, Trophy, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { getCurrentUser, getUsers, getLeads } from "@/lib/supabase";

interface TeamPerformance {
  id: string;
  name: string;
  winRate: number;
  cycle: number;
  quota: number;
  achieved: number;
}


const ManagerPerformance = () => {
  const [loading, setLoading] = useState(true);
  const [teamPerformance, setTeamPerformance] = useState<TeamPerformance[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const manager = await getCurrentUser();
        if (!manager) {
          setLoading(false);
          return;
        }

        const [usersRes, leadsRes] = await Promise.all([
          getUsers(),
          getLeads(),
        ]);

        const users = usersRes.data || [];
        const leads = leadsRes.data || [];

        // Filter for salespeople
        const salespeople = users.filter((u: any) =>
          String(u.role || "").toLowerCase().includes("sales")
        );

        // Calculate performance metrics for each salesperson
        const performance = salespeople.map((salesman: any) => {
          const salesmanLeads = leads.filter((l: any) => l.assigned_to === salesman.id);
          const closedWonLeads = salesmanLeads.filter((l: any) => l.status === "closed_won");
          const totalLeads = salesmanLeads.length;
          const winRate = totalLeads > 0 ? Math.round((closedWonLeads.length / totalLeads) * 100) : 0;
          // Placeholder for sales cycle (days) - needs real calculation if available
          const cycle = 30;
          const quota = 150000; // Standard quota, can be customized
          const achieved = closedWonLeads.reduce((sum: number, l: any) => sum + (l.value || 0), 0);
          return {
            id: salesman.id,
            name: salesman.full_name || salesman.email?.split("@")[0] || "Unknown",
            winRate,
            cycle,
            quota,
            achieved,
          };
        });

        setTeamPerformance(performance.sort((a, b) => b.winRate - a.winRate));
      } catch (error) {
        console.error("Error fetching team performance:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <DashboardSidebar role="manager" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto mb-4" />
            <p className="text-slate-600">Loading team performance...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar role="manager" />
      <main className="flex-1 p-4 lg:p-8 pt-20 sm:pt-16 lg:pt-8 overflow-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Team Performance</h1>
            <p className="text-slate-500">Win rates, sales cycles, and quota attainment</p>
          </div>
          <Badge className="bg-purple-600 text-slate-900">This Quarter</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {teamPerformance.map((rep) => {
            const quotaPct = Math.round((rep.achieved / rep.quota) * 100);
            return (
              <Card key={rep.id} className="bg-white/5 border-white/10 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-slate-900 font-semibold flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-300" /> {rep.name}
                  </div>
                  <Badge className={quotaPct >= 100 ? 'bg-green-500/20 text-green-200' : 'bg-amber-500/20 text-amber-200'}>
                    {quotaPct}% quota
                  </Badge>
                </div>
                <div className="text-sm text-slate-500">Win Rate</div>
                <div className="text-xl font-bold text-slate-900 mb-2">{rep.winRate}%</div>
                <div className="text-sm text-slate-500">Sales Cycle</div>
                <div className="text-xl font-bold text-slate-900 mb-2">{rep.cycle} days</div>
                <div className="mt-2">
                  <div className="text-xs text-slate-500 mb-1">Quota Attainment</div>
                  <Progress value={quotaPct} className="h-2" />
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ManagerPerformance;



