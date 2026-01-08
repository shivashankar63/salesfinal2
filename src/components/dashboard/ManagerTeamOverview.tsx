import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "busy";
  leads: number;
  conversion: number;
}

const teamMembers: TeamMember[] = [
  { id: "1", name: "Agent Smith", avatar: "AS", status: "online", leads: 28, conversion: 32 },
  { id: "2", name: "Agent Doe", avatar: "AD", status: "online", leads: 24, conversion: 28 },
  { id: "3", name: "Agent Brown", avatar: "AB", status: "busy", leads: 19, conversion: 25 },
  { id: "4", name: "Agent Wilson", avatar: "AW", status: "offline", leads: 15, conversion: 20 },
];

const ManagerTeamOverview = () => {
  const getStatusColor = (status: TeamMember["status"]) => {
    switch (status) {
      case "online": return "bg-success";
      case "busy": return "bg-warning";
      case "offline": return "bg-muted";
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-soft p-6 animate-slide-up">
      <h2 className="text-xl font-semibold text-foreground mb-4">Your Team</h2>
      <div className="space-y-3">
        {teamMembers.map((member) => (
          <div key={member.id} className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
                    {member.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${getStatusColor(member.status)} border border-card`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{member.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{member.status}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{member.leads} leads</span>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {member.conversion}%
              </Badge>
            </div>
          </div>
        ))}
      </div>
      <Button className="w-full mt-4">View Full Team</Button>
    </div>
  );
};

export default ManagerTeamOverview;
