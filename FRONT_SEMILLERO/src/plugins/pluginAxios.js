import axios from 'axios'

export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor: agrega automáticamente el token antes de cada request
apiClient.interceptors.request.use(
  (config) => {
    const authData = JSON.parse(localStorage.getItem('auth'))
    const token = authData?.token

    if (token) {
      config.headers['x-token'] = token   // <── asegúrate que el backend usa este header
    } else {
      delete config.headers['x-token']
    }

    return config
  },
  (error) => Promise.reject(error)
)
