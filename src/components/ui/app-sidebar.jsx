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
      url: "/dashboard",
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
      url: "/campaigns",
      icon: Mail,
      items: [
        {
          title: "All Campaigns",
          url: "/campaigns",
        },
        {
          title: "Create Campaign",
          url: "/campaigns/create",
        },
      ],
    },
    {
      title: "Templates",
      url: "/templates",
      icon: FileText,
      items: [
        {
          title: "All Templates",
          url: "/templates",
        },
        {
          title: "Create Template",
          url: "/templates/create",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "/settings",
        },
        {
          title: "Team",
          url: "/settings/team",
        },
        {
          title: "Billing",
          url: "/settings/billing",
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