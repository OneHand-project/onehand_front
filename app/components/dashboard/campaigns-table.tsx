import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Progress } from "~/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Plus,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

// Mock campaigns data
const campaignsData = [
  {
    id: 1,
    name: "Summer Sale 2024",
    type: "Promotional",
    status: "Active",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    targetUsers: 5000,
    reachedUsers: 4567,
    conversions: 567,
    conversionRate: 12.4,
    budget: 25000,
    spent: 18750,
    roi: 145,
  },
  {
    id: 2,
    name: "Product Launch Campaign",
    type: "Launch",
    status: "Active",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    targetUsers: 3000,
    reachedUsers: 2890,
    conversions: 234,
    conversionRate: 8.1,
    budget: 15000,
    spent: 12300,
    roi: 98,
  },
  {
    id: 3,
    name: "Newsletter Signup Drive",
    type: "Engagement",
    status: "Completed",
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    targetUsers: 10000,
    reachedUsers: 9876,
    conversions: 1234,
    conversionRate: 12.5,
    budget: 8000,
    spent: 7500,
    roi: 167,
  },
  {
    id: 4,
    name: "Referral Program",
    type: "Referral",
    status: "Active",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    targetUsers: 2000,
    reachedUsers: 1456,
    conversions: 234,
    conversionRate: 16.1,
    budget: 12000,
    spent: 8900,
    roi: 189,
  },
  {
    id: 5,
    name: "Holiday Special",
    type: "Seasonal",
    status: "Paused",
    startDate: "2023-11-15",
    endDate: "2024-01-15",
    targetUsers: 7500,
    reachedUsers: 6234,
    conversions: 456,
    conversionRate: 7.3,
    budget: 20000,
    spent: 15600,
    roi: 87,
  },
  {
    id: 6,
    name: "Mobile App Promotion",
    type: "App Install",
    status: "Draft",
    startDate: "2024-02-01",
    endDate: "2024-04-30",
    targetUsers: 4000,
    reachedUsers: 0,
    conversions: 0,
    conversionRate: 0,
    budget: 18000,
    spent: 0,
    roi: 0,
  },
];

export function CampaignsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [campaigns] = useState(campaignsData);

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Paused":
        return "bg-yellow-100 text-yellow-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Promotional":
        return "bg-purple-100 text-purple-800";
      case "Launch":
        return "bg-orange-100 text-orange-800";
      case "Engagement":
        return "bg-blue-100 text-blue-800";
      case "Referral":
        return "bg-green-100 text-green-800";
      case "Seasonal":
        return "bg-red-100 text-red-800";
      case "App Install":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage marketing campaigns and track performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <p className="text-xs text-muted-foreground">
              {campaigns.filter((c) => c.status === "Active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns
                .reduce((sum, c) => sum + c.reachedUsers, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">users reached</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                campaigns.reduce((sum, c) => sum + c.conversionRate, 0) /
                campaigns.length
              ).toFixed(1)}
              %
            </div>
            <p className="text-xs text-muted-foreground">conversion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length
              ).toFixed(0)}
              %
            </div>
            <p className="text-xs text-muted-foreground">average ROI</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Management</CardTitle>
          <CardDescription>
            View and manage all marketing campaigns ({filteredCampaigns.length}{" "}
            campaigns)
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Conversion</TableHead>
                <TableHead>ROI</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {campaign.startDate} - {campaign.endDate}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(campaign.type)}>
                      {campaign.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{campaign.reachedUsers.toLocaleString()}</span>
                        <span className="text-muted-foreground">
                          / {campaign.targetUsers.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          (campaign.reachedUsers / campaign.targetUsers) * 100
                        }
                        className="h-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">
                        {campaign.conversionRate}%
                      </span>
                      {campaign.conversionRate > 10 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${
                        campaign.roi > 100 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {campaign.roi}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit campaign</DropdownMenuItem>
                        <DropdownMenuItem>View analytics</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          {campaign.status === "Active" ? "Pause" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete campaign
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
