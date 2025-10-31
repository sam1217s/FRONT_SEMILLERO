<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="shadow-1">
          <q-card-section>
            <div class="page-title">
              <q-icon name="warning" class="q-mr-sm" />
              Alertas
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Ver y gestionar alertas del sistema completo
            </div>
          </q-card-section>
          
          <q-card-section>
            <!-- Proyectos pendientes de confirmación -->
            <div class="section-title q-mb-md">
              <q-icon name="pending_actions" class="q-mr-sm" />
              Proyectos Pendientes de Confirmación
            </div>
            
            <div v-if="proyectosPendientes.length === 0" class="text-center q-pa-xl">
              <q-icon name="check_circle" size="80px" color="positive" />
              <div class="text-h6 text-grey-6 q-mt-md">No hay proyectos pendientes</div>
              <div class="text-caption text-grey-5">
                Todos los proyectos han sido procesados
              </div>
            </div>
            
            <div v-else class="row q-col-gutter-md">
              <div 
                v-for="proyecto in proyectosPendientes" 
                :key="proyecto.id" 
                class="col-12 col-md-6 col-lg-4"
              >
                <ProjectCard 
                  :project="proyecto"
                  @view-detail="handleViewDetail"
                  @approve="handleApprove"
                  @reject="handleReject"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
        
        <!-- Modal de confirmación para aprobar -->
        <q-dialog v-model="showApproveDialog">
          <q-card style="min-width: 400px">
            <q-card-section class="row items-center q-pb-none">
              <q-icon name="check_circle" color="positive" size="sm" class="q-mr-sm" />
              <div class="text-h6">Confirmar Aprobación</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
              <div class="text-body2 q-mb-md">
                ¿Está seguro de que desea aprobar este proyecto?
              </div>
              <div class="project-summary q-pa-md bg-grey-1 rounded-borders">
                <div class="text-weight-medium text-primary">{{ selectedProject?.titulo }}</div>
                <div class="text-caption text-grey-6 q-mt-xs">
                  Líder: {{ selectedProject?.lider }} | Semillero: {{ selectedProject?.semillero }}
                </div>
                <div class="text-caption text-grey-6">
                  Presupuesto: {{ selectedProject?.presupuesto }}
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="grey" v-close-popup />
              <q-btn 
                label="Aprobar" 
                color="positive" 
                @click="confirmApprove"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
        
        <!-- Modal para rechazar proyecto (reutilizando el de Aprobar_Proyectos.vue) -->
        <q-dialog v-model="showRejectDialog">
          <q-card style="min-width: 350px">
            <q-card-section class="row items-center q-pb-none">
              <q-icon name="cancel" color="negative" size="sm" class="q-mr-sm" />
              <div class="text-h6">Desaprobar Proyecto</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
              <div class="text-body2 q-mb-md">
                ¿Por qué se desaprueba este proyecto?
              </div>
              <div class="project-summary q-pa-md bg-grey-1 rounded-borders q-mb-md">
                <div class="text-weight-medium text-primary">{{ selectedProject?.titulo }}</div>
                <div class="text-caption text-grey-6 q-mt-xs">
                  Líder: {{ selectedProject?.lider }} | Semillero: {{ selectedProject?.semillero }}
                </div>
              </div>
              <q-input
                v-model="rejectComment"
                filled
                autofocus
                label="Comentario"
                type="textarea"
                rows="4"
                placeholder="Explique el motivo de la desaprobación..."
                :rules="[val => !!val || 'El comentario es obligatorio']"
              />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="grey" v-close-popup />
              <q-btn 
                label="Enviar" 
                color="negative" 
                @click="confirmReject"
                :disable="!rejectComment.trim()"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import ProjectCard from '../../components/ProjectCard.vue'
import { getData, putData } from '../../services/apiClient'

const $q = useQuasar()

// Estados de los modales
const showApproveDialog = ref(false)
const showRejectDialog = ref(false)
const selectedProject = ref(null)
const rejectComment = ref('')

