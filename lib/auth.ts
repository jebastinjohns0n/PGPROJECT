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

import axiosInstance from "@/utils/axiosInstance";

export type AuthResult = {
  user: User | null;
  error?: string;
}

export const addUser = async (user: User): Promise<User> => {
  try {
    const response = await axiosInstance.post('/users/register', user);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

export const authenticate = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const response = await axiosInstance.post('/users/login', { email, password });
    const { token, user } = response.data;
    if (!token || !user) {
      return { user: null, error: 'Invalid response from server' };
    }
    localStorage.setItem('token', `Bearer ${token}`);
    setCurrentUser(user);
    return { user };
  } catch (error: any) {
    console.error('Authentication error:', error);
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 404:
          return { user: null, error: data?.message || 'No user found with this email' };
        case 401:
          return { user: null, error: data?.message || 'Invalid credentials' };
        case 403:
          return { user: null, error: data?.message || 'Access forbidden' };
        case 429:
          return { user: null, error: 'Too many login attempts. Please try again later' };
        case 500:
          return { user: null, error: 'Server error. Please try again later' };
        default:
          return { user: null, error: data?.message || 'Authentication failed' };
      }
    }
    if (!navigator.onLine) {
      return { user: null, error: 'No internet connection' };
    }
    return { user: null, error: 'Unable to connect to server. Please try again' };
  }
}

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem("currentUser");
  return userJson ? JSON.parse(userJson) : null;
}

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("currentUser");
  }
}

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    return null;
  }
}

