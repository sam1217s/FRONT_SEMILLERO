<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="shadow-1">
          <!-- HEADER -->
          <q-card-section>
            <div class="page-title">
              <q-icon name="meeting_room" class="q-mr-sm" />
              Reuniones
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Programa y gestiona reuniones con tu equipo
            </div>
          </q-card-section>

          <!-- TABLA -->
          <q-card-section>
            <!-- FILTROS -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-6">
                <q-input v-model="busqueda" filled clearable label="Buscar" placeholder="Buscar por asunto o lugar...">
                  <template #prepend><q-icon name="search" /></template>
                </q-input>
              </div>
              <div class="col-6 col-md-3">
                <q-select v-model="filtroEstado" :options="estadoOptions" option-label="label" option-value="value"
                  emit-value map-options filled clearable label="Estado" />
              </div>
              <div class="col-6 col-md-3">
                <q-select v-model="filtroProyecto" :options="projectOptions" option-label="label" option-value="value"
                  emit-value map-options filled clearable label="Proyecto" />
              </div>
            </div>

            <!-- LOADING -->
            <div v-if="loading" class="text-center q-pa-xl">
              <q-spinner-dots size="50px" color="primary" />
              <div class="text-h6 text-grey-6 q-mt-md">Cargando reuniones...</div>
            </div>

            <!-- TABLA PRINCIPAL -->
            <Table v-else :rows="filtradatos" :columns="columns" title="REUNIONES"
              add-button-label="NUEVA REUNIÓN" @add-item="openCreate">
              <template #options-column="{ row }">
                <ActionButtons :row="row" :show-view="true" :show-edit="true" :show-toggle-status="false"
                  view-tooltip="Ver detalle" edit-tooltip="Editar reunión" @view="openDetail" @edit="openEdit" />
              </template>
            </Table>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- PERFIL -->
    <q-dialog v-model="showDetailDialog">
      <q-card style="min-width: 800px; max-width: 1000px">
        <q-card-section class="modal-header">
          <div class="text-h6">
            <q-icon name="visibility" class="q-mr-sm" /> Detalle de Reunión
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedReunion">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="text-h6 text-primary q-mb-md">{{ selectedReunion.title || selectedReunion.topic || '-' }}</div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-primary q-mb-sm">Información General</div>
              <div class="info-item"><strong>Proyecto:</strong> {{ selectedReunion.id_project?.project_name || 'Sin proyecto' }}</div>
              <div class="info-item"><strong>Semillero:</strong> {{ selectedReunion.id_seedbed?.name || 'N/A' }}</div>
              <div class="info-item"><strong>Fecha:</strong> {{ formatDate(selectedReunion.date || selectedReunion.meeting_date) }}</div>
              <div class="info-item"><strong>Hora:</strong> {{ formatTime(selectedReunion.date || selectedReunion.meeting_date) }}</div>
              <div class="info-item"><strong>Duración:</strong> {{ selectedReunion.duration_minutes || '-' }} min</div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-primary q-mb-sm">Detalles</div>
              <div class="info-item"><strong>Lugar:</strong> {{ selectedReunion.location || '-' }}</div>
              <div class="info-item"><strong>Modalidad:</strong> {{ mapModality(selectedReunion.modality) }}</div>
              <div class="info-item" v-if="selectedReunion.meeting_url">
                <strong>URL:</strong> <a :href="selectedReunion.meeting_url" target="_blank">{{ selectedReunion.meeting_url }}</a>
              </div>
              <div class="info-item">
                <strong>Estado:</strong>
                <q-badge :color="selectedReunion.status === 'Active' ? 'positive' : 'grey'">
                  {{ selectedReunion.status === 'Active' ? 'Activo' : 'Inactivo' }}
                </q-badge>
              </div>
            </div>

            <div class="col-12" v-if="selectedReunion.description">
              <div class="text-subtitle2 text-primary q-mb-sm">Descripción</div>
              <div class="info-item">{{ selectedReunion.description }}</div>
            </div>

            <div class="col-12" v-if="selectedReunion.minutes">
              <div class="text-subtitle2 text-primary q-mb-sm">Acta/Minuta</div>
              <div class="info-item">{{ selectedReunion.minutes }}</div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- CREAR/EDITAR -->
    <q-dialog v-model="showAddDialog">
      <q-card style="min-width: 800px; max-width: 900px">
        <q-card-section class="modal-header">
          <div class="text-h6">
            {{ isEditMode ? 'Editar Reunión' : 'Nueva Reunión' }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input v-model="formData.title" filled label="Asunto" />
              <q-select v-model="formData.id_project" :options="projectOptions" option-label="label" option-value="value"
                emit-value map-options filled label="Proyecto" clearable class="q-mt-md" />
              <q-select v-model="formData.id_seedbed" :options="seedbedOptions" option-label="label" option-value="value"
                emit-value map-options filled label="Semillero (opcional)" clearable class="q-mt-md" />
              <q-input v-model="formData.date" filled label="Fecha" type="date" class="q-mt-md" />
              <q-input v-model="formData.time" filled label="Hora" type="time" class="q-mt-md" />
            </div>

            <div class="col-12 col-md-6">
              <q-input v-model="formData.location" filled label="Lugar" />
              <q-select v-model="formData.modality" :options="modalityOptions" option-label="label" option-value="value"
                emit-value map-options filled label="Modalidad" clearable class="q-mt-md" />
              <q-input v-model="formData.meeting_url" filled label="URL (si virtual)" type="url" class="q-mt-md" />
              <q-input v-model.number="formData.duration_minutes" filled label="Duración (minutos)" type="number" class="q-mt-md" />
            </div>

            <div class="col-12">
              <q-input v-model="formData.description" filled label="Descripción" type="textarea" rows="2" />
            </div>

            <div class="col-12">
              <q-input v-model="formData.minutes" filled label="Acta/Minuta (opcional)" type="textarea" rows="2" class="q-mt-md" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" @click="closeDialog" />
          <q-btn :label="isEditMode ? 'Actualizar' : 'Registrar'" color="primary" @click="onSubmitReunion" />
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
const reuniones = ref([])
const busqueda = ref('')
const filtroEstado = ref(null)
const filtroProyecto = ref(null)
const showAddDialog = ref(false)
const showDetailDialog = ref(false)
const isEditMode = ref(false)
const selectedReunion = ref(null)

const formData = ref({
  _id: null,
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  id_project: null,
  id_seedbed: null,
  duration_minutes: null,
  modality: '',
  meeting_url: '',
  minutes: ''
})

// Opciones
const projectOptions = ref([])
const seedbedOptions = ref([])

const estadoOptions = [
  { label: 'Activo', value: 'Active' },
  { label: 'Inactivo', value: 'Inactive' }
]

const modalityOptions = [
  { label: 'Presencial', value: 'in_person' },
  { label: 'Virtual', value: 'virtual' },
  { label: 'Híbrida', value: 'hybrid' }
]

// === FILTRO AUTOMÁTICO ===
const filtradatos = computed(() => {
  let filtrados = [...reuniones.value]

  // Filtro por estado
  if (filtroEstado.value) {
    filtrados = filtrados.filter(r => r.status === filtroEstado.value)
  }

  // Filtro por proyecto
  if (filtroProyecto.value) {
    filtrados = filtrados.filter(r => {
      const projectId = r.id_project?._id || r.id_project
      return projectId === filtroProyecto.value
    })
  }

  // Filtro por búsqueda de texto
  const term = busqueda.value?.toLowerCase().trim()
  if (term) {
    filtrados = filtrados.filter(r => {
      const title = (r.title || r.topic || '').toLowerCase()
      const place = (r.location || '').toLowerCase()
      return title.includes(term) || place.includes(term)
    })
  }

  return filtrados.map(r => ({
    ...r,
    id: r._id,
    title: r.title || r.topic,
    date: r.date || r.meeting_date,
    time: r.time || r.meeting_time,
    location: r.location,
    estado: (r.status && r.status !== 'cancelled') ? 'Activo' : 'Inactivo',
    opciones: 'opciones'
  }))
})

// === COLUMNAS ===
const columns = [
  { name: 'nombre', label: 'Asunto', field: 'title', align: 'left' },
  { name: 'proyecto_col', label: 'Proyecto', field: 'id_project', align: 'center', format: (v) => v?.project_name || '-' },
  { name: 'fecha', label: 'Fecha', field: 'date', align: 'center', format: (v) => formatDate(v) },
  { name: 'hora', label: 'Hora', field: 'date', align: 'center', format: (v) => formatTime(v) },
  { name: 'lugar', label: 'Lugar', field: 'location', align: 'center' },
  { name: 'opciones', label: 'Opciones', field: 'opciones', align: 'center' }
]

// === HELPERS ===
function formatDate(d) {
  if (!d) return '-'
  const date = new Date(d)
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('es-CO')
}

function formatTime(d) {
  if (!d) return '-'
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return '-'
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

function combineDateTime(dateStr, timeStr) {
  if (!dateStr) return undefined
  const time = timeStr && timeStr.length > 0 ? timeStr : '00:00'
  const iso = new Date(`${dateStr}T${time}:00`)
  return isNaN(iso.getTime()) ? undefined : iso.toISOString()
}

function mapModality(m) {
  const map = { in_person: 'Presencial', virtual: 'Virtual', hybrid: 'Híbrida' }
  return map[m] || m || '-'
}

// === CRUD ===
// Cargar reuniones
const cargarReuniones = async () => {
  try {
    loading.value = true
    const res = await getData('/meetings/list')
    reuniones.value = Array.isArray(res?.msg) ? res.msg : []
  } catch (err) {
    console.error('Error al cargar reuniones:', err)
    error('No se pudieron cargar las reuniones')
  } finally {
    loading.value = false
  }
}

// Cargar proyectos
const cargarProyectos = async () => {
  try {
    const res = await getData('/projects/list')
    projectOptions.value = (res?.msg || []).map(p => ({
      label: p.project_name,
      value: p._id
    }))
  } catch (err) {
    console.error('Error al cargar proyectos:', err)
  }
}

// Cargar semilleros
const cargarSemilleros = async () => {
  try {
    const res = await getData('/seedbeds/list')
    seedbedOptions.value = (res?.msg || []).map(s => ({
      label: s.name,
      value: s._id
    }))
  } catch (err) {
    console.error('Error al cargar semilleros:', err)
  }
}

// Registrar reunión
const registrarReunion = async () => {
  try {
    const payload = {
      id_project: formData.value.id_project,
      id_seedbed: formData.value.id_seedbed || undefined,
      title: formData.value.title,
      description: formData.value.description || undefined,
      meeting_date: combineDateTime(formData.value.date, formData.value.time),
      duration_minutes: formData.value.duration_minutes || undefined,
      location: formData.value.location || undefined,
      modality: formData.value.modality || undefined,
      meeting_url: formData.value.meeting_url || undefined,
      minutes: formData.value.minutes || undefined
    }
    await postData('/meetings/create', payload)
    await cargarReuniones()
    info('Reunión registrada correctamente')
    closeDialog()
  } catch (err) {
    console.error('Error al registrar reunión:', err)
    error('No se pudo registrar la reunión')
  }
}

// Actualizar reunión
const actualizarReunion = async () => {
  try {
    const payload = {
      id_project: formData.value.id_project,
      id_seedbed: formData.value.id_seedbed || undefined,
      title: formData.value.title,
      description: formData.value.description || undefined,
      meeting_date: combineDateTime(formData.value.date, formData.value.time),
      duration_minutes: formData.value.duration_minutes || undefined,
      location: formData.value.location || undefined,
      modality: formData.value.modality || undefined,
      meeting_url: formData.value.meeting_url || undefined,
      minutes: formData.value.minutes || undefined
    }
    await putData(`/meetings/update/${formData.value._id}`, payload)
    await cargarReuniones()
    info('Reunión actualizada correctamente')
    closeDialog()
  } catch (err) {
    console.error('Error al actualizar reunión:', err)
    error('No se pudo actualizar la reunión')
  }
}

// === ACCIONES ===
const openCreate = () => {
  formData.value = {
    _id: null,
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    id_project: null,
    id_seedbed: null,
    duration_minutes: null,
    modality: '',
    meeting_url: '',
    minutes: ''
  }
  isEditMode.value = false
  showAddDialog.value = true
}

const openEdit = (row) => {
  isEditMode.value = true
  formData.value = {
    _id: row._id,
    title: row.title || row.topic || '',
    description: row.description || '',
    date: row.date ? new Date(row.date).toISOString().slice(0, 10) : (row.meeting_date ? new Date(row.meeting_date).toISOString().slice(0, 10) : ''),
    time: row.time || row.meeting_time || formatTime(row.date || row.meeting_date) || '',
    location: row.location || '',
    id_project: row.id_project?._id || row.id_project || null,
    id_seedbed: row.id_seedbed?._id || row.id_seedbed || null,
    duration_minutes: row.duration_minutes || null,
    modality: row.modality || '',
    meeting_url: row.meeting_url || '',
    minutes: row.minutes || ''
  }
  showAddDialog.value = true
}

const openDetail = (row) => {
  selectedReunion.value = row
  showDetailDialog.value = true
}

const closeDialog = () => {
  showAddDialog.value = false
  isEditMode.value = false
  formData.value = {
    _id: null,
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    id_project: null,
    id_seedbed: null,
    duration_minutes: null,
    modality: '',
    meeting_url: '',
    minutes: ''
  }
}

const onSubmitReunion = () =>
  isEditMode.value ? actualizarReunion() : registrarReunion()

onMounted(async () => {
  await Promise.all([cargarProyectos(), cargarSemilleros()])
  await cargarReuniones()
})
</script>

<style lang="scss" scoped>
@import '../../variables.scss';

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: $primary-color;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: $primary-color;
  color: white;
}

.text-primary {
  color: $primary-color !important;
}

.info-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item strong {
  color: $primary-color;
}
</style>
