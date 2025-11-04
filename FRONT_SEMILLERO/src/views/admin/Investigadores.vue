<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="shadow-1">
          <q-card-section>
            <div class="page-title">
              <q-icon name="person_add" class="q-mr-sm" />
              Investigadores
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Crear y gestionar investigadores
            </div>
          </q-card-section>

          <q-card-section>
            <!-- Filtros -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-4">
                <q-select
                  v-model="filtroRol"
                  filled
                  label="Filtrar por rol"
                  :options="opcionesFiltro"
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  clearable
                />
              </div>
              <div class="col-12 col-md-8">
                <q-input
                  v-model="busqueda"
                  filled
                  clearable
                  label="Buscar por nombre"
                  placeholder="Escriba para buscar..."
                >
                  <template #prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </div>

            <!-- Indicador de carga -->
            <div v-if="loading" class="text-center q-pa-xl">
              <q-spinner-dots size="50px" color="primary" />
              <div class="text-h6 text-grey-6 q-mt-md">Cargando investigadores...</div>
            </div>

            <!-- Tabla de investigadores -->
            <Table
              v-else
              :rows="filtradatos"
              :columns="columns"
              title="INVESTIGADORES"
              add-button-label="AGREGAR"
              @add-item="handleAddInvestigador"
            >
              <template #cell-estado="{ value, row }">
                <q-badge
                  :color="row.estado === 'Activo' ? 'positive' : 'grey'"
                  :label="value"
                />
              </template>

              <template #options-column="{ row }">
                <ActionButtons
                  :row="row"
                  :show-view="true"
                  :show-edit="true"
                  :show-toggle-status="true"
                  view-tooltip="Ver Perfil"
                  edit-tooltip="Editar"
                  :activate-tooltip="row.estado === 'Inactivo' ? 'Activar' : 'Desactivar'"
                  :deactivate-tooltip="row.estado === 'Inactivo' ? 'Activar' : 'Desactivar'"
                  @view="handleViewDetalle"
                  @edit="handleEditInvestigador"
                  @toggle-status="handleToggleStatus"
                />
              </template>
            </Table>
          </q-card-section>
        </q-card>

        <!-- Modal: Ver Perfil del Investigador -->
        <q-dialog v-model="showDetailDialog">
          <q-card style="min-width: 800px; max-width: 1000px">
            <q-card-section class="modal-header">
              <div class="text-h6">
                <q-icon name="visibility" class="q-mr-sm" />
                Perfil del Investigador
              </div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section v-if="selectedInvestigador">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <div class="text-h6 text-primary q-mb-md">Información Básica</div>
                  <div class="info-item q-mb-sm"><strong>Nombre:</strong> {{ selectedInvestigador.nombre }}</div>
                  <div class="info-item q-mb-sm"><strong>Tipo Documento:</strong> {{ selectedInvestigador.tipoDocumento }}</div>
                  <div class="info-item q-mb-sm"><strong>Número Documento:</strong> {{ selectedInvestigador.numeroDocumento }}</div>
                  <div class="info-item q-mb-sm"><strong>Rol:</strong> {{ selectedInvestigador.rol }}</div>
                  <div class="info-item q-mb-sm"><strong>Estado:</strong>
                    <q-badge :color="selectedInvestigador.estado === 'Activo' ? 'positive' : 'grey'" :label="selectedInvestigador.estado" />
                  </div>
                  <div class="info-item q-mb-sm"><strong>Proyecto / Área de conocimiento:</strong> {{ selectedInvestigador.proyecto }}</div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="text-h6 text-primary q-mb-md">Contacto y Académico</div>
                  <div class="info-item q-mb-sm"><strong>Email:</strong> {{ selectedInvestigador.email || 'No especificado' }}</div>
                  <div class="info-item q-mb-sm"><strong>Celular:</strong> {{ selectedInvestigador.celular || 'No especificado' }}</div>
                  <div class="info-item q-mb-sm"><strong>Formación académica:</strong> {{ selectedInvestigador.formacionAcademica || 'No especificada' }}</div>
                  <div class="info-item q-mb-sm"><strong>Área de conocimiento:</strong> {{ selectedInvestigador.areaConocimiento || 'No especificada' }}</div>
                </div>
              </div>
              <div class="row q-col-gutter-md q-mt-md">
                <div class="col-12 col-md-4">
                  <div class="text-h6 text-primary q-mb-sm">Contrato</div>
                  <div class="info-item q-mb-sm"><strong>Tipo de Contrato:</strong> {{ selectedInvestigador.tipoContrato || '-' }}</div>
                  <div class="info-item q-mb-sm"><strong>Número de Contrato:</strong> {{ selectedInvestigador.numeroContrato || '-' }}</div>
                  <div class="info-item q-mb-sm"><strong>Fecha inicio:</strong> {{ selectedInvestigador.fechaInicio || '-' }}</div>
                  <div class="info-item q-mb-sm"><strong>Fecha fin:</strong> {{ selectedInvestigador.fechaFin || '-' }}</div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="text-h6 text-primary q-mb-sm">Roles (todos)</div>
                  <ul class="q-pl-md no-margin">
                    <li v-for="role in selectedInvestigador.roles" :key="role.role + role.start_date">
                      <span><strong>{{ role.role }}</strong> <span v-if="role.active" class="text-positive">[Activo]</span><span v-else class="text-negative">[Inactivo]</span></span>
                    </li>
                  </ul>
                </div>
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cerrar" color="grey" v-close-popup />
              <q-btn flat :label="selectedInvestigador?.estado === 'Inactivo' ? 'Activar' : 'Desactivar'" :color="selectedInvestigador?.estado === 'Inactivo' ? 'positive' : 'warning'" @click="selectedInvestigador?.estado === 'Inactivo' ? handleActivateInvestigador(selectedInvestigador) : handleDeactivateInvestigador(selectedInvestigador)" />
              <q-btn color="primary" label="Editar" @click="openEditFromDetail" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- Modal para registrar investigador -->
        <q-dialog v-model="showAddDialog">
          <q-card style="min-width: 800px; max-width: 900px">
            <q-card-section class="modal-header">
              <div class="text-h6">
                {{ isEditMode ? `Editar ${editingInvestigador?.rol || 'Investigador'}` : 'Información Personal para agregar investigador' }}
              </div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
              <div class="row q-col-gutter-md">
                <!-- Columna izquierda -->
                <div class="col-12 col-md-6">
                  <q-input v-model="formData.nombreCompleto" filled label="Nombre completo" placeholder="Ingrese nombre completo" />
                  <q-input v-model="formData.numeroDocumento" filled label="Número de documento" placeholder="Ingrese número de documento" class="q-mt-md" />
                  <q-input v-model="formData.telefono" filled label="Teléfono" placeholder="Ingrese teléfono" class="q-mt-md" />
                  <q-input v-model="formData.areaConocimiento" filled label="Área de conocimiento" placeholder="Ingrese área de conocimiento" class="q-mt-md" />
                  <q-input v-model="formData.numeroContrato" filled label="Número de contrato" placeholder="Ingrese número de contrato" class="q-mt-md" />
                  <q-input v-model="formData.fechaFin" filled label="Fecha de fin" placeholder="DD/MM/YYYY" class="q-mt-md" mask="##/##/####">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="formData.fechaFin" mask="DD/MM/YYYY">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <!-- Columna derecha -->
                <div class="col-12 col-md-6">
                  <q-select v-model="formData.tipoDocumento" filled label="Tipo de documento" :options="tipoDocumentoOptions" option-label="label" option-value="value" emit-value map-options placeholder="CC, TARJETA..." />
                  <q-input v-model="formData.gmail" filled label="Gmail" placeholder="ejemplo@gmail.com" class="q-mt-md" type="email" />
                  <q-input v-model="formData.formacionAcademica" filled label="Formación académica" placeholder="Ingrese formación académica" class="q-mt-md" />
                  <q-input v-model="formData.tipoContrato" filled label="Tipo de contrato" placeholder="Ingrese tipo de contrato" class="q-mt-md" />
                  <q-input v-model="formData.fechaInicio" filled label="Fecha de inicio" placeholder="DD/MM/YYYY" class="q-mt-md" mask="##/##/####">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="formData.fechaInicio" mask="DD/MM/YYYY">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>

              <!-- Checkbox Asignar como líder -->
              <div class="row q-mt-md">
                <div class="col-12">
                  <q-checkbox v-model="formData.asignarComoLider" :label="isEditMode ? `Cambiar a ${editingInvestigador?.rol === 'LIDER' ? 'INVESTIGADOR' : 'LIDER'}` : 'Asignar como LIDER'" color="primary" />
                  <div class="text-caption text-grey-6 q-mt-xs">
                    {{ formData.asignarComoLider ? 'Se asignará como LIDER' : 'Se asignará como INVESTIGADOR' }}
                  </div>
                </div>
              </div>
              <template v-if="isEditMode && isAdmin.value && formData.estado !== undefined">
                <div class="row q-mt-md">
                  <div class="col-12">
                    <q-toggle v-model="formData.estado" left-label color="primary" val="0" false-value="1" true-value="0" :label="formData.estado === 0 ? 'Estado: Activo' : 'Estado: Inactivo'" />
                    <div class="text-caption text-grey-6 q-mt-xs">Solo un ADMIN puede activar o inactivar desde aquí</div>
                  </div>
                </div>
              </template>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="grey" @click="closeDialog" />
              <q-btn :label="isEditMode ? 'Actualizar' : 'Registrar'" color="primary" @click="onSubmitInvestigador" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import Table from '../../components/table.vue'
