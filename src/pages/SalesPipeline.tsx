import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Clock, CheckCircle2 } from "lucide-react";

const stages = [
  { name: "Discovery", leads: 8, value: 42000, sla: "24h", progress: 35 },
  { name: "Qualified", leads: 5, value: 38000, sla: "48h", progress: 55 },
  { name: "Proposal", leads: 3, value: 29000, sla: "3d", progress: 70 },
  { name: "Negotiation", leads: 2, value: 25000, sla: "5d", progress: 85 },
  { name: "Won", leads: 4, value: 51000, sla: "-", progress: 100 },
];

const SalesPipeline = () => {
  const totalValue = stages.reduce((s, st) => s + st.value, 0);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <DashboardSidebar role="salesman" />
      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pipeline</h1>
            <p className="text-gray-500">Track where every deal stands</p>
          </div>
          <Badge className="bg-orange-100 text-orange-700 border-0">Total ${totalValue.toLocaleString()}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stages.map((stage) => (
            <Card key={stage.name} className="p-4 bg-white border border-orange-100 shadow-soft">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-lg font-semibold text-gray-900">{stage.name}</div>
                  <div className="text-sm text-gray-500">{stage.leads} leads</div>
                </div>
                <Badge className="bg-orange-50 text-orange-700 border-0">${stage.value.toLocaleString()}</Badge>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2"><Target className="w-4 h-4 text-orange-500" /> Momentum: {stage.progress}%</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-orange-500" /> SLA: {stage.sla}</div>
                {stage.progress === 100 && (
                  <div className="flex items-center gap-2 text-green-600"><CheckCircle2 className="w-4 h-4" /> Closed won</div>
                )}
              </div>

              <Progress value={stage.progress} className="h-2" />
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SalesPipeline;
