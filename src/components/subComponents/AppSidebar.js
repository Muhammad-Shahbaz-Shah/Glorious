"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Tag,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { authClient, useSession } from "@/lib/auth-client";
import { IconHome2 } from "@tabler/icons-react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";


/* ---------------- MENU ---------------- */
const items = [
  { title: "Dashboard", url: "/-admin/dashboard", icon: LayoutDashboard },
  { title: "Users", url: "/-admin/users", icon: Users },
  { title: "Orders", url: "/-admin/orders", icon: ShoppingBag },
  { title: "Products", url: "/-admin/products", icon: Package },
  { title: "Categories", url: "/-admin/categories", icon: Tag },
  { title: "Store", url: "/", icon: IconHome2 },
];

export function AppSidebar() {
  const router = useRouter()
  const { data: session, isPending } = useSession();
  const { isMobile, state } = useSidebar();
  const collapsed = state === "collapsed";

  const user = session?.user;

  return (
    <Sidebar collapsible="icon" className="border-r">
      {/* ---------------- HEADER ---------------- */}
      <SidebarHeader className="h-16 flex items-center justify-center px-3">
        <Link
          href="/"
          className={clsx(
            "flex items-center gap-3 hover:bg-sidebar-accent rounded-lg p-1 w-full",
            collapsed && "justify-center"
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-md  text-sidebar-primary-foreground">
            <Image src="/logo.png" alt="Logo" width={30} height={30} />
          </div>

          {!collapsed && (
            <div className="flex  flex-col leading-tight">
              <span className="text-lg font-semibold">Glorious</span>
              <span className="text-xs text-muted-foreground">
                Welcome Store Owner{" "}
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      {/* ---------------- CONTENT ---------------- */}
      <SidebarContent className="px-2">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="px-2 text-xs">
              Menu Items
            </SidebarGroupLabel>
          )}

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={clsx(
                      "h-10",
                      collapsed ? "justify-center px-0" : "gap-3 px-3"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ---------------- FOOTER ---------------- */}
      <SidebarFooter className="px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            {isPending ? (
              <div className="w-full h-full flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className={clsx(
                      "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                      collapsed ? "justify-center px-0" : "pl-2 pr-0"
                    )}
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.image} alt={user?.name} />
                      <AvatarFallback className="rounded-lg text-primary">
                        G
                      </AvatarFallback>
                    </Avatar>
                    {!collapsed && (
                      <>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">
                            {user.name}
                          </span>
                          <span className="truncate text-xs">{user.email}</span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4" />
                      </>
                    )}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user?.image} alt={user?.name} />
                        <AvatarFallback className="rounded-lg">
                          CN
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {user?.name}
                        </span>
                        <span className="truncate text-xs">{user?.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => router.push("/-admin/profile")}
                    >
                      <BadgeCheck className="mr-2 h-4 w-4" />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => authClient.signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
