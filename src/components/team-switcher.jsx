"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, PanelLeftClose } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { LogoIcon, LogoTitle } from "./logo"
export function TeamSwitcher({
  teams
}) {
  const { isMobile, toggleSidebar } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  return (
    (<SidebarMenu>
      <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <LogoIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <LogoTitle className="text-[25px]" />
                </div>
              </div>
              <div onClick={(e) => { e.stopPropagation(); toggleSidebar(); }} className="cursor-pointer text-sidebar-foreground hover:text-sidebar-accent-foreground p-1 rounded-md hover:bg-sidebar-accent transition-colors">
                <PanelLeftClose className="size-5" />
              </div>
            </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>)
  );
}
