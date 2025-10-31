import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref('')
  const user = ref(null)
  const isAuthenticated = ref(false)

  // Getters
  function getUser() {
    return user.value
  }

  function getIsAuthenticated() {
    return isAuthenticated.value
  }

  function getUserRole() {
    return user.value?.role || null
  }

  function getToken() {
    return token.value
  }

  // Actions
  function setToken(tk) {
    token.value = tk
    isAuthenticated.value = !!tk
  }

  function setUser(userData) {
    user.value = userData
  }

  function setAuth(tokenValue, userData) {
    setToken(tokenValue)
    setUser(userData)
    localStorage.setItem('auth', JSON.stringify({ user: userData, token: tokenValue }))
  }

  function clearAuth() {
    token.value = ''
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('auth')
  }

  function loadAuth() {
    const authData = localStorage.getItem('auth')
    if (authData) {
      try {
        const parsed = JSON.parse(authData)
        if (parsed.user && parsed.token) {
          user.value = parsed.user
          token.value = parsed.token
          isAuthenticated.value = true
        }
      } catch (error) {
        console.error('Error al cargar datos de autenticación:', error)
        clearAuth()
      }
    }
  }

  function updateUser(userData) {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      localStorage.setItem('auth', JSON.stringify({ user: user.value, token: token.value }))
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    getUser,
    getIsAuthenticated,
    getUserRole,
    getToken,
    setToken,
    setUser,
    setAuth,
    clearAuth,
    loadAuth,
    updateUser
  }
})
