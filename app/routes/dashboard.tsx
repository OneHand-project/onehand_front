import { useState } from "react";
import { AppSidebar } from "~/components/dashboard/app-sidebar";
import { DashboardPage } from "~/components/dashboard/dashboard";
import { ReportsPage } from "~/components/dashboard/reports-page";
import { UsersTable } from "~/components/dashboard/user-tables";
import { CampaignsTable } from "~/components/dashboard/campaigns-table";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

export default function Page() {
  const [activeItem, setActiveItem] = useState("dashboard");

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return <DashboardPage />;
      case "reports":
        return <ReportsPage />;
      case "users":
        return <UsersTable />;
      case "campaigns":
        return <CampaignsTable />;
      default:
        return <DashboardPage />;
    }
  };

  const getBreadcrumbTitle = () => {
    switch (activeItem) {
      case "dashboard":
        return "Dashboard";
      case "reports":
        return "Reports";
      case "users":
        return "Users";
      case "campaigns":
        return "Campaigns";
      default:
        return "Dashboard";
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar activeItem={activeItem} onNavigate={setActiveItem} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href="#"
                  onClick={() => setActiveItem("dashboard")}
                >
                  RBAC System
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{getBreadcrumbTitle()}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
            {renderContent()}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
