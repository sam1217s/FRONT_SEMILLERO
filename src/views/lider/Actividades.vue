<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="shadow-1">
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
          
          <q-card-section>
            <TableLider title="ACTIVIDADES" addButtonLabel="NUEVA ACTIVIDAD" :rows="tableRows" :columns="tableColumns"
              @add-item="openCreate" @view-item="openDetail" @edit-item="openEdit" @toggle-status="handleToggleStatus">
              <template #filters>
                <div class="row q-gutter-sm items-center">
                  <q-input v-model="search" dense outlined placeholder="Buscar por nombre"
                    @update:model-value="applyFilter" style="min-width: 220px;" clearable>
                    <template #prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                  <q-select v-model="filtroProceso" :options="statusOptions" option-label="label" option-value="value"
                    emit-value map-options dense outlined clearable label="Proceso" style="min-width: 160px;"
                    @update:model-value="applyFilter" />
                  <q-select v-model="filtroPrioridad" :options="priorityOptions" option-label="label"
                    option-value="value" emit-value map-options dense outlined clearable label="Prioridad"
                    style="min-width: 140px;" @update:model-value="applyFilter" />
                  <q-select v-model="filtroProyecto" :options="projectOptions" option-label="label" option-value="value"
                    emit-value map-options dense outlined clearable label="Proyecto" style="min-width: 200px;"
                    @update:model-value="applyFilter" />
                  <q-select v-model="filtroInvestigador" :options="researcherOptions" option-label="label"
                    option-value="value" emit-value map-options dense outlined clearable label="Investigador"
                    style="min-width: 200px;" @update:model-value="applyFilter" />
              </div>
              </template>
            </TableLider>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Crear/Editar -->
    <q-dialog v-model="showForm">
      <q-card style="min-width: 720px; max-width: 900px">
        <q-card-section class="detail-header">
          <div class="text-h6">{{ isEdit ? 'Editar actividad' : 'Nueva actividad' }}</div>
          <div class="text-caption">Completa los campos y guarda los cambios</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="onSubmit">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input v-model="form.name" label="Nombre" outlined dense :rules="[val => !!val || 'Obligatorio']" />
              </div>
              <div class="col-12 col-md-6">
                <q-select v-model="form.id_project" :options="projectOptions" option-label="label" option-value="value"
                  emit-value map-options label="Proyecto" outlined dense :rules="[val => !!val || 'Obligatorio']"
                  clearable />
              </div>
              <div class="col-12">
                <div class="text-subtitle2 q-mb-xs">Descripción</div>
                <q-input v-model="form.description" type="textarea" label="Descripción" outlined dense autogrow />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.start_date" label="Fecha inicio" outlined dense type="date"
                  :rules="[val => !!val || 'Obligatorio']" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.end_date" label="Fecha fin" outlined dense type="date"
                  :rules="[val => !!val || 'Obligatorio']" />
              </div>
              <div class="col-12 col-md-6">
                <q-select v-model="form.responsible_researcher" :options="researcherOptions" option-label="label"
                  option-value="value" emit-value map-options label="Investigador responsable" outlined dense
                  :rules="[val => !!val || 'Obligatorio']" clearable />
              </div>
              <div class="col-6 col-md-3">
                <q-select v-model="form.status" :options="statusOptions" label="Estado" outlined dense emit-value
                  map-options />
              </div>
              <div class="col-6 col-md-3">
                <q-select v-model="form.priority" :options="priorityOptions" label="Prioridad" outlined dense emit-value
                  map-options />
              </div>
              <div class="col-12">
                <div class="text-subtitle2 q-mb-xs">Observaciones</div>
                <q-input v-model="form.observations" type="textarea" label="Observaciones" outlined dense autogrow />
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

    <!-- Detalle -->
    <q-dialog v-model="showDetail">
      <q-card style="min-width: 640px; max-width: 900px">
        <q-card-section class="detail-header">
          <div class="row items-center justify-between">
            <div class="text-h6">Detalle de actividad</div>
            <div class="row q-gutter-sm items-center">
              <q-badge :color="statusColor(current?.status)">{{ mapStatus(current?.status) }}</q-badge>
              <q-badge outline :color="priorityColor(current?.priority)">{{ mapPriority(current?.priority) }}</q-badge>
            </div>
          </div>
          <div class="text-caption">Información completa de la actividad</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-lg">
            <div class="col-12">
              <div class="text-subtitle1 text-primary">{{ current?.name }}</div>
            </div>
            <div class="col-12 col-md-6">
              <q-list dense separator>
                <q-item>
                  <q-item-section avatar><q-icon name="science" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Proyecto</q-item-label>
                    <q-item-label>{{ current?.id_project?.project_name || '-' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="person" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Investigador responsable</q-item-label>
                    <q-item-label>{{ current?.responsible_researcher?.name || '-' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="work" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Tipo de contrato</q-item-label>
                    <q-item-label>{{ mapContractType(current?.responsible_researcher?.contract_type) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="event_busy" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Vencimiento</q-item-label>
                    <q-item-label>{{ current?.responsible_researcher?.contract_type === 'planta' ? 'Indefinido' :
                      (current?.responsible_researcher?.contract_end_date ?
                        formatDate(current?.responsible_researcher?.contract_end_date) : '-') }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-12 col-md-6">
              <q-list dense separator>
                <q-item>
                  <q-item-section avatar><q-icon name="schedule" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Inicio</q-item-label>
                    <q-item-label>{{ formatDate(current?.start_date) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="event" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Fin</q-item-label>
                    <q-item-label>{{ formatDate(current?.end_date) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-12">
              <div class="text-subtitle2 q-mb-xs">Descripción</div>
              <q-banner dense class="bg-grey-1 text-grey-8">{{ current?.description || '—' }}</q-banner>
            </div>
            <div class="col-12">
              <div class="text-subtitle2 q-mb-xs">Observaciones</div>
              <q-banner dense class="bg-grey-1 text-grey-8">{{ current?.observations || '—' }}</q-banner>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { getData, postData, putData } from '../../services/apiClient'
import TableLider from '../../components/tableLider.vue'

const $q = useQuasar()

const loading = ref(false)
const rows = ref([])
const filteredRows = ref([])
const search = ref('')
const filtroProceso = ref(null)
const filtroPrioridad = ref(null)
const filtroProyecto = ref(null)
const filtroInvestigador = ref(null)

const showForm = ref(false)
const isEdit = ref(false)
const showDetail = ref(false)
const current = ref(null)

const form = ref({
  _id: null,
  id_project: null,
  name: '',
  description: '',
  start_date: '', // YYYY-MM-DD
  end_date: '',   // YYYY-MM-DD
  responsible_researcher: null,
  status: 'pending',
  priority: 'medium',
  observations: ''
})

const tableColumns = [
  { name: 'nombre', label: 'Nombre', field: 'name' },
  { name: 'proyecto_col', label: 'Proyecto', field: 'id_project', format: (v) => v?.project_name || '-' },
  { name: 'investigador', label: 'Investigador', field: 'responsible_researcher', format: (v) => v?.name || '-' },
  { name: 'prioridad', label: 'Prioridad', field: 'priority', format: (v) => mapPriority(v) },
  { name: 'inicio', label: 'Inicio', field: 'start_date', format: (v) => formatDate(v) },
  { name: 'fin', label: 'Fin', field: 'end_date', format: (v) => formatDate(v) },
  { name: 'proceso', label: 'Proceso', field: 'status', format: (v) => mapStatus(v) },
  {
    name: 'status',
    label: 'Estado',
    field: 'status',
    format: (v) => v === 'cancelled' ? 'Inactivo' : 'Activo'
  },
  { name: 'opciones', label: 'Opciones', field: 'opciones' }
]

const tableRows = computed(() => {
  return (filteredRows.value || []).map(r => ({
    ...r,
    id: r._id,
    opciones: 'opciones'
  }))
})

// Options (proyectos e investigadores)
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
  const m = { pending: 'grey-5', in_progress: 'primary', completed: 'positive', cancelled: 'negative', delayed: 'warning' }
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
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('es-CO')
}

function toISODate(yyyyMMdd) {
  if (!yyyyMMdd) return undefined
  const d = new Date(yyyyMMdd)
  return isNaN(d.getTime()) ? undefined : d.toISOString()
}

async function loadActivities() {
  loading.value = true
  try {
    const { msg } = await getData('/activities/list')
    rows.value = msg || []
    filteredRows.value = applyLocalFilter(rows.value)
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Error cargando actividades' })
    console.error(err)
  } finally { loading.value = false }
}

function applyLocalFilter(data) {
  const term = (search.value || '').toLowerCase()
  return (data || []).filter(r => {
    const byText = term ? (r.name || '').toLowerCase().includes(term) : true
    const byProceso = filtroProceso.value ? r.status === filtroProceso.value : true
    const byPrioridad = filtroPrioridad.value ? r.priority === filtroPrioridad.value : true
    const byProyecto = filtroProyecto.value ? ((r.id_project?._id || r.id_project) === filtroProyecto.value) : true
    const byInvestigador = filtroInvestigador.value ? ((r.responsible_researcher?._id || r.responsible_researcher) === filtroInvestigador.value) : true
    return byText && byProceso && byPrioridad && byProyecto && byInvestigador
  })
}

function applyFilter() {
  filteredRows.value = applyLocalFilter(rows.value)
}

async function loadProjects() {
  try {
    const { msg } = await getData('/projects/list')
    projectOptions.value = (msg || []).map(p => ({ label: `${p.project_name} (${p.code || 'S/C'})`, value: p._id }))
  } catch (e) { console.error(e) }
}

async function loadResearchers() {
  try {
    const { msg } = await getData('/researchers/list')
    const allowed = (msg || []).filter(r => {
      // Puede venir como r.role o como r.roles (array con objetos { role, active })
      const directRole = r.role
      const arrayRole = Array.isArray(r.roles) ? (r.roles.find(rr => rr.active)?.role || r.roles[0]?.role) : null
      const finalRole = (directRole || arrayRole || '').toUpperCase()
      return finalRole === 'LIDER' || finalRole === 'LEADER' || finalRole === 'INVESTIGADOR' || finalRole === 'RESEARCHER'
    })
    researcherOptions.value = allowed.map(r => ({
      label: `${r.name} · ${r.contract_type === 'planta' ? 'Vencimiento: Indefinido' : ('Vence: ' + (r.contract_end_date ? formatDate(r.contract_end_date) : '-'))}`,
      value: r._id,
      raw: r
    }))
  } catch (e) { console.error(e) }
}

function filterProjects(val, update) {
  if (!val) { update(() => { /* no-op uses full list */ }); return }
  update(() => {
    const needle = val.toLowerCase()
    projectOptions.value = projectOptions.value.filter(o => o.label.toLowerCase().includes(needle))
  })
}

function filterResearchers(val, update) {
  if (!val) { update(() => { /* no-op */ }); return }
  update(() => {
    const needle = val.toLowerCase()
    researcherOptions.value = researcherOptions.value.filter(o => o.label.toLowerCase().includes(needle))
  })
}

function resetForm() {
  form.value = {
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

function openCreate() {
  resetForm()
  isEdit.value = false
  showForm.value = true
}

function openEdit(row) {
  isEdit.value = true
  form.value = {
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

function openDetail(row) {
  current.value = row
  showDetail.value = true
}

async function onSubmit() {
  try {
    const payload = {
      id_project: form.value.id_project,
      name: form.value.name,
      description: form.value.description || undefined,
      start_date: toISODate(form.value.start_date),
      end_date: toISODate(form.value.end_date),
      responsible_researcher: form.value.responsible_researcher,
      status: form.value.status,
      priority: form.value.priority,
      observations: form.value.observations || undefined
    }

    if (isEdit.value && form.value._id) {
      await putData(`/activities/update/${form.value._id}`, payload)
      $q.notify({ type: 'positive', message: 'Actividad actualizada' })
    } else {
      await postData('/activities/create', payload)
      $q.notify({ type: 'positive', message: 'Actividad creada' })
    }
    showForm.value = false
    await loadActivities()
  } catch (err) {
    console.error(err)
    const msg = err?.response?.data?.msg || 'Error al guardar actividad'
    $q.notify({ type: 'negative', message: msg })
  }
}

async function handleToggleStatus(row) {
  // Alternar entre 'cancelled' (inactivo) y 'pending' (activo por defecto)
  const nextStatus = row.status === 'cancelled' ? 'pending' : 'cancelled'
  try {
    const payload = {
      id_project: row.id_project?._id || row.id_project,
      name: row.name,
      description: row.description || undefined,
      start_date: row.start_date, // ya viene en ISO desde el backend
      end_date: row.end_date,
      responsible_researcher: row.responsible_researcher?._id || row.responsible_researcher,
      status: nextStatus,
      priority: row.priority,
      observations: row.observations || undefined
    }
    await putData(`/activities/update/${row._id}`, payload)
    $q.notify({ type: 'positive', message: nextStatus === 'cancelled' ? 'Actividad desactivada' : 'Actividad activada' })
    await loadActivities()
  } catch (err) {
    console.error(err)
    const msg = err?.response?.data?.msg || 'Error al actualizar estado'
    $q.notify({ type: 'negative', message: msg })
  }
}

function mapContractType(t) {
  const v = (t || '').toLowerCase()
  if (v === 'planta') return 'PLANTA'
  if (v === 'contractor' || v === 'contratista') return 'CONTRATISTA'
  return t || '-'
}

onMounted(async () => {
  await Promise.all([loadProjects(), loadResearchers()])
  await loadActivities()
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

.detail-header {
  background: linear-gradient(135deg, #71277A 0%, #5b1f62 100%);
  color: white;
}

.detail-header .text-caption {
  color: rgba(255, 255, 255, 0.85);
}

/* Ajustes SOLO para esta vista: permitir 2 líneas en Nombre y Proyecto */
:deep(.projects-table .name-cell) {
  max-width: 220px;
  /* controla el ancho disponible */
  white-space: normal;
  /* permite saltos de línea */
  word-break: break-word;
  /* rompe palabras largas */
  line-height: 1.2;
  /* compacta un poco la línea */
  display: -webkit-box;
  /* habilita el clamping */
  -webkit-line-clamp: 3;
  /* máximo 2 renglones */
  -webkit-box-orient: vertical;
  overflow: hidden;
  /* oculta exceso después de 2 líneas */
}

/* Asegura que la fila crezca cuando hay 2 líneas */
:deep(.projects-table .q-table tbody .q-tr > .q-td) {
  vertical-align: top;
  /* contenido comienza arriba para 2 líneas */
}
</style>
