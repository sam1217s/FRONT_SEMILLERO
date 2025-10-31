<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="shadow-1">
          <q-card-section>
            <div class="page-title">
              <q-icon name="group_add" class="q-mr-sm" />
              Grupos
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Crear y gestionar grupos de investigación
            </div>
          </q-card-section>
          
          <q-card-section>
            <!-- Filtros -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="busqueda"
                  filled
                  clearable
                  label="Buscar grupos"
                  placeholder="Buscar por nombre, categoría o estado..."
                  @update:model-value="aplicarFiltro"
                  @clear="limpiarFiltros"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="centroFiltro"
                  filled
                  clearable
                  label="Centro de investigación"
                  placeholder="Filtrar por centro"
                  :options="centrosOptions"
                  option-label="name"
                  option-value="_id"
                  emit-value
                  map-options
                  @update:model-value="aplicarFiltro"
                  @clear="limpiarFiltroCentro"
                />
              </div>
            </div>

            <!-- Indicador de carga -->
            <div v-if="loading" class="text-center q-pa-xl">
              <q-spinner-dots size="50px" color="primary" />
              <div class="text-h6 text-grey-6 q-mt-md">Cargando grupos...</div>
            </div>
            
            <!-- Tabla de grupos -->
            <Table 
              v-else
              :rows="gruposFiltrados"
              :columns="columns"
              title="GRUPOS"
              add-button-label="AGREGAR"
              @add-item="handleAddGrupo"
              @view-item="handleViewGrupo"
              @approve-item="handleEditGrupo"
              @reject-item="handleToggleStatus"
            />
          </q-card-section>
        </q-card>
        
        <!-- Modal: Ver Detalle del Grupo -->
        <q-dialog v-model="showDetailDialog">
          <q-card style="min-width: 800px; max-width: 1000px">
            <q-card-section class="modal-header">
              <div class="text-h6">
                <q-icon name="visibility" class="q-mr-sm" />
                Detalle del Grupo de Investigación
              </div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section v-if="selectedGrupo">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <div class="text-h6 text-primary q-mb-md">Información Básica</div>
                  <div class="info-item q-mb-sm"><strong>Nombre:</strong> {{ selectedGrupo.proyecto }}</div>
                  <div class="info-item q-mb-sm"><strong>Categoría:</strong> {{ selectedGrupo.categoria }}</div>
                  <div class="info-item q-mb-sm"><strong>Registro MinCiencias:</strong> {{ selectedGrupo.registro_minciencias || 'No especificado' }}</div>
                  <div class="info-item q-mb-sm">
                    <strong>Estado:</strong>
                    <q-badge :color="selectedGrupo.estado === 'Activo' ? 'positive' : 'grey'" :label="selectedGrupo.estado" />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="text-h6 text-primary q-mb-md">Centro</div>
                  <div class="info-item q-mb-sm"><strong>Centro:</strong> {{ selectedGrupo.centro }}</div>
                  <div class="info-item q-mb-sm"><strong>Ciudad:</strong> {{ selectedGrupo.ciudad || 'No especificada' }}</div>
                  <div class="info-item q-mb-sm"><strong>Departamento:</strong> {{ selectedGrupo.departamento || 'No especificado' }}</div>
                </div>
              </div>
              <div class="row q-mt-md">
                <div class="col-12">
                  <div class="text-h6 text-primary q-mb-md">Descripción</div>
                  <div class="info-item">{{ selectedGrupo.descripcion || 'Sin descripción' }}</div>
                </div>
              </div>
              <div class="row q-mt-md">
                <div class="col-12 col-md-6"><div class="info-item q-mb-sm"><strong>Creado:</strong> {{ selectedGrupo.fecha_creacion }}</div></div>
                <div class="col-12 col-md-6"><div class="info-item q-mb-sm"><strong>Actualizado:</strong> {{ selectedGrupo.fecha_actualizacion }}</div></div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cerrar" color="grey" v-close-popup />
              <q-btn flat :label="selectedGrupo?.estado === 'Inactivo' ? 'Activar' : 'Desactivar'"
                    :color="selectedGrupo?.estado === 'Inactivo' ? 'positive' : 'warning'"
                    @click="selectedGrupo?.estado === 'Inactivo' ? handleActivateGrupo(selectedGrupo) : handleDeactivateGrupo(selectedGrupo)" />
              <q-btn color="primary" label="Editar" @click="openEditFromDetail" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Modal para agregar/editar grupo -->
        <q-dialog v-model="showAddDialog">
          <q-card style="min-width: 800px; max-width: 900px">
            <q-card-section class="modal-header">
              <div class="text-h6">
                <q-icon :name="isEditMode ? 'edit' : 'group_add'" class="q-mr-sm" />
                {{ isEditMode ? 'Editar Grupo de Investigación' : 'Agregar Nuevo Grupo de Investigación' }}
              </div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
              <div class="row q-col-gutter-md">
                <!-- Columna izquierda -->
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="formData.nombre"
                    filled
                    label="Nombre del Grupo"
                    placeholder="Ingrese nombre del grupo"
                    :rules="[val => !!val || 'El nombre es obligatorio']"
                  />
                  
                  <q-input
                    v-model="formData.registro_minciencias"
                    filled
                    label="Registro MinCiencias"
                    placeholder="Ej: COL123456789"
                    class="q-mt-md"
                    :rules="[val => !!val || 'El registro es obligatorio']"
                  />
                  
                  <q-select
                    v-model="formData.categoria"
                    filled
                    label="Categoría"
                    :options="categoriaOptions"
                    option-label="label"
                    option-value="value"
                    emit-value
                    map-options
                    placeholder="Seleccione categoría"
                    class="q-mt-md"
                    :rules="[val => !!val || 'La categoría es obligatoria']"
                  />
                  
                  <q-select
                    v-model="formData.centro"
                    filled
                    clearable
                    use-input
                    fill-input
                    input-debounce="200"
                    label="Centro de Investigación"
                    :options="centrosOptions"
                    option-label="name"
                    option-value="_id"
                    emit-value
                    map-options
                    placeholder="Seleccione centro"
                    class="q-mt-md"
                    :rules="[val => !!val || 'El centro es obligatorio']"
                    @update:model-value="updateLocation"
                  />
                </div>

                <!-- Columna derecha -->
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="formData.descripcion"
                    filled
                    label="Descripción"
                    placeholder="Describa el enfoque del grupo"
                    type="textarea"
                    rows="4"
                    class="q-mt-md"
                    :rules="[val => !!val || 'La descripción es obligatoria']"
                  />
                  
                  <q-input
                    v-model="formData.ciudad"
                    filled
                    label="Ciudad"
                    placeholder="Ciudad del centro"
                    class="q-mt-md"
                    readonly
                  />
                  
                  <q-input
                    v-model="formData.departamento"
                    filled
                    label="Departamento"
                    placeholder="Departamento del centro"
                    class="q-mt-md"
                    readonly
                  />
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="grey" @click="closeDialog" />
              <q-btn 
                :label="isEditMode ? 'Actualizar Grupo' : 'Crear Grupo'" 
                color="primary" 
                @click="onSubmitGrupo"
                :loading="creating"
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
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { getData, postData, putData, deleteData } from '../../services/apiClient'

