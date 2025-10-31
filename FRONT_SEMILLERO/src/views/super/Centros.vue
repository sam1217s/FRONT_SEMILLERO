<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="shadow-1">

          <!-- HEADER -->
          <q-card-section>
            <div class="page-title">
              <q-icon name="business" class="q-mr-sm" />
              Centros de Formación
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Crear y gestionar centros de formación
            </div>
          </q-card-section>

          <!-- TABLA -->
          <q-card-section>
            <!-- FILTRO -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-6">
                <q-input v-model="busqueda" filled clearable label="Buscar centros"
                  placeholder="Buscar por nombre, código o ciudad..." @update:model-value="aplicarFiltro"
                  @clear="limpiarFiltros">
                  <template #prepend><q-icon name="search" /></template>
                </q-input>
              </div>
            </div>

            <!-- LOADING -->
            <div v-if="loading" class="text-center q-pa-xl">
              <q-spinner-dots size="50px" color="primary" />
              <div class="text-h6 text-grey-6 q-mt-md">Cargando centros...</div>
            </div>

            <!-- TABLA PRINCIPAL -->
            <Table v-else :rows="centrosFiltrados" :columns="columns" title="CENTROS DE FORMACIÓN"
              add-button-label="AGREGAR CENTRO" @add-item="showAddDialog = true">
              <template #options-column="{ row }">
                <ActionButtons :row="row" :show-view="true" :show-edit="true" :show-toggle-status="true"
                  view-tooltip="Ver detalle" edit-tooltip="Editar centro" activate-tooltip="Activar centro"
                  deactivate-tooltip="Desactivar centro" @view="handleViewDetalle(row)" @edit="handleEditCentro(row)"
                  @toggle-status="handleToggleStatus(row)" />
              </template>
            </Table>
          </q-card-section>
        </q-card>

        <!-- DETALLE -->
        <q-dialog v-model="showDetailDialog">
          <q-card style="min-width: 800px; max-width: 1000px">
            <q-card-section class="modal-header">
              <div class="text-h6">
                <q-icon name="visibility" class="q-mr-sm" /> Detalle del Centro
              </div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section v-if="selectedCentro">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <div class="text-h6 text-primary q-mb-md">Información Básica</div>
                  <div class="info-item"><strong>Nombre:</strong> {{ selectedCentro.nombre }}</div>
                  <div class="info-item"><strong>Código:</strong> {{ selectedCentro.codigo }}</div>
                  <div class="info-item"><strong>Ciudad:</strong> {{ selectedCentro.ciudad }}</div>
                  <div class="info-item"><strong>Departamento:</strong> {{ selectedCentro.departamento }}</div>
                  <div class="info-item"><strong>Capacidad:</strong> {{ selectedCentro.capacidad }} estudiantes</div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="text-h6 text-primary q-mb-md">Información de Contacto</div>
                  <div class="info-item"><strong>Teléfono:</strong> {{ selectedCentro.telefono }}</div>
                  <div class="info-item"><strong>Email:</strong> {{ selectedCentro.email }}</div>
                  <div class="info-item"><strong>Dirección:</strong> {{ selectedCentro.direccion }}</div>
                </div>
              </div>

              <div class="q-mt-md">
                <div class="text-h6 text-primary q-mb-md">Descripción</div>
                <div class="info-item">
                  {{ selectedCentro.descripcion || "No hay descripción disponible" }}
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
                {{ isEditMode ? "Editar Centro" : "Registrar Centro" }}
              </div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input v-model="formData.nombre" filled label="Nombre del centro" />
                  <q-input v-model="formData.codigo" filled label="Código" class="q-mt-md" />
                  <q-input v-model="formData.ciudad" filled label="Ciudad" class="q-mt-md" />
                  <q-input v-model="formData.capacidad" type="number" filled label="Capacidad" class="q-mt-md" />
                </div>

                <div class="col-12 col-md-6">
                  <q-input v-model="formData.telefono" filled label="Teléfono" />
                  <q-input v-model="formData.email" filled label="Correo electrónico" class="q-mt-md" />
                  <q-input v-model="formData.direccion" filled label="Dirección" class="q-mt-md" />
                  <q-input v-model="formData.departamento" filled label="Departamento" class="q-mt-md" />
                </div>

                <div class="col-12 q-mt-md">
                  <q-input v-model="formData.descripcion" type="textarea" filled label="Descripción" rows="3" />
                  <q-checkbox v-model="formData.estado" :true-value="1" :false-value="0" color="primary"
                    label="Centro activo" class="q-mt-md" />
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="grey" @click="closeDialog" />
              <q-btn :label="isEditMode ? 'Actualizar' : 'Registrar'" color="primary" @click="onSubmitCentro" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue"