import ActionButtons from '../../components/ActionButtons.vue'
import { ref, onMounted, computed } from 'vue'
import { getData, postData, putData } from '../../services/apiClient'
import { useAuthStore } from '../../stores/authStore.js'
import { useNotifications } from '../../composables/useNotifications'

const { error, info } = useNotifications()

const loading = ref(false)
const investigadores = ref([])
const selectedInvestigador = ref(null)
const showDetailDialog = ref(false)
const filtroRol = ref('leaders_investigators')
const busqueda = ref('')

// Modal de registro/edición
const showAddDialog = ref(false)
const isEditMode = ref(false)
const editingInvestigador = ref(null)

// Datos del formulario
const formData = ref({
  nombreCompleto: '',
  tipoDocumento: '',
  numeroDocumento: '',
  telefono: '',
  gmail: '',
  formacionAcademica: '',
  areaConocimiento: '',
  tipoContrato: '',
  numeroContrato: '',
  fechaInicio: '',
  fechaFin: '',
  asignarComoLider: false,
  estado: 0,
  entry_date: ''
})

const tipoDocumentoOptions = [
  { label: 'Cédula de Ciudadanía (CC)', value: 'CC' },
  { label: 'Tarjeta de Identidad (TI)', value: 'TI' },
  { label: 'Cédula de Extranjería (CE)', value: 'CE' },
  { label: 'Pasaporte (PP)', value: 'PP' }
]

