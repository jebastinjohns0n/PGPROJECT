"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ArcElement,
} from "chart.js"
import { Users, Briefcase, CheckSquare, Server, DollarSign } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend)

// Update the admin dashboard to remove total users and task distribution
// And update lecturer dashboard to only show specific cards
export default function Dashboard() {
  const { user, role } = useAuth()
  const [stats, setStats] = useState({
    activeBatches: 0,
    completedTasks: 0,
    resourceUsage: 0,
  })

  const [lecturerStats, setLecturerStats] = useState({
    completedBatches: 0,
    completedTasks: 0,
    totalEarnings: 0,
    studentsCompleted: 0,
  })

  const [lecturers, setLecturers] = useState([
    {
      id: "lec1",
      name: "John Doe",
      department: "Training",
      status: "active",
      joinDate: "2022-01-15",
    },
    {
      id: "lec2",
      name: "Jane Smith",
      department: "Development",
      status: "active",
      joinDate: "2021-05-20",
    },
    {
      id: "lec3",
      name: "Bob Johnson",
      department: "Training",
      status: "inactive",
      joinDate: "2022-03-10",
    },
  ])

  const [completedBatches, setCompletedBatches] = useState([
    {
      id: "batch1",
      name: "2023 January - B1",
      lecturer: "John Doe",
      completionDate: "2023-03-15",
      studentsCompleted: 18,
      totalStudents: 20,
      completionRate: 90,
    },
    {
      id: "batch2",
      name: "2023 March - B2",
      lecturer: "Jane Smith",
      completionDate: "2023-05-25",
      studentsCompleted: 15,
      totalStudents: 15,
      completionRate: 100,
    },
  ])

  useEffect(() => {
    // Set initial stats to zero until DB is connected
    setStats({
      activeBatches: 0,
      completedTasks: 0,
      resourceUsage: 0,
    })

    // Set lecturer stats
    if (role === "lecturer" && user) {
      setLecturerStats({
        completedBatches: user.completedBatches || 0,
        completedTasks: 12, // Example value
        totalEarnings: 250000, // Example value in rupees
        studentsCompleted: user.studentsCompleted || 0,
      })
    }
  }, [role, user])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name || "User"}</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Last updated:</span>
          <span className="text-sm font-medium">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Different dashboard for lecturer vs admin/superadmin */}
      {role === "lecturer" ? (
        // Lecturer Dashboard - Only show specific cards
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Batches</CardTitle>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lecturerStats.completedBatches}</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckSquare className="h-5 w-5 text-green-600 dark:text-green-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lecturerStats.completedTasks}</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{lecturerStats.totalEarnings.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students Trained</CardTitle>
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <Users className="h-5 w-5 text-amber-600 dark:text-amber-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lecturerStats.studentsCompleted}</div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Admin/SuperAdmin Dashboard - Remove total users and task distribution
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeBatches}</div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckSquare className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedTasks}</div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resource Usage</CardTitle>
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <Server className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.resourceUsage}%</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Lecturers</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lecturers.length > 0 ? (
                      lecturers.map((lecturer) => (
                        <TableRow key={lecturer.id}>
                          <TableCell className="font-medium">{lecturer.name}</TableCell>
                          <TableCell>{lecturer.department}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                lecturer.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }
                            >
                              {lecturer.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{lecturer.joinDate}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                          No data available. Connect to database to view lecturers.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Completed Batches</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch</TableHead>
                      <TableHead>Lecturer</TableHead>
                      <TableHead>Completion</TableHead>
                      <TableHead>Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedBatches.length > 0 ? (
                      completedBatches.map((batch) => (
                        <TableRow key={batch.id}>
                          <TableCell className="font-medium">{batch.name}</TableCell>
                          <TableCell>{batch.lecturer}</TableCell>
                          <TableCell>{batch.completionDate}</TableCell>
                          <TableCell>{batch.completionRate}%</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                          No data available. Connect to database to view completed batches.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

