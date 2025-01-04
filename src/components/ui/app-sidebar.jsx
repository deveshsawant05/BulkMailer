"use client"

import * as React from "react"
import {
  Mail,
  Settings,
  Users,
  FileText,
  BarChart,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Devesh Sawant",
    email: "deveshsawant05@gmail.com",
    avatar: "https://avatars.githubusercontent.com/u/146441689?v=4",
  },
  teams: [
    {
      name: "BulkMailer",
      logo : ()=>{BulkMailerSvg()},
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: BarChart,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
      ],
    },
    {
      title: "Campaigns",
      url: "#",
      icon: Mail,
      items: [
        {
          title: "All Campaigns",
          url: "#",
        },
        {
          title: "Create Campaign",
          url: "#",
        },
      ],
    },
    {
      title: "Templates",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "All Templates",
          url: "#",
        },
        {
          title: "Create Template",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function BulkMailerSvg() {
  return (
    <img src="./BulkMailer.svg" alt="BulkMailer Logo" />
  )
}