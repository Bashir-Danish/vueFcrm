import { defineStore } from 'pinia'
import axiosInstance, { isCancel } from '@/utils/axios'
import axios from 'axios'
import { ref, computed } from 'vue'
import { User } from '@/types/types'

export interface UsersData {
  users: User[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  filterCounts: {
    role: Record<string, number>;
  };
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const usersData = ref<UsersData>({
    users: [],
    totalCount: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    filterCounts: {
      role: {}
    }
  })

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get('/api/user')
      user.value = response.data
    } catch (error) {
      console.error('Failed to fetch user:', error)
      throw error
    }
  }

  const fetchUsers = async (page: number = 1, limit: number = 10, search: string = "", role: string[] = [], signal?: AbortSignal) => {
    try {
      const params: Record<string, any> = { page, limit };
      
      if (search) {
        params.search = search;
      }
      
      if (role.length > 0) {
        params.role = role.join(',');
      }

      const response = await axiosInstance.get('/api/users', { params, signal });

      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response data');
      }

      const { users, totalCount, totalPages, filterCounts } = response.data;

      if (!Array.isArray(users)) {
        throw new Error('Users data is not an array');
      }

      usersData.value = {
        users,
        totalCount: Number(totalCount),
        page: Number(response.data.page) || page,
        limit: Number(response.data.limit) || limit,
        totalPages: Number(totalPages),
        filterCounts: {
          role: filterCounts?.role || {}
        }
      };
    } catch (error) {
      if (isCancel(error)) {
        console.log('Request canceled:', (error as Error).message);
      } else {
        console.error('Error fetching users:', error);
        if (error instanceof Error) {
          console.error('Error message:', error.message);
        }
        throw error;
      }
    }
  }

  const addUser = async (userData: Partial<User>) => {
    try {
      const response = await axiosInstance.post('/api/users', userData)
      const newUser = response.data.user
      usersData.value.users.push(newUser)
      usersData.value.totalCount++
      return newUser
    } catch (error) {
      console.error('Error adding user:', error)
      throw error
    }
  }

  const updateUser = async (userData: User) => {
    try {
      if (!userData || !userData._id) {
        throw new Error('Invalid user data: Missing _id')
      }
      const response = await axiosInstance.put(`/api/users/${userData._id}`, userData)
      const updatedUser = response.data
      usersData.value.users = usersData.value.users.map(u => 
        u._id === updatedUser._id ? updatedUser : u
      )
      return updatedUser
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  const getUserById = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/api/users/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching user by ID:', error)
      throw error
    }
  }

  const deleteUser = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/users/${id}`)
      usersData.value.users = usersData.value.users.filter(u => u._id !== id)
      usersData.value.totalCount--
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }

  const isLoggedIn = computed(() => !!user.value)

  const inviteUser = async (userData: Partial<User>) => {
    try {
      const response = await axiosInstance.post('/api/users/invite', userData)
      return response.data
    } catch (error) {
      console.error('Error inviting user:', error)
      throw error
    }
  }

  const verifyInvitation = async (token: string) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/verify-invitation`, {
        params: { token },
        withCredentials: true
      })
      return response.data
    } catch (error) {
      console.error('Error verifying invitation:', error)
      throw error
    }
  }

  const updateInvitedUser = async (userData: { token: string; name: string; password: string }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/update-invited-user`, userData, {
        withCredentials: true
      })
      return response.data
    } catch (error) {
      console.error('Error updating invited user:', error)
      throw error
    }
  }

  const register = async (userData: { name: string; email: string; password: string }) => {
    try {
      const response = await axiosInstance.post('/api/users/register', userData)
      return response.data
    } catch (error) {
      console.error('Error registering user:', error)
      throw error
    }
  }

  return {
    user,
    usersData,
    fetchUser,
    fetchUsers,
    addUser,
    updateUser,
    getUserById,
    deleteUser,
    isLoggedIn,
    inviteUser,
    verifyInvitation,
    updateInvitedUser,
    register,
  }
})