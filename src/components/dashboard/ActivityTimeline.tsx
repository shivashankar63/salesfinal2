import { Clock, Phone, FileText, CheckCircle2, Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { getActivities, getCurrentUser } from "@/lib/supabase";

interface Activity {
  id: string;
  type: "call" | "email" | "note" | "deal";
  title: string;
  description?: string;
  created_at: string;
  activity_type?: string;
}

const ActivityTimeline = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          const { data } = await getActivities(user.id);
          
          const formattedActivities = (data || []).map((activity: any) => {
            const type = activity.activity_type?.toLowerCase() || "note";
            return {
              id: activity.id,
              type: type as "call" | "email" | "note" | "deal",
              title: activity.description || "Activity",
              created_at: activity.created_at,
              activity_type: activity.activity_type,
            };
          });

          setActivities(formattedActivities.sort((a: any, b: any) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ).slice(0, 5)); // Last 5 activities
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "call": return <Phone className="w-4 h-4" />;
      case "email": return <FileText className="w-4 h-4" />;
      case "note": return <Clock className="w-4 h-4" />;
      case "deal": return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "call": return "bg-blue/10 text-blue";
      case "email": return "bg-purple/10 text-purple";
      case "note": return "bg-warning/10 text-warning";
      case "deal": return "bg-success/10 text-success";
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl shadow-soft p-6 animate-slide-up">
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
        <div className="flex items-center justify-center py-12">
          <Loader className="w-6 h-6 animate-spin text-primary mr-2" />
          <span className="text-muted-foreground">Loading activities...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-soft p-6 animate-slide-up">
      <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{formatTime(activity.created_at)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground text-sm py-4">No activities yet</p>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;
