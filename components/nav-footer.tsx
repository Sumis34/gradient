"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import {
  BookmarkPlus,
  LogOut,
  Plus,
  PlusCircle,
  Puzzle,
  Settings,
  User,
} from "lucide-react";
import SyncState from "./sync-state";

export function NavFooter({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { signOut } = useAuth();

  return (
    <SidebarFooter className="p-4">
      <SyncState state="no-sync" />
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-full">CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="m-2">
                  <DropdownMenuItem>
                    <User size={16} className="opacity-80" aria-hidden="true" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings
                      size={16}
                      className="opacity-80"
                      aria-hidden="true"
                    />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut
                      size={16}
                      className="opacity-80"
                      aria-hidden="true"
                    />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  aria-label="Open edit menu"
                >
                  <Plus size={16} aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="pb-2">
                <DropdownMenuLabel>Add New</DropdownMenuLabel>
                <DropdownMenuItem>
                  <PlusCircle
                    size={16}
                    className="mr-2 opacity-80"
                    aria-hidden="true"
                  />
                  Add New Item
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BookmarkPlus
                    size={16}
                    className="mr-2 opacity-80"
                    aria-hidden="true"
                  />
                  Add Bookmark
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Puzzle
                    size={16}
                    className="mr-2 opacity-80"
                    aria-hidden="true"
                  />
                  Add Integration
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
