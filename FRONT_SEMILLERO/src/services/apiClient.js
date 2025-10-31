import { apiClient } from '../plugins/pluginAxios.js'
import { useAuthStore } from '../stores/authStore'

export { apiClient }

// GET - Obtener datos
export async function getData(url, config = {}) {
  try {
    const response = await apiClient.get(url, config)
    return response.data
  } catch (error) {
    console.error('Error en GET:', error)
    throw error
  }
}

// POST - Crear datos
export async function postData(url, data, config = {}) {
  try {
    const response = await apiClient.post(url, data, config)
    return response.data
  } catch (error) {
    console.error('Error en POST:', error)
    throw error
  }
}

// PUT - Actualizar datos
export async function putData(url, data, config = {}) {
  try {
    const response = await apiClient.put(url, data, config)
    return response.data
  } catch (error) {
    console.error('Error en PUT:', error)
    throw error
  }
}

// DELETE - Eliminar datos
export async function deleteData(url, config = {}) {
  try {
    const response = await apiClient.delete(url, config)
    return response.data
  } catch (error) {
    console.error('Error en DELETE:', error)
    throw error
  }
}

// Función auxiliar para verificar si el usuario está autenticado
export function isAuthenticated() {
  try {
    const authStore = useAuthStore()
    return authStore.getIsAuthenticated()
  } catch (error) {
    return false
  }
}
