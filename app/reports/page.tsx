"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDown, Eye, Download, Filter, Calendar, User, FileText, UserCheck, Calculator, FileSpreadsheet } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from 'xlsx'

export default function Reports() {
  const { role } = useAuth()
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [month, setMonth] = useState("all")
  const [selectedEmployee, setSelectedEmployee] = useState("all")
  const [activeTab, setActiveTab] = useState("batches")
  const [selectedReport, setSelectedReport] = useState(null)
  const [employeeSummary, setEmployeeSummary] = useState(null)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  // Sample employees list
  const [employees, setEmployees] = useState([
    { id: "EMP001", name: "John Doe", role: "lecturer" },
    { id: "EMP002", name: "Jane Smith", role: "lecturer" },
    { id: "EMP003", name: "Bob Johnson", role: "lecturer" },
    { id: "EMP004", name: "Alice Brown", role: "lecturer" },
    { id: "EMP005", name: "Charlie Wilson", role: "lecturer" },
    { id: "EMP006", name: "Diana Miller", role: "lecturer" },
  ])

  // Months array for filter
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];

  const years = ["2022", "2023", "2024", "2025"];

  // Sample batch completion data
  const [batchCompletions, setBatchCompletions] = useState([
    {
      id: "1",
      batchName: "Batch A",
      employeeId: "EMP001",
      employeeName: "John Doe",
      startDate: "2023-01-01",
      endDate: "2023-03-31",
      studentsEnrolled: 25,
      studentsCompleted: 23,
      completionRate: 92,
      status: "completed"
    },
    {
      id: "2",
      batchName: "Batch B",
      employeeId: "EMP002",
      employeeName: "Jane Smith",
      startDate: "2023-02-01",
      endDate: "2023-04-30",
      studentsEnrolled: 30,
      studentsCompleted: 28,
      completionRate: 93,
      status: "completed"
    },
    {
      id: "3",
      batchName: "Batch C",
      employeeId: "EMP003",
      employeeName: "Bob Johnson",
      startDate: "2023-03-01",
      endDate: "2023-05-31",
      studentsEnrolled: 35,
      studentsCompleted: 33,
      completionRate: 94,
      status: "completed"
    },
    {
      id: "4",
      batchName: "Batch D",
      employeeId: "EMP001",
      employeeName: "John Doe",
      startDate: "2023-04-01",
      endDate: "2023-06-30",
      studentsEnrolled: 20,
      studentsCompleted: 18,
      completionRate: 90,
      status: "completed"
    },
    {
      id: "5",
      batchName: "Batch E",
      employeeId: "EMP002",
      employeeName: "Jane Smith",
      startDate: "2023-05-01",
      endDate: "2023-07-31",
      studentsEnrolled: 25,
      studentsCompleted: 0,
      completionRate: 0,
      status: "in-progress"
    },
  ])

  // Sample payslip data
  const [payslips, setPayslips] = useState([
    {
      id: "1",
      employeeId: "EMP001",
      employeeName: "John Doe",
      month: "2023-01",
      baseSalary: 50000,
      bonus: 5000,
      deductions: 2000,
      netPay: 53000,
      status: "paid"
    },
    {
      id: "2",
      employeeId: "EMP001",
      employeeName: "John Doe",
      month: "2023-02",
      baseSalary: 50000,
      bonus: 3000,
      deductions: 2000,
      netPay: 51000,
      status: "paid"
    },
    {
      id: "3",
      employeeId: "EMP002",
      employeeName: "Jane Smith",
      month: "2023-01",
      baseSalary: 55000,
      bonus: 5500,
      deductions: 2200,
      netPay: 58300,
      status: "paid"
    },
    {
      id: "4",
      employeeId: "EMP002",
      employeeName: "Jane Smith",
      month: "2023-02",
      baseSalary: 55000,
      bonus: 2000,
      deductions: 2200,
      netPay: 56500,
      status: "paid"
    },
    {
      id: "5",
      employeeId: "EMP003",
      employeeName: "Bob Johnson",
      month: "2023-01",
      baseSalary: 45000,
      bonus: 3000,
      deductions: 1000,
      netPay: 47000,
      status: "paid"
    },
    {
      id: "6",
      employeeId: "EMP003",
      employeeName: "Bob Johnson",
      month: "2023-02",
      baseSalary: 45000,
      bonus: 0,
      deductions: 1000,
      netPay: 44000,
      status: "paid"
    },
  ])

  // Sample attendance records data
  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: "1",
      employeeId: "EMP001",
      employeeName: "John Doe",
      date: "2023-01-01",
      hours: 8,
      status: "present"
    },
    {
      id: "2",
      employeeId: "EMP001",
      employeeName: "John Doe",
      date: "2023-01-02",
      hours: 7.5,
      status: "present"
    },
    {
      id: "3",
      employeeId: "EMP001",
      employeeName: "John Doe",
      date: "2023-01-03",
      hours: 0,
      status: "absent"
    },
    {
      id: "4",
      employeeId: "EMP002",
      employeeName: "Jane Smith",
      date: "2023-01-01",
      hours: 8,
      status: "present"
    },
    {
      id: "5",
      employeeId: "EMP002",
      employeeName: "Jane Smith",
      date: "2023-01-02",
      hours: 7.5,
      status: "present"
    },
    {
      id: "6",
      employeeId: "EMP002",
      employeeName: "Jane Smith",
      date: "2023-01-03",
      hours: 8,
      status: "present"
    },
    {
      id: "7",
      employeeId: "EMP003",
      employeeName: "Bob Johnson",
      date: "2023-01-01",
      hours: 8,
      status: "present"
    },
    {
      id: "8",
      employeeId: "EMP003",
      employeeName: "Bob Johnson",
      date: "2023-01-02",
      hours: 0,
      status: "absent"
    },
    {
      id: "9",
      employeeId: "EMP003",
      employeeName: "Bob Johnson",
      date: "2023-01-03",
      hours: 8,
      status: "present"
    },
  ])

  // Filter functions
  const filterByDate = (date: string) => {
    if (month === "all") {
      return date.includes(year);
    }
    return date.includes(`${year}-${month}`);
  };

  const filteredBatchCompletions = useMemo(() => {
    return batchCompletions.filter((batch) => {
      const matchesEmployee = selectedEmployee === "all" || batch.employeeId === selectedEmployee;
      const matchesDate = filterByDate(batch.startDate);
      return matchesEmployee && matchesDate;
    });
  }, [batchCompletions, selectedEmployee, year, month]);

  const filteredPayslips = useMemo(() => {
    return payslips.filter((payslip) => {
      const matchesEmployee = selectedEmployee === "all" || payslip.employeeId === selectedEmployee;
      const matchesDate = filterByDate(payslip.month);
      return matchesEmployee && matchesDate;
    });
  }, [payslips, selectedEmployee, year, month]);

  const filteredAttendanceRecords = useMemo(() => {
    return attendanceRecords.filter((record) => {
      const matchesEmployee = selectedEmployee === "all" || record.employeeId === selectedEmployee;
      const matchesDate = filterByDate(record.date);
      return matchesEmployee && matchesDate;
    });
  }, [attendanceRecords, selectedEmployee, year, month]);

  // Calculate employee performance metrics
  const calculateEmployeeMetrics = (employeeId) => {
    const employeeBatches = batchCompletions.filter(
      (batch) => batch.employeeId === employeeId && batch.startDate.includes(year),
    )

    const totalBatches = employeeBatches.length
    const completedBatches = employeeBatches.filter((batch) => batch.status === "completed").length
    const totalStudents = employeeBatches.reduce((sum, batch) => sum + batch.studentsEnrolled, 0)
    const completedStudents = employeeBatches.reduce((sum, batch) => sum + batch.studentsCompleted, 0)
    const avgCompletionRate =
      totalBatches > 0
        ? employeeBatches.reduce((sum, batch) => sum + batch.completionRate, 0) / totalBatches
        : 0

    const employeePayslips = payslips.filter(
      (payslip) => payslip.employeeId === employeeId && payslip.month.includes(year),
    )

    const totalEarnings = employeePayslips.reduce((sum, payslip) => sum + payslip.netPay, 0)
    const totalBonus = employeePayslips.reduce((sum, payslip) => sum + payslip.bonus, 0)

    return {
      totalBatches,
      completedBatches,
      totalStudents,
      completedStudents,
      avgCompletionRate,
      totalEarnings,
      totalBonus,
    }
  }

  // Calculate attendance statistics for each employee
  const calculateAttendanceStats = (employeeId) => {
    const employeeRecords = attendanceRecords.filter(
      (record) => record.employeeId === employeeId && record.date.includes(year),
    )

    const totalDays = employeeRecords.length
    const presentDays = employeeRecords.filter((record) => record.status === "present").length
    const absentDays = employeeRecords.filter((record) => record.status === "absent").length
    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0

    return {
      totalDays,
      presentDays,
      absentDays,
      attendanceRate,
    }
  }

  // Get all employee metrics for summary
  const getEmployeesSummary = () => {
    return employees.map((employee) => {
      const metrics = calculateEmployeeMetrics(employee.id)
      const attendanceStats = calculateAttendanceStats(employee.id)
      return {
        id: employee.id,
        employeeId: employee.id,
        name: employee.name,
        ...metrics,
        ...attendanceStats,
      }
    })
  }

  const employeesSummary = getEmployeesSummary()

  // Update employee summary when selection changes
  useEffect(() => {
    if (selectedEmployee === "all") {
      setEmployeeSummary(null)
    } else {
      const employee = employees.find((emp) => emp.id === selectedEmployee)
      if (employee) {
        const metrics = calculateEmployeeMetrics(employee.id)
        const attendanceStats = calculateAttendanceStats(employee.id)
        setEmployeeSummary({
          ...employee,
          ...metrics,
          ...attendanceStats,
        })
      }
    }
  }, [selectedEmployee, year])

  // Calculate totals for the current view
  const calculateTotals = () => {
    switch (activeTab) {
      case "batches":
        const batchTotals = filteredBatchCompletions.reduce(
          (acc, curr) => ({
            totalStudentsEnrolled: acc.totalStudentsEnrolled + curr.studentsEnrolled,
            totalStudentsCompleted: acc.totalStudentsCompleted + curr.studentsCompleted,
            averageCompletionRate: acc.averageCompletionRate + curr.completionRate,
          }),
          { totalStudentsEnrolled: 0, totalStudentsCompleted: 0, averageCompletionRate: 0 }
        )
        return {
          ...batchTotals,
          averageCompletionRate: (batchTotals.averageCompletionRate / filteredBatchCompletions.length || 0).toFixed(1)
        }
      case "payslips":
        return filteredPayslips.reduce(
          (acc, curr) => ({
            totalBaseSalary: acc.totalBaseSalary + curr.baseSalary,
            totalBonus: acc.totalBonus + curr.bonus,
            totalDeductions: acc.totalDeductions + curr.deductions,
            totalNetPay: acc.totalNetPay + curr.netPay,
          }),
          { totalBaseSalary: 0, totalBonus: 0, totalDeductions: 0, totalNetPay: 0 }
        )
      case "attendance":
        const stats = calculateAttendanceStats(selectedEmployee)
        return {
          totalDays: stats.totalDays,
          presentDays: stats.presentDays,
          absentDays: stats.absentDays,
          attendanceRate: stats.attendanceRate.toFixed(1)
        }
      default:
        return null
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleExport = async (format: "pdf" | "excel") => {
    try {
      setIsExporting(true);

      const getData = () => {
        switch (activeTab) {
          case "batches":
            return {
              title: "Batch Completions Report",
              headers: ["Batch Name", "Employee ID", "Lecturer Name", "Start Date", "End Date", "Students", "Completion Rate", "Status"],
              data: filteredBatchCompletions.map(batch => [
                batch.batchName,
                batch.employeeId,
                batch.employeeName,
                batch.startDate,
                batch.endDate,
                batch.studentsEnrolled,
                `${batch.completionRate}%`,
                batch.status.charAt(0).toUpperCase() + batch.status.slice(1)
              ])
            };
          case "payslips":
            return {
              title: "Payslips Report",
              headers: ["Employee ID", "Employee Name", "Month", "Base Salary", "Bonus", "Deductions", "Net Pay", "Status"],
              data: filteredPayslips.map(payslip => [
                payslip.employeeId,
                payslip.employeeName,
                payslip.month,
                formatCurrency(payslip.baseSalary),
                formatCurrency(payslip.bonus),
                formatCurrency(payslip.deductions),
                formatCurrency(payslip.netPay),
                payslip.status.charAt(0).toUpperCase() + payslip.status.slice(1)
              ])
            };
          case "attendance":
            return {
              title: "Attendance Report",
              headers: ["Date", "Employee ID", "Employee Name", "Hours Worked", "Status"],
              data: filteredAttendanceRecords.map(record => [
                record.date,
                record.employeeId,
                record.employeeName,
                record.status.toLowerCase() === "absent" ? "0.0" : record.hours.toFixed(1),
                record.status.charAt(0).toUpperCase() + record.status.slice(1)
              ])
            };
          default:
            return { title: "", headers: [], data: [] };
        }
      };

      const { title, headers, data } = getData();
      const fileName = `${activeTab}_report_${new Date().toISOString().split('T')[0]}`;

      if (format === "excel") {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([
          [title], // A1: Title
          [], // A2: Empty row
          headers, // A3: Headers
          ...data // A4+: Data
        ]);

        // Style the worksheet
        const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
        ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }
        ];

        // Set column widths based on content
        ws['!cols'] = headers.map(() => ({ wch: 20 }));

        XLSX.utils.book_append_sheet(wb, ws, activeTab);
        XLSX.writeFile(wb, `${fileName}.xlsx`);
      } else {
        const doc = new jsPDF({
          orientation: headers.length > 5 ? 'landscape' : 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        // Set document properties
        doc.setProperties({
          title: title,
          subject: 'Report Document',
          author: 'Cybernaut Technologies',
          keywords: 'report, atms',
          creator: 'ATMS System'
        })

        // Set document title
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(16)
        doc.text(title, 105, 20, { align: 'center' })

        let currentY = 30

        // Configure table columns with specific widths
        const columnStyles = {}
        if (activeTab === "payslips") {
          columnStyles[0] = { cellWidth: 25 } // Employee ID
          columnStyles[1] = { cellWidth: 35 } // Name
          columnStyles[2] = { cellWidth: 25 } // Month
          columnStyles[3] = { cellWidth: 25, halign: 'right' } // Base Salary
          columnStyles[4] = { cellWidth: 25, halign: 'right' } // Bonus
          columnStyles[5] = { cellWidth: 25, halign: 'right' } // Deductions
          columnStyles[6] = { cellWidth: 25, halign: 'right' } // Net Pay
        } else if (activeTab === "batches") {
          columnStyles[0] = { cellWidth: 30 } // Batch Name
          columnStyles[1] = { cellWidth: 25 } // Employee ID
          columnStyles[2] = { cellWidth: 35 } // Lecturer Name
          columnStyles[3] = { cellWidth: 25 } // Start Date
          columnStyles[4] = { cellWidth: 25 } // End Date
          columnStyles[5] = { cellWidth: 20 } // Students
          columnStyles[6] = { cellWidth: 20 } // Completion Rate
        } else if (activeTab === "attendance") {
          columnStyles[0] = { cellWidth: 25 } // Date
          columnStyles[1] = { cellWidth: 25 } // Employee ID
          columnStyles[2] = { cellWidth: 35 } // Name
          columnStyles[3] = { cellWidth: 25, halign: 'right' } // Hours
          columnStyles[4] = { cellWidth: 25 } // Status
        }

        currentY += 10
        // Add the table with proper configuration
        const table = autoTable(doc, {
          head: [headers],
          body: data,
          startY: currentY,
          theme: 'grid',
          styles: {
            fontSize: 10,
            cellPadding: 5,
            overflow: 'linebreak',
            cellWidth: 'wrap'
          },
          columnStyles: columnStyles,
          headStyles: {
            fillColor: [75, 85, 99],
            textColor: 255,
            fontStyle: 'bold'
          }
        })

        // Add footer
        currentY = Math.min((table as any).lastAutoTable.finalY + 20, 270)
        doc.setDrawColor(200, 200, 200)
        doc.line(20, currentY, 190, currentY)
        
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(128, 128, 128)
        doc.text("This is a computer-generated document. No signature is required.", 105, currentY + 5, { align: "center" })
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, currentY + 10, { align: "center" })

        doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`)
        toast({
          title: "Success",
          description: "Report exported successfully",
        })
      }

      toast({
        title: "Success",
        description: `${format.toUpperCase()} report downloaded successfully`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: `Failed to export ${format.toUpperCase()} report: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (role !== "admin" && role !== "superAdmin" && role !== "lecturer") {
    return <div>Access Denied</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Batch Completions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredBatchCompletions.length}</div>
            <p className="text-xs text-muted-foreground">
              Total batches {selectedEmployee === "all" ? "completed" : "assigned"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center">
              <Calculator className="w-4 h-4 mr-2" />
              Payslips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPayslips.length}</div>
            <p className="text-xs text-muted-foreground">
              Total payslips generated
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center">
              <UserCheck className="w-4 h-4 mr-2" />
              Attendance Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAttendanceRecords.length}</div>
            <p className="text-xs text-muted-foreground">
              Total attendance records
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger>
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger>
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    {months.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <User className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 md:justify-end">
                <Button
                  variant="outline"
                  onClick={() => handleExport("pdf")}
                  disabled={isExporting}
                  className="flex-1 md:flex-none"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {isExporting ? "Exporting..." : "Export PDF"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport("excel")}
                  disabled={isExporting}
                  className="flex-1 md:flex-none"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {isExporting ? "Exporting..." : "Export Excel"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="summary" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Employee Summary
          </TabsTrigger>
          <TabsTrigger value="batches" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Batch Completions
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center">
            <UserCheck className="h-4 w-4 mr-2" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="payslips" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Payslips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Employee Performance Summary - {year}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Batches</TableHead>
                    <TableHead>Completion Rate</TableHead>
                    <TableHead>Students Trained</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeesSummary.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.employeeId}</TableCell>
                      <TableCell>
                        {employee.completedBatches}/{employee.totalBatches}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={employee.avgCompletionRate} className="h-2 w-20" />
                          <span>{employee.avgCompletionRate.toFixed(0)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {employee.completedStudents}/{employee.totalStudents}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {employeesSummary.length === 0 && (
                <div className="text-center py-10 text-gray-500">No employee data available for the selected year.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batches">
          <Card>
            <CardHeader>
              <CardTitle>Batch Completion Reports - {year}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch Name</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Lecturer Name</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Completion Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBatchCompletions.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell>{batch.batchName}</TableCell>
                      <TableCell>{batch.employeeId}</TableCell>
                      <TableCell>{batch.employeeName}</TableCell>
                      <TableCell>{batch.startDate}</TableCell>
                      <TableCell>{batch.endDate}</TableCell>
                      <TableCell>
                        {batch.studentsCompleted}/{batch.studentsEnrolled}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={batch.completionRate} className="h-2 w-20" />
                          <span>{batch.completionRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            batch.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : batch.status === "in-progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                          }
                        >
                          {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredBatchCompletions.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No batch completion data available for the selected criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payslips">
          <Card>
            <CardHeader>
              <CardTitle>Payslip Reports - {year}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Employee ID</TableHead>
                    <TableHead className="w-[150px]">Name</TableHead>
                    <TableHead className="w-[100px]">Month</TableHead>
                    <TableHead className="w-[120px] text-right">Base Salary</TableHead>
                    <TableHead className="w-[120px] text-right">Bonus</TableHead>
                    <TableHead className="w-[120px] text-right">Deductions</TableHead>
                    <TableHead className="w-[120px] text-right">Net Pay</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayslips.map((payslip) => (
                    <TableRow key={payslip.id}>
                      <TableCell>{payslip.employeeId}</TableCell>
                      <TableCell>{payslip.employeeName}</TableCell>
                      <TableCell>{payslip.month}</TableCell>
                      <TableCell className="text-right">{formatCurrency(payslip.baseSalary)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(payslip.bonus)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(payslip.deductions)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(payslip.netPay)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            payslip.status === "paid" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                          }
                        >
                          {payslip.status.charAt(0).toUpperCase() + payslip.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewPayslip(payslip)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredPayslips.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No payslip data available for the selected criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Reports - {year}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Hours Worked</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendanceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.employeeId}</TableCell>
                      <TableCell>{record.employeeName}</TableCell>
                      <TableCell>
                        {record.status.toLowerCase() === "absent" ? "0.0" : record.hours.toFixed(1)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={record.status.toLowerCase() === "present" ? "success" : "destructive"}>
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredAttendanceRecords.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No attendance data available for the selected criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
