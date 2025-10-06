"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useAuth();

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div>{children}</div>
          <div className="absolute inset-0 p-4 flex justify-center items-end sm:hidden pointer-events-none">
            <div className="">Mobile Nav</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
