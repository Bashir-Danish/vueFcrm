import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '@/utils/axios'
import router from '@/router'
import CryptoJS from 'crypto-js'

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
      const response = await axios.post('/api/users/login', { email, password })
      token.value = response.data.accessToken
      user.value = response.data.user
      
      if (token.value) {
        localStorage.setItem('token', token.value)
      }
      if (user.value) {
        saveUserToLocalStorage(user.value)
      }
      console.log('Login successful, token set:', !!token.value);
      return true
    } catch (error: any) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout')
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

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    refreshToken,
    checkAuth,
    isLoggedIn
  }
})