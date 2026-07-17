// File: components/app-sidebar.tsx

"use client";

import * as React from "react";
import {
  PackageSearch,
  ShoppingCart,
  Users,
  CreditCard,
  Gem,
  BarChart3,
  UserCog,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },

  teams: [
    {
      name: "Jewelry Management",
      logo: <></>,
      plan: "Enterprise",
    },
  ],

  navMain: [

    {
      title: "Product Management",
      url: "#",
      icon: <PackageSearch />,
      isActive: true,
      items: [
        {
          title: "Product Catalog",
          url: "/dashboard/products",
        },
      ],
    },

    {
      title: "Order Management",
      url: "#",
      icon: <ShoppingCart />,
      items: [
        {
          title: "Orders",
          url: "/dashboard/orders",
        },
        // {
        //   title: "Payments",
        //   url: "/dashboard/payments",
        // },
      ],
    },

    {
      title: "Customer Management",
      url: "#",
      icon: <Users />,
      items: [
        {
          title: "Customers",
          url: "/dashboard/customers",
        },
      ],
    },

    {
      title: "Sales",
      url: "#",
      icon: <CreditCard />,
      items: [
        {
          title: "Sales History",
          url: "/dashboard/sales",
        },
        {
          title: "Consignments",
          url: "/dashboard/consignments",
        },
      ],
    },

    {
      title: "Inventory Management",
      url: "#",
      icon: <BarChart3 />,
      items: [
        {
          title: "Inventory",
          url: "/dashboard/inventory",
        },
      ],
    },

    
  ],
};

export function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
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
  );
}