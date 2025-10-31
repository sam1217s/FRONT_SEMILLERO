<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="shadow-1">
          <!-- HEADER -->
          <q-card-section>
            <div class="page-title">
              <q-icon name="school" class="q-mr-sm" />
              Semilleros
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Gestiona semilleros de investigación
            </div>
          </q-card-section>

          <!-- TABLA -->
          <q-card-section>
            <!-- FILTROS -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-4">
                <q-input v-model="busqueda" filled clearable label="Buscar" placeholder="Buscar por nombre...">
                  <template #prepend><q-icon name="search" /></template>
                </q-input>
              </div>
              <div class="col-6 col-md-2">
                <q-select v-model="filtroEstado" :options="estadoOptions" option-label="label" option-value="value"
                  emit-value map-options filled clearable label="Estado" />
              </div>
              <div class="col-6 col-md-3">
                <q-select v-model="filtroGrupo" :options="grupoOptions" option-label="label" option-value="value"
                  emit-value map-options filled clearable label="Grupo" />
              </div>
              <div class="col-12 col-md-3">
                <q-select v-model="filtroLider" :options="liderOptions" option-label="label" option-value="value"
                  emit-value map-options filled clearable label="Líder" />
              </div>
            </div>

            <!-- LOADING -->
            <div v-if="loading" class="text-center q-pa-xl">
              <q-spinner-dots size="50px" color="primary" />
              <div class="text-h6 text-grey-6 q-mt-md">Cargando semilleros...</div>
            </div>

            <!-- TABLA PRINCIPAL -->
            <Table v-else :rows="rowsMostrados" :columns="tableColumns" title="SEMILLEROS"
              add-button-label="AGREGAR" @add-item="openCreate">
              <template #options-column="{ row }">
                <ActionButtons :row="row" :show-view="true" :show-edit="true" :show-toggle-status="true"
                  view-tooltip="Ver detalle" edit-tooltip="Editar semillero" activate-tooltip="Activar"
                  deactivate-tooltip="Desactivar" @view="openDetail" @edit="handleEditSemillero"
                  @toggle-status="handleToggleStatus" />
              </template>
            </Table>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- PERFIL -->
    <q-dialog v-model="showProfileDialog">
      <q-card style="min-width: 800px; max-width: 1000px">
        <q-card-section class="modal-header">
          <div class="text-h6">
            <q-icon name="visibility" class="q-mr-sm" /> Detalle del Semillero
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedSemillero">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="text-h6 text-primary q-mb-md">{{ selectedSemillero.name }}</div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-primary q-mb-sm">Información General</div>
              <div class="info-item"><strong>Nombre:</strong> {{ selectedSemillero.name || '-' }}</div>
              <div class="info-item"><strong>Grupo de investigación:</strong> {{ selectedSemillero.id_group?.name || '-' }}</div>
              <div class="info-item"><strong>Líder:</strong> {{ selectedSemillero.id_leader?.name || '-' }}</div>
              <div class="info-item"><strong>Categoría:</strong> {{ selectedSemillero.id_group?.category || '-' }}</div>
              <div class="info-item">
                <strong>Estado:</strong>
                <q-badge :color="selectedSemillero.status === 'Active' ? 'positive' : 'grey'">
                  {{ selectedSemillero.status === 'Active' ? 'Activo' : 'Inactivo' }}
                </q-badge>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-primary q-mb-sm">Detalles Académicos</div>
              <div class="info-item"><strong>Fecha de creación:</strong> {{ formatDate(selectedSemillero.seedbed_creation_date) }}</div>
              <div class="info-item"><strong>Líneas de investigación:</strong> {{ selectedSemillero.research_lines || '-' }}</div>
              <div class="info-item"><strong>Áreas temáticas:</strong> {{ selectedSemillero.thematic_areas || '-' }}</div>
              <div class="info-item"><strong>Red tecnológica:</strong> {{ selectedSemillero.technology_network || '-' }}</div>
            </div>

            <div class="col-12" v-if="selectedSemillero.description">
              <div class="text-subtitle2 text-primary q-mb-sm">Descripción</div>
              <div class="info-item">{{ selectedSemillero.description }}</div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" v-close-popup />
          <q-btn color="primary" label="Editar" @click="openEditFromDetail" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- CREAR/EDITAR -->
    <q-dialog v-model="showAddDialog">
      <q-card style="min-width: 800px; max-width: 900px">
        <q-card-section class="modal-header">
          <div class="text-h6">
            {{ isEditMode ? 'Editar Semillero' : 'Nuevo Semillero' }}
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input v-model="formData.name" filled label="Nombre del semillero" />
              <q-select v-model="formData.id_group" :options="grupoOptions" option-label="label" option-value="value"
                emit-value map-options filled label="Grupo de investigación" clearable class="q-mt-md" />
              <q-select v-model="formData.id_leader" :options="liderOptions" option-label="label" option-value="value"
                emit-value map-options filled label="Líder del semillero" clearable class="q-mt-md" />
              <q-input v-model="formData.seedbed_creation_date" filled label="Fecha de creación" type="date" class="q-mt-md" />
            </div>

            <div class="col-12 col-md-6">
              <q-input v-model="formData.research_lines" filled label="Líneas de investigación" />
              <q-input v-model="formData.thematic_areas" filled label="Áreas temáticas" class="q-mt-md" />
              <q-input v-model="formData.technology_network" filled label="Red tecnológica" class="q-mt-md" />
              <q-input v-model="formData.logo" filled label="URL del logo" class="q-mt-md" />
            </div>

            <div class="col-12">
              <q-input v-model="formData.description" filled label="Descripción" type="textarea" rows="3" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" @click="closeDialog" />
          <q-btn :label="isEditMode ? 'Actualizar' : 'Registrar'" color="primary" @click="onSubmitSemillero" />
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
const semilleros = ref([])
const busqueda = ref('')
const filtroEstado = ref(null)
const filtroGrupo = ref(null)
const filtroLider = ref(null)
const showAddDialog = ref(false)
const showProfileDialog = ref(false)
const isEditMode = ref(false)
const selectedSemillero = ref(null)
const editingSemillero = ref(null)

