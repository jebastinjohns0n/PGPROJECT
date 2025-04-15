"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Eye, Pencil, UserCheck, UserX, Search, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Attendance() {
  const { role, user } = useAuth()
  const [attendance, setAttendance] = useState([
    {
      id: "1",
      date: "2023-09-01",
      userId: "lec1",
      userName: "John Doe",
      employeeId: "EMP001",
      inTime: "09:00",
      outTime: "17:00",
      duration: "8h 0m",
      status: "present",
    },
    {
      id: "2",
      date: "2023-09-01",
      userId: "lec2",
      userName: "Jane Smith",
      employeeId: "EMP002",
      inTime: "09:15",
      outTime: "17:30",
      duration: "8h 15m",
      status: "present",
    },
    {
      id: "3",
      date: "2023-09-01",
      userId: "lec3",
      userName: "Bob Johnson",
      employeeId: "EMP003",
      inTime: "",
      outTime: "",
      duration: "",
      status: "absent",
    },
    {
      id: "4",
      date: "2023-09-02",
      userId: "lec1",
      userName: "John Doe",
      employeeId: "EMP001",
      inTime: "08:45",
      outTime: "16:45",
      duration: "8h 0m",
      status: "present",
    },
    {
      id: "5",
      date: "2023-09-02",
      userId: "lec2",
      userName: "Jane Smith",
      employeeId: "EMP002",
      inTime: "09:30",
      outTime: "17:45",
      duration: "8h 15m",
      status: "present",
    },
    {
      id: "6",
      date: "2023-09-02",
      userId: "lec3",
      userName: "Bob Johnson",
      employeeId: "EMP003",
      inTime: "09:00",
      outTime: "17:00",
      duration: "8h 0m",
      status: "present",
    },
  ])

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [editRecord, setEditRecord] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isLoadingDb, setIsLoadingDb] = useState(true)
  const { toast } = useToast()

  const [lecturers, setLecturers] = useState([
    { id: "lec1", name: "John Doe", employeeId: "EMP001" },
    { id: "lec2", name: "Jane Smith", employeeId: "EMP002" },
    { id: "lec3", name: "Bob Johnson", employeeId: "EMP003" },
  ])

  // Simulate a database connection check
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingDb(false) // After 2 seconds, pretend DB is connected for demo purposes
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Update attendance module to have fixed checkout time (8 hours)
  const calculateDuration = (inTime: string, outTime: string): string => {
    if (!inTime || !outTime) return ""

    const [inHour, inMinute] = inTime.split(":").map(Number)
    const [outHour, outMinute] = outTime.split(":").map(Number)

    let durationHours = outHour - inHour
    let durationMinutes = outMinute - inMinute

    if (durationMinutes < 0) {
      durationHours -= 1
      durationMinutes += 60
    }

    return `${durationHours}h ${durationMinutes}m`
  }

  const handleMarkAttendance = (userId: string, status: string, inTime: string = "") => {
    // Find if there's already an attendance record for this user on this date
    const dateString = selectedDate.toISOString().split("T")[0]
    const existingRecordIndex = attendance.findIndex((record) => record.userId === userId && record.date === dateString)

    // Calculate outTime as 8 hours after inTime
    let outTime = ""
    if (inTime && status === "present") {
      const [hours, minutes] = inTime.split(":").map(Number)
      const outHours = hours + 8
      outTime = `${outHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    }

    if (existingRecordIndex >= 0) {
      // Update existing record
      const updatedAttendance = [...attendance]
      updatedAttendance[existingRecordIndex] = {
        ...updatedAttendance[existingRecordIndex],
        inTime,
        outTime,
        duration: calculateDuration(inTime, outTime),
        status,
      }
      setAttendance(updatedAttendance)
    } else {
      // Create new record
      const newRecord = {
        id: Math.random().toString(36).substring(2, 9),
        date: dateString,
        userId,
        userName: lecturers.find((lecturer) => lecturer.id === userId)?.name || "Unknown",
        employeeId: lecturers.find((lecturer) => lecturer.id === userId)?.employeeId || "Unknown",
        inTime,
        outTime,
        duration: calculateDuration(inTime, outTime),
        status,
      }
      setAttendance([...attendance, newRecord])
    }

    toast({
      title: "Success",
      description: `Attendance ${status === "present" ? "marked" : "updated"} successfully`,
    })
  }

  const handleUpdateAttendance = (e) => {
    e.preventDefault()

    const updatedAttendance = attendance.map((record) =>
      record.id === editRecord.id
        ? {
            ...editRecord,
            duration: calculateDuration(editRecord.inTime, editRecord.outTime),
          }
        : record,
    )

    setAttendance(updatedAttendance)
    setEditRecord(null)

    toast({
      title: "Success",
      description: "Attendance record updated successfully",
    })
  }

  const handleBulkAction = (action) => {
    const dateString = selectedDate.toISOString().split("T")[0]
    let updatedAttendance = [...attendance]

    // Get all users who don't have a record for this date
    const usersWithoutRecord = lecturers.filter(
      (lecturer) => !attendance.some((record) => record.userId === lecturer.id && record.date === dateString),
    )

    if (action === "markAllPresent") {
      // Update existing records for this date to present
      updatedAttendance = updatedAttendance.map((record) =>
        record.date === dateString
          ? {
              ...record,
              inTime: "09:00",
              outTime: "17:00",
              duration: "8h 0m",
              status: "present",
            }
          : record,
      )

      // Add new records for users without a record
      usersWithoutRecord.forEach((lecturer) => {
        updatedAttendance.push({
          id: Math.random().toString(36).substring(2, 9),
          date: dateString,
          userId: lecturer.id,
          userName: lecturer.name,
          employeeId: lecturer.employeeId,
          inTime: "09:00",
          outTime: "17:00",
          duration: "8h 0m",
          status: "present",
        })
      })
    } else if (action === "markAllAbsent") {
      // Update existing records for this date to absent
      updatedAttendance = updatedAttendance.map((record) =>
        record.date === dateString
          ? {
              ...record,
              inTime: "",
              outTime: "",
              duration: "",
              status: "absent",
            }
          : record,
      )

      // Add new records for users without a record
      usersWithoutRecord.forEach((lecturer) => {
        updatedAttendance.push({
          id: Math.random().toString(36).substring(2, 9),
          date: dateString,
          userId: lecturer.id,
          userName: lecturer.name,
          employeeId: lecturer.employeeId,
          inTime: "",
          outTime: "",
          duration: "",
          status: "absent",
        })
      })
    }

    setAttendance(updatedAttendance)

    toast({
      title: "Success",
      description: `All attendance records for ${selectedDate.toDateString()} marked as ${action === "markAllPresent" ? "present" : "absent"}`,
    })
  }

  // Update the handleSelfAttendance function
  const handleSelfAttendance = (status) => {
    if (!user) return

    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

    // Calculate outTime as 8 hours after inTime
    let outTime = ""
    if (status === "present") {
      const [hours, minutes] = currentTime.split(":").map(Number)
      const outHours = hours + 8
      outTime = `${outHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    }

    handleMarkAttendance(user.id, status, status === "present" ? currentTime : "", outTime)

    toast({
      title: "Success",
      description:
        status === "present"
          ? "You have marked yourself present for today"
          : "You have marked yourself absent for today",
    })
  }

  // Filter attendance records for the selected date
  const filteredAttendance = attendance.filter((record) => {
    const matchesDate = record.date === selectedDate.toISOString().split("T")[0]

    // For lecturers, only show their own records
    if (role === "lecturer") {
      return matchesDate && record.userId === user.id
    }

    // For admins/superadmins, filter based on search and status
    const matchesSearch = record.userName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || record.status === filterStatus

    return matchesDate && matchesSearch && matchesStatus
  })

  // Get attendance statistics
  const getAttendanceStats = () => {
    const dateString = selectedDate.toISOString().split("T")[0]
    const recordsForDate = attendance.filter((record) => record.date === dateString)

    const totalRecords = recordsForDate.length
    const presentCount = recordsForDate.filter((record) => record.status === "present").length
    const absentCount = recordsForDate.filter((record) => record.status === "absent").length

    const presentPercentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0

    return {
      totalRecords,
      presentCount,
      absentCount,
      presentPercentage: presentPercentage.toFixed(0),
    }
  }

  const stats = getAttendanceStats()

  // Check user record for today
  const getTodayUserRecord = () => {
    const today = new Date().toISOString().split("T")[0]
    return attendance.find((record) => record.userId === user?.id && record.date === today)
  }

  const userTodayRecord = getTodayUserRecord()

  if (role !== "lecturer" && role !== "admin" && role !== "superAdmin") {
    return <div>Access Denied</div>
  }

  if (isLoadingDb) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Attendance Tracking</h1>
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connecting to Database</AlertTitle>
          <AlertDescription>
            Please wait while we connect to the database to retrieve attendance records.
          </AlertDescription>
        </Alert>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  // Different layout for lecturers vs admin/superadmin
  if (role === "lecturer") {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Attendance Management</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mark Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center sm:flex-row sm:justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-medium mb-2">Today's Status</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {userTodayRecord
                    ? `You are marked as ${userTodayRecord.status} today`
                    : "You haven't marked your attendance for today"}
                </p>
                {userTodayRecord && userTodayRecord.status === "present" && (
                  <div className="text-sm">
                    <span className="font-medium">Check-in:</span> {userTodayRecord.inTime}
                    {userTodayRecord.outTime && (
                      <>
                        <span className="mx-2">|</span>
                        <span className="font-medium">Expected Check-out:</span> {userTodayRecord.outTime}
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleSelfAttendance("present")}
                  className="flex items-center"
                  disabled={userTodayRecord?.status === "present"}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Mark Present
                </Button>
                <Button
                  onClick={() => handleSelfAttendance("absent")}
                  variant="outline"
                  className="flex items-center"
                  disabled={userTodayRecord?.status === "absent"}
                >
                  <UserX className="mr-2 h-4 w-4" />
                  Mark Absent
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>My Attendance Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border mx-auto"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance for {selectedDate.toDateString()}</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredAttendance.length > 0 ? (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Check-in</TableHead>
                        <TableHead>Check-out</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAttendance.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <Badge
                              className={
                                record.status === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.inTime || "-"}</TableCell>
                          <TableCell>{record.outTime || "-"}</TableCell>
                          <TableCell>{record.duration || "-"}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Update Attendance</DialogTitle>
                                  <DialogDescription>
                                    Update your attendance record for {selectedDate.toDateString()}
                                  </DialogDescription>
                                </DialogHeader>
                                {editRecord && (
                                  <form onSubmit={handleUpdateAttendance} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="inTime">Check-in Time</Label>
                                        <Input
                                          id="inTime"
                                          type="time"
                                          value={editRecord.inTime}
                                          onChange={(e) => setEditRecord({ ...editRecord, inTime: e.target.value })}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="outTime">Check-out Time</Label>
                                        <Input
                                          id="outTime"
                                          type="time"
                                          value={editRecord.outTime}
                                          onChange={(e) => setEditRecord({ ...editRecord, outTime: e.target.value })}
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="status">Status</Label>
                                      <div className="flex space-x-4">
                                        <Button
                                          type="button"
                                          variant={editRecord.status === "present" ? "default" : "outline"}
                                          onClick={() => setEditRecord({ ...editRecord, status: "present" })}
                                        >
                                          <UserCheck className="h-4 w-4 mr-2" />
                                          Present
                                        </Button>
                                        <Button
                                          type="button"
                                          variant={editRecord.status === "absent" ? "default" : "outline"}
                                          onClick={() => setEditRecord({ ...editRecord, status: "absent" })}
                                        >
                                          <UserX className="h-4 w-4 mr-2" />
                                          Absent
                                        </Button>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button type="submit">Save Changes</Button>
                                    </DialogFooter>
                                  </form>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No attendance record found for this date.</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>My Attendance Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Present Days</p>
                    <p className="text-xl font-bold">
                      {attendance.filter((record) => record.userId === user?.id && record.status === "present").length}
                    </p>
                  </div>
                  <UserCheck className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Absent Days</p>
                    <p className="text-xl font-bold">
                      {attendance.filter((record) => record.userId === user?.id && record.status === "absent").length}
                    </p>
                  </div>
                  <UserX className="h-8 w-8 text-red-500" />
                </div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Attendance Rate</p>
                    <p className="text-xl font-bold">
                      {attendance.filter((record) => record.userId === user?.id).length > 0
                        ? Math.round(
                            (attendance.filter((record) => record.userId === user?.id && record.status === "present")
                              .length /
                              attendance.filter((record) => record.userId === user?.id).length) *
                              100,
                          )
                        : 0}
                      %
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin/SuperAdmin View
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Attendance Tracking</h1>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Records</p>
                <p className="text-2xl font-bold">{stats.totalRecords}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full">
                <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Present</p>
                <p className="text-2xl font-bold">{stats.presentCount}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-800 p-3 rounded-full">
                <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-red-600 dark:text-red-400">Absent</p>
                <p className="text-2xl font-bold">{stats.absentCount}</p>
              </div>
              <div className="bg-red-100 dark:bg-red-800 p-3 rounded-full">
                <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">Attendance Rate</p>
                <p className="text-2xl font-bold">{stats.presentPercentage}%</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-800 p-3 rounded-full">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />

            <div className="mt-4 flex space-x-2">
              <Button variant="outline" className="flex-1" onClick={() => handleBulkAction("markAllPresent")}>
                <UserCheck className="h-4 w-4 mr-2" />
                Mark All Present
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => handleBulkAction("markAllAbsent")}>
                <UserX className="h-4 w-4 mr-2" />
                Mark All Absent
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance for {selectedDate.toDateString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>In Time</TableHead>
                  <TableHead>Out Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.userName}</TableCell>
                    <TableCell>{record.employeeId}</TableCell>
                    <TableCell>{record.inTime || "-"}</TableCell>
                    <TableCell>{record.outTime || "-"}</TableCell>
                    <TableCell>{record.duration || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          record.status === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="View Attendance"
                              onClick={() => setSelectedRecord(record)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Attendance Details</DialogTitle>
                              <DialogDescription>View attendance information</DialogDescription>
                            </DialogHeader>
                            {selectedRecord && (
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Name</Label>
                                    <div className="font-medium">{selectedRecord.userName}</div>
                                  </div>
                                  <div>
                                    <Label>Employee ID</Label>
                                    <div className="font-medium">{selectedRecord.employeeId}</div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>In Time</Label>
                                    <div className="font-medium">{selectedRecord.inTime || "-"}</div>
                                  </div>
                                  <div>
                                    <Label>Out Time</Label>
                                    <div className="font-medium">{selectedRecord.outTime || "-"}</div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Duration</Label>
                                    <div className="font-medium">{selectedRecord.duration || "-"}</div>
                                  </div>
                                  <div>
                                    <Label>Status</Label>
                                    <div className="font-medium">
                                      <Badge
                                        className={
                                          selectedRecord.status === "present"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }
                                      >
                                        {selectedRecord.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="Edit Attendance"
                              onClick={() => setEditRecord(record)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Attendance</DialogTitle>
                              <DialogDescription>Update attendance information</DialogDescription>
                            </DialogHeader>
                            {editRecord && (
                              <form onSubmit={handleUpdateAttendance} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="inTime">In Time</Label>
                                    <Input
                                      id="inTime"
                                      type="time"
                                      value={editRecord.inTime}
                                      onChange={(e) => setEditRecord({ ...editRecord, inTime: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="outTime">Out Time</Label>
                                    <Input
                                      id="outTime"
                                      type="time"
                                      value={editRecord.outTime}
                                      onChange={(e) => setEditRecord({ ...editRecord, outTime: e.target.value })}
                                    />{" "}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="status">Status</Label>
                                  <div className="flex space-x-4">
                                    <Button
                                      type="button"
                                      variant={editRecord.status === "present" ? "default" : "outline"}
                                      onClick={() => setEditRecord({ ...editRecord, status: "present" })}
                                    >
                                      <UserCheck className="h-4 w-4 mr-2" />
                                      Present
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={editRecord.status === "absent" ? "default" : "outline"}
                                      onClick={() => setEditRecord({ ...editRecord, status: "absent" })}
                                    >
                                      <UserX className="h-4 w-4 mr-2" />
                                      Absent
                                    </Button>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button type="submit">Save Changes</Button>
                                </DialogFooter>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>

                        {record.status === "absent" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600"
                            onClick={() => handleMarkAttendance(record.userId, "present", "09:00")}
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Mark Present
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={() => handleMarkAttendance(record.userId, "absent", "")}
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Mark Absent
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredAttendance.length === 0 && (
              <div className="text-center py-4 text-gray-500">No attendance records for this date.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

