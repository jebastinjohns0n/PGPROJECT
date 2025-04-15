// "use client"

// import type React from "react"
// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { useToast } from "@/hooks/use-toast"
// import { authenticate, setCurrentUser } from "@/lib/auth"
// import { Checkbox } from "@/components/ui/checkbox"
// import { ArrowRight, Lock, Mail, Key } from "lucide-react"

// export default function Login() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [otp, setOtp] = useState("")
//   const [rememberMe, setRememberMe] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [isOtpSent, setIsOtpSent] = useState(false)
//   const router = useRouter()
//   const { toast } = useToast()

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     // Simulate network delay
//     setTimeout(() => {
//       if (!isOtpSent) {
//         // Simulate sending OTP
//         setIsOtpSent(true)
//         toast({
//           title: "OTP Sent",
//           description: "OTP has been sent to your registered email/phone.",
//         })
//       } else {
//         // Simulate OTP verification
//         const isOtpValid = verifyOtp(email, otp)
//         if (isOtpValid) {
//           const user = authenticate(email, password)
//           if (user) {
//             setCurrentUser(user)
//             router.push("/")
//           } else {
//             toast({
//               title: "Error",
//               description: "Invalid email or password",
//               variant: "destructive",
//             })
//           }
//         } else {
//           toast({
//             title: "Error",
//             description: "Invalid OTP",
//             variant: "destructive",
//           })
//         }
//       }
//       setIsLoading(false)
//     }, 1000)
//   }

//   return (
//     <div className="">
//       <div className=" w-full max-w-6xl flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-xl shadow-lg ">
//         {/* Left side - System Title and Tagline */}
//         <div className="md:w-1/2  p-12 flex flex-col justify-center bg-blue-500 items-center text-white">
//           <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">CYBERNAUT</h1>
//           <p className="text-xl md:text-3xl italic text-center mb-8">We create leaders, not employees.</p>
//           <div className="w-24 h-1 bg-white rounded mb-8"></div>
//           <p className="text-center text-lg">
//             A comprehensive solution for managing academic teams, tasks, and resources.
//           </p>
//         </div>

//         {/* Right side - Login Form */}
//         <div className="md:w-1/2 p-8 md:p-12">
//           <div className="max-w-md mx-auto">
//             <div className="flex flex-col items-center mb-8">
//               <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">Welcome Back</h2>
//               <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
//                 Sign in to access your dashboard
//               </p>
//             </div>
//             <form className="space-y-6" onSubmit={handleLogin}>
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Email address
//                   </Label>
//                   <div className="mt-1 relative rounded-md shadow-sm">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Mail className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <Input
//                       id="email-address"
//                       name="email"
//                       type="email"
//                       autoComplete="email"
//                       required
//                       className="pl-10 block w-full"
//                       placeholder="you@example.com"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Password
//                   </Label>
//                   <div className="mt-1 relative rounded-md shadow-sm">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Lock className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <Input
//                       id="password"
//                       name="password"
//                       type="password"
//                       autoComplete="current-password"
//                       required
//                       className="pl-10 block w-full"
//                       placeholder="••••••••"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                     />
//                   </div>
//                 </div>
//                 {isOtpSent && (
//                   <div>
//                     <Label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                       OTP
//                     </Label>
//                     <div className="mt-1 relative rounded-md shadow-sm">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <Key className="h-5 w-5 text-gray-400" />
//                       </div>
//                       <Input
//                         id="otp"
//                         name="otp"
//                         type="text"
//                         required
//                         className="pl-10 block w-full"
//                         placeholder="Enter your OTP"
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <Checkbox
//                     id="remember-me"
//                     name="remember-me"
//                     checked={rememberMe}
//                     onCheckedChange={(checked) => setRememberMe(!!checked)}
//                     className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
//                   />
//                   <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
//                     Remember me
//                   </Label>
//                 </div>
//               </div>

//               <div>
//                 <Button
//                   type="submit"
//                   disabled={isLoading}
//                   className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
//                 >
//                   {isLoading ? "Loading..." : "Sign in"}
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Add this function to simulate OTP verification
// function verifyOtp(email: string, otp: string) {
//   // Replace this with your actual OTP verification logic
//   return true;
// }
"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { authenticate, setCurrentUser } from "@/lib/auth"
import { Checkbox } from "@/components/ui/checkbox"
import { Lock, Mail } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      const user = authenticate(email, password)
      if (user) {
        setCurrentUser(user)
        router.push("/")
      } else {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1000)
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

        {/* Right side - Login Form */}
        <div className="md:w-1/2 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">Welcome Back</h2>
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Sign in to access your dashboard
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </Label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="pl-10 block w-full"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
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
                      autoComplete="current-password"
                      required
                      className="pl-10 block w-full"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    id="remember-me"
                    name="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </Label>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {isLoading ? "Loading..." : "Sign in"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}