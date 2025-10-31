<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="shadow-1">
          <!-- HEADER -->
          <q-card-section>
            <div class="page-title">
              <q-icon name="admin_panel_settings" class="q-mr-sm" />
              Administradores
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Crear y gestionar administradores del sistema
            </div>
          </q-card-section>

          <!-- TABLA -->
          <q-card-section>
            <!-- FILTRO -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-6">
                <q-input v-model="busqueda" filled clearable label="Buscar administradores"
                  placeholder="Buscar por nombre, correo o teléfono...">
                  <template #prepend><q-icon name="search" /></template>
                </q-input>
              </div>
            </div>

            <!-- LOADING -->
            <div v-if="loading" class="text-center q-pa-xl">
              <q-spinner-dots size="50px" color="primary" />
              <div class="text-h6 text-grey-6 q-mt-md">Cargando administradores...</div>
            </div>

            <!-- TABLA PRINCIPAL -->
            <Table v-else :rows="filtradatos" :columns="columns" title="ADMINISTRADORES"
              add-button-label="AGREGAR ADMINISTRADOR" @add-item="showAddDialog = true">
              <template #options-column="{ row }">
                <ActionButtons :row="row" :show-view="true" :show-edit="true" :show-toggle-status="true"
                  view-tooltip="Ver perfil" edit-tooltip="Editar administrador" activate-tooltip="Activar"
                  deactivate-tooltip="Desactivar" @view="handleViewPerfil(row)" @edit="handleEditAdministrador(row)"
                  @toggle-status="handleToggleStatus(row)" />
              </template>
              <template v-slot:body-cell-status="props">
                <q-td>
                  <span style="color: green;" v-if="props.row.status==1">¨{{ props.row.status }} </span>
                  <span style="color: red;" v-else>{{ props.row.status }} </span>
                </q-td>

              </template>
            </Table>
          </q-card-section>
        </q-card>

        <!-- PERFIL -->
        <q-dialog v-model="showProfileDialog">
          <q-card style="min-width: 800px; max-width: 1000px">
            <q-card-section class="modal-header">
              <div class="text-h6">
                <q-icon name="visibility" class="q-mr-sm" /> Perfil del Administrador
              </div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section v-if="selectedAdministrador">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <div class="text-h6 text-primary q-mb-md">Información Básica</div>
                  <div class="info-item"><strong>Nombre:</strong> {{ selectedAdministrador.name }}</div>
                  <div class="info-item"><strong>Documento:</strong> {{ selectedAdministrador.document_type }} {{
                    selectedAdministrador.document_number }}</div>
                  <div class="info-item"><strong>Rol:</strong> ADMIN</div>
                  <div class="info-item">
                    <strong>Estado:</strong>
                    <q-badge :color="selectedAdministrador.status === 1 ? 'positive' : 'grey'"
                      :label="selectedAdministrador.status === 0 ? 'Activo' : 'Inactivo'" />
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="text-h6 text-primary q-mb-md">Contacto</div>
                  <div class="info-item"><strong>Celular:</strong> {{ selectedAdministrador.phone }}</div>
                  <div class="info-item"><strong>Email:</strong> {{ selectedAdministrador.email }}</div>
                  <div class="info-item"><strong>Área:</strong> {{ selectedAdministrador.knowledge_area }}</div>
                  <div class="info-item"><strong>Formación:</strong> {{ selectedAdministrador.academic_formation }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- CREAR / EDITAR -->
        <q-dialog v-model="showAddDialog">
          <q-card style="min-width: 800px; max-width: 900px">
            <q-card-section class="modal-header">
              <div class="text-h6">
                {{ isEditMode ? "Editar Administrador" : "Registrar Administrador" }}
              </div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input v-model="formData.name" filled label="Nombre completo" />
                  <q-select v-model="formData.document_type" filled label="Tipo de documento"
                    :options="tipoDocumentoOptions" class="q-mt-md" />
                  <q-input v-model="formData.document_number" filled label="Número de documento" class="q-mt-md" />
                  <q-input v-model="formData.phone" filled label="Teléfono" class="q-mt-md" />
                  <q-input v-model="formData.email" filled label="Correo electrónico" class="q-mt-md" />
                </div>

                <div class="col-12 col-md-6">
                  <q-input v-model="formData.academic_formation" filled label="Formación académica" />
                  <q-input v-model="formData.knowledge_area" filled label="Área de conocimiento" class="q-mt-md" />
                  <q-select v-model="formData.contract_type" filled label="Tipo de contrato" :options="[
                    { label: 'Planta', value: 'planta' },
                    { label: 'Contrato', value: 'contrato' }
                  ]" class="q-mt-md" />
                  <q-input v-model="formData.contract_number" filled label="Número de contrato" class="q-mt-md" />
                  <q-input v-model="formData.contract_start_date" filled type="date" label="Fecha de inicio de contrato"
                    class="q-mt-md" />
                </div>

                <!-- FILA DE FECHA DE INGRESO -->
                <div class="col-12 col-md-6 q-mt-md">
                  <q-input v-model="formData.entry_date" filled type="date" label="Fecha de ingreso" />
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="grey" @click="closeDialog" />
              <q-btn :label="isEditMode ? 'Actualizar' : 'Registrar'" color="primary" @click="onSubmitAdministrador" />
            </q-card-actions>
          </q-card>
        </q-dialog>

      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import Table from "../../components/table.vue"
