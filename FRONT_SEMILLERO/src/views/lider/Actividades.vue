<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="shadow-1">

          <!-- HEADER -->
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="page-title">
                <q-icon name="event_note" class="q-mr-sm" />
                Mis Actividades
              </div>
              <div class="text-caption text-grey-7 q-mt-xs">
                Gestiona tus actividades de investigación
              </div>
            </div>
            <div class="row q-gutter-sm"></div>
          </q-card-section>

          <q-separator />

          <!-- TABLA -->
          <q-card-section>
            <!-- FILTROS -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-3">
                <q-input v-model="busqueda" filled clearable label="Buscar" placeholder="Buscar por nombre...">
                  <template #prepend><q-icon name="search" /></template>
                </q-input>
              </div>
              <div class="col-6 col-md-2">
                <q-select v-model="filtroProceso" :options="statusOptions" option-label="label" option-value="value"
                  emit-value map-options filled clearable label="Proceso" />
              </div>
              <div class="col-6 col-md-2">
                <q-select v-model="filtroPrioridad" :options="priorityOptions" option-label="label" option-value="value"
                  emit-value map-options filled clearable label="Prioridad" />
              </div>
              <div class="col-12 col-md-3">
                <q-select v-model="filtroProyecto" :options="projectOptions" option-label="label" option-value="value"
                  emit-value map-options filled clearable label="Proyecto" />
              </div>
              <div class="col-12 col-md-2">
                <q-select v-model="filtroInvestigador" :options="researcherOptions" option-label="label"
                  option-value="value" emit-value map-options filled clearable label="Investigador" />
              </div>
            </div>

            <!-- LOADING -->
            <div v-if="loading" class="text-center q-pa-xl">
              <q-spinner-dots size="50px" color="primary" />
              <div class="text-h6 text-grey-6 q-mt-md">Cargando actividades...</div>
            </div>

            <!-- TABLA PRINCIPAL -->
            <Table v-else :rows="rowsMostrados" :columns="tableColumns" title="ACTIVIDADES"
              add-button-label="NUEVA ACTIVIDAD" @add-item="openCreate">
              <template #options-column="{ row }">
                <ActionButtons
                  :row="row"
                  :show-view="true"
                  :show-edit="true"
                  :show-toggle-status="true"
                  view-tooltip="Ver detalle"
                  edit-tooltip="Editar actividad"
                  activate-tooltip="Activar"
                  deactivate-tooltip="Desactivar"
                  @view="openDetail"
                  @edit="openEdit"
                  @toggle-status="handleToggleStatus"
                />
              </template>
            </Table>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!-- PERFIL -->
    <q-dialog v-model="showDetail">
      <q-card style="min-width: 800px; max-width: 1000px">
        <q-card-section class="modal-header">
          <div class="text-h6">
            <q-icon name="visibility" class="q-mr-sm" /> Detalle de Actividad
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="current">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="text-h6 text-primary q-mb-md">{{ current.name }}</div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-primary q-mb-sm">Información General</div>
              <div class="info-item"><strong>Proyecto:</strong> {{ current.id_project?.project_name || 'Sin proyecto' }}</div>
              <div class="info-item"><strong>Investigador:</strong> {{ current.responsible_researcher?.name || 'Sin asignar' }}</div>
              <div class="info-item">
                <strong>Estado:</strong>
                <q-badge :color="statusColor(current.status)">{{ mapStatus(current.status) }}</q-badge>
              </div>
              <div class="info-item">
                <strong>Prioridad:</strong>
                <q-badge :color="priorityColor(current.priority)">{{ mapPriority(current.priority) }}</q-badge>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-primary q-mb-sm">Fechas</div>
              <div class="info-item"><strong>Inicio:</strong> {{ formatDate(current.start_date) }}</div>
              <div class="info-item"><strong>Fin:</strong> {{ formatDate(current.end_date) }}</div>
            </div>

            <div class="col-12">
              <div class="text-subtitle2 text-primary q-mb-sm">Descripción</div>
              <div class="info-item">{{ current.description || 'Sin descripción' }}</div>
            </div>

            <div class="col-12" v-if="current.observations">
              <div class="text-subtitle2 text-primary q-mb-sm">Observaciones</div>
              <div class="info-item">{{ current.observations }}</div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- CREAR/EDITAR -->
    <q-dialog v-model="showForm">
      <q-card style="min-width: 800px; max-width: 900px">
        <q-card-section class="modal-header">
          <div class="text-h6">
            {{ isEdit ? 'Editar Actividad' : 'Nueva Actividad' }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input v-model="formData.name" filled label="Nombre" />
              <q-select v-model="formData.id_project" :options="projectOptions" option-label="label" option-value="value"
                emit-value map-options filled label="Proyecto" clearable class="q-mt-md" />
              <q-select v-model="formData.responsible_researcher" :options="researcherOptions" option-label="label"
                option-value="value" emit-value map-options filled label="Investigador responsable" clearable class="q-mt-md" />
              <q-input v-model="formData.start_date" filled label="Fecha inicio" type="date" class="q-mt-md" />
              <q-input v-model="formData.end_date" filled label="Fecha fin" type="date" class="q-mt-md" />
            </div>

            <div class="col-12 col-md-6">
              <q-select v-model="formData.status" :options="statusOptions" option-label="label" option-value="value"
                emit-value map-options filled label="Estado" />
              <q-select v-model="formData.priority" :options="priorityOptions" option-label="label" option-value="value"
                emit-value map-options filled label="Prioridad" class="q-mt-md" />
              <q-input v-model="formData.description" filled label="Descripción" type="textarea" rows="3" class="q-mt-md" />
              <q-input v-model="formData.observations" filled label="Observaciones" type="textarea" rows="3" class="q-mt-md" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" @click="closeDialog" />
          <q-btn :label="isEdit ? 'Actualizar' : 'Registrar'" color="primary" @click="onSubmitActividad" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getData, postData, putData } from '../../services/apiClient'
