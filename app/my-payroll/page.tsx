"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, FileText, DollarSign, Calendar, FileSpreadsheet, Calculator } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import { toast } from "sonner"

// Types for better type safety
interface PayrollEntry {
  id: string
  month: string
  baseSalary: number
  bonus: number
  deductions: number
  netPay: number
  status: "paid" | "pending"
  paymentDate: string
  details?: string
}

// Utility functions for formatting
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function MyPayroll() {
  const { user } = useAuth()
  const [payrollData, setPayrollData] = useState<PayrollEntry[]>([
    {
      id: "1",
      month: "January 2023",
      baseSalary: 5000,
      bonus: 500,
      deductions: 200,
      netPay: 5300,
      status: "paid",
      paymentDate: "2023-01-31",
      details: "Regular monthly salary",
    },
    {
      id: "2",
      month: "February 2023",
      baseSalary: 5000,
      bonus: 300,
      deductions: 200,
      netPay: 5100,
      status: "paid",
      paymentDate: "2023-02-28",
      details: "Regular monthly salary",
    },
    {
      id: "3",
      month: "March 2023",
      baseSalary: 5000,
      bonus: 700,
      deductions: 200,
      netPay: 5500,
      status: "paid",
      paymentDate: "2023-03-31",
      details: "Regular monthly salary + performance bonus",
    },
    {
      id: "4",
      month: "April 2023",
      baseSalary: 5000,
      bonus: 0,
      deductions: 200,
      netPay: 4800,
      status: "paid",
      paymentDate: "2023-04-30",
      details: "Regular monthly salary",
    },
    {
      id: "5",
      month: "May 2023",
      baseSalary: 5000,
      bonus: 0,
      deductions: 200,
      netPay: 4800,
      status: "paid",
      paymentDate: "2023-05-31",
      details: "Regular monthly salary",
    },
    {
      id: "6",
      month: "June 2023",
      baseSalary: 5000,
      bonus: 1000,
      deductions: 200,
      netPay: 5800,
      status: "paid",
      paymentDate: "2023-06-30",
      details: "Regular monthly salary + mid-year bonus",
    },
  ])

  const [selectedPayroll, setSelectedPayroll] = useState<PayrollEntry | null>(null)
  const [yearFilter, setYearFilter] = useState("2023")

  // Calculate summary statistics
  const totalEarnings = payrollData.reduce((sum, entry) => sum + entry.netPay, 0)
  const totalBonus = payrollData.reduce((sum, entry) => sum + entry.bonus, 0)
  const averageSalary = totalEarnings / payrollData.length

  // Filter payroll data by year
  const filteredPayroll = payrollData.filter((entry) => entry.month.includes(yearFilter))

  useEffect(() => {
    // In a real application, you would fetch the lecturer's payroll data from an API
    // No changes needed for now as we're using static data
  }, [])

  // Export functions
  const exportToPDF = () => {
    try {
      const doc = new jsPDF()
      let currentY = 20

      // Set document properties
      doc.setProperties({
        title: 'Payroll Report',
        subject: 'Payroll Document',
        author: 'Cybernaut',
        keywords: 'payslip, salary, payroll',
        creator: 'ATMS System'
      })

      // Company Header
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(20)
      doc.setTextColor(55, 65, 81)
      doc.text("Cybernaut", 105, currentY, { align: "center" })
      
      currentY += 10
      doc.setFontSize(16)
      doc.text("Payroll Report", 105, currentY, { align: "center" })

      // Add horizontal line
      currentY += 5
      doc.setDrawColor(200, 200, 200)
      doc.line(20, currentY, 190, currentY)

      // Employee Information
      currentY += 15
      doc.setFontSize(12)
      doc.text("Employee Information", 20, currentY)
      
      currentY += 10
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.text(`Employee Name: ${user?.name || "Lecturer User"}`, 25, currentY)
      doc.text(`Employee ID: ${user?.id || "3"}`, 120, currentY)
      
      currentY += 8
      doc.text(`Department: Faculty`, 25, currentY)
      doc.text(`Year: ${yearFilter}`, 120, currentY)

      // Summary Section
      currentY += 15
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text("Summary", 20, currentY)

      // Summary Table
      currentY += 5
      autoTable(doc, {
        startY: currentY,
        head: [["Total Earnings", "Total Bonus", "Average Monthly"]],
        body: [[
          formatCurrency(totalEarnings),
          formatCurrency(totalBonus),
          formatCurrency(averageSalary)
        ]],
        theme: 'grid',
        headStyles: {
          fillColor: [75, 85, 99],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center',
          fontSize: 10
        },
        bodyStyles: {
          halign: 'right',
          fontSize: 10
        },
        columnStyles: {
          0: { cellWidth: 55 },
          1: { cellWidth: 55 },
          2: { cellWidth: 55 }
        },
        margin: { left: 20, right: 20 },
        styles: {
          cellPadding: 5,
          fontSize: 10
        }
      })

      // Get the Y position after the first table
      let finalY = (doc as any).lastAutoTable.finalY || currentY + 50

      // Monthly Details Section
      finalY += 15
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text("Monthly Details", 20, finalY)

      // Monthly Details Table
      finalY += 5
      autoTable(doc, {
        startY: finalY,
        head: [["Month", "Base Salary", "Bonus", "Deductions", "Net Pay", "Status"]],
        body: filteredPayroll.map(entry => [
          entry.month,
          formatCurrency(entry.baseSalary),
          formatCurrency(entry.bonus),
          formatCurrency(entry.deductions),
          formatCurrency(entry.netPay),
          entry.status.toUpperCase()
        ]),
        theme: 'grid',
        headStyles: {
          fillColor: [75, 85, 99],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 10,
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 30, halign: 'right' },
          2: { cellWidth: 30, halign: 'right' },
          3: { cellWidth: 30, halign: 'right' },
          4: { cellWidth: 30, halign: 'right' },
          5: { cellWidth: 25, halign: 'center' }
        },
        bodyStyles: {
          fontSize: 9
        },
        margin: { left: 20, right: 20 },
        styles: {
          cellPadding: 4,
          fontSize: 9
        }
      })

      // Get the final Y position
      finalY = (doc as any).lastAutoTable.finalY || finalY + 100

      // Footer
      finalY = Math.min(finalY + 15, 270)
      doc.setDrawColor(200, 200, 200)
      doc.line(20, finalY, 190, finalY)
      
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(128, 128, 128)
      doc.text("This is a computer-generated document. No signature is required.", 105, finalY + 5, { align: "center" })
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, finalY + 10, { align: "center" })

      // Save the PDF
      doc.save(`payroll_report_${yearFilter}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error",
        description: "Failed to export report. Please try again.",
        variant: "destructive",
      })
    }
  }

  const exportToExcel = () => {
    try {
      const data = filteredPayroll.map((entry) => ({
        Month: entry.month,
        "Base Salary": entry.baseSalary,
        Bonus: entry.bonus,
        Deductions: entry.deductions,
        "Net Pay": entry.netPay,
        Status: entry.status.toUpperCase(),
        "Payment Date": formatDate(entry.paymentDate),
        Details: entry.details || "",
      }))

      // Add summary row
      data.push({
        Month: "TOTAL",
        "Base Salary": payrollData.reduce((sum, entry) => sum + entry.baseSalary, 0),
        Bonus: totalBonus,
        Deductions: payrollData.reduce((sum, entry) => sum + entry.deductions, 0),
        "Net Pay": totalEarnings,
        Status: "",
        "Payment Date": "",
        Details: "",
      })

      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Payroll History")

      // Auto-size columns
      const colWidths = Object.keys(data[0]).map(key => ({
        wch: Math.max(key.length, ...data.map(item => String(item[key]).length))
      }))
      ws["!cols"] = colWidths

      XLSX.writeFile(wb, `payroll_history_${yearFilter}.xlsx`)
    } catch (error) {
      console.error("Error generating Excel:", error)
      toast({
        title: "Error",
        description: "Failed to export report. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Payroll</h1>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Earnings</p>
                <p className="text-2xl font-bold">{formatCurrency(totalEarnings)}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Total Bonus</p>
                <p className="text-2xl font-bold">{formatCurrency(totalBonus)}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-800 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">Average Monthly</p>
                <p className="text-2xl font-bold">{formatCurrency(averageSalary)}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-800 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payroll History</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setYearFilter("2022")}>
              2022
            </Button>
            <Button
              variant={yearFilter === "2023" ? "default" : "outline"}
              size="sm"
              onClick={() => setYearFilter("2023")}
            >
              2023
            </Button>
            <Button variant="outline" size="sm" onClick={() => setYearFilter("2024")}>
              2024
            </Button>
            <div className="ml-4 flex items-center space-x-2 border-l pl-4">
              <Button variant="outline" size="sm" onClick={() => exportToExcel()}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportToPDF()}>
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Month</TableHead>
                <TableHead className="w-[120px] text-right">Base Salary</TableHead>
                <TableHead className="w-[120px] text-right">Bonus</TableHead>
                <TableHead className="w-[120px] text-right">Deductions</TableHead>
                <TableHead className="w-[120px] text-right">Net Pay</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayroll.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.month}</TableCell>
                  <TableCell className="text-right">{formatCurrency(entry.baseSalary)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(entry.bonus)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(entry.deductions)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(entry.netPay)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={entry.status === "paid" ? "success" : "warning"}
                    >
                      {entry.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSelectedPayroll(entry)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPayroll.length === 0 && (
            <div className="text-center py-10 text-gray-500">No payroll records found for {yearFilter}.</div>
          )}
        </CardContent>
      </Card>

      {/* Payslip Details Dialog */}
      <Dialog open={!!selectedPayroll} onOpenChange={(open) => !open && setSelectedPayroll(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payslip Details</DialogTitle>
            <DialogDescription>Payroll information for {selectedPayroll?.month}</DialogDescription>
          </DialogHeader>
          {selectedPayroll && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Cybernaut Technologies</h3>
                <Badge
                  variant={selectedPayroll.status === "paid" ? "success" : "warning"}
                >
                  {selectedPayroll.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">Payment Date: {selectedPayroll.paymentDate}</p>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Base Salary</span>
                  <span className="font-medium">{formatCurrency(selectedPayroll.baseSalary)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bonus</span>
                  <span className="font-medium">{formatCurrency(selectedPayroll.bonus)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-gray-600">Gross Pay</span>
                  <span className="font-medium">{formatCurrency(selectedPayroll.baseSalary + selectedPayroll.bonus)}</span>
                </div>
              </div>

              <div className="space-y-3 border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax Deductions</span>
                  <span className="font-medium text-red-600">-{formatCurrency(selectedPayroll.deductions)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Other Deductions</span>
                  <span className="font-medium text-red-600">-{formatCurrency(0)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-gray-600">Total Deductions</span>
                  <span className="font-medium text-red-600">-{formatCurrency(selectedPayroll.deductions)}</span>
                </div>
              </div>

              <div className="border-t border-gray-900/10 pt-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Net Pay</span>
                  <span className="font-bold text-lg text-green-600">{formatCurrency(selectedPayroll.netPay)}</span>
                </div>
              </div>

              {selectedPayroll.details && (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-sm">
                  <p className="font-medium">Notes:</p>
                  <p>{selectedPayroll.details}</p>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center"
                  onClick={() => {
                    exportToPDF(selectedPayroll)
                    setSelectedPayroll(null)
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
