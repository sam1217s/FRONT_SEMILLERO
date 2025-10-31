<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="shadow-1">
          <q-card-section>
            <div class="text-h6 text-weight-bold text-primary">
              <q-icon name="school" class="q-mr-sm" />
              Semilleros
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Gestiona semilleros de investigación
            </div>
          </q-card-section>
          
          <q-card-section>
            <TableLider 
              :rows="semilleros" 
              :columns="tableColumns"
              title="SEMILLEROS"
              add-button-label="AGREGAR"
              @add-item="openCreate"
              @view-item="openDetail"
              @edit-item="handleEditSemillero"
              @toggle-status="handleToggleStatus"
            >
              <template #filters>
                <div class="row q-gutter-sm items-center">
                  <q-input
                    v-model="filtroNombre"
                    dense outlined clearable
                    placeholder="Buscar por nombre"
                    @update:model-value="aplicarFiltro"
                    style="min-width: 220px;"
                  >
                    <template #prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                  <q-select
                    v-model="filtroEstado"
                    :options="estadoOptions"
                    option-label="label" option-value="value"
                    emit-value map-options
                    dense outlined clearable
                    label="Estado"
                    @update:model-value="aplicarFiltro"
                    style="min-width: 140px;"
                  />
                  <q-select
                    v-model="filtroGrupo"
                    :options="grupoOptions"
                    option-label="label" option-value="value"
                    emit-value map-options
                    dense outlined clearable
                    label="Grupo"
                    @update:model-value="aplicarFiltro"
                    style="min-width: 200px;"
                  />
                  <q-select
                    v-model="filtroLider"
                    :options="liderOptions"
                    option-label="label" option-value="value"
                    emit-value map-options
                    dense outlined clearable
                    label="Líder"
                    @update:model-value="aplicarFiltro"
                    style="min-width: 200px;"
                  />
                </div>
              </template>
            </TableLider>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Modal de detalle -->
    <q-dialog v-model="showDetail">
      <q-card style="min-width: 640px; max-width: 900px">
        <q-card-section class="detail-modal-header">
          <div>
            <div class="text-h6 text-white">Detalle del semillero</div>
            <div class="text-caption text-white-70">Información completa del semillero</div>
          </div>
          <div class="row q-gutter-xs">
            <q-badge :color="current?.status === 'Active' ? 'green' : 'red'" :label="current?.status === 'Active' ? 'Activo' : 'Inactivo'" class="q-mr-xs" />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-list dense>
                <q-item>
                  <q-item-section avatar><q-icon name="school" color="primary" /></q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Nombre:</q-item-label>
                    <q-item-label>{{ current?.name || '-' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="group" color="primary" /></q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Grupo de investigación:</q-item-label>
                    <q-item-label>{{ current?.id_group?.name || '-' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="person" color="primary" /></q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Líder:</q-item-label>
                    <q-item-label>{{ current?.id_leader?.name || '-' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="category" color="primary" /></q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Categoría:</q-item-label>
                    <q-item-label>{{ current?.id_group?.category || '-' }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-12 col-md-6">
              <q-list dense>
                <q-item>
                  <q-item-section avatar><q-icon name="calendar_today" color="primary" /></q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Fecha de creación:</q-item-label>
                    <q-item-label>{{ formatDate(current?.seedbed_creation_date) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="science" color="primary" /></q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Líneas de investigación:</q-item-label>
                    <q-item-label>{{ current?.research_lines || '-' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="topic" color="primary" /></q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Áreas temáticas:</q-item-label>
                    <q-item-label>{{ current?.thematic_areas || '-' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="network_check" color="primary" /></q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Red tecnológica:</q-item-label>
                    <q-item-label>{{ current?.technology_network || '-' }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
          <q-separator class="q-my-md" />
          <div class="q-mt-md">
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Descripción:</div>
            <q-banner rounded class="bg-blue-1 text-blue-9 q-pa-md">
              {{ current?.description || 'Sin descripción' }}
            </q-banner>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" v-close-popup />
          <q-btn color="primary" label="Editar" @click="openEditFromDetail" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de crear/editar -->
    <q-dialog v-model="showForm">
      <q-card style="min-width: 720px; max-width: 900px">
        <q-card-section class="detail-header">
          <div class="text-h6">{{ isEdit ? 'Editar semillero' : 'Nuevo semillero' }}</div>
          <div class="text-caption">Completa los campos y guarda los cambios</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="onSubmit">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input v-model="form.name" label="Nombre del semillero" outlined dense :rules="[val => !!val || 'Obligatorio']" />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="form.id_group"
                  :options="grupoOptions"
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  label="Grupo de investigación"
                  outlined
                  dense
                  :rules="[val => !!val || 'Obligatorio']"
                  clearable
                />
              </div>
              <div class="col-12">
                <div class="text-subtitle2 q-mb-xs">Descripción</div>
                <q-input v-model="form.description" type="textarea" label="Descripción" outlined dense autogrow />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.research_lines" label="Líneas de investigación" outlined dense />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.thematic_areas" label="Áreas temáticas" outlined dense />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.technology_network" label="Red tecnológica" outlined dense />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.logo" label="URL del logo" outlined dense />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="form.id_leader"
                  :options="liderOptions"
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  label="Líder del semillero"
                  outlined
                  dense
                  :rules="[val => !!val || 'Obligatorio']"
                  clearable
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.seedbed_creation_date" label="Fecha de creación" outlined dense type="date" />
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
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import TableLider from '../../components/tableLider.vue'
import { getData, postData, putData } from '../../services/apiClient.js'

const $q = useQuasar()

// Datos reactivos
const semilleros = ref([])
const semillerosOriginales = ref([])
const showDetail = ref(false)
const showForm = ref(false)
const isEdit = ref(false)
const current = ref(null)
const editingSemillero = ref(null)

// Filtros
const filtroNombre = ref('')
const filtroEstado = ref('')
const filtroGrupo = ref('')
const filtroLider = ref('')

// Opciones para selects
const estadoOptions = [
  { label: 'Activo', value: 'Active' },
  { label: 'Inactivo', value: 'Inactive' }
]

const grupoOptions = ref([])
const liderOptions = ref([])

// Formulario
const form = ref({
  name: '',
  description: '',
  research_lines: '',
  thematic_areas: '',
  technology_network: '',
  id_group: '',
  id_leader: '',
  logo: '',
  seedbed_creation_date: ''
})

// Columnas de la tabla
const tableColumns = [
  {
    name: 'nombre',
    required: true,
    label: 'Nombre del Semillero',
    align: 'left',
    field: 'name',
    sortable: true
  },
  {
    name: 'id_group',
    label: 'Grupo de Investigación',
    align: 'left',
    field: 'id_group',
    sortable: true,
    format: (val) => val?.name || '-'
  },
  {
    name: 'id_leader',
    label: 'Líder',
    align: 'left',
    field: 'id_leader',
    sortable: true,
    format: (val) => val?.name || '-'
  },
  {
    name: 'seedbed_creation_date',
    label: 'Fecha de Creación',
    align: 'center',
    field: 'seedbed_creation_date',
    sortable: true,
    format: (val) => formatDate(val)
  },
  {
    name: 'status',
    label: 'Estado',
    align: 'center',
    field: 'status',
    sortable: true,
    format: (val) => val === 'Active' ? 'Activo' : 'Inactivo'
  },
  {
    name: 'opciones',
    label: 'Opciones',
    field: 'opciones',
    align: 'center',
    sortable: false
  }
]

// Funciones de utilidad
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-CO')
}

// Devuelve YYYY-MM-DD para inputs type="date"
const toISOInput = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    research_lines: '',
    thematic_areas: '',
    technology_network: '',
    id_group: '',
    id_leader: '',
    logo: '',
    seedbed_creation_date: ''
  }
}

// Cargar datos
const cargarSemilleros = async () => {
  try {
    const response = await getData('/seedbeds/list')
    const list = Array.isArray(response) ? response : (response?.msg || [])
    console.log('🌱 Lista semilleros cargada del backend:', list)
    semilleros.value = list.map(semillero => ({
      ...semillero,
      id: semillero._id,
      opciones: 'opciones'
    }))
    semillerosOriginales.value = [...semilleros.value]
  } catch (error) {
    console.error('Error cargando semilleros:', error)
    $q.notify({
      type: 'negative',
      message: 'Error cargando semilleros'
    })
  }
}

const loadGroups = async () => {
  try {
    const response = await getData('/research-groups/list')
    const list = Array.isArray(response) ? response : (response?.msg || [])
    grupoOptions.value = list.map(group => ({
      label: group.name,
      value: group._id,
      raw: group
    }))
  } catch (error) {
    console.error('Error cargando grupos:', error)
  }
}

const loadLeaders = async () => {
  try {
    const response = await getData('/researchers/list')
    const list = Array.isArray(response) ? response : (response?.msg || [])
    const leaders = list.filter(researcher => 
      researcher.roles?.some(role => ['LIDER', 'LEADER', 'LEAD_RESEARCHER'].includes(role.role))
    )
    liderOptions.value = leaders.map(leader => ({
      label: leader.name,
      value: leader._id,
      raw: leader
    }))
  } catch (error) {
    console.error('Error cargando líderes:', error)
  }
}

// Filtros
const aplicarFiltro = () => {
  let filtrados = [...semillerosOriginales.value]

  if (filtroNombre.value) {
    filtrados = filtrados.filter(s => 
      s.name.toLowerCase().includes(filtroNombre.value.toLowerCase())
    )
  }

  if (filtroEstado.value) {
    filtrados = filtrados.filter(s => s.status === filtroEstado.value)
  }

  if (filtroGrupo.value) {
    filtrados = filtrados.filter(s => s.id_group?._id === filtroGrupo.value)
  }

  if (filtroLider.value) {
    filtrados = filtrados.filter(s => s.id_leader?._id === filtroLider.value)
  }

  semilleros.value = filtrados
}

// Modales
const openCreate = () => {
  resetForm()
  isEdit.value = false
  showForm.value = true
}

const openEdit = (semillero) => {
  editingSemillero.value = semillero
  form.value = {
    name: semillero.name || '',
    description: semillero.description || '',
    research_lines: semillero.research_lines || '',
    thematic_areas: semillero.thematic_areas || '',
    technology_network: semillero.technology_network || '',
    id_group: semillero.id_group?._id || '',
    id_leader: semillero.id_leader?._id || '',
    logo: semillero.logo || '',
    seedbed_creation_date: semillero.seedbed_creation_date ? toISOInput(semillero.seedbed_creation_date) : ''
  }
  isEdit.value = true
  showForm.value = true
}

const openDetail = (semillero) => {
  current.value = semillero
  showDetail.value = true
}

const openEditFromDetail = () => {
  if (!current.value) return
  showDetail.value = false
  openEdit(current.value)
}

// Handlers
const handleEditSemillero = (semillero) => {
  openEdit(semillero)
}

const handleToggleStatus = async (semillero) => {
  try {
    const newStatus = semillero.status === 'Active' ? 'Inactive' : 'Active'
    const endpoint = newStatus === 'Active' ? 'activate' : 'inactivate'
    
    await putData(`/seedbeds/${endpoint}/${semillero.id}`)
    
    // Actualizar estado local
    semillero.status = newStatus
    const index = semilleros.value.findIndex(s => s.id === semillero.id)
    if (index !== -1) {
      semilleros.value[index].status = newStatus
    }
    
    $q.notify({
      type: 'positive',
      message: `Semillero ${newStatus === 'Active' ? 'activado' : 'desactivado'} correctamente`
    })
  } catch (error) {
    console.error('Error cambiando estado:', error)
    $q.notify({
      type: 'negative',
      message: 'Error cambiando estado del semillero'
    })
  }
}

const limpiarFiltros = () => {
  filtroNombre.value = ''
  filtroEstado.value = ''
  filtroGrupo.value = ''
  filtroLider.value = ''
}

// Submit
const onSubmit = async () => {
  try {
    const semilleroData = {
      name: form.value.name,
      description: form.value.description,
      research_lines: form.value.research_lines,
      thematic_areas: form.value.thematic_areas,
      technology_network: form.value.technology_network,
      id_group: form.value.id_group,
      id_leader: form.value.id_leader,
      logo: form.value.logo,
      seedbed_creation_date: form.value.seedbed_creation_date || undefined
    }
    console.log('🌱 Enviando semillero:', JSON.stringify(semilleroData, null, 2), 'Edit:', isEdit.value)

    if (isEdit.value) {
      const res = await putData(`/seedbeds/update/${editingSemillero.value.id}`, semilleroData)
      console.log('🌱 Respuesta actualización semillero:', res)
      $q.notify({
        type: 'positive',
        message: 'Semillero actualizado correctamente'
      })
    } else {
      const res = await postData('/seedbeds/create', semilleroData)
      console.log('🌱 Respuesta creación semillero:', res)
      $q.notify({
        type: 'positive',
        message: 'Semillero creado correctamente'
      })
    }

    showForm.value = false
    limpiarFiltros()
    await cargarSemilleros()
    aplicarFiltro()
  } catch (error) {
    console.error('🌱 Error guardando semillero:', error.response?.data || error)
    $q.notify({
      type: 'negative',
      message: 'Error guardando semillero'
    })
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    cargarSemilleros(),
    loadGroups(),
    loadLeaders()
  ])
})
</script>

<style scoped>
.q-card {
  border-radius: 12px;
}

.detail-modal-header {
  background: linear-gradient(135deg, #71277A 0%, #5b1f62 100%);
  color: white;
}

.detail-modal-header .text-caption {
  color: rgba(255,255,255,0.85);
}

.detail-header {
  background: linear-gradient(135deg, #71277A 0%, #5b1f62 100%);
  color: white;
}

.detail-header .text-caption {
  color: rgba(255,255,255,0.85);
}

.filter-input, .filter-select {
  min-width: 100%;
  font-size: 0.85rem;
  padding-top: 2px;
  padding-bottom: 2px;
}
@media (max-width: 600px) {
  .filter-input, .filter-select {
    min-width: 100%;
    margin-bottom: 8px;
  }
}
</style>