const opcionesFiltro = [
  { label: 'Líderes e Investigadores', value: 'leaders_investigators' },
  { label: 'Solo Líderes', value: 'leaders' },
  { label: 'Solo Investigadores', value: 'investigators' },
  { label: 'Coordinadores', value: 'coordinators' },
  { label: 'Administradores', value: 'admins' },
  { label: 'Todos', value: 'all' }
]

const columns = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: false },
  { name: 'proyecto', label: 'Proyecto', field: 'proyecto', align: 'center', sortable: false },
  { name: 'rol', label: 'Rol', field: 'rol', align: 'center', sortable: false },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center', sortable: false },
  { name: 'celular', label: 'Celular', field: 'celular', align: 'center', sortable: false },
  { name: 'options', label: 'Opciones', field: 'options', align: 'center', sortable: false }
]

// === FILTRO AUTOMÁTICO ===
const filtradatos = computed(() => {
  let filtrados = [...investigadores.value]

  // Filtro por rol
  if (filtroRol.value && filtroRol.value !== 'all') {
    switch (filtroRol.value) {
      case 'leaders_investigators':
        filtrados = filtrados.filter(inv => inv.rol === 'LIDER' || inv.rol === 'INVESTIGADOR')
        break
      case 'leaders':
        filtrados = filtrados.filter(inv => inv.rol === 'LIDER')
        break
      case 'investigators':
        filtrados = filtrados.filter(inv => inv.rol === 'INVESTIGADOR')
        break
      case 'coordinators':
        filtrados = filtrados.filter(inv => inv.rol === 'COORDINATOR')
        break
      case 'admins':
        filtrados = filtrados.filter(inv => inv.rol === 'ADMIN')
        break
    }
  }

  // Filtro por búsqueda de texto
  const term = busqueda.value?.toLowerCase().trim()
  if (term) {
    filtrados = filtrados.filter(inv => inv.nombre.toLowerCase().includes(term))
  }

  return filtrados
})

