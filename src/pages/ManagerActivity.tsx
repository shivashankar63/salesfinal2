import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Phone, Mail, FileText, CheckCircle2 } from "lucide-react";

const activityLog = [
  { id: 1, type: "call", title: "Called Jane @ Globex", owner: "Sam", time: "09:10" },
  { id: 2, type: "email", title: "Sent proposal to Acme", owner: "Sally", time: "10:20" },
  { id: 3, type: "note", title: "Notes added for Umbrella", owner: "Emma", time: "11:05" },
  { id: 4, type: "deal", title: "Closed won - Initech", owner: "Steve", time: "12:40" },
];

const iconMap: Record<string, any> = {
  call: Phone,
  email: Mail,
  note: FileText,
  deal: CheckCircle2,
};

const colorMap: Record<string, string> = {
  call: "bg-blue-500/15 text-blue-300 border-blue-500/20",
  email: "bg-amber-500/15 text-amber-200 border-amber-500/20",
  note: "bg-slate-500/15 text-slate-200 border-slate-500/20",
  deal: "bg-green-500/15 text-green-200 border-green-500/20",
};

const ManagerActivity = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <DashboardSidebar role="manager" />
      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Activity Log</h1>
            <p className="text-slate-400">Recent calls, emails, notes and deals</p>
          </div>
          <div className="text-slate-400 flex items-center gap-2"><Clock className="w-4 h-4" /> Today</div>
        </div>

        <Card className="p-4 bg-white/5 border-white/10">
          <div className="space-y-3">
            {activityLog.map((item) => {
              const Icon = iconMap[item.type];
              return (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <Badge className={colorMap[item.type]} variant="outline">
                      <Icon className="w-4 h-4" />
                    </Badge>
                    <div>
                      <div className="text-white font-medium">{item.title}</div>
                      <div className="text-xs text-slate-400">Owner: {item.owner}</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">{item.time}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ManagerActivity;
