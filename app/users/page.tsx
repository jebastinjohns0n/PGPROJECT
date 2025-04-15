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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Pencil, Trash2, UserCheck, UserX } from "lucide-react"
import { addUser } from "@/lib/auth"

export default function Users() {
  const { role } = useAuth()
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "lecturer",
      department: "Training",
      joinDate: "2022-01-15",
      phone: "+1234567890",
      address: "123 Main St, City",
      status: "active",
      employeeId: "EMP001",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "admin",
      department: "Management",
      joinDate: "2021-05-20",
      phone: "+0987654321",
      address: "456 Oak Ave, Town",
      status: "active",
      employeeId: "EMP002",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "lecturer",
      department: "Development",
      joinDate: "2022-03-10",
      phone: "+1122334455",
      address: "789 Pine St, Village",
      status: "inactive",
      employeeId: "EMP003",
    },
  ])

  async function fetchUserData() {
    
      try {
        const response = await fetch(`http://localhost:8090/api/users`);
        
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

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "password123", // Default password for new users
    role: "lecturer",
    department: "",
    joinDate: new Date().toISOString().split("T")[0],
    phone: "",
    address: "", // Added address field
    status: "active",
    employeeId: `EMP${Math.floor(1000 + Math.random() * 9000)}`,
  })

  const [editUser, setEditUser] = useState(null)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()

    // Add user to the auth system
    const userToAdd = {
      ...newUser,
      completedBatches: 0,
      studentsCompleted: 0,
      completionRate: 0,
    }

    // Add to auth system
    const addedUser = addUser(userToAdd)

    // Add to local state
    setUsers([
      ...users,
      {
        id: addedUser.id,
        name: addedUser.name,
        email: addedUser.email,
        role: addedUser.role,
        department: addedUser.department,
        joinDate: addedUser.joinDate,
        phone: addedUser.phone,
        status: "active",
        employeeId: addedUser.employeeId,
      },
    ])

    toast({
      title: "Success",
      description: `User added successfully. They can now login with the password: '${newUser.password}'`,
    })

    setNewUser({
      name: "",
      email: "",
      password: "password123", // Default password for new users
      role: "lecturer",
      department: "",
      joinDate: new Date().toISOString().split("T")[0],
      phone: "",
      address: "", // Added address field
      status: "active",
      employeeId: `EMP${Math.floor(1000 + Math.random() * 9000)}`,
    })
  }

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedUsers = users.map((user) => (user.id === editUser.id ? editUser : user))

    setUsers(updatedUsers)
    toast({
      title: "Success",
      description: "User updated successfully",
    })
    setEditUser(null)
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      })
      return
    }

    // Here you would typically make an API call to update the password
    toast({
      title: "Success",
      description: "Password updated successfully",
    })
    setShowChangePassword(false)
    setPasswordData({ newPassword: '', confirmPassword: '' })
  }

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter((user) => user.id !== userId)
    setUsers(updatedUsers)
    toast({
      title: "Success",
      description: "User deleted successfully",
    })
  }

  const handleStatusChange = (userId: string, newStatus: string) => {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, status: newStatus } : user))

    setUsers(updatedUsers)
    toast({
      title: "Success",
      description: `User status changed to ${newStatus}`,
    })
  }

  // Filter users based on search term and active tab
  const filteredUsers = users.filter((user: any) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && user.status === "active"
    if (activeTab === "inactive") return matchesSearch && user.status === "inactive"
    if (activeTab === "lecturers") return matchesSearch && user.role === "lecturer"
    if (activeTab === "admins") return matchesSearch && (user.role === "admin" || user.role === "superAdmin")

    return matchesSearch
  })

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (role !== "superAdmin" && role !== "admin") {
    return <div>Access Denied</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="lecturers">Lecturers</SelectItem>
                  <SelectItem value="admins">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add User</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new user. The default password will be "password".
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lecturer">Lecturer</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="superAdmin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={newUser.department}
                        onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="joinDate">Join Date</Label>
                      <Input
                        id="joinDate"
                        type="date"
                        value={newUser.joinDate}
                        onChange={(e) => setNewUser({ ...newUser, joinDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newUser.status}
                        onValueChange={(value) => setNewUser({ ...newUser, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <Input
                        id="employeeId"
                        value={newUser.employeeId}
                        onChange={(e) => setNewUser({ ...newUser, employeeId: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newUser.address}
                      onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Initial Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="Set initial password"
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add User</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="lecturers">Lecturers</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
            </TabsList>
          </Tabs>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.employeeId}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="View User">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>User Details</DialogTitle>
                            <DialogDescription>View user information</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Name</Label>
                                <div className="font-medium">{user.name}</div>
                              </div>
                              <div>
                                <Label>Email</Label>
                                <div className="font-medium">{user.email}</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Employee ID</Label>
                                <div className="font-medium">{user.employeeId}</div>
                              </div>
                              <div>
                                <Label>Role</Label>
                                <div className="font-medium">{user.role}</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Department</Label>
                                <div className="font-medium">{user.department}</div>
                              </div>
                              <div>
                                <Label>Join Date</Label>
                                <div className="font-medium">{user.joinDate}</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Status</Label>
                                <div className="font-medium">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      user.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {user.status}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <Label>Address</Label>
                                <div className="font-medium">{user.address}</div>
                              </div>
                            </div>
                            <div>
                              <Label>Phone</Label>
                              <div className="font-medium">{user.phone}</div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            title="Edit User"
                            onClick={() => setEditUser(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>Edit the user's details.</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleEditUser} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Full Name</Label>
                                <Input
                                  id="edit-name"
                                  value={editUser?.name}
                                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                  id="edit-email"
                                  type="email"
                                  value={editUser?.email}
                                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-role">Role</Label>
                                <Select
                                  value={editUser?.role}
                                  onValueChange={(value) => setEditUser({ ...editUser, role: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="lecturer">Lecturer</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="superAdmin">Super Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-department">Department</Label>
                                <Input
                                  id="edit-department"
                                  value={editUser?.department}
                                  onChange={(e) => setEditUser({ ...editUser, department: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-joinDate">Join Date</Label>
                                <Input
                                  id="edit-joinDate"
                                  type="date"
                                  value={editUser?.joinDate}
                                  onChange={(e) => setEditUser({ ...editUser, joinDate: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-phone">Phone</Label>
                                <Input
                                  id="edit-phone"
                                  value={editUser?.phone}
                                  onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <Select
                                  value={editUser?.status}
                                  onValueChange={(value) => setEditUser({ ...editUser, status: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-employeeId">Employee ID</Label>
                                <Input
                                  id="edit-employeeId"
                                  value={editUser?.employeeId}
                                  onChange={(e) => setEditUser({ ...editUser, employeeId: e.target.value })}
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-address">Address</Label>
                              <Input
                                id="edit-address"
                                value={editUser?.address}
                                onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
                                required
                              />
                            </div>
                            <DialogFooter className="flex justify-between items-center">
                              <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => setShowChangePassword(true)}
                              >
                                Change Password
                              </Button>
                              <Button type="submit">Update User</Button>
                            </DialogFooter>
                          </form>

                          <Dialog open={showChangePassword} onOpenAutoFocus={(e) => e.preventDefault()} onOpenChange={setShowChangePassword}>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Change Password</DialogTitle>
                                <DialogDescription>
                                  Enter a new password for the user.
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input
                                      id="new-password"
                                      type="password"
                                      value={passwordData.newPassword}
                                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <Input
                                      id="confirm-password"
                                      type="password"
                                      value={passwordData.confirmPassword}
                                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                      required
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => {
                                      setShowChangePassword(false)
                                      setPasswordData({ newPassword: '', confirmPassword: '' })
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button type="submit">Update Password</Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title={user.status === "active" ? "Deactivate User" : "Activate User"}
                        onClick={() => handleStatusChange(user.id, user.status === "active" ? "inactive" : "active")}
                      >
                        {user.status === "active" ? (
                          <UserX className="h-4 w-4 text-red-500" />
                        ) : (
                          <UserCheck className="h-4 w-4 text-green-500" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        title="Delete User"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length > usersPerPage && (
            <div className="flex justify-center space-x-2 mt-4">
              {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
                <Button key={i} onClick={() => paginate(i + 1)} variant={currentPage === i + 1 ? "default" : "outline"}>
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
