<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="shadow-1">
          <q-card-section>
            <div class="text-h6 text-weight-bold text-primary">
              <q-icon name="inventory" class="q-mr-sm" />
              Productos
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Gestiona productos de investigación
            </div>
          </q-card-section>
          
          <q-card-section>
            <TableLider 
              :rows="tableRows" 
              :columns="columns"
              title="PRODUCTOS"
              add-button-label="AGREGAR"
              @add-item="openCreate"
              @view-item="openDetail"
              @edit-item="openEdit"
              @toggle-status="handleToggleStatus"
            >
              <template #filters>
                <div class="row q-gutter-sm items-center">
                  <q-input v-model="search" dense outlined clearable placeholder="Buscar por nombre o tipo"
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
            <div class="text-h6">Detalle del producto</div>
            <q-badge :color="(current?.status === 'Active') ? 'positive' : 'grey'">
              {{ current?.status === 'Active' ? 'Activo' : 'Inactivo' }}
            </q-badge>
          </div>
          <div class="text-caption">Información completa del producto</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-lg">
            <div class="col-12">
              <div class="text-subtitle1 text-primary">{{ current?.name || current?.product_name }}</div>
            </div>
            <div class="col-12 col-md-6">
              <q-list dense separator>
                <q-item>
                  <q-item-section avatar><q-icon name="category" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Tipo</q-item-label>
                    <q-item-label>{{ current?.type || '-' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="schedule" /></q-item-section>
                  <q-item-section>
                    <q-item-label caption>Fecha</q-item-label>
                    <q-item-label>{{ formatDate(current?.creation_date || current?.createdAt) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
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
          <div class="text-h6">{{ isEdit ? 'Editar producto' : 'Nuevo producto' }}</div>
          <div class="text-caption">Completa los campos y guarda los cambios</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="onSubmit">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input v-model="form.name" label="Nombre" outlined dense :rules="[v => !!v || 'Obligatorio']" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.type" label="Tipo" outlined dense />
              </div>
              <div class="col-12">
                <div class="text-subtitle2 q-mb-xs">Descripción</div>
                <q-input v-model="form.description" type="textarea" label="Descripción" outlined dense autogrow />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.creation_date" label="Fecha" outlined dense type="date" />
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
  name: '',
  type: '',
  description: '',
  creation_date: ''
})

// Columnas de la tabla
const columns = [
  {
    name: 'nombre',
    required: true,
    label: 'Nombre del Producto',
    align: 'left',
    field: 'name',
    sortable: true
  },
  {
    name: 'estado',
    label: 'Estado',
    align: 'center',
    field: 'estado',
    sortable: true
  },
  {
    name: 'fecha',
    label: 'Fecha de Creación',
    align: 'center',
    field: 'creation_date',
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
    name: p.name || p.product_name,
    creation_date: p.creation_date || p.createdAt,
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

async function loadProducts() {
  try {
    const { msg } = await getData('/products/list')
    rows.value = msg || []
    applyFilter()
  } catch (e) {
    console.error(e)
  }
}

function applyFilter() {
  const term = (search.value || '').toLowerCase()
  filteredRows.value = (rows.value || []).filter(p => {
    const name = (p.name || p.product_name || '').toLowerCase()
    const type = (p.type || '').toLowerCase()
    const byText = term ? (name.includes(term) || type.includes(term)) : true
    const byEstado = filtroEstado.value ? p.status === filtroEstado.value : true
    return byText && byEstado
  })
}

function openCreate() {
  form.value = { _id: null, name: '', type: '', description: '', creation_date: '' }
  isEdit.value = false
  showForm.value = true
}

function openEdit(row) {
  isEdit.value = true
  form.value = {
    _id: row._id,
    name: row.name || row.product_name || '',
    type: row.type || '',
    description: row.description || '',
    creation_date: row.creation_date ? new Date(row.creation_date).toISOString().slice(0,10) : (row.createdAt ? new Date(row.createdAt).toISOString().slice(0,10) : '')
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
      name: form.value.name,
      type: form.value.type || undefined,
      description: form.value.description || undefined,
      creation_date: toISODate(form.value.creation_date)
    }
    if (isEdit.value && form.value._id) {
      await putData(`/products/update/${form.value._id}`, payload)
    } else {
      await postData('/products/create', payload)
    }
    showForm.value = false
    await loadProducts()
  } catch (e) {
    console.error(e)
  }
}

async function handleToggleStatus(row) {
  try {
    const isInactive = row.status === 'Inactive'
    const endpoint = isInactive ? 'activate' : 'inactivate'
    await putData(`/products/${endpoint}/${row._id}`)
    await loadProducts()
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  loadProducts()
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
