import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { getLeads, getUsers } from '@/lib/supabase';

interface TeamMember {
  id: string;
  email: string;
  full_name?: string;
}

interface LeadData {
  agent: string;
  target: number;
  achieved: number;
  deals: number;
}

const PerformanceChart = () => {
  const [data, setData] = useState<LeadData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const { data: users } = await getUsers();
        const { data: leads } = await getLeads();

        if (users && leads) {
          const performanceData = users.map((user: TeamMember) => {
            const userLeads = leads.filter((lead: any) => lead.assigned_to === user.id);
            const wonLeads = userLeads.filter((lead: any) => lead.status === 'won').length;
            const totalLeads = userLeads.length;
            
            return {
              agent: user.full_name || user.email.split('@')[0],
              target: 10,
              achieved: wonLeads,
              deals: totalLeads,
            };
          });

          setData(performanceData);
        }
      } catch (error) {
        console.error('Error fetching performance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  if (loading) {
    return (
      <div className="bg-card rounded-xl shadow-soft p-6 animate-slide-up">
        <h2 className="text-xl font-semibold text-foreground mb-4">Team Performance</h2>
        <div className="flex items-center justify-center py-12">
          <Loader className="w-6 h-6 animate-spin text-primary mr-2" />
          <span className="text-muted-foreground">Loading performance data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-soft p-6 animate-slide-up">
      <h2 className="text-xl font-semibold text-foreground mb-4">Team Performance</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis stroke="var(--color-muted-foreground)" />
          <YAxis stroke="var(--color-muted-foreground)" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar dataKey="target" fill="var(--color-muted-foreground)" radius={[8, 8, 0, 0]} />
          <Bar dataKey="achieved" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
          <Bar dataKey="deals" fill="var(--color-secondary)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