import { useNotifications } from '../../composables/useNotifications'
import Table from '../../components/table.vue'
import ActionButtons from '../../components/ActionButtons.vue'

const { error, info } = useNotifications()

const loading = ref(false)
const actividades = ref([])
const busqueda = ref('')
const filtroProceso = ref(null)
const filtroPrioridad = ref(null)
const filtroProyecto = ref(null)
const filtroInvestigador = ref(null)
const showForm = ref(false)
const isEdit = ref(false)
const showDetail = ref(false)
const current = ref(null)

const formData = ref({
  _id: null,
  id_project: null,
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  responsible_researcher: null,
  status: 'pending',
  priority: 'medium',
  observations: ''
})

// Opciones
const projectOptions = ref([])
const researcherOptions = ref([])

const statusOptions = [
  { label: 'Pendiente', value: 'pending' },
  { label: 'En proceso', value: 'in_progress' },
  { label: 'Completada', value: 'completed' },
  { label: 'Cancelada', value: 'cancelled' },
  { label: 'Retrasada', value: 'delayed' }
]

const priorityOptions = [
  { label: 'Baja', value: 'low' },
  { label: 'Media', value: 'medium' },
  { label: 'Alta', value: 'high' },
  { label: 'Urgente', value: 'urgent' }
]

// === FILTRO AUTOMÁTICO ===
const rowsMostrados = computed(() => {
  let filtrados = [...actividades.value]

  // Filtro por estado
  if (filtroProceso.value) {
    filtrados = filtrados.filter(a => a.status === filtroProceso.value)
  }

  // Filtro por prioridad
  if (filtroPrioridad.value) {
    filtrados = filtrados.filter(a => a.priority === filtroPrioridad.value)
  }

  // Filtro por proyecto
  if (filtroProyecto.value) {
    filtrados = filtrados.filter(a => {
      const projectId = a.id_project?._id || a.id_project
      return projectId === filtroProyecto.value
    })
  }

  // Filtro por investigador
  if (filtroInvestigador.value) {
    filtrados = filtrados.filter(a => {
      const researcherId = a.responsible_researcher?._id || a.responsible_researcher
      return researcherId === filtroInvestigador.value
    })
  }

  // Filtro por búsqueda de texto
  const term = busqueda.value?.toLowerCase().trim()
  if (term) {
    filtrados = filtrados.filter(a =>
      (a.name || '').toLowerCase().includes(term)
    )
  }

  return filtrados.map(a => ({
    ...a,
    id: a._id,
    opciones: 'opciones'
  }))
})

