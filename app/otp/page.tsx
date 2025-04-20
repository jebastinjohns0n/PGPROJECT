"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { verifyOtp, setCurrentUser } from "@/lib/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock } from "lucide-react"

export default function OtpPage() {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      setError("")
      if (!email) {
        throw new Error("Email not provided")
      }

      const result = await verifyOtp(email, otp)
      if (result.user) {
        setCurrentUser(result.user)
        toast({
          title: "Success",
          description: "OTP verified successfully! Welcome back.",
        })
        router.push("/")
      } else {
        setError(result.error || "Invalid OTP code")
      }
    } catch (error) {
      setError("Unable to verify OTP. Please try again later.")
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
          <p className="text-xl md:text-3xl italic text-center mb-8">We create leaders, not employees.</p>
          <div className="w-24 h-1 bg-white rounded mb-8"></div>
          <p className="text-center text-lg">
            A comprehensive solution for managing academic teams, tasks, and resources.
          </p>
        </div>

        {/* Right side - OTP Form */}
        <div className="md:w-1/2 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">Verify Your Identity</h2>
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Enter the OTP sent to your email
              </p>
            </div>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form className="space-y-6" onSubmit={handleVerify}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    OTP Code
                  </Label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      className="pl-10 block w-full"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>
                <div className="flex justify-between text-sm">
                  <button 
                    type="button" 
                    onClick={() => router.push('/login')}
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Back to Sign In
                  </button>
                  <button 
                    type="button" 
                    onClick={() => router.push('/register')}
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Create New Account
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}