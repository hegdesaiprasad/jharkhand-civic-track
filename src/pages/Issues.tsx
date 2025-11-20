import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { IssueCategory, IssueStatus, Department } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Link } from "react-router-dom";
import { Search, Filter, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { issuesAPI } from "@/services/api";

export default function Issues() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "ALL">("ALL");
  const [departmentFilter, setDepartmentFilter] = useState<Department | "ALL">("ALL");

  // Fetch issues from API
  const { data: issues = [], isLoading, error } = useQuery({
    queryKey: ["issues", categoryFilter, statusFilter],
    queryFn: () => issuesAPI.getAll({
      category: categoryFilter !== "ALL" ? categoryFilter : undefined,
      status: statusFilter !== "ALL" ? statusFilter : undefined,
    }),
  });

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      searchQuery === "" ||
      issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      departmentFilter === "ALL" || issue.assignedTo?.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  const formatAge = (hours: number) => {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (days > 0) {
      return `${days}d ${remainingHours}h`;
    }
    return `${remainingHours}h`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("issues")}</h1>
        <p className="text-muted-foreground">Manage and track all reported civic issues</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t("filters")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as IssueCategory | "ALL")}>
              <SelectTrigger>
                <SelectValue placeholder={t("category")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t("all")}</SelectItem>
                <SelectItem value="POTHOLES">{t("potholes")}</SelectItem>
                <SelectItem value="GARBAGE">{t("garbage")}</SelectItem>
                <SelectItem value="STREETLIGHTS">{t("streetlights")}</SelectItem>
                <SelectItem value="WATER">{t("water")}</SelectItem>
                <SelectItem value="SEWAGE">{t("sewage")}</SelectItem>
                <SelectItem value="OTHER">{t("other")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as IssueStatus | "ALL")}>
              <SelectTrigger>
                <SelectValue placeholder={t("status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t("all")}</SelectItem>
                <SelectItem value="NEW">{t("new")}</SelectItem>
                <SelectItem value="ACKNOWLEDGED">{t("acknowledged")}</SelectItem>
                <SelectItem value="IN_PROGRESS">{t("inProgress")}</SelectItem>
                <SelectItem value="RESOLVED">{t("resolved")}</SelectItem>
                <SelectItem value="REJECTED">{t("rejected")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={(v) => setDepartmentFilter(v as Department | "ALL")}>
              <SelectTrigger>
                <SelectValue placeholder={t("department")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t("all")}</SelectItem>
                <SelectItem value="ROADS">{t("roads")}</SelectItem>
                <SelectItem value="SANITATION">{t("sanitation")}</SelectItem>
                <SelectItem value="WATER">{t("water")}</SelectItem>
                <SelectItem value="ELECTRICITY">{t("electricity")}</SelectItem>
                <SelectItem value="OTHER">{t("other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {filteredIssues.length} {t("issues")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading issues...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              Error loading issues. Please try again.
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No issues found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("issueId")}</TableHead>
                  <TableHead>{t("category")}</TableHead>
                  <TableHead>{t("title")}</TableHead>
                  <TableHead>{t("location")}</TableHead>
                  <TableHead>{t("reportedDate")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("assignedDept")}</TableHead>
                  <TableHead>{t("age")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className="font-mono text-sm">{issue.id}</TableCell>
                    <TableCell>{t(issue.category.toLowerCase())}</TableCell>
                    <TableCell className="max-w-xs truncate">{issue.title}</TableCell>
                    <TableCell>
                      <div className="text-sm">{issue.location.city}</div>
                      <div className="text-xs text-muted-foreground">{issue.location.ward}</div>
                    </TableCell>
                    <TableCell>
                      {new Date(issue.reportedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={issue.status} />
                    </TableCell>
                    <TableCell>
                      {issue.assignedTo ? t(issue.assignedTo.department.toLowerCase()) : "-"}
                    </TableCell>
                    <TableCell>
                      <span className={issue.slaBreached ? "text-destructive font-medium" : ""}>
                        {formatAge(issue.ageInHours)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/issues/${issue.id}`}>
                        <Button variant="outline" size="sm">
                          {t("viewDetails")}
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
