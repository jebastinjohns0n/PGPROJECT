"use client"

import type React from "react"

import { useState } from "react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Pencil, Trash2, DollarSign, CheckCircle, XCircle, IndianRupee, Printer } from "lucide-react"

export default function Payroll() {
  const { role } = useAuth()
  const [payrollData, setPayrollData] = useState([
    {
      id: "1",
      employee: "John Doe",
      employeeId: "EMP001",
      month: "September 2023",
      salary: 5000,
      bonus: 500,
      deductions: 200,
      netPay: 5300,
      status: "paid",
      paymentDate: "2023-09-30",
    },
    {
      id: "2",
      employee: "Jane Smith",
      employeeId: "EMP002",
      month: "September 2023",
      salary: 4800,
      bonus: 300,
      deductions: 150,
      netPay: 4950,
      status: "paid",
      paymentDate: "2023-09-30",
    },
    {
      id: "3",
      employee: "Bob Johnson",
      employeeId: "EMP003",
      month: "September 2023",
      salary: 4500,
      bonus: 0,
      deductions: 100,
      netPay: 4400,
      status: "unpaid",
      paymentDate: "",
    },
  ])

  const [newEntry, setNewEntry] = useState({
    employee: "",
    employeeId: "",
    month: `${new Date().toLocaleString("default", { month: "long" })} ${new Date().getFullYear()}`,
    salary: "",
    bonus: "",
    deductions: "",
    status: "unpaid",
    paymentDate: "",
  })

  const [editEntry, setEditEntry] = useState(null)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [lecturers, setLecturers] = useState([
    { id: "lec1", name: "John Doe" },
    { id: "lec2", name: "Jane Smith" },
    { id: "lec3", name: "Bob Johnson" },
  ])
  const { toast } = useToast()

  const calculateNetPay = (salary, bonus, deductions) => {
    const salaryNum = Number.parseFloat(salary) || 0
    const bonusNum = Number.parseFloat(bonus) || 0
    const deductionsNum = Number.parseFloat(deductions) || 0
    return salaryNum + bonusNum - deductionsNum
  }

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault()

    // Generate a random ID for the new entry
    const newId = Math.random().toString(36).substring(2, 9)
    const lecturer = lecturers.find((l) => l.id === newEntry.employeeId)

    const entryToAdd = {
      ...newEntry,
      id: newId,
      employee: lecturer ? lecturer.name : "Unknown",
      netPay: calculateNetPay(newEntry.salary, newEntry.bonus, newEntry.deductions),
      paymentDate: newEntry.status === "paid" ? new Date().toISOString().split("T")[0] : "",
    }

    setPayrollData([...payrollData, entryToAdd])
    toast({
      title: "Success",
      description: "Payroll entry added successfully",
    })
    setNewEntry({
      employee: "",
      employeeId: "",
      month: `${new Date().toLocaleString("default", { month: "long" })} ${new Date().getFullYear()}`,
      salary: "",
      bonus: "",
      deductions: "",
      status: "unpaid",
      paymentDate: "",
    })
  }

  const handleEditEntry = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedEntry = {
      ...editEntry,
      netPay: calculateNetPay(editEntry.salary, editEntry.bonus, editEntry.deductions),
      paymentDate: editEntry.status === "paid" ? editEntry.paymentDate || new Date().toISOString().split("T")[0] : "",
    }

    const updatedPayroll = payrollData.map((entry) => (entry.id === editEntry.id ? updatedEntry : entry))

    setPayrollData(updatedPayroll)
    toast({
      title: "Success",
      description: "Payroll entry updated successfully",
    })
    setEditEntry(null)
  }

  const handleDeleteEntry = (entryId: string) => {
    const updatedPayroll = payrollData.filter((entry) => entry.id !== entryId)
    setPayrollData(updatedPayroll)
    toast({
      title: "Success",
      description: "Payroll entry deleted successfully",
    })
  }

  const handleStatusChange = (entryId: string, newStatus: string) => {
    const updatedPayroll = payrollData.map((entry) =>
      entry.id === entryId
        ? {
            ...entry,
            status: newStatus,
            paymentDate: newStatus === "paid" ? new Date().toISOString().split("T")[0] : "",
          }
        : entry,
    )

    setPayrollData(updatedPayroll)
    toast({
      title: "Success",
      description: `Payment status changed to ${newStatus}`,
    })
  }

  if (role !== "admin" && role !== "superAdmin") {
    return <div>Access Denied</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payroll Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Payroll Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                <IndianRupee className="mr-2 h-4 w-4" />

                  Add Payroll Entry
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Payroll Entry</DialogTitle>
                  <DialogDescription>Enter the details for the new payroll entry.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddEntry} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee">Employee</Label>
                    <Select
                      value={newEntry.employeeId}
                      onValueChange={(value) => setNewEntry({ ...newEntry, employeeId: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {lecturers.map((lecturer) => (
                          <SelectItem key={lecturer.id} value={lecturer.id}>
                            {lecturer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="month">Month</Label>
                    <Input
                      id="month"
                      value={newEntry.month}
                      onChange={(e) => setNewEntry({ ...newEntry, month: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary</Label>
                      <Input
                        id="salary"
                        type="number"
                        value={newEntry.salary}
                        onChange={(e) => setNewEntry({ ...newEntry, salary: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bonus">Bonus</Label>
                      <Input
                        id="bonus"
                        type="number"
                        value={newEntry.bonus}
                        onChange={(e) => setNewEntry({ ...newEntry, bonus: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deductions">Deductions</Label>
                      <Input
                        id="deductions"
                        type="number"
                        value={newEntry.deductions}
                        onChange={(e) => setNewEntry({ ...newEntry, deductions: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newEntry.status}
                        onValueChange={(value) => setNewEntry({ ...newEntry, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Entry</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.employee}</TableCell>
                  <TableCell>{entry.employeeId}</TableCell>
                  <TableCell>{entry.month}</TableCell>
                  <TableCell>₹{entry.salary}</TableCell>
                  <TableCell>₹{entry.bonus}</TableCell>
                  <TableCell>₹{entry.deductions}</TableCell>
                  <TableCell>₹{entry.netPay}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        entry.status === "paid" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {entry.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="View Payroll Entry"
                            onClick={() => setSelectedEntry(entry)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Payroll Entry Details</DialogTitle>
                            <DialogDescription>View payroll information</DialogDescription>
                          </DialogHeader>
                          {selectedEntry && (
                            <>
                              <div className="grid gap-4 py-4">
                                <div className="flex justify-between items-center">
                                  <h3 className="text-lg font-semibold">Pay Slip</h3>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="print:hidden"
                                    onClick={() => window.print()}
                                  >
                                    <Printer className="h-4 w-4 mr-2" />
                                    Print
                                  </Button>
                                </div>
                                <div className="print:border-t print:border-b print:py-4">
                                  <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                      <Label className="text-muted-foreground">Employee</Label>
                                      <div className="font-medium text-lg">{selectedEntry.employee}</div>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Employee ID</Label>
                                      <div className="font-medium text-lg">{selectedEntry.employeeId}</div>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                      <Label className="text-muted-foreground">Month</Label>
                                      <div className="font-medium">{selectedEntry.month}</div>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Payment Date</Label>
                                      <div className="font-medium">
                                        {selectedEntry.status === "paid" ? selectedEntry.paymentDate : "Pending"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 print:border-t print:border-dashed print:pt-4">
                                    <div>
                                      <Label className="text-muted-foreground">Basic Salary</Label>
                                      <div className="font-medium">
                                        <IndianRupee className="h-4 w-4 inline mr-1" />
                                        {selectedEntry.salary}
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Bonus</Label>
                                      <div className="font-medium">
                                        <IndianRupee className="h-4 w-4 inline mr-1" />
                                        {selectedEntry.bonus}
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Deductions</Label>
                                      <div className="font-medium text-red-600">
                                        <IndianRupee className="h-4 w-4 inline mr-1" />
                                        {selectedEntry.deductions}
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Net Pay</Label>
                                      <div className="font-medium text-lg text-green-600">
                                        <IndianRupee className="h-4 w-4 inline mr-1" />
                                        {selectedEntry.netPay}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-6 print:border-t print:pt-4">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-muted-foreground">Status</Label>
                                      <span
                                        className={`px-3 py-1 rounded-full text-sm ${
                                          selectedEntry.status === "paid"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-amber-100 text-amber-800"
                                        }`}
                                      >
                                        {selectedEntry.status.charAt(0).toUpperCase() + selectedEntry.status.slice(1)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <style jsx global>{`
                                  @media print {
                                    body * {
                                      visibility: hidden;
                                    }
                                    .DialogContent,
                                    .DialogContent * {
                                      visibility: visible;
                                    }
                                    .DialogContent {
                                      position: absolute;
                                      left: 0;
                                      top: 0;
                                      width: 100%;
                                    }
                                    .print\\:hidden {
                                      display: none;
                                    }
                                  }
                                `}</style>
                              </div>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Edit Payroll Entry"
                            onClick={() => setEditEntry(entry)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Payroll Entry</DialogTitle>
                            <DialogDescription>Update payroll information</DialogDescription>
                          </DialogHeader>
                          {editEntry && (
                            <form onSubmit={handleEditEntry} className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-employee">Employee</Label>
                                <Input id="edit-employee" value={editEntry.employee} disabled />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-month">Month</Label>
                                <Input
                                  id="edit-month"
                                  value={editEntry.month}
                                  onChange={(e) => setEditEntry({ ...editEntry, month: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-salary">Salary</Label>
                                  <Input
                                    id="edit-salary"
                                    type="number"
                                    value={editEntry.salary}
                                    onChange={(e) => setEditEntry({ ...editEntry, salary: e.target.value })}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-bonus">Bonus</Label>
                                  <Input
                                    id="edit-bonus"
                                    type="number"
                                    value={editEntry.bonus}
                                    onChange={(e) => setEditEntry({ ...editEntry, bonus: e.target.value })}
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-deductions">Deductions</Label>
                                  <Input
                                    id="edit-deductions"
                                    type="number"
                                    value={editEntry.deductions}
                                    onChange={(e) => setEditEntry({ ...editEntry, deductions: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-status">Status</Label>
                                  <Select
                                    value={editEntry.status}
                                    onValueChange={(value) => setEditEntry({ ...editEntry, status: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="paid">Paid</SelectItem>
                                      <SelectItem value="unpaid">Unpaid</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit">Save Changes</Button>
                              </DialogFooter>
                            </form>
                          )}
                        </DialogContent>
                      </Dialog>

                      {entry.status === "unpaid" ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-500"
                          title="Mark as Paid"
                          onClick={() => handleStatusChange(entry.id, "paid")}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-amber-500"
                          title="Mark as Unpaid"
                          onClick={() => handleStatusChange(entry.id, "unpaid")}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        title="Delete Payroll Entry"
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
