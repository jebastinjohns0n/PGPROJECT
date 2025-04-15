"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, setCurrentUser } from "@/lib/auth"

const AuthContext = createContext<{ user: any; role: string | null; logout: () => void }>({
  user: null,
  role: null,
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setRole(currentUser.role)
    } else {
      router.push("/login")
    }
  }, [router])

  const logout = () => {
    setCurrentUser(null)
    setUser(null)
    setRole(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, role, logout }}>{children}</AuthContext.Provider>
}

