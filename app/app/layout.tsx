"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Book, House, Plus } from "lucide-react";

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
          <div className="fixed bottom-0 left-0 right-0 py-5 flex justify-center z-10 sm:hidden">
            <div className="bg-card/20 backdrop-blur-xl rounded-xl p-4 flex gap-5">
              <Button variant="secondary" size={"icon"}>
                <House />
              </Button>
              <Button variant="default" size={"icon"}>
                <Plus />
              </Button>
              <Button variant="secondary" size={"icon"}>
                <Book />
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
