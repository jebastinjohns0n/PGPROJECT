// "use client"

// import type React from "react"
// import axios from "axios"
// import { useState } from "react"
// import { useAuth } from "@/components/auth-provider"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { useToast } from "@/hooks/use-toast"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Eye, Pencil, Trash2 } from "lucide-react"

// export default function Tasks() {
//   const { user, role } = useAuth()
//   const [tasks, setTasks] = useState([
//     {
//       id: "1",
//       title: "Prepare course materials",
//       description: "Create slides and exercises for the upcoming batch",
//       assignedTo: "John Doe",
//       assignedToId: "lec1",
//       dueDate: "2023-08-15",
//       status: "completed",
//       priority: "high",
//       createdAt: "2023-07-20",
//     },
//     {
//       id: "2",
//       title: "Conduct assessment tests",
//       description: "Prepare and conduct mid-term assessment for Batch B2",
//       assignedTo: "Jane Smith",
//       assignedToId: "lec2",
//       dueDate: "2023-09-10",
//       status: "in-progress",
//       priority: "medium",
//       createdAt: "2023-08-01",
//     },
//     {
//       id: "3",
//       title: "Submit monthly report",
//       description: "Compile and submit the monthly progress report for all batches",
//       assignedTo: "Bob Johnson",
//       assignedToId: "lec3",
//       dueDate: "2023-09-30",
//       status: "incomplete",
//       priority: "low",
//       createdAt: "2023-09-01",
//     },
//   ])

  

//   const [newTask, setNewTask] = useState({
//     title: "",
//     description: "",
//     assignedToId: "",
//     dueDate: new Date().toISOString().split("T")[0],
//     status: "incomplete",
//     priority: "medium",
//     createdAt: new Date().toISOString().split("T")[0],
//   })

//   const [editTask, setEditTask] = useState(null)
//   const [lecturers, setLecturers] = useState([
//     { id: "lec1", name: "John Doe" },
//     { id: "lec2", name: "Jane Smith" },
//     { id: "lec3", name: "Bob Johnson" },
//   ])
//   const [activeTab, setActiveTab] = useState("all")
//   const [searchTerm, setSearchTerm] = useState("")
//   const { toast } = useToast()

//   // useEffect(() => {
//   //   // In a real application, you would fetch tasks and users from an API
//   //   const fetchData = async () => {
//   //     const tasksResponse = await fetch("/api/tasks")
//   //     const tasksData = await tasksResponse.json()
//   //     setTasks(tasksData)

//   //     const usersResponse = await fetch("/api/users")
//   //     const usersData = await usersResponse.json()
//   //     setUsers(usersData)
//   //   }
//   //   fetchData()
//   // }, [])

//   const handleAddTask = (e: React.FormEvent) => {
//     e.preventDefault()
//     // Generate a random ID for the new task
//     const newId = Math.random().toString(36).substring(2, 9)
//     const lecturer = lecturers.find((l) => l.id === newTask.assignedToId)

//     const taskToAdd = {
//       ...newTask,
//       id: newId,
//       assignedTo: lecturer ? lecturer.name : "Unassigned",
//     }

//     setTasks([...tasks, taskToAdd])
//     toast({
//       title: "Success",
//       description: "Task added successfully",
//     })
//     setNewTask({
//       title: "",
//       description: "",
//       assignedToId: "",
//       dueDate: new Date().toISOString().split("T")[0],
//       status: "incomplete",
//       priority: "medium",
//       createdAt: new Date().toISOString().split("T")[0],
//     })
//   }

//   // const handleAddTask = async (e: React.FormEvent) => {
//   //   e.preventDefault()
//   //   // In a real application, you would send this data to an API
//   //   const response = await fetch("/api/tasks", {
//   //     method: "POST",
//   //     headers: { "Content-Type": "application/json" },
//   //     body: JSON.stringify(newTask),
//   //   })
//   //   if (response.ok) {
//   //     toast({
//   //       title: "Success",
//   //       description: "Task added successfully",
//   //     })
//   //     setNewTask({ title: "", description: "", due_date: "", assigned_to: "", status: "pending" })
//   //     // Refetch tasks
//   //     const updatedTasks = await response.json()
//   //     setTasks(updatedTasks)
//   //   } else {
//   //     toast({
//   //       title: "Error",
//   //       description: "Failed to add task",
//   //       variant: "destructive",
//   //     })
//   //   }
//   // }

