"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { addUser } from "@/lib/auth"
import { Lock, Mail, User, Phone, Building, IdCard } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    department: "",
    employeeId: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const userToAdd = {
        ...formData,
        role: "lecturer", // Default role for new registrations
        status: "active",
        joinDate: new Date().toISOString().split("T")[0],
      }

      const result = await addUser(userToAdd)

      if (result.success) {
        toast({
          title: "Success",
          description: "Registration successful! Please login.",
        })
        router.push("/login")
      } else {
        setError(result.error || "Registration failed")
      }
    } catch (error) {
      setError("Unable to connect to server. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {/* Left side - System Title and Tagline */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-blue-500 items-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">CYBERNAUT</h1>
          <p className="text-xl md:text-3xl italic text-center mb-8">Join our team of educators.</p>
          <div className="w-24 h-1 bg-white rounded mb-8"></div>
          <p className="text-center text-lg">
            Register to become part of our growing community of educational professionals.
          </p>
        </div>

        {/* Right side - Registration Form */}
        <div className="md:w-1/2 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">Create Account</h2>
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <a href="/login" className="text-blue-500 hover:text-blue-600">
                  Sign in
                </a>
              </p>
            </div>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </Label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="pl-10 block w-full"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </Label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="pl-10 block w-full"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </Label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="pl-10 block w-full"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </Label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className="pl-10 block w-full"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number
                  </Label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="pl-10 block w-full"
                      placeholder="+1234567890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Department Field */}
                <div>
                  <Label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Department
                  </Label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="department"
                      name="department"
                      type="text"
                      required
                      className="pl-10 block w-full"
                      placeholder="Training"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  </div>
                </div>

                {/* Employee ID Field */}
                <div>
                  <Label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Employee ID
                  </Label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IdCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="employeeId"
                      name="employeeId"
                      type="text"
                      required
                      className="pl-10 block w-full"
                      placeholder="EMP001"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}