// === COLUMNAS ===
const tableColumns = [
  { name: 'nombre', label: 'Nombre', field: 'name', align: 'left' },
  { name: 'proyecto_col', label: 'Proyecto', field: 'id_project', align: 'center', format: (v) => v?.project_name || '-' },
  { name: 'investigador', label: 'Investigador', field: 'responsible_researcher', align: 'center', format: (v) => v?.name || '-' },
  { name: 'prioridad', label: 'Prioridad', field: 'priority', align: 'center', format: (v) => mapPriority(v) },
  { name: 'inicio', label: 'Inicio', field: 'start_date', align: 'center', format: (v) => formatDate(v) },
  { name: 'fin', label: 'Fin', field: 'end_date', align: 'center', format: (v) => formatDate(v) },
  { name: 'proceso', label: 'Proceso', field: 'status', align: 'center', format: (v) => mapStatus(v) },
  { name: 'opciones', label: 'Opciones', field: 'opciones', align: 'center' }
]

// === HELPERS ===
function mapStatus(s) {
  const m = {
    pending: 'Pendiente',
    in_progress: 'En proceso',
    completed: 'Completada',
    cancelled: 'Cancelada',
    delayed: 'Retrasada'
  }
  return m[s] || s
}

function statusColor(s) {
  const m = {
    pending: 'grey-5',
    in_progress: 'primary',
    completed: 'positive',
    cancelled: 'negative',
    delayed: 'warning'
  }
  return m[s] || 'grey'
}

function mapPriority(p) {
  const m = { low: 'Baja', medium: 'Media', high: 'Alta', urgent: 'Urgente' }
  return m[p] || p
}

function priorityColor(p) {
  const m = { low: 'grey-5', medium: 'info', high: 'warning', urgent: 'negative' }
  return m[p] || 'grey'
}

function formatDate(d) {
  if (!d) return '-'
  const date = new Date(d)
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('es-CO')
}

function toISODate(yyyyMMdd) {
  if (!yyyyMMdd) return undefined
  const d = new Date(yyyyMMdd)
  return isNaN(d.getTime()) ? undefined : d.toISOString()
}

// === CRUD ===
// Cargar actividades
const cargarActividades = async () => {
  try {
    loading.value = true
    const res = await getData('/activities/list')
    actividades.value = Array.isArray(res?.msg) ? res.msg : []
  } catch (err) {
    console.error('Error al cargar actividades:', err)
    error('No se pudieron cargar las actividades')
  } finally {
    loading.value = false
  }
}

// Cargar proyectos
const cargarProyectos = async () => {
  try {
    const res = await getData('/projects/list')
    projectOptions.value = (res?.msg || []).map(p => ({
      label: `${p.project_name} (${p.code || 'S/C'})`,
      value: p._id
    }))
  } catch (err) {
    console.error('Error al cargar proyectos:', err)
  }
}

// Cargar investigadores
const cargarInvestigadores = async () => {
  try {
    const res = await getData('/researchers/list')
    const allowed = (res?.msg || []).filter(r => {
      const directRole = r.role
      const arrayRole = Array.isArray(r.roles) ? (r.roles.find(rr => rr.active)?.role || r.roles[0]?.role) : null
      const finalRole = (directRole || arrayRole || '').toUpperCase()
      return finalRole === 'LIDER' || finalRole === 'LEADER' || finalRole === 'INVESTIGADOR' || finalRole === 'RESEARCHER'
    })
    researcherOptions.value = allowed.map(r => ({
      label: r.name,
      value: r._id
    }))
  } catch (err) {
    console.error('Error al cargar investigadores:', err)
  }
}