//   const handleEditTask = (e: React.FormEvent) => {
//     e.preventDefault()
//     const lecturer = lecturers.find((l) => l.id === editTask.assignedToId)
//     const updatedTask = {
//       ...editTask,
//       assignedTo: lecturer ? lecturer.name : "Unassigned",
//     }

//     const updatedTasks = tasks.map((task) => (task.id === editTask.id ? updatedTask : task))

//     setTasks(updatedTasks)
//     toast({
//       title: "Success",
//       description: "Task updated successfully",
//     })
//     setEditTask(null)
//   }

//   // const handleEditTask = async (e: React.FormEvent) => {
//   //   e.preventDefault()
//   //   // In a real application, you would send this data to an API
//   //   const response = await fetch(`/api/tasks/${editTask.id}`, {
//   //     method: "PUT",
//   //     headers: { "Content-Type": "application/json" },
//   //     body: JSON.stringify(editTask),
//   //   })
//   //   if (response.ok) {
//   //     toast({
//   //       title: "Success",
//   //       description: "Task updated successfully",
//   //     })
//   //     setEditTask(null)
//   //     // Refetch tasks
//   //     const updatedTasks = await response.json()
//   //     setTasks(updatedTasks)
//   //   } else {
//   //     toast({
//   //       title: "Error",
//   //       description: "Failed to update task",
//   //       variant: "destructive",
//   //     })
//   //   }
//   // }

//   const handleDeleteTask = (taskId: string) => {
//     const updatedTasks = tasks.filter((task) => task.id !== taskId)
//     setTasks(updatedTasks)
//     toast({
//       title: "Success",
//       description: "Task deleted successfully",
//     })
//   }

//   // const handleDeleteTask = async (taskId: string) => {
//   //   // In a real application, you would send this request to an API
//   //   const response = await fetch(`/api/tasks/${taskId}`, {
//   //     method: "DELETE",
//   //   })
//   //   if (response.ok) {
//   //     toast({
//   //       title: "Success",
//   //       description: "Task deleted successfully",
//   //     })
//   //     // Refetch tasks
//   //     const updatedTasks = await response.json()
//   //     setTasks(updatedTasks)
//   //   } else {
//   //     toast({
//   //       title: "Error",
//   //       description: "Failed to delete task",
//   //       variant: "destructive",
//   //     })
//   //   }
//   // }

//   const handleStatusChange = (taskId: string, newStatus: string) => {
//     const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))

//     setTasks(updatedTasks)
//     toast({
//       title: "Success",
//       description: `Task status changed to ${newStatus}`,
//     })
//   }

//   // Filter tasks based on search term, active tab, and user role
//   const filteredTasks = tasks.filter((task: any) => {
//     // Search filter
//     const matchesSearch =
//       task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())

//     // Tab filter
//     const matchesTab =
//       activeTab === "all"
//         ? true
//         : activeTab === "completed"
//           ? task.status === "completed"
//           : activeTab === "in-progress"
//             ? task.status === "in-progress"
//             : activeTab === "incomplete"
//               ? task.status === "incomplete"
//               : true

//     // Role filter - lecturers can only see their own tasks
//     const matchesRole = role === "lecturer" ? task.assignedToId === user.id : true

//     return matchesSearch && matchesTab && matchesRole
//   })

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Manage Tasks</h1>

//       <div className="flex justify-between items-center mb-4">
//         <div className="flex space-x-2">
//           <Input
//             placeholder="Search tasks..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="max-w-sm"
//           />
//         </div>

