import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axiosInstance from '@/utils/axios'
import router from '@/router'
import CryptoJS from 'crypto-js'
import axios from 'axios'

const ENCRYPTION_KEY = 'FJKAIDFAJERKWJFKLASDJFAKSLFJLKFJLSDFHJLSHDF' 

const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString()
}

const decryptData = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<any | null>(null)
  const isRefreshing = ref(false)
  const refreshPromise = ref<Promise<string | null> | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const saveUserToLocalStorage = (userData: any) => {
    const encryptedUser = encryptData(JSON.stringify(userData))
    localStorage.setItem('user', encryptedUser)
  }

  const getUserFromLocalStorage = (): any | null => {
    const encryptedUser = localStorage.getItem('user')
    if (encryptedUser) {
      try {
        return JSON.parse(decryptData(encryptedUser))
      } catch (error) {
        console.error('Error decrypting user data:', error)
        return null
      }
    }
    return null
  }

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login to:', `${import.meta.env.VITE_API_URL}/api/users/login`);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login`, 
        { email, password },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        token.value = response.data.accessToken;
        user.value = response.data.user;
        
        if (token.value) {
          localStorage.setItem('token', token.value);
        }
        if (user.value) {
          saveUserToLocalStorage(user.value);
        }
        
        return {
          success: true,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Login failed'
        };
      }
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      // Handle different types of errors
      let errorMessage = 'Login failed';
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Unable to connect to the server. Please check if the server is running and try again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/auth/signin')
    }
  }

  const refreshToken = async () => {
    if (isRefreshing.value) {
      return refreshPromise.value
    }

    isRefreshing.value = true
    refreshPromise.value = new Promise(async (resolve) => {
      try {
        const response = await axios.post('/api/users/refresh-token')
        token.value = response.data.accessToken
        if (token.value) {
          localStorage.setItem('token', token.value)
        }
        if (response.data.user) {
          user.value = response.data.user
          saveUserToLocalStorage(user.value)
        }
        resolve(token.value)
      } catch (error) {
        console.error('Token refresh failed:', error)
        await logout()
        resolve(null)
      } finally {
        isRefreshing.value = false
      }
    })

    return refreshPromise.value
  }

  const checkAuth = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = getUserFromLocalStorage()
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = storedUser
      return true
    }
    return false
  }

  const isLoggedIn = computed(() => {
    return !!localStorage.getItem('token')
  })

  const forgotPassword = async (payload: { email: string }) => {
    try {
      const response = await axiosInstance.post('/api/users/forgot-password', payload)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP')
    }
  }

  const verifyOTP = async (payload: { email: string; otp: string }) => {
    try {
      const response = await axiosInstance.post('/api/users/verify-otp', payload)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Invalid OTP')
    }
  }

  const resetPassword = async (payload: { resetToken: string; newPassword: string }) => {
    try {
      const response = await axiosInstance.post('/api/users/reset-password', payload)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reset password')
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    refreshToken,
    checkAuth,
    isLoggedIn,
    forgotPassword,
    verifyOTP,
    resetPassword
  }
})