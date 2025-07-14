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
    console.log('Logout initiated...')
    
    // FIRST: Clear all local authentication data immediately
    clearAllAuthData()
    
    // SECOND: Try to call server logout (but don't let it block the local cleanup)
    try {
      console.log('Calling server logout...')
      await axiosInstance.post('/api/users/logout', {}, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000 // 5 second timeout
      })
      console.log('Server logout successful')
    } catch (error) {
      console.warn('Server logout failed (continuing with local logout):', error)
      // Don't throw error, continue with local logout
    }
    
    // THIRD: Navigate to login page
    console.log('Navigating to login page...')
    try {
      await router.push('/auth/signin')
      console.log('Navigation successful')
    } catch (routerError) {
      console.error('Router navigation failed, using window.location:', routerError)
      // Fallback to window.location if router fails
      window.location.href = '/auth/signin'
    }
    
    // FOURTH: Force page reload to ensure complete cleanup (optional but thorough)
    setTimeout(() => {
      if (window.location.pathname !== '/auth/signin') {
        console.log('Forcing page reload to ensure cleanup...')
        window.location.href = '/auth/signin'
      }
    }, 100)
    
    console.log('Logout process completed')
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

  const clearAllAuthData = () => {
    console.log('Performing complete auth data cleanup...')
    
    // Clear store data
    token.value = null
    user.value = null
    isRefreshing.value = false
    refreshPromise.value = null
    
    // Clear all storage
    localStorage.clear()
    sessionStorage.clear()
    
    // Clear cookies
    const domain = window.location.hostname
    const allCookies = document.cookie.split(';')
    
    allCookies.forEach(cookie => {
      const eqPos = cookie.indexOf('=')
      const cookieName = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
      
      if (cookieName) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`
        
        if (domain !== 'localhost' && !domain.includes('127.0.0.1')) {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`
        }
      }
    })
    
    console.log('Auth data cleanup completed')
  }

  const checkAuth = () => {
    try {
      const storedToken = localStorage.getItem('token')
      const storedUser = getUserFromLocalStorage()
      
      if (storedToken && storedUser) {
        // Validate token format (basic check)
        if (typeof storedToken === 'string' && storedToken.length > 10) {
          token.value = storedToken
          user.value = storedUser
          console.log('Auth check successful - user authenticated')
          return true
        } else {
          console.warn('Invalid token format, clearing auth data')
          clearAllAuthData()
        }
      } else {
        console.log('No valid auth data found')
      }
    } catch (error) {
      console.error('Error during auth check:', error)
      clearAllAuthData()
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
    clearAllAuthData,
    isLoggedIn,
    forgotPassword,
    verifyOtp,
    resetPassword
  }
})