// === CRUD ===
// Cargar investigadores
const cargarInvestigadores = async () => {
  try {
    loading.value = true
    const response = await getData('/researchers/list')

    // Validar que la respuesta tenga datos
    if (!response || !response.msg || !Array.isArray(response.msg)) {
      console.warn('Respuesta vacía o formato incorrecto del backend:', response)
      investigadores.value = []
      return
    }

    investigadores.value = response.msg.map(investigador => {
      let rolPrincipal = 'INVESTIGADOR'

      if (investigador.roles && investigador.roles.length > 0) {
        const rolesActivos = investigador.roles.filter(role => role.active)

        if (rolesActivos.length > 0) {
          if (rolesActivos.some(r => r.role === 'SUPER')) {
            rolPrincipal = 'SUPER'
          } else if (rolesActivos.some(r => r.role === 'ADMIN')) {
            rolPrincipal = 'ADMIN'
          } else if (rolesActivos.some(r => r.role === 'LIDER')) {
            rolPrincipal = 'LIDER'
          } else if (rolesActivos.some(r => r.role === 'INVESTIGADOR')) {
            rolPrincipal = 'INVESTIGADOR'
          } else {
            rolPrincipal = rolesActivos[0].role
          }
        }
      }

      return {
        id: investigador._id,
        nombre: investigador.name,
        proyecto: investigador.knowledge_area || 'Sin área asignada',
        rol: rolPrincipal,
        estado: investigador.status === 0 ? 'Activo' : 'Inactivo',
        celular: investigador.phone,
        email: investigador.email,
        tipoDocumento: investigador.document_type,
        numeroDocumento: investigador.document_number,
        formacionAcademica: investigador.academic_formation,
        areaConocimiento: investigador.knowledge_area,
        tipoContrato: investigador.contract_type,
        numeroContrato: investigador.contract_number,
        fechaInicio: investigador.contract_start_date ? new Date(investigador.contract_start_date).toLocaleDateString('es-CO') : '',
        fechaFin: investigador.contract_end_date ? new Date(investigador.contract_end_date).toLocaleDateString('es-CO') : '',
        esLider: investigador.roles?.some(role => role.role === 'LIDER' && role.active) || false,
        roles: investigador.roles || [],
        entry_date: investigador.entry_date,
        options: 'options'
      }
    })
  } catch (err) {
    console.error('Error al cargar investigadores:', err)
    error('No se pudieron cargar los investigadores')
  } finally {
    loading.value = false
  }
}

// === ACCIONES ===
const handleAddInvestigador = () => {
  showAddDialog.value = true
}

const closeDialog = () => {
  showAddDialog.value = false
  isEditMode.value = false
  editingInvestigador.value = null
  formData.value = {
    nombreCompleto: '',
    tipoDocumento: '',
    numeroDocumento: '',
    telefono: '',
    gmail: '',
    formacionAcademica: '',
    areaConocimiento: '',
    tipoContrato: '',
    numeroContrato: '',
    fechaInicio: '',
    fechaFin: '',
    asignarComoLider: false,
    estado: 0,
    entry_date: ''
  }
}

// Registrar investigador
const registrarInvestigador = async () => {
  try {
    if (!formData.value.nombreCompleto || !formData.value.numeroDocumento || !formData.value.telefono) {
      error('Por favor complete todos los campos requeridos')
      return
    }

    const investigadorData = {
      name: formData.value.nombreCompleto,
      document_type: formData.value.tipoDocumento,
      document_number: formData.value.numeroDocumento,
      phone: formData.value.telefono,
      email: formData.value.gmail,
      academic_formation: formData.value.formacionAcademica,
      knowledge_area: formData.value.areaConocimiento,
      contract_type: formData.value.tipoContrato,
      contract_number: formData.value.numeroContrato,
      contract_start_date: formData.value.fechaInicio
        ? (typeof formData.value.fechaInicio === 'string' && formData.value.fechaInicio.includes('/')
          ? new Date(formData.value.fechaInicio.split('/').reverse().join('-')).toISOString()
          : new Date(formData.value.fechaInicio).toISOString())
        : undefined,
      contract_end_date: formData.value.fechaFin
        ? (typeof formData.value.fechaFin === 'string' && formData.value.fechaFin.includes('/')
          ? new Date(formData.value.fechaFin.split('/').reverse().join('-')).toISOString()
          : new Date(formData.value.fechaFin).toISOString())
        : undefined,
      status: 'Active',
      roles: formData.value.asignarComoLider
        ? [{ role: 'LIDER', start_date: new Date(), active: true }]
        : [{ role: 'INVESTIGADOR', start_date: new Date(), active: true }]
    }

    await postData('/researchers/create', investigadorData)
    await cargarInvestigadores()
    info('Investigador registrado correctamente')
    closeDialog()
  } catch (err) {
    console.error('Error al registrar investigador:', err)
    error('No se pudo registrar el investigador')
  }
}