// Datos de proyectos pendientes de confirmación
const proyectosPendientes = ref([])

// Cargar proyectos pendientes
const cargarProyectosPendientes = async () => {
  try {
    // Usar /projects/list y filtrar los pendientes
    const response = await getData('/projects/list')

    if (!response || !response.msg || !Array.isArray(response.msg)) {
      console.warn('Respuesta vacía o formato incorrecto del backend:', response)
      proyectosPendientes.value = []
      return
    }

    // Filtrar solo proyectos pendientes de aprobación
    const proyectosPendientesData = response.msg.filter(p => p.approval_status === 'Pending')

    proyectosPendientes.value = proyectosPendientesData.map(p => ({
      id: p._id,
      titulo: p.project_name,
      descripcion: p.description || 'Sin descripción',
      investigador: p.id_leader?.name || 'No asignado',
      fecha: p.createdAt ? new Date(p.createdAt).toLocaleDateString('es-CO') : 'N/A',
      ...p
    }))
  } catch (error) {
    console.error('Error al cargar proyectos pendientes:', error)
    $q.notify({ type: 'negative', message: 'Error al cargar proyectos pendientes', position: 'top', timeout: 3000 })
    proyectosPendientes.value = []
  }
}


// Handlers para los eventos de las tarjetas
const handleViewDetail = (proyecto) => {
  console.log('Ver detalle del proyecto:', proyecto)
  $q.notify({
    type: 'info',
    message: `Viendo detalles de: ${proyecto.titulo}`,
    position: 'top',
    timeout: 3000
  })
  // TODO: Implementar modal o navegación para ver detalles
}

const handleApprove = (proyecto) => {
  console.log('Aprobar proyecto:', proyecto)
  selectedProject.value = proyecto
  showApproveDialog.value = true
}

const handleReject = (proyecto) => {
  console.log('Rechazar proyecto:', proyecto)
  selectedProject.value = proyecto
  rejectComment.value = ''
  showRejectDialog.value = true
}

// Función para confirmar la aprobación
const confirmApprove = async () => {
  if (!selectedProject.value) return

  try {
    await putData(`/projects/approve/${selectedProject.value.id}`)

    $q.notify({
      type: 'positive',
      message: `Proyecto "${selectedProject.value.titulo}" aprobado exitosamente`,
      position: 'top',
      timeout: 4000
    })

    // Recargar proyectos pendientes
    await cargarProyectosPendientes()
  } catch (error) {
    console.error('Error al aprobar proyecto:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al aprobar el proyecto',
      position: 'top',
      timeout: 3000
    })
  } finally {
    // Cerrar modal y limpiar
    showApproveDialog.value = false
    selectedProject.value = null
  }
}

// Función para confirmar el rechazo
const confirmReject = async () => {
  if (!selectedProject.value || !rejectComment.value.trim()) return

  try {
    await putData(`/projects/reject/${selectedProject.value.id}`, {
      comment: rejectComment.value
    })

    $q.notify({
      type: 'negative',
      message: `Proyecto "${selectedProject.value.titulo}" rechazado`,
      position: 'top',
      timeout: 4000
    })

    // Recargar proyectos pendientes
    await cargarProyectosPendientes()
  } catch (error) {
    console.error('Error al rechazar proyecto:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al rechazar el proyecto',
      position: 'top',
      timeout: 3000
    })
  } finally {
    // Cerrar modal y limpiar
    showRejectDialog.value = false
    selectedProject.value = null
    rejectComment.value = ''
  }
}

// Cargar proyectos pendientes al montar el componente
onMounted(() => {
  cargarProyectosPendientes()
})
</script>

<style scoped>
.q-card {
  border-radius: 12px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #71277A;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #71277A;
  display: flex;
  align-items: center;
}

.project-summary {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.text-primary {
  color: #71277A !important;
}
</style>
