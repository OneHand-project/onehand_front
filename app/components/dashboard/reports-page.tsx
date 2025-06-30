import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { Download, Calendar, Shield } from "lucide-react";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { useState } from "react";

// Mock report data
const reportData = {
  userGrowth: [
    { month: "Jan", users: 980, newUsers: 45 },
    { month: "Feb", users: 1020, newUsers: 40 },
    { month: "Mar", users: 1050, newUsers: 30 },
    { month: "Apr", users: 1089, newUsers: 39 },
    { month: "May", users: 1125, newUsers: 36 },
    { month: "Jun", users: 1247, newUsers: 122 },
  ],
  roleActivity: [
    { role: "Admin", logins: 245, actions: 1250 },
    { role: "Manager", logins: 567, actions: 2340 },
    { role: "Editor", logins: 890, actions: 4560 },
    { role: "Viewer", logins: 1234, actions: 2890 },
    { role: "Guest", logins: 456, actions: 234 },
  ],
  securityEvents: [
    { type: "Failed Login", count: 23, severity: "medium" },
    { type: "Permission Denied", count: 8, severity: "low" },
    { type: "Role Changed", count: 12, severity: "high" },
    { type: "Account Locked", count: 3, severity: "high" },
  ],
};

const campaignReports = [
  {
    id: 1,
    campaignName: "Summer Sale 2024",
    submittedBy: "john_doe",
    submitterEmail: "john.doe@example.com",
    submittedDate: "2024-01-15 14:30",
    status: "pending",
    reportType: "Performance Review",
    summary: "Campaign exceeded expectations with 15% conversion rate",
    metrics: {
      reach: 4567,
      conversions: 685,
      revenue: 45000,
      roi: 180,
    },
    attachments: ["campaign_analytics.pdf", "performance_summary.xlsx"],
    comments:
      "Please review the attached performance metrics. The campaign performed better than projected.",
  },
  {
    id: 2,
    campaignName: "Product Launch Campaign",
    submittedBy: "jane_smith",
    submitterEmail: "jane.smith@example.com",
    submittedDate: "2024-01-14 09:15",
    status: "approved",
    reportType: "Final Report",
    summary: "Successful product launch with strong initial response",
    metrics: {
      reach: 2890,
      conversions: 234,
      revenue: 28000,
      roi: 120,
    },
    attachments: ["launch_report.pdf"],
    comments: "Campaign completed successfully. All objectives met.",
    reviewedBy: "admin",
    reviewedDate: "2024-01-14 16:20",
    reviewComments:
      "Excellent work on the launch campaign. Approved for final processing.",
  },
  {
    id: 3,
    campaignName: "Holiday Special",
    submittedBy: "bob_wilson",
    submitterEmail: "bob.wilson@example.com",
    submittedDate: "2024-01-13 11:45",
    status: "rejected",
    reportType: "Mid-Campaign Review",
    summary: "Campaign underperforming, requesting budget adjustment",
    metrics: {
      reach: 3200,
      conversions: 89,
      revenue: 12000,
      roi: 60,
    },
    attachments: ["mid_campaign_analysis.pdf"],
    comments:
      "Campaign is not meeting targets. Requesting additional budget allocation.",
    reviewedBy: "admin",
    reviewedDate: "2024-01-13 15:30",
    reviewComments:
      "Budget allocation not justified based on current performance. Please optimize current spend first.",
  },
  {
    id: 4,
    campaignName: "Referral Program",
    submittedBy: "alice_brown",
    submitterEmail: "alice.brown@example.com",
    submittedDate: "2024-01-12 16:20",
    status: "pending",
    reportType: "Weekly Update",
    summary: "Strong referral growth, exceeding weekly targets",
    metrics: {
      reach: 1456,
      conversions: 234,
      revenue: 18500,
      roi: 155,
    },
    attachments: ["weekly_referral_stats.xlsx"],
    comments:
      "Referral program showing excellent results. Weekly targets exceeded by 25%.",
  },
  {
    id: 5,
    campaignName: "Newsletter Signup Drive",
    submittedBy: "charlie_davis",
    submitterEmail: "charlie.davis@example.com",
    submittedDate: "2024-01-11 13:10",
    status: "pending",
    reportType: "Completion Report",
    summary: "Campaign completed with mixed results",
    metrics: {
      reach: 5600,
      conversions: 420,
      revenue: 8400,
      roi: 105,
    },
    attachments: ["completion_summary.pdf", "subscriber_analysis.xlsx"],
    comments:
      "Campaign completed. Results were mixed but within acceptable range.",
  },
];

