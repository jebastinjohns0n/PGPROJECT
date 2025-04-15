"use client"

import { useAuth } from "./auth-provider"
import Image from "next/image"
import Logo from '@/public/logo.png'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Home,
  Users,
  Briefcase,
  FileText,
  BarChart,
  LogOut,
  CheckSquare,
  DollarSign,
  UserCheck,
  BookOpen,
  Settings,
  User,
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function AppSidebar() {
  const { role, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Don't show logout on login page
  const isLoginPage = pathname === "/login"

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Define all menu items
  const allMenuItems = {
    superAdmin: [
      { title: "Dashboard", icon: Home, url: "/" },
      { title: "Manage Users", icon: Users, url: "/users" },
      { title: "Manage Batches", icon: Briefcase, url: "/batches" },
      { title: "Manage Tasks", icon: CheckSquare, url: "/tasks" },
      { title: "Track Progress", icon: BarChart, url: "/progress" },
      { title: "Payroll", icon: DollarSign, url: "/payroll" },
      { title: "Attendance", icon: UserCheck, url: "/attendance" },
      { title: "Resources", icon: BookOpen, url: "/resources" },
      { title: "Reports", icon: FileText, url: "/reports" },
      { title: "Settings", icon: Settings, url: "/settings" },
    ],
    admin: [
      { title: "Dashboard", icon: Home, url: "/" },
      { title: "Manage Users", icon: Users, url: "/users" },
      { title: "Manage Batches", icon: Briefcase, url: "/batches" },
      { title: "Manage Tasks", icon: CheckSquare, url: "/tasks" },
      { title: "Track Progress", icon: BarChart, url: "/progress" },
      { title: "Attendance", icon: UserCheck, url: "/attendance" },
      { title: "Resources", icon: BookOpen, url: "/resources" },
      { title: "Reports", icon: FileText, url: "/reports" },
    ],
    lecturer: [
      { title: "Dashboard", icon: Home, url: "/" },
      { title: "My Profile", icon: User, url: "/my-profile" },
      { title: "My Batches", icon: Briefcase, url: "/my-batches" },
      { title: "My Tasks", icon: CheckSquare, url: "/tasks" },
      { title: "Attendance", icon: UserCheck, url: "/attendance" },
      { title: "Resources", icon: BookOpen, url: "/resources" },
      { title: "My Payroll", icon: DollarSign, url: "/my-payroll" },
    ],
  }

  // Determine which menu items to show based on role
  let items = []
  if (role === "superAdmin") {
    // SuperAdmin gets all menu items
    items = allMenuItems.superAdmin
  } else if (role === "admin") {
    items = allMenuItems.admin
  } else if (role === "lecturer") {
    items = allMenuItems.lecturer
  }

  // If on login page, don't show any items
  if (isLoginPage) {
    items = []
  }

  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <SidebarContent>
        <div className="px-4 py-4">
          {isLoginPage ? (
            <div className="text-center">
              <Image src={Logo} alt="Company Logo" width={180} height={180} className="mx-auto" />
            </div>
          ) : (
            <div className="space-y-2">
              <Image src={Logo} alt="Company Logo" width={180} height={180} className="mx-auto" />
              <div className="text-center">
                {/* <h2 className="text-xl font-semibold text-blue-600">ATMS</h2> */}
                {/* <p className="text-xs text-gray-500">Academic Team Management System</p> */}
              </div>
            </div>
          )}
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild>
                          <a
                            href={item.url}
                            className="flex items-center space-x-2 px-6 py-3 text-sm text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg mx-2 transition-all duration-200"
                          >
                            <item.icon className="h-5 w-5 text-blue-500" />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </SidebarMenuItem>
              ))}
              {!isLoginPage && (
                <SidebarMenuItem>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-6 py-3 text-sm text-gray-400 dark:text-gray-500 rounded-lg mx-2 cursor-allowed"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>LogOut</span>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">Logout</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