const formData = ref({
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

// Opciones
const grupoOptions = ref([])
const liderOptions = ref([])

const estadoOptions = [
  { label: 'Activo', value: 'Active' },
  { label: 'Inactivo', value: 'Inactive' }
]

// === FILTRO AUTOMÁTICO ===
const rowsMostrados = computed(() => {
  let filtrados = [...semilleros.value]

  // Filtro por estado
  if (filtroEstado.value) {
    filtrados = filtrados.filter(s => s.status === filtroEstado.value)
  }

  // Filtro por grupo
  if (filtroGrupo.value) {
    filtrados = filtrados.filter(s => {
      const groupId = s.id_group?._id || s.id_group
      return groupId === filtroGrupo.value
    })
  }

  // Filtro por líder
  if (filtroLider.value) {
    filtrados = filtrados.filter(s => {
      const leaderId = s.id_leader?._id || s.id_leader
      return leaderId === filtroLider.value
    })
  }

  // Filtro por búsqueda de texto
  const term = busqueda.value?.toLowerCase().trim()
  if (term) {
    filtrados = filtrados.filter(s =>
      (s.name || '').toLowerCase().includes(term)
    )
  }

  return filtrados.map(s => ({
    ...s,
    id: s._id,
    opciones: 'opciones'
  }))
})

// === COLUMNAS ===
const tableColumns = [
  { name: 'nombre', label: 'Nombre del Semillero', field: 'name', align: 'left' },
  { name: 'id_group', label: 'Grupo de Investigación', field: 'id_group', align: 'center', format: (val) => val?.name || '-' },
  { name: 'id_leader', label: 'Líder', field: 'id_leader', align: 'center', format: (val) => val?.name || '-' },
  { name: 'seedbed_creation_date', label: 'Fecha de Creación', field: 'seedbed_creation_date', align: 'center', format: (val) => formatDate(val) },
  { name: 'status', label: 'Estado', field: 'status', align: 'center', format: (val) => val === 'Active' ? 'Activo' : 'Inactivo' },
  { name: 'opciones', label: 'Opciones', field: 'opciones', align: 'center' }
]

// === HELPERS ===
function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-CO')
}

function toISOInput(date) {
  if (!date) return ''
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// === CRUD ===
// Cargar semilleros
const cargarSemilleros = async () => {
  try {
    loading.value = true
    const res = await getData('/seedbeds/list')
    const list = Array.isArray(res) ? res : (res?.msg || [])
    semilleros.value = list
  } catch (err) {
    console.error('Error al cargar semilleros:', err)
    error('No se pudieron cargar los semilleros')
  } finally {
    loading.value = false
  }
}

// Cargar grupos
const cargarGrupos = async () => {
  try {
    const res = await getData('/research-groups/list')
    const list = Array.isArray(res) ? res : (res?.msg || [])
    grupoOptions.value = list.map(group => ({
      label: group.name,
      value: group._id
    }))
  } catch (err) {
    console.error('Error al cargar grupos:', err)
  }
}

// Cargar líderes
const cargarLideres = async () => {
  try {
    const res = await getData('/researchers/list')
    const list = Array.isArray(res) ? res : (res?.msg || [])
    const leaders = list.filter(researcher =>
      researcher.roles?.some(role => ['LIDER', 'LEADER', 'LEAD_RESEARCHER'].includes(role.role))
    )
    liderOptions.value = leaders.map(leader => ({
      label: leader.name,
      value: leader._id
    }))
  } catch (err) {
    console.error('Error al cargar líderes:', err)
  }
}

// Registrar semillero
const registrarSemillero = async () => {
  try {
    const payload = {
      name: formData.value.name,
      description: formData.value.description,
      research_lines: formData.value.research_lines,
      thematic_areas: formData.value.thematic_areas,
      technology_network: formData.value.technology_network,
      id_group: formData.value.id_group,
      id_leader: formData.value.id_leader,
      logo: formData.value.logo,
      seedbed_creation_date: formData.value.seedbed_creation_date || undefined
    }
    await postData('/seedbeds/create', payload)
    await cargarSemilleros()
    info('Semillero registrado correctamente')
    closeDialog()
  } catch (err) {
    console.error('Error al registrar semillero:', err)
    error('No se pudo registrar el semillero')
  }
}

// Actualizar semillero
const actualizarSemillero = async () => {
  try {
    const payload = {
      name: formData.value.name,
      description: formData.value.description,
      research_lines: formData.value.research_lines,
      thematic_areas: formData.value.thematic_areas,
      technology_network: formData.value.technology_network,
      id_group: formData.value.id_group,
      id_leader: formData.value.id_leader,
      logo: formData.value.logo,
      seedbed_creation_date: formData.value.seedbed_creation_date || undefined
    }
    await putData(`/seedbeds/update/${editingSemillero.value._id}`, payload)
    await cargarSemilleros()
    info('Semillero actualizado correctamente')
    closeDialog()
  } catch (err) {
    console.error('Error al actualizar semillero:', err)
    error('No se pudo actualizar el semillero')
  }
}

// Activar/Desactivar semillero
const handleToggleStatus = async (semillero) => {
  try {
    const newStatus = semillero.status === 'Active' ? 'Inactive' : 'Active'
    const endpoint = newStatus === 'Active' ? 'activate' : 'inactivate'
    await putData(`/seedbeds/${endpoint}/${semillero.id}`)
    await cargarSemilleros()
    info(`Semillero ${newStatus === 'Active' ? 'activado' : 'desactivado'} correctamente`)
  } catch (err) {
    console.error('Error al cambiar estado:', err)
    error('No se pudo cambiar el estado del semillero')
  }
}

// === ACCIONES ===
const openCreate = () => {
  formData.value = {
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
  isEditMode.value = false
  showAddDialog.value = true
}

const openDetail = (semillero) => {
  selectedSemillero.value = semillero
  showProfileDialog.value = true
}

const handleEditSemillero = (semillero) => {
  editingSemillero.value = semillero
  formData.value = {
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
  isEditMode.value = true
  showAddDialog.value = true
}

const openEditFromDetail = () => {
  if (!selectedSemillero.value) return
  showProfileDialog.value = false
  handleEditSemillero(selectedSemillero.value)
}

const closeDialog = () => {
  showAddDialog.value = false
  isEditMode.value = false
  formData.value = {
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

const onSubmitSemillero = () =>
  isEditMode.value ? actualizarSemillero() : registrarSemillero()

onMounted(async () => {
  await Promise.all([cargarGrupos(), cargarLideres()])
  await cargarSemilleros()
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