const $q = useQuasar()

// Estado de carga
const loading = ref(false)
const creating = ref(false)

// Datos de grupos (se cargan desde el backend)
const grupos = ref([])
const gruposFiltrados = ref([])

// Filtro
const busqueda = ref('')

// Modales y estados
const showAddDialog = ref(false)
const isEditMode = ref(false)
const showDetailDialog = ref(false)
const selectedGrupo = ref(null)
const editingGrupo = ref(null)

// Referencia reactiva para el filtro de centro de investigación en la tabla
const centroFiltro = ref('');

// Función para limpiar el filtro de centros y aplicar nuevamente el filtrado
const limpiarFiltroCentro = () => {
  centroFiltro.value = '';
  aplicarFiltro();
};

// Datos del formulario
const formData = ref({
  nombre: '',
  descripcion: '',
  categoria: '',
  registro_minciencias: '',
  centro: '',
  ciudad: '',
  departamento: ''
})

// Opciones para categorías
const categoriaOptions = [
  { label: 'A1 - Reconocido Internacionalmente', value: 'A1' },
  { label: 'A - Reconocido Nacionalmente', value: 'A' },
  { label: 'B - Reconocido Regionalmente', value: 'B' },
  { label: 'C - En Formación', value: 'C' }
]

// Opciones para centros (se cargarán del backend)
const centrosOptions = ref([])