// Actualizar investigador
const actualizarInvestigador = async () => {
  try {
    if (!formData.value.nombreCompleto || !formData.value.numeroDocumento || !formData.value.telefono) {
      error('Por favor complete todos los campos requeridos')
      return
    }

    const investigadorData = {
      name: formData.value.nombreCompleto,
      document_type: formData.value.tipoDocumento,
      document_number: formData.value.numeroDocumento,
      phone: formData.value.telefono,
      email: formData.value.gmail,
      academic_formation: formData.value.formacionAcademica,
      knowledge_area: formData.value.areaConocimiento,
      contract_type: formData.value.tipoContrato,
      contract_number: formData.value.numeroContrato,
      roles: formData.value.asignarComoLider
        ? [{ role: 'LIDER', start_date: new Date(), active: true }]
        : [{ role: 'INVESTIGADOR', start_date: new Date(), active: true }],
      entry_date: formData.value.entry_date && formData.value.entry_date !== ''
        ? (typeof formData.value.entry_date === 'string' && formData.value.entry_date.includes('/')
          ? new Date(formData.value.entry_date.split('/').reverse().join('-')).toISOString()
          : new Date(formData.value.entry_date).toISOString())
        : new Date().toISOString()
    }

    if (isAdmin.value) {
      investigadorData.status = formData.value.estado
    }

    await putData(`/researchers/update/${editingInvestigador.value.id}`, investigadorData)
    await cargarInvestigadores()
    info('Investigador actualizado correctamente')
    closeDialog()
  } catch (err) {
    console.error('Error al actualizar investigador:', err)
    error('No se pudo actualizar el investigador')
  }
}

const handleViewDetalle = (investigador) => {
  selectedInvestigador.value = investigador
  showDetailDialog.value = true
}

const handleEditInvestigador = (investigador) => {
  isEditMode.value = true
  editingInvestigador.value = investigador
  formData.value = {
    nombreCompleto: investigador.nombre || '',
    tipoDocumento: investigador.tipoDocumento || 'CC',
    numeroDocumento: investigador.numeroDocumento || '',
    telefono: investigador.celular || '',
    gmail: investigador.email || '',
    formacionAcademica: investigador.formacionAcademica || '',
    areaConocimiento: investigador.areaConocimiento || '',
    tipoContrato: investigador.tipoContrato || '',
    numeroContrato: investigador.numeroContrato || '',
    fechaInicio: investigador.fechaInicio || '',
    fechaFin: investigador.fechaFin || '',
    asignarComoLider: investigador.esLider || false,
    estado: investigador.estado === 'Activo' ? 0 : 1,
    entry_date: investigador.entry_date || ''
  }
  showAddDialog.value = true
}

// Activar / Desactivar investigador
const handleToggleStatus = async (investigador) => {
  try {
    const endpoint = investigador.estado === 'Activo' ? 'inactivate' : 'activate'
    await putData(`/researchers/${endpoint}/${investigador.id}`)
    await cargarInvestigadores()
    info(`Investigador ${endpoint === 'activate' ? 'activado' : 'desactivado'} correctamente`)
  } catch {
    error('No se pudo cambiar el estado del investigador')
  }
}

const handleActivateInvestigador = async (investigador) => {
  try {
    await putData(`/researchers/activate/${investigador.id}`)
    info('Investigador activado correctamente')
    await cargarInvestigadores()
  } catch (err) {
    console.error('Error al activar investigador:', err)
    error('No se pudo activar el investigador')
  }
}

const handleDeactivateInvestigador = async (investigador) => {
  try {
    await putData(`/researchers/inactivate/${investigador.id}`)
    info('Investigador desactivado correctamente')
    await cargarInvestigadores()
  } catch (err) {
    console.error('Error al desactivar investigador:', err)
    error('No se pudo desactivar el investigador')
  }
}

const openEditFromDetail = () => {
  if (!selectedInvestigador.value) return
  showDetailDialog.value = false
  handleEditInvestigador(selectedInvestigador.value)
}

onMounted(() => {
  cargarInvestigadores()
})

const authStore = useAuthStore()
const isAdmin = computed(() => authStore.getUserRole === 'ADMIN')

const onSubmitInvestigador = () =>
  isEditMode.value ? actualizarInvestigador() : registrarInvestigador()
</script>

<!-- Los estilos globales están definidos en src/app.scss -->
