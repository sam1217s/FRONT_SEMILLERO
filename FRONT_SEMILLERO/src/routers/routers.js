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
      { path: "lider/actividades", name: "LiderActividades", component: LiderActividades },
      { path: "lider/reuniones", name: "LiderReuniones", component: LiderReuniones },
      { path: "lider/productos", name: "LiderProductos", component: LiderProductos },
      { path: "lider/proyectos", name: "LiderProyectos", component: LiderProyectos },
      { path: "lider/semilleros", name: "LiderSemilleros", component: LiderSemilleros },
      { path: "lider/perfil", name: "LiderPerfil", component: LiderPerfil },
      { path: "lider/equipo", name: "LiderEquipo", component: LiderEquipo },
      { path: "lider/reportes", name: "LiderReportes", component: LiderReportes },
      
      // Rutas del investigador
      { path: "investigador/actividades", name: "InvestigadorActividades", component: InvestigadorActividades },
      { path: "investigador/proyectos", name: "InvestigadorProyectos", component: InvestigadorProyectos },
      { path: "investigador/perfil", name: "InvestigadorPerfil", component: InvestigadorPerfil },
      { path: "investigador/documentos", name: "InvestigadorDocumentos", component: InvestigadorDocumentos },
      
      // Rutas del admin
      { path: "admin/estadisticas", name: "AdminEstadisticas", component: AdminEstadisticas },
      { path: "admin/proyectos", name: "AdminProyectos", component: AdminProyectos },
      { path: "admin/investigadores", name: "AdminInvestigadores", component: AdminInvestigadores },
      { path: "admin/grupos", name: "AdminGrupos", component: AdminGrupos },
      { path: "admin/alertas", name: "AdminAlertas", component: AdminAlertas },
      
      // Rutas del super admin
      { path: "super/administradores", name: "SuperAdministradores", component: SuperAdministradores },
      { path: "super/centros", name: "SuperCentros", component: SuperCentros },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
