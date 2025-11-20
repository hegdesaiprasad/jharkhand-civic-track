import { useLanguage } from "@/contexts/LanguageContext";
import { KpiCard } from "@/components/KpiCard";
import { FileText, CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockIssues } from "@/mock-data/issues";
import { StatusBadge } from "@/components/StatusBadge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { t } = useLanguage();

  const kpiData = {
    totalIssues: mockIssues.length,
    resolvedIssues: mockIssues.filter((i) => i.status === "RESOLVED").length,
    avgResponseTime: "4.2h",
    avgResolutionTime: "36h",
    openSLABreached: mockIssues.filter((i) => i.slaBreached && i.status !== "RESOLVED").length,
  };

  const recentIssues = mockIssues.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
        <p className="text-muted-foreground">Overview of civic issues and performance metrics</p>
      </div>

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
        </CardContent>
      </Card>
    </div>
  );
}