//         {(role === "admin" || role === "superAdmin") && (
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button>Add Task</Button>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Add New Task</DialogTitle>
//                 <DialogDescription>Enter the details for the new task.</DialogDescription>
//               </DialogHeader>
//               <form onSubmit={handleAddTask} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="title">Title</Label>
//                   <Input
//                     id="title"
//                     value={newTask.title}
//                     onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="description">Description</Label>
//                   <Textarea
//                     id="description"
//                     value={newTask.description}
//                     onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
//                     required
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="assignedTo">Assigned To</Label>
//                     <Select
//                       value={newTask.assignedToId}
//                       onValueChange={(value) => setNewTask({ ...newTask, assignedToId: value })}
//                       required
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select a lecturer" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {lecturers.map((lecturer: any) => (
//                           <SelectItem key={lecturer.id} value={lecturer.id}>
//                             {lecturer.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="dueDate">Due Date</Label>
//                     <Input
//                       id="dueDate"
//                       type="date"
//                       value={newTask.dueDate}
//                       onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="status">Status</Label>
//                     <Select value={newTask.status} onValueChange={(value) => setNewTask({ ...newTask, status: value })}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select a status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="incomplete">Incomplete</SelectItem>
//                         <SelectItem value="in-progress">In Progress</SelectItem>
//                         <SelectItem value="completed">Completed</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="priority">Priority</Label>
//                     <Select
//                       value={newTask.priority}
//                       onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select priority" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="low">Low</SelectItem>
//                         <SelectItem value="medium">Medium</SelectItem>
//                         <SelectItem value="high">High</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//                 <DialogFooter>
//                   <Button type="submit">Add Task</Button>
//                 </DialogFooter>
//               </form>
//             </DialogContent>
//           </Dialog>
//         )}
//       </div>

//       <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
//         <TabsList>
//           <TabsTrigger value="all">All Tasks</TabsTrigger>
//           <TabsTrigger value="incomplete">Incomplete</TabsTrigger>
//           <TabsTrigger value="in-progress">In Progress</TabsTrigger>
//           <TabsTrigger value="completed">Completed</TabsTrigger>
//         </TabsList>
//       </Tabs>

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Title</TableHead>
//             <TableHead>Description</TableHead>
//             <TableHead>Assigned To</TableHead>
//             <TableHead>Due Date</TableHead>
//             <TableHead>Priority</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {filteredTasks.map((task: any) => (
//             <TableRow key={task.id}>
//               <TableCell className="font-medium">{task.title}</TableCell>
//               <TableCell className="max-w-xs truncate">{task.description}</TableCell>
//               <TableCell>{task.assignedTo}</TableCell>
//               <TableCell>{task.dueDate}</TableCell>
//               <TableCell>
//                 <span
//                   className={`px-2 py-1 rounded-full text-xs ${
//                     task.priority === "high"
//                       ? "bg-red-100 text-red-800"
//                       : task.priority === "medium"
//                         ? "bg-amber-100 text-amber-800"
//                         : "bg-green-100 text-green-800"
//                   }`}
//                 >
//                   {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
//                 </span>
//               </TableCell>
//               <TableCell>
//                 <span
//                   className={`px-2 py-1 rounded-full text-xs ${
//                     task.status === "completed"
//                       ? "bg-green-100 text-green-800"
//                       : task.status === "in-progress"
//                         ? "bg-blue-100 text-blue-800"
//                         : "bg-gray-100 text-gray-800"
//                   }`}
//                 >
//                   {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace("-", " ")}
//                 </span>
//               </TableCell>
//               <TableCell>
//                 <div className="flex space-x-2">
//                   {(role === "admin" ||
//                     role === "superAdmin" ||
//                     (role === "lecturer" && task.assignedToId === user.id)) && (
//                     <>
//                       <Dialog>
//                         <DialogTrigger asChild>
//                           <Button variant="ghost" size="icon" className="h-8 w-8" title="View Task">
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                         </DialogTrigger>
//                         <DialogContent>
//                           <DialogHeader>
//                             <DialogTitle>Task Details</DialogTitle>
//                             <DialogDescription>View task information</DialogDescription>
//                           </DialogHeader>
//                           <div className="grid gap-4 py-4">
//                             <div>
//                               <Label>Title</Label>
//                               <div className="font-medium">{task.title}</div>
//                             </div>
//                             <div>
//                               <Label>Description</Label>
//                               <div className="font-medium">{task.description}</div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-4">
//                               <div>
//                                 <Label>Assigned To</Label>
//                                 <div className="font-medium">{task.assignedTo}</div>
//                               </div>
//                               <div>
//                                 <Label>Due Date</Label>
//                                 <div className="font-medium">{task.dueDate}</div>
//                               </div>
//                             </div>
//                             <div className="grid grid-cols-2 gap-4">
//                               <div>
//                                 <Label>Priority</Label>
//                                 <div className="font-medium">
//                                   <span
//                                     className={`px-2 py-1 rounded-full text-xs ${
//                                       task.priority === "high"
//                                         ? "bg-red-100 text-red-800"
//                                         : task.priority === "medium"
//                                           ? "bg-amber-100 text-amber-800"
//                                           : "bg-green-100 text-green-800"
//                                     }`}
//                                   >
//                                     {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
//                                   </span>
//                                 </div>
//                               </div>
//                               <div>
//                                 <Label>Status</Label>
//                                 <div className="font-medium">
//                                   <span
//                                     className={`px-2 py-1 rounded-full text-xs ${
//                                       task.status === "completed"
//                                         ? "bg-green-100 text-green-800"
//                                         : task.status === "in-progress"
//                                           ? "bg-blue-100 text-blue-800"
//                                           : "bg-gray-100 text-gray-800"
//                                     }`}
//                                   >
//                                     {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace("-", " ")}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                             <div>
//                               <Label>Created At</Label>
//                               <div className="font-medium">{task.createdAt}</div>
//                             </div>
//                           </div>
//                         </DialogContent>
//                       </Dialog>

