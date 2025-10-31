<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="shadow-1">
          <q-card-section>
            <div class="page-title">
              <q-icon name="approval" class="q-mr-sm" />
              Aprobar Proyectos
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Aprobar o desaprobar proyectos de investigación
            </div>
          </q-card-section>
          
          <q-card-section>
            <Table 
              :rows="proyectos"
              :columns="columns"
              title="PROYECTOS ACTIVOS"
              add-button-label="AGREGAR"
              @add-item="handleAddProject"
              @view-item="handleViewProject"
              @approve-item="handleApproveProject"
              @reject-item="handleRejectProject"
            />
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
                <div class="text-weight-medium text-primary">{{ selectedProject?.nombre }}</div>
                <div class="text-caption text-grey-6 q-mt-xs">
                  Investigadores: {{ selectedProject?.investigadores }} | Vigencia: {{ selectedProject?.vigencia }}
                </div>
                <div class="text-caption text-grey-6">
                  Estado: {{ selectedProject?.estado }}
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
                <div class="text-weight-medium text-primary">{{ selectedProject?.nombre }}</div>
                <div class="text-caption text-grey-6 q-mt-xs">
                  Investigadores: {{ selectedProject?.investigadores }} | Vigencia: {{ selectedProject?.vigencia }}
                </div>
                <div class="text-caption text-grey-6">
                  Estado: {{ selectedProject?.estado }}
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
        
        <!-- Modal para desaprobar proyecto -->
        <q-dialog v-model="showRejectDialog">
          <q-card style="min-width: 350px">
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">Desaprobar Proyecto</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
              <div class="text-body2 q-mb-md">
                ¿Por qué se desaprueba este proyecto?
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
import Table from '../../components/table.vue'
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Datos de proyectos (ejemplo con una fila para probar)
const proyectos = ref([
  {
    id: 1,
    nombre: 'GRUPO DE ENERGÍAS RENOVABLES',
    investigadores: 15,
    estado: 'Activo',
    vigencia: '2023-2025'
  }
])

// Columnas para la tabla de proyectos
const columns = [
  {
    name: 'nombre',
    label: 'Proyecto',
    field: 'nombre',
    align: 'left',
    sortable: false
  },
  {
    name: 'investigadores',
    label: 'Investigadores',
    field: 'investigadores',
    align: 'center',
    sortable: false
  },
  {
    name: 'vigencia',
    label: 'Vigencia',
    field: 'vigencia',
    align: 'center',
    sortable: false
  },
  {
    name: 'actions',
    label: 'Ver proyecto',
    field: 'actions',
    align: 'center',
    sortable: false
  },
  {
    name: 'options',
    label: 'Opciones',
    field: 'options',
    align: 'center',
    sortable: false
  }
]

// Función para cargar proyectos desde el backend
const cargarProyectos = async () => {
  try {
    // TODO: Implementar llamada al backend
    // const response = await getData('/projects/list')
    // proyectos.value = response.msg
  } catch (error) {
    console.error('Error al cargar proyectos:', error)
  }
}

// Modales
const showApproveDialog = ref(false)
const showRejectDialog = ref(false)
const rejectComment = ref('')
const selectedProject = ref(null)

// Handlers para los eventos de la tabla
const handleAddProject = () => {
  console.log('Agregar nuevo proyecto')
  // TODO: Implementar lógica para agregar proyecto
}

const handleViewProject = (project) => {
  console.log('Ver proyecto:', project)
  // TODO: Implementar lógica para ver proyecto
}

const handleApproveProject = (project) => {
  console.log('Aprobar proyecto:', project)
  selectedProject.value = project
  showApproveDialog.value = true
}

const handleRejectProject = (project) => {
  console.log('Desaprobar proyecto:', project)
  selectedProject.value = project
  showRejectDialog.value = true
}

// Función para confirmar la aprobación
const confirmApprove = () => {
  if (!selectedProject.value) return
  
  console.log('Aprobar proyecto:', selectedProject.value)
  
  // TODO: Implementar lógica para aprobar proyecto
  // Ejemplo: await putData(`/projects/${selectedProject.value.id}/approve`)
  
  $q.notify({
    type: 'positive',
    message: `Proyecto "${selectedProject.value.nombre}" aprobado exitosamente`,
    position: 'top',
    timeout: 4000
  })
  
  // Cerrar modal y limpiar
  showApproveDialog.value = false
  selectedProject.value = null
}

const confirmReject = () => {
  if (!rejectComment.value.trim()) {
    $q.notify({
      type: 'negative',
      message: 'Por favor ingrese un comentario',
      position: 'top',
      timeout: 3000
    })
    return
  }
  
  console.log('Desaprobar proyecto:', selectedProject.value, 'Comentario:', rejectComment.value)
  
  // TODO: Implementar lógica para desaprobar proyecto
  // Ejemplo: await putData(`/projects/${selectedProject.value.id}/reject`, { comment: rejectComment.value })
  
  $q.notify({
    type: 'info',
    message: 'Proyecto desaprobado',
    position: 'top',
    timeout: 3000
  })
  
  // Limpiar formulario y cerrar modal
  rejectComment.value = ''
  showRejectDialog.value = false
  selectedProject.value = null
}

// Cargar proyectos al montar el componente
// onMounted(() => {
//   cargarProyectos()
// })
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

.project-summary {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.text-primary {
  color: #71277A !important;
}
</style>

