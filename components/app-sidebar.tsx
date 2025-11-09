"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { IconAd2, IconNews, IconSettingsCode } from "@tabler/icons-react";
import { LayoutDashboard, Package } from "lucide-react";
import { NavCollapsible } from "@/components/nav-collapsible";
import { NavFooter } from "@/components/nav-footer";
import { NavHeader } from "@/components/nav-header";
import { NavMain } from "@/components/nav-main";
import type { SidebarData } from "./types";
import { useAuth } from "@/hooks/use-auth";
import { useCollections } from "@/context/collection-context";
import { useLiveQuery } from "@tanstack/react-db";
import Link from "next/link";

const data: SidebarData = {
  navMain: [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/app",
    },
  ],
  navCollapsible: {
    favorites: [
      {
        id: "design",
        title: "Design",
        href: "#",
        color: "bg-green-400 dark:bg-green-300",
      },
      {
        id: "development",
        title: "Development",
        href: "#",
        color: "bg-blue-400 dark:bg-blue-300",
      },
      {
        id: "workshop",
        title: "Workshop",
        href: "#",
        color: "bg-orange-400 dark:bg-orange-300",
      },
      {
        id: "personal",
        title: "Personal",
        href: "#",
        color: "bg-red-400 dark:bg-red-300",
      },
    ],
    teams: [
      {
        id: "engineering",
        title: "Engineering",
        icon: IconSettingsCode,
      },
      {
        id: "marketing",
        title: "Marketing",
        icon: IconAd2,
      },
    ],
    topics: [
      {
        id: "product-updates",
        title: "Product Updates",
        icon: Package,
      },
      {
        id: "company-news",
        title: "Company News",
        icon: IconNews,
      },
    ],
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const { semesters: semestersCollection } = useCollections();

  const { data: semesters = [] } = useLiveQuery((q) =>
    q
      .from({
        semester: semestersCollection,
      })
      .select(({ semester }) => ({
        id: semester.id,
        name: semester.name,
      }))
      .orderBy(({ semester }) => semester.created_at, "desc")
  );

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="px-2 pt-2 pb-20">
          <Link href="/app">
            <h1 className="font-serif font-semibold">Gradient</h1>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavCollapsible
          favorites={data.navCollapsible.favorites}
          teams={data.navCollapsible.teams}
          topics={data.navCollapsible.topics}
          semesters={semesters}
        />
      </SidebarContent>
      <NavFooter
        user={
          user
            ? {
                name: user?.user_metadata?.name || "Guest User",
                email: user?.email || "",
                avatar: user?.user_metadata?.avatar_url,
              }
            : undefined
        }
      />
    </Sidebar>
  );
}
