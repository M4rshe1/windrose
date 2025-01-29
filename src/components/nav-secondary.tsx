import * as React from "react"
import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import {type TablerIcon} from "@tabler/icons-react";

export function NavSecondary({
  items,
    version,
    env,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon | TablerIcon
    target?: string
  }[],
    version: string,
  env: string,
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild size="sm">
                  <Link href={item.url} target={item?.target}>
                    <item.icon/>
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
          ))}
          <div className="px-4 py-2 text-xs text-gray-500">
            {env}-{version}
          </div>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
