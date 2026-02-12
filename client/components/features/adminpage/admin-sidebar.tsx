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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { NavigationGroup } from "@/types/navigation.group";
import { NavigationItem } from "@/types/navigation.item";
import { Sidebar } from "@/types/sidebar";
import {
  BadgeCheck,
  Bell,
  Boxes,
  ClipboardList,
  CreditCard,
  Layers,
  LayoutGrid,
  LogOut,
  ShoppingCart,
  Soup,
  Sparkles,
  Store,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminSidebar = () => {
  const pathName = usePathname();

  function isActive(path: string): boolean {
    return pathName === path;
  }

  const sidebarContent: Sidebar = {
    label: "POS System",
    icon: Store,
    groups: [
      {
        label: "Main Menu",
        items: [
          {
            label: "Cashier",
            icon: ShoppingCart,
            path: "/adminpage/cashier",
          },
          {
            label: "Category",
            icon: Layers,
            path: "/adminpage/category",
          },
          {
            label: "Products",
            icon: Soup,
            path: "/adminpage/product",
          },
          {
            label: "Table",
            icon: LayoutGrid,
            path: "/adminpage/table",
          },
          {
            label: "Inventory",
            icon: Boxes,
            path: "/adminpage/inventory",
          },
          {
            label: "Orders",
            icon: ClipboardList,
            path: "/adminpage/orders",
          },
          {
            label: "Employee",
            icon: Users,
            path: "/adminpage/employee",
          },
        ],
      },
    ],
  };

  return (
    <aside className="sticky top-0  h-screen w-20 bg-white border-r flex flex-col">
      <div className="flex items-center justify-center border-b py-5 px-4">
        <Link href="/" className="flex items-center justify-center">
          <sidebarContent.icon className="w-7 h-7" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {sidebarContent.groups.map(
          (group: NavigationGroup, groupIndex: number) => (
            <div key={groupIndex} className="mb-6">
              <nav className="space-y-1 px-2">
                {group?.items?.map(
                  (item: NavigationItem, itemIndex: number) => {
                    const isCurrentActive = isActive(item.path ?? "");

                    return (
                      <Tooltip key={itemIndex}>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.path ?? ""}
                            className={cn(
                              "flex items-center justify-center rounded-lg transition-colors py-4",
                              "hover:bg-gray-100",
                              isCurrentActive &&
                                "bg-blue-100 text-blue-700 hover:bg-blue-200",
                            )}
                          >
                            <item.icon size={24} strokeWidth={1.5} />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  },
                )}
              </nav>
            </div>
          ),
        )}
      </div>

      <div className="border-t p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors py-3">
              <Avatar className="h-10 w-10 rounded-lg">
                <AvatarImage src="" alt="R" />
                <AvatarFallback className="rounded-lg uppercase font-semibold">
                  R
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-lg"
            side="right"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="" alt="R" />
                  <AvatarFallback className="rounded-lg uppercase">
                    R
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Username</span>
                  <span className="truncate text-xs">Email</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <BadgeCheck className="mr-2 h-4 w-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};

export default AdminSidebar;
