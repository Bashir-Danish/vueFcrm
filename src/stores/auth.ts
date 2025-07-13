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
      router.push('/auth/signin')

      // Call the logout endpoint to invalidate the session on the server
      await axiosInstance.post('/api/users/logout', {}, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      // Clear all auth-related data from the store
      token.value = null
      user.value = null
      isRefreshing.value = false
      refreshPromise.value = null
      
      // Remove all auth-related items from localStorage
      const itemsToRemove = [
        'token',
        'user',
        'refreshToken',
        'accessToken',
        'session',
        'login'
      ]
      
      itemsToRemove.forEach(item => {
        localStorage.removeItem(item)
      })
      
      // Clear any other user-related data that might be stored
      Object.keys(localStorage).forEach(key => {
        if (
          key.startsWith('user_') || 
          key.includes('auth') || 
          key.includes('token') || 
          key.includes('session') ||
          key.includes('login')
        ) {
          localStorage.removeItem(key)
        }
      })
      
      // Clear cookies that can be accessed by JavaScript
      const cookiesToRemove = [
        'muid',
        'session',
        'token'
      ]
      
      // Get the current domain and path
      const domain = window.location.hostname
      const path = '/'
      
      // Set cookies to expire by setting their expiration date to the past
      cookiesToRemove.forEach(cookieName => {
        // Try with different combinations of domain and path
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`
        
        // Also try with .domain for subdomain coverage
        if (domain !== 'localhost') {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`
        }
      })
      
      // Also try to clear all cookies that might be related to authentication
      const allCookies = document.cookie.split(';')
      allCookies.forEach(cookie => {
        const cookieName = cookie.split('=')[0].trim()
        if (
          cookieName.includes('token') || 
          cookieName.includes('auth') || 
          cookieName.includes('session') ||
          cookieName.includes('user')
        ) {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`
          
          if (domain !== 'localhost') {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`
          }
        }
      })
      
      // Navigate to login page using Vue Router before page reload
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
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/users/refresh-token`,
          {},
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.accessToken) {
          token.value = response.data.accessToken;
          localStorage.setItem('token', response.data.accessToken);
          
          if (response.data.user) {
            user.value = response.data.user;
            saveUserToLocalStorage(user.value);
          }
          
          resolve(response.data.accessToken);
        } else {
          console.error('No access token received in refresh response');
          await logout();
          resolve(null);
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        await logout();
        resolve(null);
      } finally {
        isRefreshing.value = false;
        refreshPromise.value = null;
      }
    });

    return refreshPromise.value;
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

  const forgotPassword = async (email: string) => {
    try {
      // Use axios directly instead of axiosInstance to avoid auth headers
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/forgot-password`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      return {
        success: true,
        message: response.data.message || 'Password reset instructions have been sent to your email',
        email // Return email to be used in the OTP verification step
      };
    } catch (error: any) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to process password reset request'
      };
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/verify-otp`,
        { email, otp },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      return {
        success: true,
        resetToken: response.data.resetToken,
        message: response.data.message || 'OTP verified successfully'
      };
    } catch (error: any) {
      console.error('OTP verification error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to verify OTP'
      };
    }
  };

  const resetPassword = async (resetToken: string, newPassword: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/reset-password`,
        { resetToken, newPassword },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      return {
        success: true,
        message: response.data.message || 'Password reset successful'
      };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password'
      };
    }
  };

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
    verifyOtp,
    resetPassword
  }
})