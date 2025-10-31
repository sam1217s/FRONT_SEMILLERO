import axios from "axios";

export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token dinámicamente
apiClient.interceptors.request.use(
  (config) => {
    try {
      const authString = localStorage.getItem("auth");
      if (authString) {
        const authData = JSON.parse(authString);
        const token = authData?.token;

        if (token) {
          config.headers["x-token"] = token;
        } else {
          delete config.headers["x-token"];
        }
      } else {
        delete config.headers["x-token"];
      }
    } catch (error) {
      console.warn("Error parsing auth from localStorage:", error);
      delete config.headers["x-token"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, config } = error.response;
      
      if (status === 401 || status === 403) {
        console.warn(`⚠️ Error de autenticación (${status}): Token inválido o expirado`);
        
        // Limpiar auth y redirigir al login solo si no estamos ya en la página de login
        if (!window.location.hash.includes('#/')) {
          localStorage.removeItem('auth');
          window.location.href = '/#/';
        }
      } else if (status === 404) {
        console.error(`❌ Endpoint no encontrado (404):`, {
          url: config?.url,
          method: config?.method?.toUpperCase(),
          fullURL: `${config?.baseURL}${config?.url}`
        });
      }
    } else if (error.request) {
      console.error("❌ No se recibió respuesta del servidor. Verifica que el backend esté corriendo.");
    }
    
    return Promise.reject(error);
  }
);