export function ReportsPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCampaignReports = campaignReports.filter((report) => {
    if (statusFilter === "all") return true;
    return report.status === statusFilter;
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and reporting
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="user-reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="user-reports">User Reports</TabsTrigger>
          <TabsTrigger value="campaign-reviews">Campaign Reviews</TabsTrigger>
          <TabsTrigger value="security-reports">Security Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="user-reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth Trend</CardTitle>
                <CardDescription>
                  Monthly user acquisition and total users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    users: {
                      label: "Total Users",
                      color: "hsl(var(--chart-1))",
                    },
                    newUsers: {
                      label: "New Users",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reportData.userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="var(--color-users)"
                        name="Total Users"
                      />
                      <Line
                        type="monotone"
                        dataKey="newUsers"
                        stroke="var(--color-newUsers)"
                        name="New Users"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Role Activity</CardTitle>
                <CardDescription>
                  Login frequency and actions by role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    logins: { label: "Logins", color: "hsl(var(--chart-1))" },
                    actions: { label: "Actions", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportData.roleActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="role" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="logins"
                        fill="var(--color-logins)"
                        name="Logins"
                      />
                      <Bar
                        dataKey="actions"
                        fill="var(--color-actions)"
                        name="Actions"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaign-reviews" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Campaign Report Reviews</h2>
              <p className="text-sm text-muted-foreground">
                Review and approve campaign reports submitted by team members
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Filter by status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">
                  All Reports ({campaignReports.length})
                </option>
                <option value="pending">
                  Pending (
                  {campaignReports.filter((r) => r.status === "pending").length}
                  )
                </option>
                <option value="approved">
                  Approved (
                  {
                    campaignReports.filter((r) => r.status === "approved")
                      .length
                  }
                  )
                </option>
                <option value="rejected">
                  Rejected (
                  {
                    campaignReports.filter((r) => r.status === "rejected")
                      .length
                  }
                  )
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaignReports.filter((r) => r.status === "pending").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  awaiting approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {
                    campaignReports.filter((r) => r.status === "approved")
                      .length
                  }
                </div>
                <p className="text-xs text-muted-foreground">this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {
                    campaignReports.filter((r) => r.status === "rejected")
                      .length
                  }
                </div>
                <p className="text-xs text-muted-foreground">needs revision</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Review Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4h</div>
                <p className="text-xs text-muted-foreground">
                  average response
                </p>
              </CardContent>
            </Card>
          </div>

          {filteredCampaignReports.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="text-muted-foreground mb-2">
                    No reports found
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {statusFilter === "all"
                      ? "No campaign reports available"
                      : `No ${statusFilter} reports at this time`}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>
                  {statusFilter === "all"
                    ? "All Campaign Reports"
                    : `${
                        statusFilter.charAt(0).toUpperCase() +
                        statusFilter.slice(1)
                      } Reports`}
                </CardTitle>
                <CardDescription>
                  Showing {filteredCampaignReports.length} of{" "}
                  {campaignReports.length} reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredCampaignReports.map((report) => (
                  <div
                    key={report.id}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {report.campaignName}
                          </h3>
                          <Badge
                            className={
                              report.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : report.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {report.status}
                          </Badge>
                          <Badge variant="outline">{report.reportType}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Submitted by {report.submittedBy} (
                          {report.submitterEmail}) on {report.submittedDate}
                        </p>
                      </div>
                      {report.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Report Summary</h4>
                        <p className="text-sm text-muted-foreground">
                          {report.summary}
                        </p>

                        <h4 className="font-medium mt-4 mb-2">Comments</h4>
                        <p className="text-sm text-muted-foreground">
                          {report.comments}
                        </p>

                        {report.attachments && (
                          <>
                            <h4 className="font-medium mt-4 mb-2">
                              Attachments
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {report.attachments.map((file, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  📎 {file}
                                </Badge>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">
                          Performance Metrics
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="font-medium">
                              {report.metrics.reach.toLocaleString()}
                            </div>
                            <div className="text-muted-foreground">Reach</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="font-medium">
                              {report.metrics.conversions}
                            </div>
                            <div className="text-muted-foreground">
                              Conversions
                            </div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="font-medium">
                              ${report.metrics.revenue.toLocaleString()}
                            </div>
                            <div className="text-muted-foreground">Revenue</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <div
                              className={`font-medium ${
                                report.metrics.roi > 100
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {report.metrics.roi}%
                            </div>
                            <div className="text-muted-foreground">ROI</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {(report.status === "approved" ||
                      report.status === "rejected") &&
                      report.reviewComments && (
                        <Alert
                          className={
                            report.status === "approved"
                              ? "border-green-200 bg-green-50"
                              : "border-red-200 bg-red-50"
                          }
                        >
                          <AlertDescription>
                            <div className="space-y-1">
                              <div className="font-medium">
                                {report.status === "approved"
                                  ? "✅ Approved"
                                  : "❌ Rejected"}{" "}
                                by {report.reviewedBy} on {report.reviewedDate}
                              </div>
                              <div className="text-sm">
                                {report.reviewComments}
                              </div>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="security-reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Events</CardTitle>
                <CardDescription>
                  Recent security incidents and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reportData.securityEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{event.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          event.severity === "high"
                            ? "destructive"
                            : event.severity === "medium"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {event.severity}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {event.count} events
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Metrics</CardTitle>
                <CardDescription>Key security indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      98.5%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Login Success Rate
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">23</div>
                    <div className="text-sm text-muted-foreground">
                      Failed Attempts
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">12</div>
                    <div className="text-sm text-muted-foreground">
                      Role Changes
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600">3</div>
                    <div className="text-sm text-muted-foreground">
                      Locked Accounts
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