// Columnas para la tabla de grupos
const columns = [
  {
    name: 'proyecto',
    label: 'Grupo',
    field: 'proyecto',
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
    name: 'categoria',
    label: 'Categoría',
    field: 'categoria',
    align: 'center',
    sortable: false
  },
  {
    name: 'estado',
    label: 'Estado',
    field: 'estado',
    align: 'center',
    sortable: false
  },
  {
    name: 'actions',
    label: 'Ver Grupo',
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

// Función para cargar centros desde el backend
const cargarCentros = async () => {
  try {
    const response = await getData('/research-centers/list')
    centrosOptions.value = response.msg || response.data || []
  } catch (error) {
    console.error('Error al cargar centros:', error)
    // Centros de ejemplo en caso de error
    centrosOptions.value = [
      {
        _id: '68fffcd7a42032bc57fa3c65',
        name: 'Centro de Pruebas SENA',
        city: 'Bogotá',
        department: 'Cundinamarca'
      }
    ]
  }
}

// Función para cargar grupos desde el backend
const cargarGrupos = async () => {
  try {
    loading.value = true
    const response = await getData('/research-groups/list')
    
    // Mapear los datos del backend al formato esperado por la tabla
    grupos.value = response.msg.map(grupo => ({
      id: grupo._id,
      proyecto: grupo.name,
      investigadores: 0, // No viene en la respuesta, se puede agregar después
      categoria: grupo.category,
      estado: grupo.status === 'Active' ? 'Activo' : 'Inactivo',
      descripcion: grupo.description,
      registro_minciencias: grupo.minciencias_registration,
      centro: grupo.id_center?.name || 'Sin centro',
      centroId: grupo.id_center?._id || grupo.id_center || '',
      ciudad: grupo.id_center?.city || '',
      departamento: grupo.id_center?.department || '',
      fecha_creacion: new Date(grupo.createdAt).toLocaleDateString('es-CO'),
      fecha_actualizacion: new Date(grupo.updatedAt).toLocaleDateString('es-CO')
    }))
    
    $q.notify({
      type: 'positive',
      message: `${grupos.value.length} grupos cargados exitosamente`,
      position: 'top',
      timeout: 2000
    })
    aplicarFiltro()
    
  } catch (error) {
    console.error('Error al cargar grupos:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al cargar los grupos del servidor',
      position: 'top',
      timeout: 3000
    })
    
    // Cargar datos de ejemplo en caso de error
    grupos.value = [
      {
        id: 1,
        proyecto: 'GRUPO DE INTELIGENCIA ARTIFICIAL',
        investigadores: 15,
        categoria: 'Agricultura',
        estado: 'Activo'
      },
      {
        id: 2,
        proyecto: 'GRUPO DE BIOTECNOLOGÍA',
        investigadores: 12,
        categoria: 'Salud',
        estado: 'Activo'
      },
      {
        id: 3,
        proyecto: 'GRUPO DE ENERGÍAS RENOVABLES',
        investigadores: 8,
        categoria: 'Ambiente',
        estado: 'Inactivo'
      }
    ]
    aplicarFiltro()
  } finally {
    loading.value = false
  }
}

// Aplicar filtros
const aplicarFiltro = () => {
  let data = [...grupos.value]
  if (busqueda.value) {
    const term = busqueda.value.toLowerCase()
    data = data.filter(g =>
      (g.proyecto && g.proyecto.toLowerCase().includes(term)) ||
      (g.categoria && g.categoria.toLowerCase().includes(term)) ||
      (g.estado && g.estado.toLowerCase().includes(term)) ||
      (g.centro && String(g.centro).toLowerCase().includes(term)) ||
      (g.ciudad && g.ciudad.toLowerCase().includes(term)) ||
      (g.departamento && g.departamento.toLowerCase().includes(term))
    )
  }
  gruposFiltrados.value = data
}

const limpiarFiltros = () => {
  busqueda.value = ''
  aplicarFiltro()
}

watch(busqueda, () => aplicarFiltro())

// Handlers para los eventos de la tabla
const handleAddGrupo = () => {
  console.log('Agregar nuevo grupo')
  showAddDialog.value = true
  cargarCentros() // Cargar centros al abrir el modal
}

const handleViewGrupo = (grupo) => {
  console.log('Ver grupo:', grupo)
  selectedGrupo.value = grupo
  showDetailDialog.value = true
}

const handleEditGrupo = (grupo) => {
  console.log('Editar grupo:', grupo)
  isEditMode.value = true
  editingGrupo.value = grupo
  // Prefill formulario
  formData.value = {
    nombre: grupo.proyecto || '',
    descripcion: grupo.descripcion || '',
    categoria: grupo.categoria || '',
    registro_minciencias: grupo.registro_minciencias || '',
    centro: grupo.centroId || '',
    ciudad: grupo.ciudad || '',
    departamento: grupo.departamento || ''
  }
  // Asegurar opciones de centros disponibles para filtrar/buscar
  cargarCentros()
  showAddDialog.value = true
}

const openEditFromDetail = () => {
  if (!selectedGrupo.value) return
  handleEditGrupo(selectedGrupo.value)
}

const handleActivateGrupo = async (grupo) => {
  try {
    console.log('Activar grupo:', grupo)
    await putData(`/research-groups/activate/${grupo.id}`)
    
    // Actualizar estado local
    grupo.estado = 'Activo'
    
    $q.notify({
      type: 'positive',
      message: 'Grupo activado exitosamente',
      position: 'top',
      timeout: 3000
    })
  } catch (error) {
    console.error('Error al activar grupo:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al activar el grupo',
      position: 'top',
      timeout: 3000
    })
  }
}

