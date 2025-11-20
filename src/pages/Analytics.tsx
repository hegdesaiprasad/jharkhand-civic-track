import { useLanguage } from "@/contexts/LanguageContext";
import { KpiCard } from "@/components/KpiCard";
import { FileText, CheckCircle2, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockIssues } from "@/mock-data/issues";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapView } from "@/components/MapView";
import { useState } from "react";

export default function Analytics() {
  const { t } = useLanguage();
  const [selectedCity] = useState("Ranchi");

  const kpiData = {
    totalIssues: mockIssues.length,
    resolvedIssues: mockIssues.filter((i) => i.status === "RESOLVED").length,
    avgResponseTime: "4.2h",
    avgResolutionTime: "36h",
    openSLABreached: mockIssues.filter((i) => i.slaBreached && i.status !== "RESOLVED").length,
  };

  // Issues by category
  const categoryData = [
    { name: t("potholes"), value: mockIssues.filter((i) => i.category === "POTHOLES").length, color: "hsl(var(--chart-1))" },
    { name: t("garbage"), value: mockIssues.filter((i) => i.category === "GARBAGE").length, color: "hsl(var(--chart-2))" },
    { name: t("streetlights"), value: mockIssues.filter((i) => i.category === "STREETLIGHTS").length, color: "hsl(var(--chart-3))" },
    { name: t("water"), value: mockIssues.filter((i) => i.category === "WATER").length, color: "hsl(var(--chart-4))" },
    { name: t("sewage"), value: mockIssues.filter((i) => i.category === "SEWAGE").length, color: "hsl(var(--chart-5))" },
  ];

  // Issues reported per day (last 7 days)
  const dailyData = [
    { day: "Nov 13", issues: 3 },
    { day: "Nov 14", issues: 2 },
    { day: "Nov 15", issues: 4 },
    { day: "Nov 16", issues: 5 },
    { day: "Nov 17", issues: 3 },
    { day: "Nov 18", issues: 6 },
    { day: "Nov 19", issues: 4 },
  ];

  // Department performance
  const deptPerformance = [
    {
      department: t("roads"),
      issuesHandled: mockIssues.filter((i) => i.assignedTo?.department === "ROADS").length,
      avgResolutionTime: "42h",
      resolvedPercentage: 67,
    },
    {
      department: t("sanitation"),
      issuesHandled: mockIssues.filter((i) => i.assignedTo?.department === "SANITATION").length,
      avgResolutionTime: "28h",
      resolvedPercentage: 75,
    },
    {
      department: t("water"),
      issuesHandled: mockIssues.filter((i) => i.assignedTo?.department === "WATER").length,
      avgResolutionTime: "36h",
      resolvedPercentage: 80,
    },
    {
      department: t("electricity"),
      issuesHandled: mockIssues.filter((i) => i.assignedTo?.department === "ELECTRICITY").length,
      avgResolutionTime: "52h",
      resolvedPercentage: 60,
    },
  ];

  // Get issues for map (filtering by selected city)
  const cityIssues = mockIssues.filter((i) => i.location.city === selectedCity);
  const centerLat = cityIssues.reduce((sum, i) => sum + i.location.lat, 0) / cityIssues.length;
  const centerLng = cityIssues.reduce((sum, i) => sum + i.location.lng, 0) / cityIssues.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("analytics")}</h1>
        <p className="text-muted-foreground">Performance metrics and data visualization</p>
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("issuesReportedPerDay")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="issues"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("issuesByCategory")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("departmentPerformance")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deptPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="department" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar dataKey="issuesHandled" fill="hsl(var(--primary))" name={t("issuesHandled")} />
              <Bar dataKey="resolvedPercentage" fill="hsl(var(--success))" name={t("resolvedPercentage")} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Issue Heat Map - {selectedCity}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 rounded-lg overflow-hidden">
            <MapView lat={centerLat} lng={centerLng} zoom={13} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("reports")} - {t("departmentPerformance")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("department")}</TableHead>
                <TableHead>{t("issuesHandled")}</TableHead>
                <TableHead>{t("resolvedPercentage")}</TableHead>
                <TableHead>{t("avgResolutionTime")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deptPerformance.map((dept) => (
                <TableRow key={dept.department}>
                  <TableCell className="font-medium">{dept.department}</TableCell>
                  <TableCell>{dept.issuesHandled}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-success h-full"
                          style={{ width: `${dept.resolvedPercentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{dept.resolvedPercentage}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{dept.avgResolutionTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
