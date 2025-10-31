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
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import ProjectCard from '../../components/ProjectCard.vue'

const $q = useQuasar()

// Estados de los modales
const showApproveDialog = ref(false)
const showRejectDialog = ref(false)
const selectedProject = ref(null)
const rejectComment = ref('')

// Datos de proyectos pendientes de confirmación


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
const confirmApprove = () => {
  if (!selectedProject.value) return
  
  // Remover el proyecto de la lista de pendientes
  const index = proyectosPendientes.value.findIndex(p => p.id === selectedProject.value.id)
  if (index !== -1) {
    proyectosPendientes.value.splice(index, 1)
  }
  
  $q.notify({
    type: 'positive',
    message: `Proyecto "${selectedProject.value.titulo}" aprobado exitosamente`,
    position: 'top',
    timeout: 4000
  })
  
  // Cerrar modal y limpiar
  showApproveDialog.value = false
  selectedProject.value = null
  
  // TODO: Implementar llamada al backend para aprobar
  // await postData(`/projects/${selectedProject.value.id}/approve`)
}

// Función para confirmar el rechazo
const confirmReject = () => {
  if (!selectedProject.value || !rejectComment.value.trim()) return
  
  // Remover el proyecto de la lista de pendientes
  const index = proyectosPendientes.value.findIndex(p => p.id === selectedProject.value.id)
  if (index !== -1) {
    proyectosPendientes.value.splice(index, 1)
  }
  
  $q.notify({
    type: 'negative',
    message: `Proyecto "${selectedProject.value.titulo}" rechazado`,
    position: 'top',
    timeout: 4000
  })
  
  // Cerrar modal y limpiar
  showRejectDialog.value = false
  selectedProject.value = null
  rejectComment.value = ''
  
  // TODO: Implementar llamada al backend para rechazar
  // await postData(`/projects/${selectedProject.value.id}/reject`, { comment: rejectComment.value })
}
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
