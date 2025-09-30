"use client";
import { AppSidebar } from "@/components/app-sidebar";
import ClientOnly from "@/components/client-only";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useCollections } from "@/hooks/use-collections";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoading } = useCollections();

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="sm:hidden" />
            </div>
          </header>
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <p>Loading...</p>
            </div>
          ) : (
            children
          )}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