//                       <Dialog>
//                         <DialogTrigger asChild>
//                           <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit Task">
//                             <Pencil className="h-4 w-4" />
//                           </Button>
//                         </DialogTrigger>
//                         <DialogContent>
//                           <DialogHeader>
//                             <DialogTitle>Edit Task</DialogTitle>
//                             <DialogDescription>Edit the task details.</DialogDescription>
//                           </DialogHeader>
//                           <form onSubmit={handleEditTask} className="space-y-4">
//                             <div className="space-y-2">
//                               <Label htmlFor="edit-title">Title</Label>
//                               <Input
//                                 id="edit-title"
//                                 value={editTask?.title || ""}
//                                 onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
//                                 required
//                               />
//                             </div>
//                             <div className="space-y-2">
//                               <Label htmlFor="edit-description">Description</Label>
//                               <Textarea
//                                 id="edit-description"
//                                 value={editTask?.description || ""}
//                                 onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
//                                 required
//                               />
//                             </div>
//                             {(role === "admin" || role === "superAdmin") && (
//                               <div className="space-y-2">
//                                 <Label htmlFor="edit-assignedTo">Assigned To</Label>
//                                 <Select
//                                   value={editTask?.assignedToId || ""}
//                                   onValueChange={(value) => setEditTask({ ...editTask, assignedToId: value })}
//                                 >
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Select a lecturer" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     {lecturers.map((lecturer: any) => (
//                                       <SelectItem key={lecturer.id} value={lecturer.id}>
//                                         {lecturer.name}
//                                       </SelectItem>
//                                     ))}
//                                   </SelectContent>
//                                 </Select>
//                               </div>
//                             )}
//                             <div className="grid grid-cols-2 gap-4">
//                               <div className="space-y-2">
//                                 <Label htmlFor="edit-dueDate">Due Date</Label>
//                                 <Input
//                                   id="edit-dueDate"
//                                   type="date"
//                                   value={editTask?.dueDate || ""}
//                                   onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })}
//                                   required
//                                 />
//                               </div>
//                               <div className="space-y-2">
//                                 <Label htmlFor="edit-priority">Priority</Label>
//                                 <Select
//                                   value={editTask?.priority || ""}
//                                   onValueChange={(value) => setEditTask({ ...editTask, priority: value })}
//                                 >
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Select priority" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     <SelectItem value="low">Low</SelectItem>
//                                     <SelectItem value="medium">Medium</SelectItem>
//                                     <SelectItem value="high">High</SelectItem>
//                                   </SelectContent>
//                                 </Select>
//                               </div>
//                             </div>
//                             <div className="space-y-2">
//                               <Label htmlFor="edit-status">Status</Label>
//                               <Select
//                                 value={editTask?.status || ""}
//                                 onValueChange={(value) => setEditTask({ ...editTask, status: value })}
//                               >
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select a status" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectItem value="incomplete">Incomplete</SelectItem>
//                                   <SelectItem value="in-progress">In Progress</SelectItem>
//                                   <SelectItem value="completed">Completed</SelectItem>
//                                 </SelectContent>
//                               </Select>
//                             </div>
//                             <DialogFooter>
//                               <Button type="submit">Save Changes</Button>
//                             </DialogFooter>
//                           </form>
//                         </DialogContent>
//                       </Dialog>

