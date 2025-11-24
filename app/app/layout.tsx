"use client";
import { AppSidebar } from "@/components/app-sidebar";
import SetupForm from "@/components/setup-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Book, House, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showSetup, setShowSetup] = useState(true);

  useAuth();

  useEffect(() => {
    const isSetup = localStorage.getItem("settings/storage");
    if (isSetup) {
      setShowSetup(false);
    }
  }, []);

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
        <Dialog open={showSetup}>
          <DialogHeader>
            <DialogTitle>Setup Form</DialogTitle>
          </DialogHeader>
          <DialogContent>
            <SetupForm />
          </DialogContent>
        </Dialog>
      </SidebarProvider>
    </>
  );
}
