import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Mail, ArrowUpRight, Flame } from "lucide-react";

const leads = [
  { name: "Acme Corp", contact: "Jane Johnson", email: "jane@acme.com", phone: "+1-555-2100", value: 32000, stage: "Qualified", score: "Hot" },
  { name: "Globex", contact: "Mark Riley", email: "mark@globex.com", phone: "+1-555-2101", value: 18000, stage: "Negotiation", score: "Warm" },
  { name: "Umbrella", contact: "Sara Lee", email: "sara@umbrella.com", phone: "+1-555-2102", value: 27000, stage: "Proposal", score: "Hot" },
  { name: "Initech", contact: "Peter Gibbons", email: "peter@initech.com", phone: "+1-555-2103", value: 15000, stage: "Discovery", score: "Warm" },
];

const stageColors: Record<string, string> = {
  Discovery: "bg-amber-100 text-amber-800",
  Qualified: "bg-green-100 text-green-800",
  Proposal: "bg-blue-100 text-blue-800",
  Negotiation: "bg-purple-100 text-purple-800",
};

const scoreColors: Record<string, string> = {
  Hot: "bg-red-100 text-red-700",
  Warm: "bg-orange-100 text-orange-700",
  Cold: "bg-slate-100 text-slate-700",
};

const SalesMyLeads = () => {
  const totalValue = leads.reduce((s, l) => s + l.value, 0);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <DashboardSidebar role="salesman" />
      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Leads</h1>
            <p className="text-gray-500">Focus on the hottest opportunities first</p>
          </div>
          <div className="bg-white shadow-sm rounded-xl px-4 py-2 text-sm text-gray-700 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" /> ${totalValue.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leads.map((lead) => (
            <Card key={lead.name} className="p-4 bg-white border border-orange-100 shadow-soft">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-orange-500 text-white font-semibold">
                      {lead.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{lead.name}</div>
                    <div className="text-sm text-gray-500">{lead.contact}</div>
                  </div>
                </div>
                <Badge className={`${stageColors[lead.stage]} border-0`}>{lead.stage}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" />{lead.email}</div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" />{lead.phone}</div>
                <div className="text-gray-500">Value</div>
                <div className="text-gray-900 font-semibold">${lead.value.toLocaleString()}</div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Badge className={`${scoreColors[lead.score]} border-0`}>{lead.score} fit</Badge>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
                  <ArrowUpRight className="w-4 h-4" /> Advance Stage
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SalesMyLeads;
