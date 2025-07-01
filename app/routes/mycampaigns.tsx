"use client";

import { useState } from "react";
import { CalendarDays, MoreHorizontal, Plus, Search } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { authCookie, verifyuser } from "~/utils/cookies.server";
import { Campaign } from "~/types/campaign";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const API_URL = process.env.API_URL;
  const cookieHeader = request.headers.get("Cookie");
  const token = await authCookie.parse(cookieHeader);

  const data = (await verifyuser(token)) || null;
  const islogin = data != null ? true : false;

  try {
    const fetchcampaigns = await fetch(
      `${API_URL}/api/campaigns/filter/organizer`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!fetchcampaigns.ok) {
      throw json({ message: "Not found" }, { status: 404 });
    }

    const campaigns: Campaign[] = await fetchcampaigns.json();

    return json({ islogin, data, campaigns });
  } catch (e) {
    console.error(e);
    return [];
  }
}
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "paused":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "completed":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "draft":
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function CampaignsPage() {
  const { islogin, data, campaigns } = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredCampaigns = (campaigns || []).filter((campaign: Campaign) => {
    const matchesSearch = campaign.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.category === statusFilter;
    const matchesType =
      typeFilter === "all" || campaign.category === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });
  const navigation = useNavigate();
  const handleviewdetails = (campaignid: string) => {
    navigation(`/campaign/${campaignid}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Campaigns</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and monitor your marketing campaigns
              </p>
            </div>
            <Button onClick={() => navigation("/campaign/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Email">Email</SelectItem>
              <SelectItem value="Social Media">Social Media</SelectItem>
              <SelectItem value="Display">Display</SelectItem>
              <SelectItem value="Video">Video</SelectItem>
              <SelectItem value="Search">Search</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Campaigns List */}
        <div className="space-y-4">
          {filteredCampaigns.map((campaign: Campaign) => (
            <Card
              key={campaign.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {campaign.title}
                      </h3>
                      <Badge className={getStatusColor(campaign.category)}>
                        {campaign.category.charAt(0).toUpperCase() +
                          campaign.category.slice(1)}
                      </Badge>
                      <Badge variant="outline">{campaign.category}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {campaign.daysLeft}
                      </div>
                      <div>
                        donation: {formatCurrency(campaign.currentDonation)}
                      </div>
                      <div>Goal: {formatCurrency(campaign.donationGoal)}</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => {
                            handleviewdetails(campaign.id);
                          }}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {campaign.category === "active" ? (
                          <DropdownMenuItem>Pause Campaign</DropdownMenuItem>
                        ) : campaign.category === "paused" ? (
                          <DropdownMenuItem>Resume Campaign</DropdownMenuItem>
                        ) : null}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handledelete(campaign.id)}
                        >
                          Delete Campaign
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No campaigns found</div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Campaign
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
