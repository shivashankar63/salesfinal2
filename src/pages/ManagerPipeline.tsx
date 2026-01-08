import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Target, DollarSign, Timer, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const stages = [
  { name: "New", count: 22, value: 260000, sla: "1d" },
  { name: "Qualified", count: 14, value: 340000, sla: "3d" },
  { name: "Proposal", count: 9, value: 280000, sla: "5d" },
  { name: "Negotiation", count: 6, value: 190000, sla: "7d" },
  { name: "Closed Won", count: 5, value: 175000, sla: "-" },
];

const ManagerPipeline = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <DashboardSidebar role="manager" />
      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Lead Pipeline</h1>
            <p className="text-slate-400">Stage-wise breakdown with value and SLA</p>
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <Filter className="w-4 h-4" /> Current Quarter
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {stages.map((stage) => {
            const pct = Math.min(100, Math.round((stage.value / 400000) * 100));
            return (
              <Card key={stage.name} className="bg-white/5 border-white/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-semibold flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-300" /> {stage.name}
                  </div>
                  <Badge variant="outline" className="text-slate-300 border-white/10">{stage.count} deals</Badge>
                </div>
                <div className="text-sm text-slate-400 mb-1">Value: ${(stage.value/1000).toFixed(0)}K</div>
                <Progress value={pct} className="h-2 mb-2" />
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Timer className="w-3 h-3" /> SLA: {stage.sla}
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ManagerPipeline;
