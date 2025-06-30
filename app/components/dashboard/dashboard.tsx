import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import {
  Users,
  Shield,
  Key,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  Database,
} from "lucide-react";

// Mock data based on the RBAC schema
const dashboardData = {
  overview: {
    totalUsers: 1247,
    totalRoles: 8,
    totalPermissions: 24,
    activeUsers: 1089,
    userGrowth: 12.5,
    securityScore: 87,
  },
  usersByRole: [
    { role: "Admin", count: 12, color: "#ef4444" },
    { role: "Manager", count: 45, color: "#f97316" },
    { role: "Editor", count: 156, color: "#eab308" },
    { role: "Viewer", count: 789, color: "#22c55e" },
    { role: "Guest", count: 245, color: "#6b7280" },
  ],
  permissionUsage: [
    { permission: "read", usage: 95 },
    { permission: "write", usage: 67 },
    { permission: "delete", usage: 23 },
    { permission: "admin", usage: 8 },
  ],
  userActivity: [
    { month: "Jan", active: 980, total: 1100 },
    { month: "Feb", active: 1020, total: 1150 },
    { month: "Mar", active: 1050, total: 1180 },
    { month: "Apr", active: 1089, total: 1247 },
  ],
  rolePermissions: [
    { role: "Admin", permissions: 24 },
    { role: "Manager", permissions: 18 },
    { role: "Editor", permissions: 12 },
    { role: "Viewer", permissions: 6 },
    { role: "Guest", permissions: 3 },
  ],
  securityMetrics: {
    usersWithMultipleRoles: 89,
    orphanedPermissions: 3,
    unusedRoles: 1,
    privilegedUsers: 57,
  },
};

const categoryData = [
  { category: "E-commerce", count: 345, color: "#ef4444" },
  { category: "Marketing", count: 289, color: "#f97316" },
  { category: "Analytics", count: 234, color: "#eab308" },
  { category: "Social Media", count: 198, color: "#22c55e" },
  { category: "Content", count: 156, color: "#6b7280" },
  { category: "Support", count: 89, color: "#8b5cf6" },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Role-Based Access Control Analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">Schema Analysis</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.overview.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">
                +{dashboardData.overview.userGrowth}%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.overview.totalRoles}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.securityMetrics.unusedRoles} unused role
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.overview.totalPermissions}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.securityMetrics.orphanedPermissions} orphaned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Security Score
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.overview.securityScore}%
            </div>
            <Progress
              value={dashboardData.overview.securityScore}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Most Used Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Most Used Categories</CardTitle>
                <CardDescription>
                  Distribution of usage across different categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    count: {
                      label: "Usage",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ category, count }) => `${category}: ${count}`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* User Activity Trend */}
            <Card>
              <CardHeader>
                <CardTitle>User Activity Trend</CardTitle>
                <CardDescription>
                  Active vs total users over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    active: {
                      label: "Active Users",
                      color: "hsl(var(--chart-1))",
                    },
                    total: {
                      label: "Total Users",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboardData.userActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="active"
                        stroke="var(--color-active)"
                        name="Active Users"
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="var(--color-total)"
                        name="Total Users"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Details */}
            <Card>
              <CardHeader>
                <CardTitle>Category Analysis</CardTitle>
                <CardDescription>
                  Detailed breakdown of category usage and engagement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryData.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{category.count} uses</Badge>
                      <span className="text-sm text-gray-500">
                        {(
                          (category.count /
                            categoryData.reduce((sum, c) => sum + c.count, 0)) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* User Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>User Statistics</CardTitle>
                <CardDescription>
                  Key metrics about user management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-green-600" />
                    <span>Active Users</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {dashboardData.overview.activeUsers}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>Multiple Roles</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {dashboardData.securityMetrics.usersWithMultipleRoles}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-orange-600" />
                    <span>Privileged Users</span>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">
                    {dashboardData.securityMetrics.privilegedUsers}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Permission Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Permission Usage</CardTitle>
                <CardDescription>
                  How frequently different permissions are used
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    usage: {
                      label: "Usage %",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.permissionUsage}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="permission" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="usage" fill="var(--color-usage)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Role Permissions Matrix */}
            <Card>
              <CardHeader>
                <CardTitle>Role-Permission Matrix</CardTitle>
                <CardDescription>
                  Number of permissions per role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    permissions: {
                      label: "Permissions",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData.rolePermissions}
                      layout="horizontal"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="role" type="category" width={80} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="permissions"
                        fill="var(--color-permissions)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Security Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  Security Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">
                    Orphaned Permissions
                  </p>
                  <p className="text-xs text-yellow-600">
                    {dashboardData.securityMetrics.orphanedPermissions}{" "}
                    permissions not assigned to any role
                  </p>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    Unused Roles
                  </p>
                  <p className="text-xs text-blue-600">
                    {dashboardData.securityMetrics.unusedRoles} role with no
                    users assigned
                  </p>
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    System Health
                  </p>
                  <p className="text-xs text-green-600">
                    RBAC system is functioning normally
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Database Schema Info */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Database Schema Overview</CardTitle>
                <CardDescription>
                  RBAC system structure and relationships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Core Tables</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Users</span>
                        <Badge variant="outline">Primary Entity</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Roles</span>
                        <Badge variant="outline">Access Levels</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Permissions</span>
                        <Badge variant="outline">Actions</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Junction Tables</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>UserRoles</span>
                        <Badge variant="secondary">Many-to-Many</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>RolePermissions</span>
                        <Badge variant="secondary">Many-to-Many</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    This RBAC system implements a flexible permission model
                    where users can have multiple roles, and roles can have
                    multiple permissions, enabling fine-grained access control.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
