<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="shadow-1">
          <q-card-section>
            <div class="text-h6 text-weight-bold text-primary">
              <q-icon name="science" class="q-mr-sm" />
              Proyectos
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Administra proyectos de investigación
            </div>
          </q-card-section>
          
          <q-card-section>
            <TableLider 
              :rows="tableRows" 
              :columns="columns"
              title="PROYECTOS"
              add-button-label="AGREGAR"
              @add-item="openCreate"
              @view-item="openDetail"
              @edit-item="openEdit"
              @toggle-status="handleToggleStatus"
            >
              <template #filters>
                <div class="row q-gutter-sm items-center">
                  <q-input v-model="search" dense outlined clearable placeholder="Buscar por nombre o código"
                    @update:model-value="applyFilter" style="min-width: 240px;">
                    <template #prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                  <q-select v-model="filtroEstado" :options="estadoOptions" option-label="label" option-value="value"
                    emit-value map-options dense outlined clearable label="Estado" style="min-width: 160px;"
                    @update:model-value="applyFilter" />
                </div>
              </template>
            </TableLider>
          </q-card-section>
        </q-card>
      </div>
    </div>
    
    <!-- Detalle -->
    <q-dialog v-model="showDetail">
      <q-card style="min-width: 640px; max-width: 900px">
        <q-card-section class="detail-header">
          <div class="row items-center justify-between">
            <div class="text-h6">Detalle del proyecto</div>
            <q-badge :color="(current?.status === 'Active') ? 'positive' : 'grey'">
              {{ current?.status === 'Active' ? 'Activo' : 'Inactivo' }}
            </q-badge>
          </div>
          <div class="text-caption">Información completa del proyecto</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-lg">
            <div class="col-12">
              <div class="text-subtitle1 text-primary">{{ current?.project_name }}</div>
            </div>
            <div class="col-12 col-md-6">
              <q-list dense separator>
                <q-item>
                  <q-item-section avatar><q-icon name="confirmation_number" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Código</q-item-label>
                    <q-item-label>{{ current?.code || '-' }}</q-item-label>
                  </q-item-section>
                </q-item>
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
            <div class="col-12 col-md-6">
              <q-list dense separator>
                <q-item>
                  <q-item-section avatar><q-icon name="people" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Investigadores</q-item-label>
                    <q-item-label>{{ current?.num_researchers ?? '-' }}</q-item-label>
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
          <div class="text-h6">{{ isEdit ? 'Editar proyecto' : 'Nuevo proyecto' }}</div>
          <div class="text-caption">Completa los campos y guarda los cambios</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="onSubmit">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input v-model="form.project_name" label="Nombre" outlined dense :rules="[v => !!v || 'Obligatorio']" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.code" label="Código" outlined dense />
              </div>
              <div class="col-12">
                <div class="text-subtitle2 q-mb-xs">Descripción</div>
                <q-input v-model="form.description" type="textarea" label="Descripción" outlined dense autogrow />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.start_date" label="Fecha inicio" outlined dense type="date"
                  :rules="[v => !!v || 'Obligatorio']" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.end_date" label="Fecha fin" outlined dense type="date" />
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
import TableLider from '../../components/tableLider.vue'
import { getData, postData, putData } from '../../services/apiClient'

const rows = ref([])
const filteredRows = ref([])
const search = ref('')
const filtroEstado = ref(null)
const showForm = ref(false)
const isEdit = ref(false)
const showDetail = ref(false)
const current = ref(null)
const form = ref({
  _id: null,
  project_name: '',
  code: '',
  description: '',
  start_date: '',
  end_date: ''
})

// Columnas de la tabla
const columns = [
  {
    name: 'nombre',
    required: true,
    label: 'Nombre del Proyecto',
    align: 'left',
    field: 'project_name',
    sortable: true
  },
  {
    name: 'codigo',
    label: 'Código',
    align: 'center',
    field: 'code',
    sortable: true
  },
  {
    name: 'estado',
    label: 'Estado',
    align: 'center',
    field: 'estado',
    sortable: true,
    format: (v) => v
  },
  {
    name: 'fecha',
    label: 'Fecha de Inicio',
    align: 'center',
    field: 'start_date',
    sortable: true
  },
  {
    name: 'opciones',
    label: 'Opciones',
    field: 'opciones',
    align: 'center',
    sortable: false
  }
]

const estadoOptions = [
  { label: 'Activo', value: 'Active' },
  { label: 'Inactivo', value: 'Inactive' }
]

const tableRows = computed(() => {
  return (filteredRows.value || []).map(p => ({
    ...p,
    id: p._id,
    estado: p.status === 'Active' ? 'Activo' : 'Inactivo',
    opciones: 'opciones'
  }))
})

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

async function loadProjects() {
  try {
    const { msg } = await getData('/projects/list')
    rows.value = msg || []
    applyFilter()
  } catch (e) {
    console.error(e)
  }
}

function applyFilter() {
  const term = (search.value || '').toLowerCase()
  filteredRows.value = (rows.value || []).filter(p => {
    const byText = term ? ((p.project_name || '').toLowerCase().includes(term) || (p.code || '').toLowerCase().includes(term)) : true
    const byEstado = filtroEstado.value ? p.status === filtroEstado.value : true
    return byText && byEstado
  })
}

function openCreate() {
  form.value = { _id: null, project_name: '', code: '', description: '', start_date: '', end_date: '' }
  isEdit.value = false
  showForm.value = true
}

function openEdit(row) {
  isEdit.value = true
  form.value = {
    _id: row._id,
    project_name: row.project_name || '',
    code: row.code || '',
    description: row.description || '',
    start_date: row.start_date ? new Date(row.start_date).toISOString().slice(0,10) : '',
    end_date: row.end_date ? new Date(row.end_date).toISOString().slice(0,10) : ''
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
      project_name: form.value.project_name,
      code: form.value.code || undefined,
      description: form.value.description || undefined,
      start_date: toISODate(form.value.start_date),
      end_date: toISODate(form.value.end_date)
    }
    if (isEdit.value && form.value._id) {
      await putData(`/projects/update/${form.value._id}`, payload)
    } else {
      await postData('/projects/create', payload)
    }
    showForm.value = false
    await loadProjects()
  } catch (e) {
    console.error(e)
  }
}

async function handleToggleStatus(row) {
  try {
    const isInactive = row.status === 'Inactive'
    const endpoint = isInactive ? 'activate' : 'inactivate'
    await putData(`/projects/${endpoint}/${row._id}`)
    await loadProjects()
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  loadProjects()
})
</script>

<style scoped>
.q-card {
  border-radius: 12px;
}

.detail-header {
  background: linear-gradient(135deg, #71277A 0%, #5b1f62 100%);
  color: white;
}
</style>
