type User = {
  id: string
  email: string
  role: "superAdmin" | "admin" | "lecturer"
  name?: string
  department?: string
  joinDate?: string
  phone?: string
  address?: string
  completedBatches?: number
  studentsCompleted?: number
  completionRate?: number
  employeeId?: string
  password?: string
}

const users: User[] = [
  {
    id: "1",
    email: "superadmin@example.com",
    role: "superAdmin",
    name: "Super Admin",
    department: "Management",
    joinDate: "2020-01-01",
    phone: "+1234567890",
    address: "123 Admin Street",
    completedBatches: 0,
    studentsCompleted: 0,
    completionRate: 0,
    employeeId: "EMP000",
  },
  {
    id: "2",
    email: "admin@example.com",
    role: "admin",
    name: "Admin User",
    department: "Operations",
    joinDate: "2021-03-15",
    phone: "+1987654321",
    address: "456 Admin Avenue",
    completedBatches: 0,
    studentsCompleted: 0,
    completionRate: 0,
    employeeId: "EMP001",
  },
  {
    id: "3",
    email: "lecturer@example.com",
    role: "lecturer",
    name: "Lecturer User",
    department: "Training",
    joinDate: "2022-06-10",
    phone: "+1122334455",
    address: "789 Lecturer Lane",
    completedBatches: 5,
    studentsCompleted: 75,
    completionRate: 92,
    employeeId: "EMP002",
  },
]

// This function will be used to add new users created by admin
export const addUser = (user: User): User => {
  // Generate a new ID
  const newId = (users.length + 1).toString()

  // Generate a unique employee ID if not provided
  const employeeId = user.employeeId || `EMP${(users.length + 1).toString().padStart(3, "0")}`

  const newUser = { ...user, id: newId, employeeId }
  users.push(newUser)
  return newUser
}

export const authenticate = (email: string, password: string): User | null => {
  // In a real application, you would hash the password and compare it securely
  const user = users.find((u) => u.email === email)

  // Check if user exists and password matches
  // For existing demo users, allow "password" as default
  // For new users, check against their specific password
  if (user) {
    if (password === "password" || password === user.password) {
      return user
    }
  }
  return null
}

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem("currentUser")
  return userJson ? JSON.parse(userJson) : null
}

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user))
  } else {
    localStorage.removeItem("currentUser")
  }
}

export const getAllUsers = (): User[] => {
  return users
}

export const getUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id)
}

