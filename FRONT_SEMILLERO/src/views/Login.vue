<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="login-header">
      <q-toolbar>
        <q-toolbar-title class="text-center">
          <div class="header-logo">
            <q-icon name="science" size="32px" class="q-mr-sm" />
            <span class="header-title-text">SEMILLEROS</span>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-lg" style="width: 100%; max-width: 500px;">

          <q-card bordered class="login-card q-pa-xl">

            <div class="text-center q-mb-lg">
              <q-icon name="account_circle" size="80px" class="login-icon" />
            </div>

            <q-select v-model="selectedRole" :options="roles" label="Rol" outlined class="q-mb-md login-input">
              <template v-slot:prepend>
                <q-icon name="person" color="grey-6" />
              </template>
            </q-select>

            <q-input v-model="cedula" label="Cédula" outlined class="q-mb-md login-input" type="text"
              :rules="cedulaRules" lazy-rules>
              <template v-slot:prepend>
                <q-icon name="badge" color="grey-6" />
              </template>
            </q-input>

            <q-input v-model="password" label="Contraseña" outlined class="q-mb-md login-input"
              :type="isPwd ? 'password' : 'text'" :rules="passwordRules" lazy-rules>
              <template v-slot:prepend>
                <q-icon name="lock" color="grey-6" />
              </template>
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>

            <!-- Mensaje de error -->
            <div v-if="errorMessage" class="text-center q-mb-md">
              <q-banner rounded class="bg-red-1 text-red-8">
                {{ errorMessage }}
              </q-banner>
            </div>

            <div class="text-left q-mb-lg">
              <a href="#" class="text-grey-7 text-body2" style="text-decoration: none;">
                <q-icon name="vpn_key" size="xs" class="q-mr-xs" />
                Olvidé mi contraseña
              </a>
            </div>

            <div class="text-center">
              <q-btn label="INGRESAR" color="primary" unelevated rounded padding="md xl"
                class="text-weight-bold full-width login-button" @click="login" :loading="loading" :disable="loading" />
            </div>
          </q-card>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useQuasar } from 'quasar'
import { useNotifications } from '../composables/useNotifications'


const router = useRouter()
const authStore = useAuthStore()
const $q = useQuasar()

const cedula = ref('')
const password = ref('')
const isPwd = ref(true)
const selectedRole = ref('Seleccione su Rol')
const { success, error, warning, info } = useNotifications()


const roles = [
  'ADMINISTRADOR',
  'INVESTIGADOR'
]

const loading = ref(false)
const errorMessage = ref('')

// Reglas de validación de Quasar
const cedulaRules = [
  val => !!val || 'El documento es obligatorio',
  val => /^\d{7,10}$/.test(val) || 'El documento debe tener entre 7 y 10 dígitos'
]

const passwordRules = [
  val => !!val || 'La contraseña es obligatoria',
  val => val.length >= 6 || 'La contraseña debe tener al menos 6 caracteres'
]

const login = async () => {
  errorMessage.value = ''

  // Validaciones básicas
  if (!cedula.value) {
   info("Por favor ingresa tu cédula")
    return
  }

  if (!password.value) {
    info("Por favor ingresa tu contraseña")
    return
  }

  if (selectedRole.value === 'Seleccione su Rol') {
    info("Por favor selecciona tu rol")
    return
  }

  loading.value = true

  try {
    // Todos los usuarios usan el mismo endpoint de researchers
    // El backend determina el rol real automáticamente (ADMIN, LEAD_RESEARCHER, RESEARCHER, COORDINATOR)
    const endpoint = 'http://localhost:5000/api/researchers/login'

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document_number: cedula.value,
        password: password.value
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.msg || 'Error en la autenticación')
    }

    const data = await response.json()

    let userData = data.researcher || data.deputyDirector

    // 🔒 Validar coincidencia de roles seleccionados vs reales
    const backendRole = (userData.role || '').toUpperCase()
    const selected = (selectedRole.value || '').toUpperCase()

    if (backendRole !== selected) {
      info("rol no coincide con el seleccionado")
    }


    // Guardar token y datos del usuario en el store - orden correcto: (token, userData)
    authStore.setAuth(data.token, userData)

    // Redirigir según el rol del usuario
    let redirectRoute = '/app/inicio'

    if (userData.role === 'ADMIN') {
      redirectRoute = '/app/admin/proyectos'
    } else if (userData.role === 'LEAD_RESEARCHER' || userData.role === 'LEADER' || userData.role === 'LIDER') {
      // Navegar al componente de Actividades de Líder usando el router
      router.push('/app/lider/actividades')
      return
    } else if (userData.role === 'RESEARCHER' || userData.role === 'COORDINATOR') {
      redirectRoute = '/app/investigador/actividades'
    } else if (userData.role === 'DEPUTY_DIRECTOR') {
      redirectRoute = '/app/admin/proyectos'
    } else if (userData.role === 'SUPER') {
      redirectRoute = '/app/super/centros'
    }

    console.log('Login exitoso, redirigiendo a:', redirectRoute)
    router.push(redirectRoute)

  } catch (err) {
    console.error('Error en login:', err)
    const errorMsg = err.message || 'Error de conexión. Verifica que el servidor esté corriendo.'
    errorMessage.value = errorMsg

    // Mostrar notificación de error
    $q.notify({
      type: 'negative',
      message: errorMsg,
      position: 'top',
      timeout: 4000,
      icon: 'error',
      actions: [{ icon: 'close', color: 'white' }]
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Header del login */
.login-header {
  background: linear-gradient(135deg, #71277A 0%, #5b1f62 100%);
  box-shadow: 0 2px 8px rgba(113, 39, 122, 0.3);
}

.header-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-title-text {
  font-size: 1.5rem;
  font-weight: 700;
}

/* Card de login */
.login-card {
  border-radius: 16px;
  border: 3px solid #71277A !important;
  box-shadow: 0 4px 16px rgba(113, 39, 122, 0.15);
}

/* Icono de login */
.login-icon {
  color: #71277A;
}

/* Inputs del login */
.login-input :deep(.q-field__control) {
  border-radius: 8px;
}

.login-input :deep(.q-field--outlined .q-field__control) {
  border: 2px solid #e0e0e0;
  transition: border-color 0.3s ease;
}

.login-input :deep(.q-field--outlined:focus .q-field__control),
.login-input :deep(.q-field--outlined.q-field--highlighted .q-field__control) {
  border: 2px solid #71277A;
}

.login-input :deep(.q-field__label) {
  color: #6b7280;
  font-weight: 500;
}

/* Botón de login */
.login-button {
  background: linear-gradient(135deg, #71277A 0%, #5b1f62 100%);
  box-shadow: 0 4px 12px rgba(113, 39, 122, 0.3);
  transition: all 0.3s ease;
}

.login-button:hover {
  box-shadow: 0 6px 16px rgba(113, 39, 122, 0.4);
  transform: translateY(-2px);
}

.login-button:active {
  transform: translateY(0);
}
</style>