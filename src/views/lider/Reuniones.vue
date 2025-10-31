<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="shadow-1">
          <q-card-section>
            <div class="text-h6 text-weight-bold text-primary">
              <q-icon name="meeting_room" class="q-mr-sm" />
              Reuniones
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Programa y gestiona reuniones con tu equipo
            </div>
          </q-card-section>
          
          <q-card-section>
            <Table
              :rows="tableRows"
              :columns="columns"
              title="REUNIONES"
              add-button-label="NUEVA REUNIÓN"
              @add-item="openCreate"
            >
              <template #filters>
                <div class="row q-gutter-sm items-center">
                  <q-input v-model="search" dense outlined clearable placeholder="Buscar por asunto o lugar"
                    @update:model-value="applyFilter" style="min-width: 240px;">
                    <template #prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                  <q-select v-model="filtroEstado" :options="estadoOptions" option-label="label" option-value="value"
                    emit-value map-options dense outlined clearable label="Estado" style="min-width: 160px;"
                    @update:model-value="applyFilter" />
                  <q-select v-model="filtroProyecto" :options="projectOptions" option-label="label" option-value="value"
                    emit-value map-options dense outlined clearable label="Proyecto" style="min-width: 200px;"
                    @update:model-value="applyFilter" />
                </div>
              </template>

              <template #options-column="{ row }">
                <ActionButtons
                  :row="row"
                  :show-view="true"
                  :show-edit="true"
                  view-tooltip="Ver detalle"
                  edit-tooltip="Editar reunión"
                  @view="openDetail"
                  @edit="openEdit"
                />
              </template>
            </Table>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Detalle -->
    <q-dialog v-model="showDetail">
      <q-card style="min-width: 640px; max-width: 900px">
        <q-card-section class="detail-header">
          <div class="row items-center justify-between">
            <div class="text-h6">Detalle de la reunión</div>
            <q-badge :color="(current?.status === 'Active') ? 'positive' : 'grey'">
              {{ current?.status === 'Active' ? 'Activo' : 'Inactivo' }}
            </q-badge>
          </div>
          <div class="text-caption">Información completa de la reunión</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-lg">
            <div class="col-12">
              <div class="text-subtitle1 text-primary">{{ current?.title || current?.topic || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <q-list dense separator>
                <q-item>
                  <q-item-section avatar><q-icon name="event" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Fecha</q-item-label>
                    <q-item-label>{{ formatDate(current?.date || current?.meeting_date) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="schedule" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Hora</q-item-label>
                    <q-item-label>{{ formatTime(current?.date || current?.meeting_date) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-12 col-md-6">
              <q-list dense separator>
                <q-item>
                  <q-item-section avatar><q-icon name="place" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Lugar</q-item-label>
                    <q-item-label>{{ current?.location || '-' }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-12">
              <div class="text-subtitle2 q-mb-xs">Descripción</div>
              <q-banner dense class="bg-grey-1 text-grey-8">{{ current?.description || '—' }}</q-banner>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Crear/Editar -->
    <q-dialog v-model="showForm">
      <q-card style="min-width: 720px; max-width: 900px">
        <q-card-section class="detail-header">
          <div class="text-h6">{{ isEdit ? 'Editar reunión' : 'Nueva reunión' }}</div>
          <div class="text-caption">Completa los campos y guarda los cambios</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="onSubmit">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-select v-model="form.id_project" :options="projectOptions" option-label="label" option-value="value"
                  emit-value map-options label="Proyecto" outlined dense :rules="[v => !!v || 'Obligatorio']" clearable />
              </div>
              <div class="col-12 col-md-6">
                <q-select v-model="form.id_seedbed" :options="seedbedOptions" option-label="label" option-value="value"
                  emit-value map-options label="Semillero (opcional)" outlined dense clearable />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.title" label="Asunto" outlined dense :rules="[v => !!v || 'Obligatorio']" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.location" label="Lugar" outlined dense />
              </div>
              <div class="col-12">
                <div class="text-subtitle2 q-mb-xs">Descripción</div>
                <q-input v-model="form.description" type="textarea" label="Descripción" outlined dense autogrow />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.date" label="Fecha" outlined dense type="date" :rules="[v => !!v || 'Obligatorio']" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.time" label="Hora" outlined dense type="time" />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model.number="form.duration_minutes" label="Duración (minutos)" outlined dense type="number" />
              </div>
              <div class="col-12 col-md-4">
                <q-select v-model="form.modality" :options="modalityOptions" label="Modalidad" outlined dense emit-value map-options clearable />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="form.meeting_url" label="URL (si virtual)" outlined dense type="url" />
              </div>
              <div class="col-12">
                <div class="text-subtitle2 q-mb-xs">Acta/Minuta (opcional)</div>
                <q-input v-model="form.minutes" type="textarea" label="Acta" outlined dense autogrow />
              </div>
            </div>
            <div class="row justify-end q-gutter-sm q-mt-md">
              <q-btn flat label="Cancelar" v-close-popup />
              <q-btn color="primary" :label="isEdit ? 'Actualizar' : 'Crear'" type="submit" unelevated />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Table from '../../components/table.vue'
import ActionButtons from '../../components/ActionButtons.vue'
import { getData, postData, putData } from '../../services/apiClient'

const rows = ref([])
const filteredRows = ref([])
const search = ref('')
const filtroEstado = ref(null)
const filtroProyecto = ref(null)
const showForm = ref(false)
const isEdit = ref(false)
const showDetail = ref(false)
const current = ref(null)

const form = ref({
  _id: null,
  title: '',
  description: '',
  date: '', // YYYY-MM-DD
  time: '',
  location: '',
  id_project: null,
  id_seedbed: null,
  duration_minutes: null,
  modality: '',
  meeting_url: '',
  minutes: ''
})

const estadoOptions = [
  { label: 'Activo', value: 'Active' },
  { label: 'Inactivo', value: 'Inactive' }
]

const modalityOptions = [
  { label: 'Presencial', value: 'in_person' },
  { label: 'Virtual', value: 'virtual' },
  { label: 'Híbrida', value: 'hybrid' }
]

const projectOptions = ref([])
const seedbedOptions = ref([])

const columns = [
  { name: 'nombre', label: 'Asunto', field: 'title' },
  { name: 'proyecto_col', label: 'Proyecto', field: 'id_project', format: (v) => v?.project_name || '-' },
  { name: 'fecha', label: 'Fecha', field: 'date', format: (v) => formatDate(v) },
  { name: 'hora', label: 'Hora', field: 'date', format: (v) => formatTime(v) },
  { name: 'lugar', label: 'Lugar', field: 'location' },
  { name: 'proceso', label: 'Proceso', field: 'status', format: (v) => mapMeetingStatus(v) },
  { name: 'opciones', label: 'Opciones', field: 'opciones' }
]

const tableRows = computed(() => {
  return (filteredRows.value || []).map(r => ({
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

function toISODate(yyyyMMdd) {
  if (!yyyyMMdd) return undefined
  const d = new Date(yyyyMMdd)
  return isNaN(d.getTime()) ? undefined : d.toISOString()
}

async function loadMeetings() {
  try {
    const { msg } = await getData('/meetings/list')
    rows.value = msg || []
    applyFilter()
  } catch (e) {
    console.error(e)
  }
}

async function loadProjects() {
  try {
    const { msg } = await getData('/projects/list')
    projectOptions.value = (msg || []).map(p => ({ label: p.project_name, value: p._id, raw: p }))
  } catch (e) { console.error(e) }
}

async function loadSeedbeds() {
  try {
    const { msg } = await getData('/seedbeds/list')
    seedbedOptions.value = (msg || []).map(s => ({ label: s.name, value: s._id, raw: s }))
  } catch (e) { console.error(e) }
}

function applyFilter() {
  const term = (search.value || '').toLowerCase()
  filteredRows.value = (rows.value || []).filter(m => {
    const title = (m.title || m.topic || '').toLowerCase()
    const place = (m.location || '').toLowerCase()
    const byText = term ? (title.includes(term) || place.includes(term)) : true
    const byEstado = filtroEstado.value ? m.status === filtroEstado.value : true
    const byProyecto = filtroProyecto.value ? ((m.id_project?._id || m.id_project) === filtroProyecto.value) : true
    return byText && byEstado && byProyecto
  })
}

function openCreate() {
  form.value = { _id: null, title: '', description: '', date: '', time: '', location: '' }
  form.value.id_project = null
  form.value.id_seedbed = null
  form.value.duration_minutes = null
  form.value.modality = ''
  form.value.meeting_url = ''
  form.value.minutes = ''
  isEdit.value = false
  showForm.value = true
}

function openEdit(row) {
  isEdit.value = true
  form.value = {
    _id: row._id,
    title: row.title || row.topic || '',
    description: row.description || '',
    date: row.date ? new Date(row.date).toISOString().slice(0,10) : (row.meeting_date ? new Date(row.meeting_date).toISOString().slice(0,10) : ''),
    time: row.time || row.meeting_time || formatTime(row.date || row.meeting_date) || '',
    location: row.location || '',
    id_project: row.id_project?._id || row.id_project || null,
    id_seedbed: row.id_seedbed?._id || row.id_seedbed || null,
    duration_minutes: row.duration_minutes || null,
    modality: row.modality || '',
    meeting_url: row.meeting_url || '',
    minutes: row.minutes || ''
  }
  showForm.value = true
}

function openDetail(row) {
  current.value = row
  showDetail.value = true
}

async function onSubmit() {
  try {
    const payload = {
      id_project: form.value.id_project,
      id_seedbed: form.value.id_seedbed || undefined,
      title: form.value.title,
      description: form.value.description || undefined,
      meeting_date: combineDateTime(form.value.date, form.value.time),
      duration_minutes: form.value.duration_minutes || undefined,
      location: form.value.location || undefined,
      modality: form.value.modality || undefined,
      meeting_url: form.value.meeting_url || undefined,
      minutes: form.value.minutes || undefined
    }
    if (isEdit.value && form.value._id) {
      await putData(`/meetings/update/${form.value._id}`, payload)
    } else {
      await postData('/meetings/create', payload)
    }
    showForm.value = false
    await loadMeetings()
  } catch (e) {
    console.error(e)
  }
}

async function handleToggleStatus(row) {
  try {
    const isInactive = row.status === 'Inactive'
    const endpoint = isInactive ? 'activate' : 'inactivate'
    await putData(`/meetings/${endpoint}/${row._id}`)
    await loadMeetings()
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  loadMeetings()
  loadProjects()
  loadSeedbeds()
})

function combineDateTime(dateStr, timeStr) {
  if (!dateStr) return undefined
  const time = timeStr && timeStr.length > 0 ? timeStr : '00:00'
  const iso = new Date(`${dateStr}T${time}:00`)
  return isNaN(iso.getTime()) ? undefined : iso.toISOString()
}

function mapMeetingStatus(s) {
  const m = { scheduled: 'Programada', cancelled: 'Cancelada', finished: 'Finalizada' }
  return m[s] || s
}
</script>

<style scoped>
.q-card {
  border-radius: 12px;
}

.detail-header {
  background: linear-gradient(135deg, #71277A 0%, #5b1f62 100%);
  color: white;
}
/* Ocultar botón Activar/Desactivar en la columna Opciones sin tocar tableLider.vue */
:deep(.projects-table .table-body-row .table-body-cell .row.q-gutter-xs .q-btn:nth-child(2)) {
  display: none !important;
}
</style>
