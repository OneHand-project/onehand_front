import type * as React from "react";
import {
  BarChart3,
  Users,
  Megaphone,
  Home,
  FileText,
  Database,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";

// Navigation items
const navigationItems = [
  {
    title: "Dashboard",
    url: "#dashboard",
    icon: Home,
  },
  {
    title: "Reports",
    url: "#reports",
    icon: FileText,
  },
  {
    title: "Users",
    url: "#users",
    icon: Users,
  },
  {
    title: "Campaigns",
    url: "#campaigns",
    icon: Megaphone,
  },
];

const analyticsItems = [
  {
    title: "Analytics",
    url: "#analytics",
    icon: BarChart3,
  },
  {
    title: "Database Schema",
    url: "#schema",
    icon: Database,
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeItem: string;
  onNavigate: (item: string) => void;
}

export function AppSidebar({
  activeItem,
  onNavigate,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Database className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">RBAC System</span>
            <span className="truncate text-xs">Admin Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeItem === item.url.replace("#", "")}
                    onClick={() => onNavigate(item.url.replace("#", ""))}
                  >
                    <button className="w-full">
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeItem === item.url.replace("#", "")}
                    onClick={() => onNavigate(item.url.replace("#", ""))}
                  >
                    <button className="w-full">
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground">
          v1.0.0 - RBAC Dashboard
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
