<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="shadow-1">
          <q-card-section>
            <div class="page-title">
              <q-icon name="analytics" class="q-mr-sm" />
              Estadísticas
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Resumen general del sistema de investigación
            </div>
          </q-card-section>
          
          <q-card-section>
            <!-- Contenido principal -->
            <div class="page-container">
        <!-- Sección GENERALES -->
        <div class="section">
          <div class="section-title">GENERALES</div>
          <div class="row q-col-gutter-md">
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-card class="stat-card">
                <q-card-section class="text-center">
                  <div class="stat-number">{{ estadisticas.investigadoresActivos }}</div>
                  <div class="stat-label">Investigadores Activos</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-card class="stat-card">
                <q-card-section class="text-center">
                  <div class="stat-number">{{ estadisticas.gruposActivos }}</div>
                  <div class="stat-label">Grupos Activos</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-card class="stat-card">
                <q-card-section class="text-center">
                  <div class="stat-number">{{ estadisticas.semillerosActivos }}</div>
                  <div class="stat-label">Semilleros Activos</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3">
              <q-card class="stat-card">
                <q-card-section class="text-center">
                  <div class="stat-number">{{ estadisticas.proyectosActivos }}</div>
                  <div class="stat-label">Proyectos Activos</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

      <!-- Sección ACCIONES RAPIDAS -->
      <div class="section">
        <div class="section-title">ACCIONES RÁPIDAS</div>
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-sm-6 col-md-3">
            <q-card class="action-card" clickable @click="handleRegistrarInvestigador">
              <q-card-section class="text-center">
                <q-icon name="person_add" size="48px" class="action-icon" />
                <div class="action-label">Registrar Investigador</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3">
            <q-card class="action-card" clickable @click="handleCrearGrupo">
              <q-card-section class="text-center">
                <q-icon name="group_add" size="48px" class="action-icon" />
                <div class="action-label">Crear Grupo de Investigación</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3">
            <q-card class="action-card" clickable @click="handleGestionarPermisos">
              <q-card-section class="text-center">
                <q-icon name="admin_panel_settings" size="48px" class="action-icon" />
                <div class="action-label">Gestionar Permisos</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3">
            <q-card class="action-card" clickable @click="handleFiltros">
              <q-card-section class="text-center">
                <q-icon name="filter_list" size="48px" class="action-icon" />
                <div class="action-label">Filtros de grupos, semilleros y proyectos</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

        <!-- Sección ALERTAS Y PENDIENTES -->
        <div class="section">
          <div class="alerts-container">
            <div class="section-title red">ALERTAS Y PENDIENTES</div>
            <div v-if="alertas.length === 0" class="text-center q-pa-md">
              <q-icon name="check_circle" size="48px" color="positive" />
              <div class="text-h6 text-grey-6 q-mt-md">No hay alertas pendientes</div>
            </div>
            <div v-else class="alerts-list">
              <div 
                v-for="alerta in alertas" 
                :key="alerta.id" 
                class="alert-item"
                @click="handleAlertClick(alerta)"
              >
                <div :class="`alert-icon ${alerta.tipo}-circle`"></div>
                <div class="alert-text">{{ alerta.mensaje }}</div>
                <q-icon name="chevron_right" color="grey-5" />
              </div>
            </div>
          </div>
        </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

// Datos de estadísticas
const estadisticas = ref({
  investigadoresActivos: 0,
  gruposActivos: 0,
  semillerosActivos: 0,
  proyectosActivos: 0
})

// Datos de alertas
const alertas = ref([])

// Función para cargar estadísticas
const cargarEstadisticas = () => {
  // Datos de ejemplo (en producción vendrían del backend)
  estadisticas.value = {
    investigadoresActivos: 45,
    gruposActivos: 12,
    semillerosActivos: 8,
    proyectosActivos: 24
  }
  
  // Cargar alertas
  alertas.value = [
    {
      id: 1,
      tipo: 'red',
      mensaje: '3 contratos vencen este mes',
      accion: 'ver_contratos'
    },
    {
      id: 2,
      tipo: 'yellow',
      mensaje: '2 proyectos requieren aprobación',
      accion: 'ver_proyectos_pendientes'
    },
    {
      id: 3,
      tipo: 'yellow',
      mensaje: '5 solicitudes de recursos pendientes',
      accion: 'ver_solicitudes'
    },
    {
      id: 4,
      tipo: 'blue',
      mensaje: '1 nuevo producto registrado',
      accion: 'ver_productos'
    }
  ]
}

// Función para manejar clics en alertas
const handleAlertClick = (alerta) => {
  console.log('Alert clicked:', alerta)
  
  // Navegar según el tipo de alerta
  switch (alerta.accion) {
    case 'ver_contratos':
      router.push('/app/admin/investigadores')
      break
    case 'ver_proyectos_pendientes':
      router.push('/app/admin/alertas')
      break
    case 'ver_solicitudes':
      router.push('/app/admin/grupos')
      break
    case 'ver_productos':
      router.push('/app/lider/productos')
      break
    default:
      $q.notify({
        type: 'info',
        message: `Acción: ${alerta.mensaje}`,
        position: 'top',
        timeout: 3000
      })
  }
}

// Handlers para acciones rápidas
const handleRegistrarInvestigador = () => {
  console.log('Registrar Investigador')
  $q.notify({
    type: 'info',
    message: 'Función de registrar investigador en desarrollo',
    position: 'top',
    timeout: 3000
  })
}

const handleCrearGrupo = () => {
  console.log('Crear Grupo')
  $q.notify({
    type: 'info',
    message: 'Función de crear grupo en desarrollo',
    position: 'top',
    timeout: 3000
  })
}

const handleGestionarPermisos = () => {
  console.log('Gestionar Permisos')
  $q.notify({
    type: 'info',
    message: 'Función de gestionar permisos en desarrollo',
    position: 'top',
    timeout: 3000
  })
}

const handleFiltros = () => {
  console.log('Abrir Filtros')
  $q.notify({
    type: 'info',
    message: 'Función de filtros en desarrollo',
    position: 'top',
    timeout: 3000
  })
}

// Cargar datos al montar el componente
onMounted(() => {
  cargarEstadisticas()
})
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
}

.q-card {
  border-radius: 12px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #71277A;
}

.section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #71277A;
  margin-bottom: 16px;
}

.section-title.red {
  color: #C10015;
}

/* Tarjetas de estadísticas */
.stat-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(113, 39, 122, 0.2);
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: #71277A;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.95rem;
  color: #424242;
  font-weight: 500;
}

/* Tarjetas de acciones */
.action-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  cursor: pointer;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(113, 39, 122, 0.2);
  background: #f9f5fa;
}

.action-icon {
  color: #71277A;
  margin-bottom: 12px;
}

.action-label {
  font-size: 0.9rem;
  color: #424242;
  font-weight: 500;
  line-height: 1.3;
}

/* Contenedor de alertas */
.alerts-container {
  border: 2px solid #C10015;
  border-radius: 12px;
  padding: 20px;
  background: white;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
}

.alert-item:hover {
  background: #fff5f5;
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.alert-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
}

.alert-icon.red-circle {
  background: #C10015;
}

.alert-icon.yellow-circle {
  background: #F2C037;
}

.alert-icon.blue-circle {
  background: #31CCEC;
}

.alert-text {
  font-size: 0.95rem;
  color: #424242;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 600px) {
  .stat-number {
    font-size: 2.5rem;
  }
  
  .stat-label {
    font-size: 0.85rem;
  }
  
  .action-label {
    font-size: 0.8rem;
  }
}
</style>