//                       {role === "lecturer" && (
//                         <div className="flex items-center space-x-2">
//                           <Label htmlFor="status-change" className="sr-only">
//                             Change Status
//                           </Label>
//                           <Select value={task.status} onValueChange={(value) => handleStatusChange(task.id, value)}>
//                             <SelectTrigger className="h-9 w-[130px]">
//                               <SelectValue placeholder="Change status" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="incomplete">Incomplete</SelectItem>
//                               <SelectItem value="in-progress">In Progress</SelectItem>
//                               <SelectItem value="completed">Completed</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       )}

//                       {(role === "admin" || role === "superAdmin") && (
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="h-8 w-8 text-red-500"
//                           title="Delete Task"
//                           onClick={() => handleDeleteTask(task.id)}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       )}
//                     </>
//                   )}
//                 </div>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       {filteredTasks.length === 0 && (
//         <div className="text-center py-10 text-gray-500">
//           No tasks found. {role === "lecturer" ? "You don't have any tasks assigned yet." : "Try adding a new task."}
//         </div>
//       )}
//     </div>
//   )
// }

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
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Pencil, Trash2 } from "lucide-react"
import axiosInstance from "@/utils/axiosInstance";

export default function Tasks() {
  const { user, role } = useAuth()
  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Prepare course materials",
      description: "Create slides and exercises for the upcoming batch",
      assignedTo: "John Doe",
      assignedToId: "lec1",
      dueDate: "2023-08-15",
      status: "completed",
      priority: "high",
      createdAt: "2023-07-20",
    },
    {
      id: "2",
      title: "Conduct assessment tests",
      description: "Prepare and conduct mid-term assessment for Batch B2",
      assignedTo: "Jane Smith",
      assignedToId: "lec2",
      dueDate: "2023-09-10",
      status: "in-progress",
      priority: "medium",
      createdAt: "2023-08-01",
    },
    {
      id: "3",
      title: "Submit monthly report",
      description: "Compile and submit the monthly progress report for all batches",
      assignedTo: "Bob Johnson",
      assignedToId: "lec3",
      dueDate: "2023-09-30",
      status: "incomplete",
      priority: "low",
      createdAt: "2023-09-01",
    },
  ])
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get("/tasks");
        setTasks(response.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        toast({
          title: "Error",
          description: "Failed to fetch tasks.",
          variant: "destructive",
        });
      }
    };

    fetchTasks();
  }, []);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedToId: "",
    dueDate: new Date().toISOString().split("T")[0],
    status: "incomplete",
    priority: "medium",
    createdAt: new Date().toISOString().split("T")[0],
  })

  const [editTask, setEditTask] = useState(null)
  const [lecturers, setLecturers] = useState([
    { id: "lec1", name: "John Doe" },
    { id: "lec2", name: "Jane Smith" },
    { id: "lec3", name: "Bob Johnson" },
  ])
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // useEffect(() => {
  //   // In a real application, you would fetch tasks and users from an API
  //   const fetchData = async () => {
  //     const tasksResponse = await fetch("/api/tasks")
  //     const tasksData = await tasksResponse.json()
  //     setTasks(tasksData)

  //     const usersResponse = await fetch("/api/users")
  //     const usersData = await usersResponse.json()
  //     setUsers(usersData)
  //   }
  //   fetchData()
  // }, [])

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    // Generate a random ID for the new task
    const newId = Math.random().toString(36).substring(2, 9)
    const lecturer = lecturers.find((l) => l.id === newTask.assignedToId)

    const taskToAdd = {
      ...newTask,
      id: newId,
      assignedTo: lecturer ? lecturer.name : "Unassigned",
    }

    setTasks([...tasks, taskToAdd])
    toast({
      title: "Success",
      description: "Task added successfully",
    })
    setNewTask({
      title: "",
      description: "",
      assignedToId: "",
      dueDate: new Date().toISOString().split("T")[0],
      status: "incomplete",
      priority: "medium",
      createdAt: new Date().toISOString().split("T")[0],
    })
  }

  // const handleAddTask = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   // In a real application, you would send this data to an API
  //   const response = await fetch("/api/tasks", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(newTask),
  //   })
  //   if (response.ok) {
  //     toast({
  //       title: "Success",
  //       description: "Task added successfully",
  //     })
  //     setNewTask({ title: "", description: "", due_date: "", assigned_to: "", status: "pending" })
  //     // Refetch tasks
  //     const updatedTasks = await response.json()
  //     setTasks(updatedTasks)
  //   } else {
  //     toast({
  //       title: "Error",
  //       description: "Failed to add task",
  //       variant: "destructive",
  //     })
  //   }
  // }

  const handleEditTask = (e: React.FormEvent) => {
    e.preventDefault()
    const lecturer = lecturers.find((l) => l.id === editTask.assignedToId)
    const updatedTask = {
      ...editTask,
      assignedTo: lecturer ? lecturer.name : "Unassigned",
    }

    const updatedTasks = tasks.map((task) => (task.id === editTask.id ? updatedTask : task))

    setTasks(updatedTasks)
    toast({
      title: "Success",
      description: "Task updated successfully",
    })
    setEditTask(null)
  }

  // const handleEditTask = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   // In a real application, you would send this data to an API
  //   const response = await fetch(`/api/tasks/${editTask.id}`, {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(editTask),
  //   })
  //   if (response.ok) {
  //     toast({
  //       title: "Success",
  //       description: "Task updated successfully",
  //     })
  //     setEditTask(null)
  //     // Refetch tasks
  //     const updatedTasks = await response.json()
  //     setTasks(updatedTasks)
  //   } else {
  //     toast({
  //       title: "Error",
  //       description: "Failed to update task",
  //       variant: "destructive",
  //     })
  //   }
  // }

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    setTasks(updatedTasks)
    toast({
      title: "Success",
      description: "Task deleted successfully",
    })
  }

  // const handleDeleteTask = async (taskId: string) => {
  //   // In a real application, you would send this request to an API
  //   const response = await fetch(`/api/tasks/${taskId}`, {
  //     method: "DELETE",
  //   })
  //   if (response.ok) {
  //     toast({
  //       title: "Success",
  //       description: "Task deleted successfully",
  //     })
  //     // Refetch tasks
  //     const updatedTasks = await response.json()
  //     setTasks(updatedTasks)
  //   } else {
  //     toast({
  //       title: "Error",
  //       description: "Failed to delete task",
  //       variant: "destructive",
  //     })
  //   }
  // }

  const handleStatusChange = (taskId: string, newStatus: string) => {
    const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))

    setTasks(updatedTasks)
    toast({
      title: "Success",
      description: `Task status changed to ${newStatus}`,
    })
  }

  // Filter tasks based on search term, active tab, and user role
  const filteredTasks = tasks.filter((task: any) => {
    // Search filter
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())

    // Tab filter
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "completed"
          ? task.status === "completed"
          : activeTab === "in-progress"
            ? task.status === "in-progress"
            : activeTab === "incomplete"
              ? task.status === "incomplete"
              : true

    // Role filter - lecturers can only see their own tasks
    const matchesRole = role === "lecturer" ? task.assignedToId === user.id : true

    return matchesSearch && matchesTab && matchesRole
  })

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Tasks</h1>

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {(role === "admin" || role === "superAdmin") && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>Enter the details for the new task.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Select
                      value={newTask.assignedToId}
                      onValueChange={(value) => setNewTask({ ...newTask, assignedToId: value })}
                      required
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
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={newTask.status} onValueChange={(value) => setNewTask({ ...newTask, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="incomplete">Incomplete</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Task</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="incomplete">Incomplete</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task: any) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell className="max-w-xs truncate">{task.description}</TableCell>
              <TableCell>{task.assignedTo}</TableCell>
              <TableCell>{task.dueDate}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    task.priority === "high"
                      ? "bg-red-100 text-red-800"
                      : task.priority === "medium"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : task.status === "in-progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace("-", " ")}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {(role === "admin" ||
                    role === "superAdmin" ||
                    (role === "lecturer" && task.assignedToId === user.id)) && (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="View Task">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Task Details</DialogTitle>
                            <DialogDescription>View task information</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div>
                              <Label>Title</Label>
                              <div className="font-medium">{task.title}</div>
                            </div>
                            <div>
                              <Label>Description</Label>
                              <div className="font-medium">{task.description}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Assigned To</Label>
                                <div className="font-medium">{task.assignedTo}</div>
                              </div>
                              <div>
                                <Label>Due Date</Label>
                                <div className="font-medium">{task.dueDate}</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Priority</Label>
                                <div className="font-medium">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      task.priority === "high"
                                        ? "bg-red-100 text-red-800"
                                        : task.priority === "medium"
                                          ? "bg-amber-100 text-amber-800"
                                          : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <div className="font-medium">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      task.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : task.status === "in-progress"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace("-", " ")}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <Label>Created At</Label>
                              <div className="font-medium">{task.createdAt}</div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit Task">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Task</DialogTitle>
                            <DialogDescription>Edit the task details.</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleEditTask} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-title">Title</Label>
                              <Input
                                id="edit-title"
                                value={editTask?.title || ""}
                                onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-description">Description</Label>
                              <Textarea
                                id="edit-description"
                                value={editTask?.description || ""}
                                onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                                required
                              />
                            </div>
                            {(role === "admin" || role === "superAdmin") && (
                              <div className="space-y-2">
                                <Label htmlFor="edit-assignedTo">Assigned To</Label>
                                <Select
                                  value={editTask?.assignedToId || ""}
                                  onValueChange={(value) => setEditTask({ ...editTask, assignedToId: value })}
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
                            )}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-dueDate">Due Date</Label>
                                <Input
                                  id="edit-dueDate"
                                  type="date"
                                  value={editTask?.dueDate || ""}
                                  onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-priority">Priority</Label>
                                <Select
                                  value={editTask?.priority || ""}
                                  onValueChange={(value) => setEditTask({ ...editTask, priority: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-status">Status</Label>
                              <Select
                                value={editTask?.status || ""}
                                onValueChange={(value) => setEditTask({ ...editTask, status: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="incomplete">Incomplete</SelectItem>
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

                      {role === "lecturer" && (
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="status-change" className="sr-only">
                            Change Status
                          </Label>
                          <Select value={task.status} onValueChange={(value) => handleStatusChange(task.id, value)}>
                            <SelectTrigger className="h-9 w-[130px]">
                              <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="incomplete">Incomplete</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {(role === "admin" || role === "superAdmin") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          title="Delete Task"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredTasks.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No tasks found. {role === "lecturer" ? "You don't have any tasks assigned yet." : "Try adding a new task."}
        </div>
      )}
    </div>
  )
}