const handleDeactivateGrupo = async (grupo) => {
  try {
    console.log('Desactivar grupo:', grupo)
    await putData(`/research-groups/inactivate/${grupo.id}`)
    
    // Actualizar estado local
    grupo.estado = 'Inactivo'
    
    $q.notify({
      type: 'warning',
      message: 'Grupo desactivado',
      position: 'top',
      timeout: 3000
    })
  } catch (error) {
    console.error('Error al desactivar grupo:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al desactivar el grupo',
      position: 'top',
      timeout: 3000
    })
  }
}

const handleToggleStatus = (grupo) => {
  if (grupo.estado === 'Inactivo') {
    handleActivateGrupo(grupo)
  } else {
    handleDeactivateGrupo(grupo)
  }
}

// Función para cerrar el modal y limpiar formulario
const closeDialog = () => {
  showAddDialog.value = false
  isEditMode.value = false
  editingGrupo.value = null
  formData.value = {
    nombre: '',
    descripcion: '',
    categoria: '',
    registro_minciencias: '',
    centro: '',
    ciudad: '',
    departamento: ''
  }
}

// Función para actualizar ciudad y departamento cuando se selecciona un centro
const updateLocation = () => {
  const centroSeleccionado = centrosOptions.value.find(c => c._id === formData.value.centro)
  if (centroSeleccionado) {
    formData.value.ciudad = centroSeleccionado.city || ''
    formData.value.departamento = centroSeleccionado.department || ''
  } else {
    formData.value.ciudad = ''
    formData.value.departamento = ''
  }
}

// Función para crear un nuevo grupo
const handleCreateGrupo = async () => {
  try {
    creating.value = true
    
    // Validar campos requeridos
    if (!formData.value.nombre || !formData.value.descripcion || !formData.value.categoria || 
        !formData.value.registro_minciencias || !formData.value.centro) {
      $q.notify({
        type: 'negative',
        message: 'Por favor complete todos los campos requeridos',
        position: 'top',
        timeout: 3000
      })
      return
    }
    
    // Preparar datos para enviar al backend
    const grupoData = {
      name: formData.value.nombre,
      description: formData.value.descripcion,
      category: formData.value.categoria,
      minciencias_registration: formData.value.registro_minciencias,
      id_center: formData.value.centro
    }
    
    console.log('Creando grupo:', grupoData)
    
    // Enviar al backend
    const response = await postData('/research-groups/create', grupoData)
    
    $q.notify({
      type: 'positive',
      message: 'Grupo creado exitosamente',
      position: 'top',
      timeout: 3000
    })
    
    // Cerrar modal y limpiar formulario
    closeDialog()
    
    // Recargar la lista de grupos
    await cargarGrupos()
    
  } catch (error) {
    console.error('Error al crear grupo:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al crear el grupo. Intente nuevamente.',
      position: 'top',
      timeout: 3000
    })
  } finally {
    creating.value = false
  }
}

