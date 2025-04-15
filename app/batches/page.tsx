"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Pencil, Trash2 } from "lucide-react"

export default function Batches() {
  const { role } = useAuth()
  const [batches, setBatches] = useState([
    {
      id: "1",
      year: "2023",
      month: "January",
      batchName: "B1",
      lecturer: "John Doe",
      lecturerId: "lec1",
      startDate: "2023-01-10",
      endDate: "2023-03-15",
      status: "completed",
    },
    {
      id: "2",
      year: "2023",
      month: "March",
      batchName: "B2",
      lecturer: "Jane Smith",
      lecturerId: "lec2",
      startDate: "2023-03-20",
      endDate: "2023-05-25",
      status: "completed",
    },
    {
      id: "3",
      year: "2023",
      month: "June",
      batchName: "B3",
      lecturer: "Bob Johnson",
      lecturerId: "lec3",
      startDate: "2023-06-05",
      endDate: "2023-08-10",
      status: "in-progress",
    },
    {
      id: "4",
      year: "2023",
      month: "September",
      batchName: "B4",
      lecturer: "John Doe",
      lecturerId: "lec1",
      startDate: "2023-09-15",
      endDate: "2023-11-20",
      status: "upcoming",
    },
  ])
  async function fetchUserData() {
    console.log('Fetching user data...', batches);
    try {
      const response = await fetch(`http://localhost:8090/api/batches`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const userData = await response.json();
      console.log('User Data:', userData);
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  const [newBatch, setBatchUser] = useState({
    year: new Date().getFullYear().toString(),
    month: new Date().toLocaleString("default", { month: "long" }),
    batchName: "B1",
    lecturerId: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split("T")[0],
    status: "upcoming",
  })

  const [editBatch, setEditBatch] = useState(null)
  const [lecturers, setLecturers] = useState([
    { id: "lec1", name: "John Doe" },
    { id: "lec2", name: "Jane Smith" },
    { id: "lec3", name: "Bob Johnson" },
  ])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [batchesPerPage] = useState(10)
  const [selectedBatch, setSelectedBatch] = useState(null)
  const { toast } = useToast()

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const batchOptions = ["B1", "B2", "B3", "B4"]
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i).toString())

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault()
    // Generate a random ID for the new batch
    const newId = Math.random().toString(36).substring(2, 9)
    const lecturer = lecturers.find((l) => l.id === newBatch.lecturerId)

    const batchToAdd = {
      ...newBatch,
      id: newId,
      lecturer: lecturer ? lecturer.name : "Unassigned",
    }

    setBatches([...batches, batchToAdd])
    toast({
      title: "Success",
      description: "Batch added successfully",
    })
    setBatchUser({
      year: new Date().getFullYear().toString(),
      month: new Date().toLocaleString("default", { month: "long" }),
      batchName: "B1",
      lecturerId: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split("T")[0],
      status: "upcoming",
    })
  }

  const handleEditBatch = (e: React.FormEvent) => {
    e.preventDefault()
    const lecturer = lecturers.find((l) => l.id === editBatch.lecturerId)
    const updatedBatch = {
      ...editBatch,
      lecturer: lecturer ? lecturer.name : "Unassigned",
    }

    const updatedBatches = batches.map((batch) => (batch.id === editBatch.id ? updatedBatch : batch))

    setBatches(updatedBatches)
    toast({
      title: "Success",
      description: "Batch updated successfully",
    })
    setEditBatch(null)
  }

  const handleDeleteBatch = (batchId: string) => {
    const updatedBatches = batches.filter((batch) => batch.id !== batchId)
    setBatches(updatedBatches)
    toast({
      title: "Success",
      description: "Batch deleted successfully",
    })
  }

  const filteredBatches = batches.filter(
    (batch: any) =>
      batch.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.year.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.lecturer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const indexOfLastBatch = currentPage * batchesPerPage
  const indexOfFirstBatch = indexOfLastBatch - batchesPerPage
  const currentBatches = filteredBatches.slice(indexOfFirstBatch, indexOfLastBatch)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Get batches for the selected date
  const getBatchesForSelectedDate = () => {
    const dateString = selectedDate.toISOString().split("T")[0]
    return batches.filter(
      (batch) => new Date(batch.startDate) <= selectedDate && new Date(batch.endDate) >= selectedDate,
    )
  }

  const batchesOnSelectedDate = getBatchesForSelectedDate()

  if (role !== "admin" && role !== "superAdmin") {
    return <div>Access Denied</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Batches</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Batch Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Search batches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add Batch</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Batch</DialogTitle>
                  <DialogDescription>Enter the details for the new batch.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddBatch} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Select
                        value={newBatch.year}
                        onValueChange={(value) => setBatchUser({ ...newBatch, year: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="month">Month</Label>
                      <Select
                        value={newBatch.month}
                        onValueChange={(value) => setBatchUser({ ...newBatch, month: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="batchName">Batch Name</Label>
                      <Select
                        value={newBatch.batchName}
                        onValueChange={(value) => setBatchUser({ ...newBatch, batchName: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select batch" />
                        </SelectTrigger>
                        <SelectContent>
                          {batchOptions.map((batch) => (
                            <SelectItem key={batch} value={batch}>
                              {batch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lecturer">Lecturer</Label>
                      <Select
                        value={newBatch.lecturerId}
                        onValueChange={(value) => setBatchUser({ ...newBatch, lecturerId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a lecturer" />
                        </SelectTrigger>
                        <SelectContent>
                          {lecturers.map((lecturer: any) => (
                            <SelectItem key={lecturer.id} value={lecturer.id}>
                              {lecturer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newBatch.startDate}
                        onChange={(e) => setBatchUser({ ...newBatch, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newBatch.endDate}
                        onChange={(e) => setBatchUser({ ...newBatch, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newBatch.status}
                      onValueChange={(value) => setBatchUser({ ...newBatch, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Batch</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Lecturer</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentBatches.map((batch: any) => (
                <TableRow key={batch.id}>
                  <TableCell>{batch.year}</TableCell>
                  <TableCell>{batch.month}</TableCell>
                  <TableCell>{batch.batchName}</TableCell>
                  <TableCell>{batch.lecturer}</TableCell>
                  <TableCell>{batch.startDate}</TableCell>
                  <TableCell>{batch.endDate}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        batch.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : batch.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {batch.status.charAt(0).toUpperCase() + batch.status.slice(1).replace("-", " ")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="View Batch">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Batch Details</DialogTitle>
                            <DialogDescription>View batch information</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Year</Label>
                                <div className="font-medium">{batch.year}</div>
                              </div>
                              <div>
                                <Label>Month</Label>
                                <div className="font-medium">{batch.month}</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Batch Name</Label>
                                <div className="font-medium">{batch.batchName}</div>
                              </div>
                              <div>
                                <Label>Lecturer</Label>
                                <div className="font-medium">{batch.lecturer}</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Start Date</Label>
                                <div className="font-medium">{batch.startDate}</div>
                              </div>
                              <div>
                                <Label>End Date</Label>
                                <div className="font-medium">{batch.endDate}</div>
                              </div>
                            </div>
                            <div>
                              <Label>Status</Label>
                              <div className="font-medium">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    batch.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : batch.status === "in-progress"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {batch.status.charAt(0).toUpperCase() + batch.status.slice(1).replace("-", " ")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit Batch">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Batch</DialogTitle>
                            <DialogDescription>Edit the batch details.</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleEditBatch} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-year">Year</Label>
                                <Select
                                  value={editBatch?.year || ""}
                                  onValueChange={(value) => setEditBatch({ ...editBatch, year: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select year" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {years.map((year) => (
                                      <SelectItem key={year} value={year}>
                                        {year}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-month">Month</Label>
                                <Select
                                  value={editBatch?.month || ""}
                                  onValueChange={(value) => setEditBatch({ ...editBatch, month: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select month" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {months.map((month) => (
                                      <SelectItem key={month} value={month}>
                                        {month}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-batchName">Batch Name</Label>
                                <Select
                                  value={editBatch?.batchName || ""}
                                  onValueChange={(value) => setEditBatch({ ...editBatch, batchName: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select batch" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {batchOptions.map((batch) => (
                                      <SelectItem key={batch} value={batch}>
                                        {batch}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-lecturer">Lecturer</Label>
                                <Select
                                  value={editBatch?.lecturerId || ""}
                                  onValueChange={(value) => setEditBatch({ ...editBatch, lecturerId: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a lecturer" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {lecturers.map((lecturer: any) => (
                                      <SelectItem key={lecturer.id} value={lecturer.id}>
                                        {lecturer.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-startDate">Start Date</Label>
                                <Input
                                  id="edit-startDate"
                                  type="date"
                                  value={editBatch?.startDate || ""}
                                  onChange={(e) => setEditBatch({ ...editBatch, startDate: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-endDate">End Date</Label>
                                <Input
                                  id="edit-endDate"
                                  type="date"
                                  value={editBatch?.endDate || ""}
                                  onChange={(e) => setEditBatch({ ...editBatch, endDate: e.target.value })}
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-status">Status</Label>
                              <Select
                                value={editBatch?.status || ""}
                                onValueChange={(value) => setEditBatch({ ...editBatch, status: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="upcoming">Upcoming</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        title="Delete Batch"
                        onClick={() => handleDeleteBatch(batch.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-center space-x-2 mt-4">
            {Array.from({ length: Math.ceil(filteredBatches.length / batchesPerPage) }, (_, i) => (
              <Button key={i} onClick={() => paginate(i + 1)} variant={currentPage === i + 1 ? "default" : "outline"}>
                {i + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

