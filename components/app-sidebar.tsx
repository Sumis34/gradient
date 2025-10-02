"use client";

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import {
  IconAd2,
  IconBellRinging,
  IconCalendar,
  IconCalendarStats,
  IconListDetails,
  IconNews,
  IconNotebook,
  IconProgressCheck,
  IconSettingsCode,
} from "@tabler/icons-react";
import { LayoutDashboard, Package } from "lucide-react";
import { NavCollapsible } from "@/components/nav-collapsible";
import { NavFooter } from "@/components/nav-footer";
import { NavHeader } from "@/components/nav-header";
import { NavMain } from "@/components/nav-main";
import type { SidebarData } from "./types";
import { useAuth } from "@/hooks/use-auth";
import { useCollections } from "@/lib/local-database/context";
import { useLiveQuery } from "@tanstack/react-db";

const data: SidebarData = {
  navMain: [],
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
      <NavHeader data={data} />
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
        user={{
          name: user?.user_metadata?.name || "Guest User",
          email: user?.email || "",
          avatar: user?.user_metadata?.avatar_url,
        }}
      />
    </Sidebar>
  );
}
