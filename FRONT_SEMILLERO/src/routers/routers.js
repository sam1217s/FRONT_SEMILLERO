import { createRouter, createWebHashHistory } from "vue-router"
import MainLayout from '../mainlayouth/mainlayouth.vue'
import Login from '../views/Login.vue'
import Inicio from '../components/start.vue'

// Importar vistas del líder
import LiderActividades from '../views/lider/Actividades.vue'
import LiderReuniones from '../views/lider/Reuniones.vue'
import LiderProductos from '../views/lider/Productos.vue'
import LiderProyectos from '../views/lider/Proyectos.vue'
import LiderSemilleros from '../views/lider/Semilleros.vue'
import LiderPerfil from '../views/lider/Perfil.vue'
import LiderEquipo from '../views/lider/Equipo.vue'
import LiderReportes from '../views/lider/Reportes.vue'

// Importar vistas del investigador
import InvestigadorActividades from '../views/investigador/Actividades.vue'
import InvestigadorProyectos from '../views/investigador/Proyectos.vue'
import InvestigadorPerfil from '../views/investigador/Perfil.vue'
import InvestigadorDocumentos from '../views/investigador/Documentos.vue'

// Importar vistas del admin
import AdminEstadisticas from '../views/admin/Estadisticas.vue'
import AdminProyectos from '../views/admin/Aprobar_Proyectos.vue'
import AdminInvestigadores from '../views/admin/Investigadores.vue'
import AdminGrupos from '../views/admin/Grupos.vue'
import AdminAlertas from '../views/admin/Alertas.vue'

// Importar vistas del super admin
import SuperAdministradores from '../views/super/Administradores.vue'
import SuperCentros from '../views/super/Centros.vue'

const routes = [
  { path: "/", name: "Login", component: Login },
  {
    path: "/app",
    component: MainLayout,
    children: [
      // Ruta principal
      { path: "inicio", name: "Inicio", component: Inicio },
      
      // Rutas del líder
      { path: "lider/actividades", name: "LiderActividades", component: LiderActividades, meta: { roles: ['LIDER', 'ADMIN', 'INVESTIGADOR'] } },
      { path: "lider/reuniones", name: "LiderReuniones", component: LiderReuniones, meta: { roles: ['LIDER', 'ADMIN'] } },
      { path: "lider/productos", name: "LiderProductos", component: LiderProductos, meta: { roles: ['LIDER', 'ADMIN'] } },
      { path: "lider/proyectos", name: "LiderProyectos", component: LiderProyectos, meta: { roles: ['LIDER', 'ADMIN'] } },
      { path: "lider/semilleros", name: "LiderSemilleros", component: LiderSemilleros, meta: { roles: ['LIDER', 'ADMIN'] } },
      { path: "lider/perfil", name: "LiderPerfil", component: LiderPerfil, meta: { roles: ['LIDER', 'ADMIN'] } },
      { path: "lider/equipo", name: "LiderEquipo", component: LiderEquipo, meta: { roles: ['LIDER', 'ADMIN'] } },
      { path: "lider/reportes", name: "LiderReportes", component: LiderReportes, meta: { roles: ['LIDER', 'ADMIN'] } },

      // Rutas del investigador
      { path: "investigador/actividades", name: "InvestigadorActividades", component: InvestigadorActividades, meta: { roles: ['INVESTIGADOR'] } },
      { path: "investigador/proyectos", name: "InvestigadorProyectos", component: InvestigadorProyectos, meta: { roles: ['INVESTIGADOR'] } },
      { path: "investigador/perfil", name: "InvestigadorPerfil", component: InvestigadorPerfil, meta: { roles: ['INVESTIGADOR'] } },
      { path: "investigador/documentos", name: "InvestigadorDocumentos", component: InvestigadorDocumentos, meta: { roles: ['INVESTIGADOR'] } },

      // Rutas del admin
      { path: "admin/estadisticas", name: "AdminEstadisticas", component: AdminEstadisticas, meta: { roles: ['ADMIN'] } },
      { path: "admin/proyectos", name: "AdminProyectos", component: AdminProyectos, meta: { roles: ['ADMIN'] } },
      { path: "admin/investigadores", name: "AdminInvestigadores", component: AdminInvestigadores, meta: { roles: ['ADMIN'] } },
      { path: "admin/grupos", name: "AdminGrupos", component: AdminGrupos, meta: { roles: ['ADMIN'] } },
      { path: "admin/alertas", name: "AdminAlertas", component: AdminAlertas, meta: { roles: ['ADMIN'] } },

      // Rutas del super admin
      { path: "super/administradores", name: "SuperAdministradores", component: SuperAdministradores, meta: { roles: ['SUPER'] } },
      { path: "super/centros", name: "SuperCentros", component: SuperCentros, meta: { roles: ['SUPER'] } },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Guard de navegación para verificar permisos por rol
router.beforeEach((to, from, next) => {
  // Permitir acceso al login sin verificación
  if (to.path === '/') {
    next()
    return
  }

  // Obtener rol del usuario desde localStorage
  const authData = localStorage.getItem('auth')
  if (!authData) {
    // Si no hay sesión, redirigir al login
    next('/')
    return
  }

  try {
    const auth = JSON.parse(authData)
    const userRole = auth.user?.role?.trim().toUpperCase()

    // Si la ruta tiene roles definidos en meta
    if (to.meta?.roles) {
      if (!to.meta.roles.includes(userRole)) {
        // Usuario no tiene permiso para esta ruta
        console.warn(`Acceso denegado: Usuario con rol ${userRole} intentó acceder a ${to.path}`)

        // Redirigir a la ruta apropiada según su rol
        if (userRole === 'SUPER') {
          next('/app/super/centros')
        } else if (userRole === 'ADMIN') {
          next('/app/admin/estadisticas')
        } else if (userRole === 'LIDER') {
          next('/app/lider/actividades')
        } else if (userRole === 'INVESTIGADOR') {
          next('/app/lider/actividades')
        } else {
          next('/')
        }
        return
      }
    }

    // Usuario tiene permiso, continuar
    next()
  } catch (error) {
    console.error('Error verificando permisos:', error)
    next('/')
  }
})

export default router
