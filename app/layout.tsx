'use client'

import React from "react"
import { Inter } from "next/font/google"
import { Toaster } from 'sonner'
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AuthProvider } from "@/components/auth-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { useState } from "react"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

const metadata = {
  title: "Cybernaut - Task Management System",
  description: "A professional task management system for modern teams",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 dark:bg-gray-900`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <SidebarProvider>
              <div className="flex h-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                        <span className="hidden sm:inline">Academics Team Management</span>
                      </h1>
                      <div className="flex items-center space-x-4">
                        <NotificationBell />
                        <ModeToggle />
                        <UserProfileDisplay />
                      </div>
                    </div>
                  </header>

                  <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto">{children}</div>
                  </main>
                  <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-3 px-4 text-center text-xs text-gray-500 dark:text-gray-400">
                    {new Date().getFullYear()} Cybernaut. All rights reserved.
                  </footer>
                </div>
              </div>
              <Toaster richColors position="top-right" />
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

// Component to display the current user's profile
function UserProfileDisplay() {
  return (
    <div className="hidden md:flex items-center space-x-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
        <UserInitial />
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        <UserName />
      </span>
    </div>
  )
}

// Client component to show user initial
function UserInitial() {
  const { user } = useAuth()
  if (!user) return null
  return <>{user.email ? user.email[0].toUpperCase() : "U"}</>
}

// Client component to show user name
function UserName() {
  const { user } = useAuth()
  if (!user) return null
  return <>{user.email ? user.email.split("@")[0] : "User"}</>
}

import { useAuth } from "@/components/auth-provider"

// Add NotificationBell component
function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New task assigned to you", time: "5 minutes ago", read: false },
    { id: 2, message: "Your attendance was approved", time: "1 hour ago", read: false },
    { id: 3, message: "Monthly report is available", time: "3 hours ago", read: true },
    { id: 4, message: "Payroll processed for this month", time: "1 day ago", read: true },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="relative">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-20 border border-gray-200 dark:border-gray-700">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-sm font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-7">
                Mark all as read
              </Button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${notification.read ? "" : "bg-blue-50 dark:bg-blue-900/20"}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between">
                    <p className="text-sm">{notification.message}</p>
                    {!notification.read && <span className="h-2 w-2 bg-blue-500 rounded-full"></span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
            )}
          </div>
          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              View all notifications
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