const handleUpdateGrupo = async () => {
  try {
    if (!editingGrupo.value || !editingGrupo.value.id) {
      $q.notify({ type: 'negative', message: 'No se encontró el grupo a actualizar', position: 'top', timeout: 3000 })
      return
    }
    creating.value = true
    // Validación básica
    if (!formData.value.nombre || !formData.value.descripcion || !formData.value.categoria || 
        !formData.value.registro_minciencias || !formData.value.centro) {
      $q.notify({ type: 'negative', message: 'Por favor complete todos los campos requeridos', position: 'top', timeout: 3000 })
      return
    }
    const grupoData = {
      name: formData.value.nombre,
      description: formData.value.descripcion,
      category: formData.value.categoria,
      minciencias_registration: formData.value.registro_minciencias,
      id_center: formData.value.centro
    }
    console.log('Actualizar grupo:', grupoData)
    await putData(`/research-groups/update/${editingGrupo.value.id}`, grupoData)
    $q.notify({ type: 'positive', message: 'Grupo actualizado exitosamente', position: 'top', timeout: 3000 })

    // Actualización optimista en memoria
    const idx = grupos.value.findIndex(g => g.id === editingGrupo.value.id)
    if (idx !== -1) {
      const updated = {
        ...grupos.value[idx],
        proyecto: formData.value.nombre,
        descripcion: formData.value.descripcion,
        categoria: formData.value.categoria,
        registro_minciencias: formData.value.registro_minciencias,
        centro: (centrosOptions.value.find(c => c._id === formData.value.centro)?.name) || grupos.value[idx].centro,
        centroId: formData.value.centro || grupos.value[idx].centroId,
        ciudad: (centrosOptions.value.find(c => c._id === formData.value.centro)?.city) || grupos.value[idx].ciudad,
        departamento: (centrosOptions.value.find(c => c._id === formData.value.centro)?.department) || grupos.value[idx].departamento,
        fecha_actualizacion: new Date().toLocaleDateString('es-CO')
      }
      grupos.value.splice(idx, 1, updated)
      // Si detalle está abierto, sincronizar
      if (selectedGrupo.value && selectedGrupo.value.id === updated.id) {
        selectedGrupo.value = { ...updated }
      }
      aplicarFiltro()
    } else {
      // Fallback: recargar si no encontramos el ítem
      await cargarGrupos()
    }

    closeDialog()
  } catch (error) {
    console.error('Error al actualizar grupo:', error)
    $q.notify({ type: 'negative', message: 'Error al actualizar el grupo. Intente nuevamente.', position: 'top', timeout: 3000 })
  } finally {
    creating.value = false
  }
}

const onSubmitGrupo = () => {
  if (isEditMode.value) return handleUpdateGrupo()
  return handleCreateGrupo()
}

// Cargar grupos al montar el componente
onMounted(() => {
  cargarGrupos()
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #71277A;
  color: white;
}

.modal-header .text-h6 {
  color: white;
}

/* Estilos para los inputs del modal */
.q-input :deep(.q-field__label) {
  color: #71277A;
  font-weight: 500;
}

.q-input :deep(.q-field--filled .q-field__control) {
  background: #f5f5f5;
}

.q-input :deep(.q-field--filled:focus-within .q-field__control) {
  background: white;
  border: 2px solid #71277A;
}

.q-select :deep(.q-field__label) {
  color: #71277A;
  font-weight: 500;
}

.q-select :deep(.q-field--filled .q-field__control) {
  background: #f5f5f5;
}

.q-select :deep(.q-field--filled:focus-within .q-field__control) {
  background: white;
  border: 2px solid #71277A;
}
</style>

