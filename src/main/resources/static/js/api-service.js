import axios from 'axios';

class ApiService {
  constructor() {
    this.baseUrl = "/api"
  }

  // Authentication
  async login(email, password) {
    try {
      const response = await axios.post(`${this.baseUrl}/users/login`, { email, password })
      return response.data
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  // Users
  async getUsers() {
    try {
      const response = await axios.get(`${this.baseUrl}/users`)
      return response.data
    } catch (error) {
      console.error("Error fetching users:", error)
      throw error
    }
  }

  async getUserById(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/users/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error)
      throw error
    }
  }

  async createUser(userData) {
    try {
      const response = await axios.post(`${this.baseUrl}/users`, userData)
      return response.data
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  }

  async updateUser(id, userData) {
    try {
      const response = await axios.put(`${this.baseUrl}/users/${id}`, userData)
      return response.data
    } catch (error) {
      console.error(`Error updating user ${id}:`, error)
      throw error
    }
  }

  async deleteUser(id) {
    try {
      await axios.delete(`${this.baseUrl}/users/${id}`)
      return true
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error)
      throw error
    }
  }

  // Tasks
  async getTasks() {
    try {
      const response = await axios.get(`${this.baseUrl}/tasks`)
      return response.data
    } catch (error) {
      console.error("Error fetching tasks:", error)
      throw error
    }
  }

  async getTasksByAssignedToId(userId) {
    try {
      const response = await axios.get(`${this.baseUrl}/tasks/assignedTo/${userId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching tasks for user ${userId}:`, error)
      throw error
    }
  }

  async createTask(taskData) {
    try {
      const response = await axios.post(`${this.baseUrl}/tasks`, taskData)
      return response.data
    } catch (error) {
      console.error("Error creating task:", error)
      throw error
    }
  }

  async updateTask(id, taskData) {
    try {
      const response = await axios.put(`${this.baseUrl}/tasks/${id}`, taskData)
      return response.data
    } catch (error) {
      console.error(`Error updating task ${id}:`, error)
      throw error
    }
  }

  async deleteTask(id) {
    try {
      await axios.delete(`${this.baseUrl}/tasks/${id}`)
      return true
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error)
      throw error
    }
  }

  // Similar methods for other entities (Batches, Attendance, Payroll, Resources)
  // ...
}

// Export the API service
window.ApiService = new ApiService()
