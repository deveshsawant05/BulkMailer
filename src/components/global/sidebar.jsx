import React from 'react';
import { AppSidebar } from "@/components/ui/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const Sidebar = ({ children }) => {
    return (
        <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
       {children}
      </SidebarInset>
   </SidebarProvider>
    );
};

export default Sidebar;