// Registrar actividad
const registrarActividad = async () => {
  try {
    const payload = {
      id_project: formData.value.id_project,
      name: formData.value.name,
      description: formData.value.description || undefined,
      start_date: toISODate(formData.value.start_date),
      end_date: toISODate(formData.value.end_date),
      responsible_researcher: formData.value.responsible_researcher,
      status: formData.value.status,
      priority: formData.value.priority,
      observations: formData.value.observations || undefined
    }
    await postData('/activities/create', payload)
    await cargarActividades()
    info('Actividad registrada correctamente')
    closeDialog()
  } catch (err) {
    console.error('Error al registrar actividad:', err)
    error('No se pudo registrar la actividad')
  }
}

// Actualizar actividad
const actualizarActividad = async () => {
  try {
    const payload = {
      id_project: formData.value.id_project,
      name: formData.value.name,
      description: formData.value.description || undefined,
      start_date: toISODate(formData.value.start_date),
      end_date: toISODate(formData.value.end_date),
      responsible_researcher: formData.value.responsible_researcher,
      status: formData.value.status,
      priority: formData.value.priority,
      observations: formData.value.observations || undefined
    }
    await putData(`/activities/update/${formData.value._id}`, payload)
    await cargarActividades()
    info('Actividad actualizada correctamente')
    closeDialog()
  } catch (err) {
    console.error('Error al actualizar actividad:', err)
    error('No se pudo actualizar la actividad')
  }
}

// Activar/Desactivar actividad
const handleToggleStatus = async (row) => {
  const nextStatus = row.status === 'cancelled' ? 'pending' : 'cancelled'
  try {
    const payload = {
      id_project: row.id_project?._id || row.id_project,
      name: row.name,
      description: row.description || undefined,
      start_date: row.start_date,
      end_date: row.end_date,
      responsible_researcher: row.responsible_researcher?._id || row.responsible_researcher,
      status: nextStatus,
      priority: row.priority,
      observations: row.observations || undefined
    }
    await putData(`/activities/update/${row._id}`, payload)
    await cargarActividades()
    info(`Actividad ${nextStatus === 'cancelled' ? 'desactivada' : 'activada'} correctamente`)
  } catch (err) {
    console.error('Error al cambiar estado:', err)
    error('No se pudo cambiar el estado de la actividad')
  }
}

// === ACCIONES ===
const openCreate = () => {
  formData.value = {
    _id: null,
    id_project: null,
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    responsible_researcher: null,
    status: 'pending',
    priority: 'medium',
    observations: ''
  }
  isEdit.value = false
  showForm.value = true
}

const openEdit = (row) => {
  isEdit.value = true
  formData.value = {
    _id: row._id,
    id_project: row.id_project?._id || row.id_project || null,
    name: row.name || '',
    description: row.description || '',
    start_date: row.start_date ? new Date(row.start_date).toISOString().slice(0, 10) : '',
    end_date: row.end_date ? new Date(row.end_date).toISOString().slice(0, 10) : '',
    responsible_researcher: row.responsible_researcher?._id || row.responsible_researcher || null,
    status: row.status || 'pending',
    priority: row.priority || 'medium',
    observations: row.observations || ''
  }
  showForm.value = true
}

const openDetail = (row) => {
  current.value = row
  showDetail.value = true
}

const closeDialog = () => {
  showForm.value = false
  isEdit.value = false
  formData.value = {
    _id: null,
    id_project: null,
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    responsible_researcher: null,
    status: 'pending',
    priority: 'medium',
    observations: ''
  }
}

const onSubmitActividad = () =>
  isEdit.value ? actualizarActividad() : registrarActividad()

onMounted(async () => {
  await Promise.all([cargarProyectos(), cargarInvestigadores()])
  await cargarActividades()
})
</script>

<style scoped>
.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #71277A;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #71277A;
  color: white;
}

.text-primary {
  color: #71277A !important;
}

.info-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}
</style>