import ActionButtons from "../../components/ActionButtons.vue"
import { getData, postData, putData } from "../../services/apiClient"
import { useNotifications } from "../../composables/useNotifications"

const { error, info } = useNotifications()

const loading = ref(false)
const administradores = ref([])
const busqueda = ref("")
const showAddDialog = ref(false)
const showProfileDialog = ref(false)
const isEditMode = ref(false)
const selectedAdministrador = ref(null)
const editingAdministrador = ref(null)

const formData = ref({
  document_number: "",
  document_type: "",
  name: "",
  email: "",
  phone: "",
  password: "password123",
  academic_formation: "",
  knowledge_area: "",
  contract_type: "",
  contract_number: "",
  contract_start_date: "",
  entry_date: "",
  status: 0,
  roles: [{ role: "ADMIN", start_date: new Date().toISOString().split("T")[0] }]
})


const tipoDocumentoOptions = [
  { label: "Cédula de Ciudadanía (CC)", value: "CC" },
  { label: "Tarjeta de Identidad (TI)", value: "TI" },
  { label: "Cédula de Extranjería (CE)", value: "CE" },
  { label: "Pasaporte (PP)", value: "PP" }
]

// === CRUD ===
// Cargar administradores
const cargarAdministradores = async () => {
  loading.value = true
  try {
    const res = await getData("/researchers/list-admins")
    administradores.value = Array.isArray(res?.data) ? res.data : []
    console.log(administradores.value);
    
  } catch (err) {
    console.error("Error al cargar administradores:", err)
    error("No se pudieron cargar los administradores")
  } finally {
    loading.value = false
  }
}

const registrarAdministrador = async () => {
  loading.value = true
  try {
    await postData("/researchers/create", formData.value)
    await cargarAdministradores()
    info("Administrador registrado correctamente")
    closeDialog()
  } catch (err) {
    console.error("Error al registrar administrador:", err.response?.data || err.message)
    error(err.response?.data?.msg || "No se pudo registrar el administrador")
  } finally {
    loading.value = false
  }
}


// Actualizar administrador
const actualizarAdministrador = async () => {
  loading.value = true
  try {
    await putData(`/researchers/update/${editingAdministrador.value._id}`, formData.value)
    await cargarAdministradores()
    info("Administrador actualizado correctamente")
    closeDialog()
  } catch (err) {
    console.error("Error al actualizar administrador:", err)
    error("No se pudo actualizar el administrador")
  } finally {
    loading.value = false
  }
}

// Activar / Desactivar administrador
const handleToggleStatus = async (admin) => {
  loading.value = true
  try {
    const nuevoEstado = admin.status ? 0 : 1
    await putData(`/researchers/update/${admin._id}`, { ...admin, status: nuevoEstado })
    await cargarAdministradores()
    info(`Administrador ${nuevoEstado ? "desactivado" : "activado"} correctamente`)
  } catch {
    error("No se pudo cambiar el estado del administrador")
  } finally {
    loading.value = false
  }
}

// === FILTRO AUTOMÁTICO ===
const filtradatos= computed(()=>{
   if (!busqueda.value.toLowerCase()) {
        return administradores.value;
      }
  return  administradores.value.filter(item =>{
    return(
    item.name.toLowerCase().includes(busqueda.value.toLowerCase())||
    item.email.toLowerCase().includes(busqueda.value.toLowerCase())||
    item.phone.toLowerCase().includes(busqueda.value.toLowerCase())||
    item.document_number.toLowerCase().includes(busqueda.value.toLowerCase())
  )
  })
})

// === ACCIONES ===

// Ver perfil
const handleViewPerfil = (a) => {
  selectedAdministrador.value = a
  showProfileDialog.value = true
}

// Editar administrador
const handleEditAdministrador = (a) => {
  isEditMode.value = true
  editingAdministrador.value = a
  formData.value = { ...a }
  showAddDialog.value = true
}

// Cerrar modal
const closeDialog = () => {
  showAddDialog.value = false
  isEditMode.value = false
  editingAdministrador.value = null
}

// Enviar formulario (decide entre crear o actualizar)
const onSubmitAdministrador = () =>
  isEditMode.value ? actualizarAdministrador() : registrarAdministrador()


// === COLUMNAS ===
const columns = [
  { name: "name", label: "Nombre", field: "name", align: "left" },
  {
    name: "id_training_center",
    label: "Centro de Formación",
    field: "id_training_center",
    align: "center",
    format: val => val?.name || "Sin centro"
  },
  { name: "email", label: "Email", field: "email", align: "center" },
  { name: "phone", label: "Celular", field: "phone", align: "center" },
  { name: "status", label: "Estado"},
  { name: "options", label: "Opciones", field: "options", align: "center" },

]

onMounted(cargarAdministradores)
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
