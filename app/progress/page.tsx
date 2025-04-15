"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function TrackProgress() {
  const { role } = useAuth()
  const [activeTab, setActiveTab] = useState("lecturers")
  const [lecturerPerformance, setLecturerPerformance] = useState([])
  const [batchOutcomes, setBatchOutcomes] = useState([])
  const [selectedLecturer, setSelectedLecturer] = useState(null)
  const [reportFile, setReportFile] = useState(null)
  const [selectedBatch, setSelectedBatch] = useState(null)

  const handleUploadReport = (batchId) => {
    if (!reportFile) return

    // Update the batch with the report
    const updatedBatches = batchOutcomes.map((batch) =>
      batch.id === batchId ? { ...batch, reportUploaded: true, reportUrl: URL.createObjectURL(reportFile) } : batch,
    )

    setBatchOutcomes(updatedBatches)
    setReportFile(null)
    setSelectedBatch(null)
  }

  if (role !== "admin" && role !== "superAdmin" && role !== "lecturer") {
    return <div>Access Denied</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Track Progress</h1>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data Available</AlertTitle>
        <AlertDescription>
          Progress tracking data will be available once connected to the database. This module will display lecturer
          performance metrics and batch outcomes.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="lecturers">Lecturer Performance</TabsTrigger>
          <TabsTrigger value="batches">Batch Outcomes</TabsTrigger>
        </TabsList>

        <TabsContent value="lecturers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lecturer Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="rounded-full bg-gray-100 p-6 mb-4">
                  <AlertCircle className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Performance Data Available</h3>
                <p className="text-gray-500 max-w-md">
                  Lecturer performance data will be displayed here once connected to the database. This will include
                  metrics such as completed tasks, completed batches, students completed, and completion rates.
                </p>
                <Button variant="outline" className="mt-4">
                  Connect to Database
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batches" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Batch Outcome Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="rounded-full bg-gray-100 p-6 mb-4">
                  <AlertCircle className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Batch Outcome Data Available</h3>
                <p className="text-gray-500 max-w-md">
                  Batch outcome data will be displayed here once connected to the database. This will include metrics
                  such as completion rates, student performance, and batch reports.
                </p>
                <Button variant="outline" className="mt-4">
                  Connect to Database
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

