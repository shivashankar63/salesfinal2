import { Search, Filter, ChevronDown, Phone, MessageSquare, MoreHorizontal, Loader, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getLeads, getCurrentUser, supabase } from "@/lib/supabase";

interface Lead {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email?: string;
  contact_phone?: string;
  status: "new" | "qualified" | "negotiation" | "won" | "lost";
  value: number;
  assigned_to?: string;
}

const SalesmanLeadsTable = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState("");
  const [noteText, setNoteText] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          const { data } = await getLeads({ assignedTo: user.id });
          setLeads(data || []);
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = lead.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.contact_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Lead["status"]) => {
    const styles = {
      new: "bg-blue/10 text-blue border-blue/20",
      contacted: "bg-purple/10 text-purple border-purple/20",
      negotiation: "bg-warning/10 text-warning border-warning/20",
      won: "bg-success/10 text-success border-success/20",
      lost: "bg-destructive/10 text-destructive border-destructive/20",
    };

    const labels = {
      new: "New",
      contacted: "Contacted",
      negotiation: "Negotiation",
      won: "Won",
      lost: "Lost",
    };

    return (
      <Badge variant="outline" className={styles[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const handleCallLead = (lead: Lead) => {
    if (lead.contact_phone) {
      window.location.href = `tel:${lead.contact_phone}`;
    } else {
      alert("No phone number available for this lead");
    }
  };

  const handleMessageLead = (lead: Lead) => {
    if (lead.contact_email) {
      window.location.href = `mailto:${lead.contact_email}`;
    } else if (lead.contact_phone) {
      window.location.href = `sms:${lead.contact_phone}`;
    } else {
      alert("No contact information available for this lead");
    }
  };

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailsModal(true);
  };

  const handleEditClick = (lead: Lead) => {
    setSelectedLead(lead);
    setEditingStatus(lead.status);
    setUpdateMessage(null);
    setShowEditModal(true);
  };

  const handleAddNote = (lead: Lead) => {
    setSelectedLead(lead);
    setNoteText("");
    setUpdateMessage(null);
    setShowNoteModal(true);
  };

  const handleUpdateLead = async () => {
    if (!selectedLead) return;
    
    setUpdateLoading(true);
    setUpdateMessage(null);

    try {
      const { error } = await supabase
        .from("leads")
        .update({
          status: editingStatus,
        })
        .eq("id", selectedLead.id);

      if (error) {
        setUpdateMessage({ type: "error", text: error.message });
      } else {
        setUpdateMessage({ type: "success", text: "Lead updated successfully!" });
        
        // Update local state
        setLeads(leads.map(lead => 
          lead.id === selectedLead.id 
            ? { ...lead, status: editingStatus as any }
            : lead
        ));

        setTimeout(() => {
          setShowEditModal(false);
          setSelectedLead(null);
        }, 1500);
      }
    } catch (error: any) {
      setUpdateMessage({ type: "error", text: error.message });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleAddNoteSubmit = async () => {
    if (!selectedLead || !noteText.trim()) {
      alert("Please enter a note");
      return;
    }
    
    setUpdateLoading(true);
    setUpdateMessage(null);

    try {
      // Create activity record for the note
      const { error } = await supabase
        .from("activities")
        .insert([{
          user_id: (await getCurrentUser())?.id,
          lead_id: selectedLead.id,
          type: "note",
          description: noteText,
          created_at: new Date().toISOString(),
        }]);

      if (error) {
        setUpdateMessage({ type: "error", text: error.message });
      } else {
        setUpdateMessage({ type: "success", text: "Note added successfully!" });
        
        setTimeout(() => {
          setShowNoteModal(false);
          setSelectedLead(null);
          setNoteText("");
        }, 1500);
      }
    } catch (error: any) {
      setUpdateMessage({ type: "error", text: error.message });
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-soft p-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-foreground">My Leads</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                {statusFilter === "all" ? "All Status" : statusFilter}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("new")}>
                New
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("qualified")}>
                Qualified
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("negotiation")}>
                Negotiation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("won")}>
                Won
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("lost")}>
                Lost
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-6 h-6 animate-spin text-primary mr-2" />
          <span className="text-muted-foreground">Loading leads...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Lead</th>
                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">Value</th>
                <th className="text-center py-3 px-4 font-medium text-sm text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
                            {lead.company_name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">{lead.company_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-foreground">{lead.contact_name}</div>
                      {lead.contact_email && (
                        <div className="text-xs text-muted-foreground">{lead.contact_email}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(lead.status)}</td>
                    <td className="py-3 px-4 text-right text-sm font-semibold text-foreground">
                      ${(lead.value / 1000).toFixed(0)}K
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-primary/10" 
                          title="Call"
                          onClick={() => handleCallLead(lead)}
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-primary/10" 
                          title="Message"
                          onClick={() => handleMessageLead(lead)}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditClick(lead)}>Edit Lead</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewDetails(lead)}>View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClick(lead)}>Change Status</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAddNote(lead)}>Add Note</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No leads found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Company Name</Label>
                <p className="text-sm font-medium text-foreground mt-1">{selectedLead.company_name}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Contact Name</Label>
                <p className="text-sm font-medium text-foreground mt-1">{selectedLead.contact_name}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Email</Label>
                <p className="text-sm font-medium text-foreground mt-1">{selectedLead.contact_email || "N/A"}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Phone</Label>
                <p className="text-sm font-medium text-foreground mt-1">{selectedLead.contact_phone || "N/A"}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Status</Label>
                <p className="text-sm font-medium text-foreground mt-1">{selectedLead.status}</p>
              </div>
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Value</Label>
                <p className="text-sm font-medium text-foreground mt-1">${(selectedLead.value / 1000).toFixed(0)}K</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Lead Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Lead - {selectedLead?.company_name}</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              {updateMessage && (
                <Alert className={updateMessage.type === "success" ? "bg-success/10 border-success/20" : "bg-destructive/10 border-destructive/20"}>
                  <AlertDescription className={updateMessage.type === "success" ? "text-success" : "text-destructive"}>
                    {updateMessage.text}
                  </AlertDescription>
                </Alert>
              )}
              
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={editingStatus}
                  onChange={(e) => setEditingStatus(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground"
                >
                  <option value="new">New</option>
                  <option value="qualified">Qualified</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowEditModal(false)}
              disabled={updateLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateLead}
              disabled={updateLoading}
            >
              {updateLoading ? "Updating..." : "Update Lead"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note Modal */}
      <Dialog open={showNoteModal} onOpenChange={setShowNoteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Note - {selectedLead?.company_name}</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              {updateMessage && (
                <Alert className={updateMessage.type === "success" ? "bg-success/10 border-success/20" : "bg-destructive/10 border-destructive/20"}>
                  <AlertDescription className={updateMessage.type === "success" ? "text-success" : "text-destructive"}>
                    {updateMessage.text}
                  </AlertDescription>
                </Alert>
              )}
              
              <div>
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  placeholder="Enter your note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground"
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowNoteModal(false)}
              disabled={updateLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddNoteSubmit}
              disabled={updateLoading}
            >
              {updateLoading ? "Adding..." : "Add Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesmanLeadsTable;
