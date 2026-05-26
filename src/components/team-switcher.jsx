"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, ChevronLeft } from "lucide-react"

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
              <div 
                className="flex items-center gap-2 cursor-pointer group relative" 
                onClick={(e) => {
                  const sContext = document.querySelector('[data-state="collapsed"]');
                  if(sContext) toggleSidebar();
                }}
              >
                <div
                  className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground relative z-10">
                  <LogoIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-primary blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
                  <LogoTitle className="text-[25px] relative z-10" />
                </div>
              </div>
              <div onClick={(e) => { e.stopPropagation(); toggleSidebar(); }} className="cursor-pointer text-sidebar-foreground hover:text-sidebar-accent-foreground p-1 rounded-md hover:bg-sidebar-accent transition-colors">
                <ChevronLeft className="size-5" />
              </div>
            </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>)
  );
}
