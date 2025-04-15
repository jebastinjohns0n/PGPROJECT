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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Pencil, Trash2, Upload, Copy, Download, FileText } from "lucide-react"

export default function Resources() {
  const { role, user } = useAuth()
  const [resources, setResources] = useState([
    {
      id: "1",
      title: "JavaScript Fundamentals",
      description: "Comprehensive guide to JavaScript basics",
      type: "application/pdf",
      size: 2500000,
      uploadedBy: "Admin",
      uploadDate: "2023-08-15",
      isCloned: false,
      originalId: null,
      assignedTo: null,
      url: "#",
    },
    {
      id: "2",
      title: "React Component Patterns",
      description: "Best practices for React component design",
      type: "application/pdf",
      size: 1800000,
      uploadedBy: "Admin",
      uploadDate: "2023-08-20",
      isCloned: false,
      originalId: null,
      assignedTo: null,
      url: "#",
    },
    {
      id: "3",
      title: "JavaScript Fundamentals - John Doe",
      description: "Comprehensive guide to JavaScript basics (Assigned to John Doe)",
      type: "application/pdf",
      size: 2500000,
      uploadedBy: "Admin",
      uploadDate: "2023-08-25",
      isCloned: true,
      originalId: "1",
      assignedTo: "lec1",
      url: "#",
    },
  ])

  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    file: null,
    type: "",
    size: 0,
    uploadedBy: "Admin",
    uploadDate: new Date().toISOString().split("T")[0],
    isCloned: false,
    originalId: null,
    assignedTo: null,
  })

  const [cloneResource, setCloneResource] = useState({
    resourceId: "",
    newTitle: "",
    assignedTo: "",
  })

  const [editResource, setEditResource] = useState(null)
  const [selectedResource, setSelectedResource] = useState(null)
  const [lecturers, setLecturers] = useState([
    { id: "lec1", name: "John Doe" },
    { id: "lec2", name: "Jane Smith" },
    { id: "lec3", name: "Bob Johnson" },
  ])
  const { toast } = useToast()

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault()

    // Generate a random ID for the new resource
    const newId = Math.random().toString(36).substring(2, 9)

    const resourceToAdd = {
      ...newResource,
      id: newId,
      url: newResource.file ? URL.createObjectURL(newResource.file) : "#",
    }

    setResources([...resources, resourceToAdd])
    toast({
      title: "Success",
      description: "Resource added successfully",
    })
    setNewResource({
      title: "",
      description: "",
      file: null,
      type: "",
      size: 0,
      uploadedBy: "Admin",
      uploadDate: new Date().toISOString().split("T")[0],
      isCloned: false,
      originalId: null,
      assignedTo: null,
    })
  }

  const handleCloneResource = (e: React.FormEvent) => {
    e.preventDefault()

    // Find the original resource
    const originalResource = resources.find((r) => r.id === cloneResource.resourceId)
    if (!originalResource) return

    // Generate a random ID for the cloned resource
    const newId = Math.random().toString(36).substring(2, 9)
    const lecturer = lecturers.find((l) => l.id === cloneResource.assignedTo)

    const resourceToAdd = {
      ...originalResource,
      id: newId,
      title: cloneResource.newTitle || `${originalResource.title} - ${lecturer?.name || "Cloned"}`,
      isCloned: true,
      originalId: originalResource.id,
      assignedTo: cloneResource.assignedTo,
      uploadDate: new Date().toISOString().split("T")[0],
    }

    setResources([...resources, resourceToAdd])
    toast({
      title: "Success",
      description: "Resource cloned and assigned successfully",
    })
    setCloneResource({
      resourceId: "",
      newTitle: "",
      assignedTo: "",
    })
  }

  const handleEditResource = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedResources = resources.map((resource) => (resource.id === editResource.id ? editResource : resource))

    setResources(updatedResources)
    toast({
      title: "Success",
      description: "Resource updated successfully",
    })
    setEditResource(null)
  }

  const handleDeleteResource = (resourceId: string) => {
    const updatedResources = resources.filter((resource) => resource.id !== resourceId)
    setResources(updatedResources)
    toast({
      title: "Success",
      description: "Resource deleted successfully",
    })
  }

  // Filter resources based on user role
  const filteredResources = resources.filter((resource) => {
    if (role === "admin" || role === "superAdmin") {
      return true
    } else if (role === "lecturer") {
      return resource.assignedTo === user.id || !resource.isCloned
    }
    return false
  })

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Resource Management</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Resource
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload New Resource</DialogTitle>
                    <DialogDescription>Upload a new learning resource.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddResource} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newResource.title}
                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newResource.description}
                        onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file">File</Label>
                      <Input
                        id="file"
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          setNewResource({
                            ...newResource,
                            file,
                            type: file.type,
                            size: file.size,
                          })
                        }}
                        required
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit">Upload Resource</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {(role === "admin" || role === "superAdmin") && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Copy className="mr-2 h-4 w-4" />
                      Clone & Assign
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Clone and Assign Resource</DialogTitle>
                      <DialogDescription>Clone an existing resource and assign it to a lecturer.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCloneResource} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="resourceId">Select Resource</Label>
                        <Select
                          value={cloneResource.resourceId}
                          onValueChange={(value) => setCloneResource({ ...cloneResource, resourceId: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a resource" />
                          </SelectTrigger>
                          <SelectContent>
                            {resources
                              .filter((r) => !r.isCloned)
                              .map((resource) => (
                                <SelectItem key={resource.id} value={resource.id}>
                                  {resource.title}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newTitle">New Title (Optional)</Label>
                        <Input
                          id="newTitle"
                          value={cloneResource.newTitle}
                          onChange={(e) => setCloneResource({ ...cloneResource, newTitle: e.target.value })}
                          placeholder="Leave blank to auto-generate"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assignedTo">Assign To</Label>
                        <Select
                          value={cloneResource.assignedTo}
                          onValueChange={(value) => setCloneResource({ ...cloneResource, assignedTo: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a lecturer" />
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
                      <DialogFooter>
                        <Button type="submit">Clone & Assign</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                {(role === "admin" || role === "superAdmin") && <TableHead>Assigned To</TableHead>}
                <TableHead>Upload Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-500" />
                      {resource.title}
                      {resource.isCloned && (
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                          Assigned
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{resource.description}</TableCell>
                  <TableCell>{resource.type.split("/")[1]?.toUpperCase() || resource.type}</TableCell>
                  <TableCell>{(resource.size / 1024 / 1024).toFixed(2)} MB</TableCell>
                  {(role === "admin" || role === "superAdmin") && (
                    <TableCell>
                      {resource.assignedTo
                        ? lecturers.find((l) => l.id === resource.assignedTo)?.name || "Unknown"
                        : "Not Assigned"}
                    </TableCell>
                  )}
                  <TableCell>{resource.uploadDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="View Resource"
                            onClick={() => setSelectedResource(resource)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Resource Details</DialogTitle>
                            <DialogDescription>View resource information</DialogDescription>
                          </DialogHeader>
                          {selectedResource && (
                            <div className="grid gap-4 py-4">
                              <div>
                                <Label>Title</Label>
                                <div className="font-medium">{selectedResource.title}</div>
                              </div>
                              <div>
                                <Label>Description</Label>
                                <div className="font-medium">{selectedResource.description}</div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Type</Label>
                                  <div className="font-medium">
                                    {selectedResource.type.split("/")[1]?.toUpperCase() || selectedResource.type}
                                  </div>
                                </div>
                                <div>
                                  <Label>Size</Label>
                                  <div className="font-medium">
                                    {(selectedResource.size / 1024 / 1024).toFixed(2)} MB
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Uploaded By</Label>
                                  <div className="font-medium">{selectedResource.uploadedBy}</div>
                                </div>
                                <div>
                                  <Label>Upload Date</Label>
                                  <div className="font-medium">{selectedResource.uploadDate}</div>
                                </div>
                              </div>
                              {selectedResource.isCloned && (
                                <div>
                                  <Label>Assigned To</Label>
                                  <div className="font-medium">
                                    {lecturers.find((l) => l.id === selectedResource.assignedTo)?.name || "Unknown"}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          <DialogFooter>
                            <Button asChild>
                              <a href={selectedResource?.url} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </a>
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {(role === "admin" ||
                        role === "superAdmin" ||
                        (role === "lecturer" && resource.assignedTo === user.id)) && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="Edit Resource"
                              onClick={() => setEditResource(resource)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Resource</DialogTitle>
                              <DialogDescription>Update resource information</DialogDescription>
                            </DialogHeader>
                            {editResource && (
                              <form onSubmit={handleEditResource} className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-title">Title</Label>
                                  <Input
                                    id="edit-title"
                                    value={editResource.title}
                                    onChange={(e) => setEditResource({ ...editResource, title: e.target.value })}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Textarea
                                    id="edit-description"
                                    value={editResource.description}
                                    onChange={(e) => setEditResource({ ...editResource, description: e.target.value })}
                                    required
                                  />
                                </div>
                                {(role === "admin" || role === "superAdmin") && resource.isCloned && (
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-assignedTo">Assigned To</Label>
                                    <Select
                                      value={editResource.assignedTo}
                                      onValueChange={(value) => setEditResource({ ...editResource, assignedTo: value })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a lecturer" />
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
                                )}
                                <DialogFooter>
                                  <Button type="submit">Save Changes</Button>
                                </DialogFooter>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>
                      )}

                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Download Resource" asChild>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>

                      {(role === "admin" || role === "superAdmin") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          title="Delete Resource"
                          onClick={() => handleDeleteResource(resource.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredResources.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No resources found. Upload a new resource to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

