import { useLanguage } from "@/contexts/LanguageContext";
import { KpiCard } from "@/components/KpiCard";
import { FileText, CheckCircle2, Clock, AlertCircle, TrendingUp, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { issuesAPI } from "@/services/api";

export default function Dashboard() {
  const { t } = useLanguage();

  // Fetch analytics data
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => issuesAPI.getAnalytics(),
  });

  // Fetch recent issues
  const { data: allIssues = [], isLoading: issuesLoading } = useQuery({
    queryKey: ["issues"],
    queryFn: () => issuesAPI.getAll(),
  });

  const kpiData = analyticsData?.kpi || {
    totalIssues: 0,
    resolvedIssues: 0,
    avgResponseTime: "0h",
    avgResolutionTime: "0h",
    openSLABreached: 0,
  };

  // Get 5 most recent issues
  const recentIssues = allIssues
    .sort((a, b) => new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime())
    .slice(0, 5);

  const isLoading = analyticsLoading || issuesLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
        <p className="text-muted-foreground">Overview of civic issues and performance metrics</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading dashboard data...</span>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <KpiCard
              title={t("totalIssues")}
              value={kpiData.totalIssues}
              icon={FileText}
              trend={{ value: "+12% from last month", positive: false }}
            />
            <KpiCard
              title={t("resolvedIssues")}
              value={kpiData.resolvedIssues}
              icon={CheckCircle2}
              trend={{ value: "+23% from last month", positive: true }}
            />
            <KpiCard
              title={t("avgResponseTime")}
              value={kpiData.avgResponseTime}
              icon={Clock}
              trend={{ value: "-15% from last month", positive: true }}
            />
            <KpiCard
              title={t("avgResolutionTime")}
              value={kpiData.avgResolutionTime}
              icon={TrendingUp}
            />
            <KpiCard
              title={t("openSLABreached")}
              value={kpiData.openSLABreached}
              icon={AlertCircle}
              trend={{ value: "+2 from last week", positive: false }}
            />
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Issues</CardTitle>
              <Link to="/issues">
                <Button variant="outline" size="sm">
                  {t("viewDetails")}
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentIssues.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No issues found. Create your first issue!
                </div>
              ) : (
                <div className="space-y-4">
                  {recentIssues.map((issue) => (
                    <Link key={issue.id} to={`/issues/${issue.id}`}>
                      <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                        <div className="flex-1">
                          <div className="font-medium">{issue.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {issue.location.address}, {issue.location.city}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-muted-foreground">{issue.id}</div>
                          <StatusBadge status={issue.status} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

