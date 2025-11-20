import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockIssues } from "@/mock-data/issues";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { MapView } from "@/components/MapView";
import { ArrowLeft, User, Phone, MapPin, Calendar } from "lucide-react";
import { IssueStatus, Department } from "@/types";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function IssueDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const issue = mockIssues.find((i) => i.id === id);

  const [selectedDepartment, setSelectedDepartment] = useState<Department | "">(
    issue?.assignedTo?.department || ""
  );
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [newStatus, setNewStatus] = useState<IssueStatus>(issue?.status || "NEW");
  const [notes, setNotes] = useState("");

  if (!issue) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Issue not found</h2>
        <Link to="/issues">
          <Button variant="outline">Back to Issues</Button>
        </Link>
      </div>
    );
  }

  const handleAssign = () => {
    if (!selectedDepartment || !selectedOfficer) {
      toast.error("Please select department and officer");
      return;
    }
    toast.success(`Issue assigned to ${selectedDepartment} - ${selectedOfficer}`);
  };

  const handleStatusUpdate = () => {
    if (!notes.trim()) {
      toast.error("Please add notes for status update");
      return;
    }
    toast.success(`Status updated to ${newStatus}`);
    setNotes("");
  };

  // Mock officer list based on department
  const officers: Record<Department, string[]> = {
    ROADS: ["Ajay Verma", "Sunil Kumar", "Rakesh Singh"],
    SANITATION: ["Amit Singh", "Santosh Kumar", "Ravi Sharma"],
    WATER: ["Ravi Mishra", "Suresh Pandey", "Manoj Tiwari"],
    ELECTRICITY: ["Manoj Yadav", "Vijay Kumar", "Rajesh Gupta"],
    OTHER: ["Prakash Jha", "Deepak Yadav", "Ankit Verma"],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/issues">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{t("issueDetails")}</h1>
          <p className="text-muted-foreground">{issue.id}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{issue.title}</CardTitle>
                <StatusBadge status={issue.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  {t("category")}
                </div>
                <div className="font-medium">{t(issue.category.toLowerCase())}</div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  {t("description")}
                </div>
                <p className="text-sm">{issue.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    <User className="h-4 w-4 inline mr-1" />
                    {t("reportedBy")}
                  </div>
                  <div className="text-sm">{issue.reporter.name}</div>
                  <div className="text-xs text-muted-foreground">
                    <Phone className="h-3 w-3 inline mr-1" />
                    {issue.reporter.phone}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    {t("reportedDate")}
                  </div>
                  <div className="text-sm">
                    {new Date(issue.reportedDate).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  {t("location")}
                </div>
                <div className="text-sm">
                  {issue.location.address}
                  <br />
                  {issue.location.ward}, {issue.location.city}
                </div>
              </div>

              {issue.images.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    {t("photos")}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {issue.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Issue ${idx + 1}`}
                        className="rounded-lg w-full h-32 object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("assignIssue")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("department")}</Label>
                <Select value={selectedDepartment} onValueChange={(v) => setSelectedDepartment(v as Department)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROADS">{t("roads")}</SelectItem>
                    <SelectItem value="SANITATION">{t("sanitation")}</SelectItem>
                    <SelectItem value="WATER">{t("water")}</SelectItem>
                    <SelectItem value="ELECTRICITY">{t("electricity")}</SelectItem>
                    <SelectItem value="OTHER">{t("other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedDepartment && (
                <div className="space-y-2">
                  <Label>{t("assignTo")}</Label>
                  <Select value={selectedOfficer} onValueChange={setSelectedOfficer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Officer" />
                    </SelectTrigger>
                    <SelectContent>
                      {officers[selectedDepartment].map((officer) => (
                        <SelectItem key={officer} value={officer}>
                          {officer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button onClick={handleAssign} className="w-full">
                {t("assign")}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("updateStatus")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("status")}</Label>
                <Select value={newStatus} onValueChange={(v) => setNewStatus(v as IssueStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">{t("new")}</SelectItem>
                    <SelectItem value="ACKNOWLEDGED">{t("acknowledged")}</SelectItem>
                    <SelectItem value="IN_PROGRESS">{t("inProgress")}</SelectItem>
                    <SelectItem value="RESOLVED">{t("resolved")}</SelectItem>
                    <SelectItem value="REJECTED">{t("rejected")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("notes")}</Label>
                <Textarea
                  placeholder="Add notes about this status update..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <Button onClick={handleStatusUpdate} className="w-full">
                {t("update")}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("location")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 rounded-lg overflow-hidden">
                <MapView lat={issue.location.lat} lng={issue.location.lng} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("statusHistory")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {issue.history.map((entry, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-primary" />
                      {idx < issue.history.length - 1 && (
                        <div className="h-full w-px bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={entry.status} />
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm font-medium">{entry.updatedBy}</div>
                      <div className="text-xs text-muted-foreground">{entry.department}</div>
                      {entry.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