import Table from "../../components/table.vue"
import ActionButtons from "../../components/ActionButtons.vue"
import { getData, postData, putData } from "../../services/apiClient"
import { useNotifications } from "../../composables/useNotifications"

const { error, info } = useNotifications()

const loading = ref(false)
const centros = ref([])
const centrosFiltrados = ref([])
const busqueda = ref("")
const showAddDialog = ref(false)
const showDetailDialog = ref(false)
const isEditMode = ref(false)
const selectedCentro = ref(null)
const editingCentro = ref(null)

const formData = ref({
  nombre: "",
  codigo: "",
  ciudad: "",
  telefono: "",
  email: "",
  direccion: "",
  departamento: "",
  capacidad: "",
  descripcion: "",
  estado: 1
})

// === CRUD ===
const cargarCentros = async () => {
  try {
    loading.value = true
    const res = await getData("/training-centers/list")
    centros.value = Array.isArray(res?.data) ? res.data : []
  } catch (err) {
    console.error("Error al cargar centros:", err)
    error("No se pudieron cargar los centros de formación")
  } finally {
    loading.value = false
  }
}


const registrarCentro = async () => {
  try {
    await postData("/training-centers/create", formData.value)
    await cargarCentros()
    info("Centro registrado correctamente")
    closeDialog()
  } catch (err) {
    console.error("Error al registrar centro:", err)
    error("No se pudo registrar el centro")
  }
}

const actualizarCentro = async () => {
  try {
    await putData(`/training-centers/update/${editingCentro.value.id}`, formData.value)
    await cargarCentros()
    info("Centro actualizado correctamente")
    closeDialog()
  } catch (err) {
    console.error("Error al actualizar centro:", err)
    error("No se pudo actualizar el centro")
  }
}

const handleToggleStatus = async centro => {
  try {
    const endpoint =
      centro.estado === 1
        ? `/training-centers/inactivate/${centro.id}`
        : `/training-centers/activate/${centro.id}`
    await putData(endpoint)
    await cargarCentros()
    info(`Centro ${centro.estado === 1 ? "desactivado" : "activado"} correctamente`)
  } catch (err) {
    console.error("Error al cambiar estado:", err)
    error("No se pudo cambiar el estado del centro")
  }
}

// === ACCIONES ===
const handleViewDetalle = c => {
  selectedCentro.value = c
  showDetailDialog.value = true
}

const handleEditCentro = c => {
  isEditMode.value = true
  editingCentro.value = c
  formData.value = { ...c }
  showAddDialog.value = true
}

const closeDialog = () => {
  showAddDialog.value = false
  isEditMode.value = false
  editingCentro.value = null
  formData.value = {
    nombre: "",
    codigo: "",
    ciudad: "",
    telefono: "",
    email: "",
    direccion: "",
    departamento: "",
    capacidad: "",
    descripcion: "",
    estado: 1
  }
}

// === ENVÍO ===
const onSubmitCentro = () =>
  isEditMode.value ? actualizarCentro() : registrarCentro()

// === FILTROS ===
const aplicarFiltro = () => {
  const term = busqueda.value?.toLowerCase().trim() || ""
  centrosFiltrados.value = term
    ? centros.value.filter(c =>
      [c.nombre, c.codigo, c.ciudad].some(f =>
        f?.toLowerCase().includes(term)
      )
    )
    : centros.value
}

const limpiarFiltros = () => {
  busqueda.value = ""
  aplicarFiltro()
}

// === COLUMNAS ===
const columns = [
  { name: "nombre", label: "Nombre", field: "nombre", align: "left" },
  { name: "codigo", label: "Código", field: "codigo", align: "center" },
  { name: "ciudad", label: "Ciudad", field: "ciudad", align: "center" },
  { name: "capacidad", label: "Capacidad", field: "capacidad", align: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center", format: val => val === 1 ? "Activo" : "Inactivo" },
  { name: "options", label: "Opciones", field: "options", align: "center" }
]

onMounted(cargarCentros)
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

.info-item strong {
  color: #71277A;
}
</style>
