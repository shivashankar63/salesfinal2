import { useState, useEffect } from "react";
import { Plus, Loader, Briefcase } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser, getProjects, createProject } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ManagerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: "", description: "", budget: "" });
  const [creatingProject, setCreatingProject] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const projectsRes = await getProjects();
        const allProjects = projectsRes.data || [];
        
        setProjects(allProjects);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateProject = async () => {
    if (!projectForm.name) return;
    setCreatingProject(true);
    try {
      const { data } = await createProject({
        name: projectForm.name,
        description: projectForm.description,
        budget: projectForm.budget ? Number(projectForm.budget) : undefined,
        status: 'active',
      });
      const projectsRes = await getProjects();
      setProjects(projectsRes.data || []);
      setShowProjectModal(false);
      setProjectForm({ name: "", description: "", budget: "" });
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setCreatingProject(false);
    }
  };

if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <DashboardSidebar role="manager" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
            <p className="text-slate-300">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <DashboardSidebar role="manager" />
      
      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-slate-400">Manage your projects and campaigns</p>
        </div>

        <Card className="p-6 bg-white/5 border-white/10 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">All Projects</h2>
            </div>
            <Button onClick={() => setShowProjectModal(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="p-5 bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg mb-1">{project.name}</h3>
                      <Badge className="bg-purple-600 text-white border-purple-500/60">
                        {project.status || 'Active'}
                      </Badge>
                    </div>
                    <Briefcase className="w-5 h-5 text-purple-400" />
                  </div>
                  <p className="text-sm text-slate-400 mb-3">
                    {project.description || "No description provided"}
                  </p>
                  {project.budget && (
                    <div className="pt-3 border-t border-slate-700">
                      <p className="text-xs text-slate-500">Budget</p>
                      <p className="text-lg font-semibold text-purple-400">
                        ${Number(project.budget).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {project.created_at && (
                    <p className="text-xs text-slate-500 mt-2">
                      Created {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No projects yet. Create your first project to get started!</p>
              <Button onClick={() => setShowProjectModal(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create First Project
              </Button>
            </div>
          )}
        </Card>

        {/* Project Stats */}
        {projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 bg-white/5 border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Projects</p>
                  <p className="text-3xl font-bold text-white mt-1">{projects.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/20">
                  <Briefcase className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </Card>
            <Card className="p-5 bg-white/5 border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Projects</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {projects.filter(p => p.status === 'active').length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/20">
                  <Briefcase className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </Card>
            <Card className="p-5 bg-white/5 border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Budget</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    ${(projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0) / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </Card>
          </div>
        )}



        <Dialog open={showProjectModal} onOpenChange={setShowProjectModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="proj_name">Project Name</Label>
                <Input
                  id="proj_name"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  placeholder="Q1 Sales Campaign"
                />
              </div>
              <div>
                <Label htmlFor="proj_desc">Description</Label>
                <Input
                  id="proj_desc"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Project description"
                />
              </div>
              <div>
                <Label htmlFor="proj_budget">Budget (USD)</Label>
                <Input
                  id="proj_budget"
                  type="number"
                  value={projectForm.budget}
                  onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                  placeholder="150000"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowProjectModal(false)} disabled={creatingProject}>Cancel</Button>
              <Button onClick={handleCreateProject} disabled={creatingProject}>
                {creatingProject ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  );
};

export default ManagerDashboard;
