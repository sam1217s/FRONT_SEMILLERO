<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="shadow-1">
          <!-- HEADER -->
          <q-card-section>
            <div class="page-title">
              <q-icon name="science" class="q-mr-sm" />
              Proyectos
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Administra proyectos de investigación
            </div>
          </q-card-section>

          <!-- TABLA -->
          <q-card-section>
            <!-- FILTRO -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-6">
                <q-input v-model="busqueda" filled clearable label="Buscar proyectos"
                  placeholder="Buscar por nombre o código..." @clear="busqueda = ''">
                  <template #prepend><q-icon name="search" /></template>
                </q-input>
              </div>
              <div class="col-12 col-md-3">
                <q-select v-model="filtroEstado" filled clearable label="Estado"
                  :options="estadoOptions" option-label="label" option-value="value" emit-value map-options />
              </div>
            </div>

            <!-- LOADING -->
            <div v-if="loading" class="text-center q-pa-xl">
              <q-spinner-dots size="50px" color="primary" />
              <div class="text-h6 text-grey-6 q-mt-md">Cargando proyectos...</div>
            </div>

            <!-- TABLA PRINCIPAL -->
            <Table v-else :rows="filtradatos" :columns="columns" title="PROYECTOS"
              add-button-label="AGREGAR PROYECTO" @add-item="showAddDialog = true">
              <template #options-column="{ row }">
                <ActionButtons :row="row" :show-view="true" :show-edit="true" :show-toggle-status="true"
                  view-tooltip="Ver detalle" edit-tooltip="Editar proyecto" activate-tooltip="Activar"
                  deactivate-tooltip="Desactivar" @view="handleViewDetalle(row)" @edit="handleEditProyecto(row)"
                  @toggle-status="handleToggleStatus(row)" />
              </template>
            </Table>
          </q-card-section>
        </q-card>

        <!-- PERFIL -->
        <q-dialog v-model="showDetailDialog">
          <q-card style="min-width: 800px; max-width: 1000px">
            <q-card-section class="modal-header">
              <div class="text-h6">
                <q-icon name="visibility" class="q-mr-sm" /> Detalle del Proyecto
              </div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section v-if="selectedProyecto">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <div class="text-h6 text-primary q-mb-md">Información Básica</div>
                  <div class="info-item"><strong>Nombre:</strong> {{ selectedProyecto.project_name }}</div>
                  <div class="info-item"><strong>Código:</strong> {{ selectedProyecto.code || 'Sin código' }}</div>
                  <div class="info-item">
                    <strong>Estado:</strong>
                    <q-badge :color="selectedProyecto.status === 'Active' ? 'positive' : 'grey'"
                      :label="selectedProyecto.status === 'Active' ? 'Activo' : 'Inactivo'" />
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="text-h6 text-primary q-mb-md">Fechas</div>
                  <div class="info-item"><strong>Inicio:</strong> {{ formatDate(selectedProyecto.start_date) }}</div>
                  <div class="info-item"><strong>Fin:</strong> {{ formatDate(selectedProyecto.end_date) }}</div>
                  <div class="info-item"><strong>Investigadores:</strong> {{ selectedProyecto.num_researchers || 0 }}</div>
                </div>

                <div class="col-12">
                  <div class="text-h6 text-primary q-mb-md">Descripción</div>
                  <div class="info-item">{{ selectedProyecto.description || 'Sin descripción' }}</div>
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
                {{ isEditMode ? "Editar Proyecto" : "Registrar Proyecto" }}
              </div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input v-model="formData.project_name" filled label="Nombre del proyecto" />
                  <q-input v-model="formData.code" filled label="Código" class="q-mt-md" />
                  <q-input v-model="formData.start_date" filled label="Fecha de inicio" type="date" class="q-mt-md" />
                  <q-input v-model="formData.end_date" filled label="Fecha de fin" type="date" class="q-mt-md" />
                </div>

                <div class="col-12 col-md-6">
                  <q-input v-model="formData.description" filled label="Descripción" type="textarea" rows="9" />
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="grey" @click="closeDialog" />
              <q-btn :label="isEditMode ? 'Actualizar' : 'Registrar'" color="primary" @click="onSubmitProyecto" />
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
const proyectos = ref([])
const busqueda = ref("")
const filtroEstado = ref(null)
const showAddDialog = ref(false)
const showDetailDialog = ref(false)
const isEditMode = ref(false)
const selectedProyecto = ref(null)
const editingProyecto = ref(null)

const formData = ref({
  project_name: "",
  code: "",
  description: "",
  start_date: "",
  end_date: "",
})

const estadoOptions = [
  { label: "Activo", value: "Active" },
  { label: "Inactivo", value: "Inactive" }
]

// === FILTRO AUTOMÁTICO ===
const filtradatos = computed(() => {
  let filtrados = [...proyectos.value]

  // Filtro por estado
  if (filtroEstado.value) {
    filtrados = filtrados.filter(p => p.status === filtroEstado.value)
  }

  // Filtro por búsqueda de texto
  const term = busqueda.value?.toLowerCase().trim()
  if (term) {
    const campos = ["project_name", "code", "description"]
    filtrados = filtrados.filter(p =>
      campos.some(campo => {
        const valor = p[campo]?.toString().toLowerCase()
        return valor?.includes(term)
      })
    )
  }

  return filtrados.map(p => ({
    ...p,
    estado: p.status === "Active" ? "Activo" : "Inactivo",
    options: "options"
  }))
})

// === CRUD ===
// Cargar proyectos
const cargarProyectos = async () => {
  try {
    loading.value = true
    const res = await getData("/projects/list")
    proyectos.value = Array.isArray(res?.msg) ? res.msg : []
  } catch (err) {
    console.error("Error al cargar proyectos:", err)
    error("No se pudieron cargar los proyectos")
  } finally {
    loading.value = false
  }
}

// Registrar proyecto
const registrarProyecto = async () => {
  try {
    const payload = {
      project_name: formData.value.project_name,
      code: formData.value.code || undefined,
      description: formData.value.description || undefined,
      start_date: formData.value.start_date ? new Date(formData.value.start_date).toISOString() : undefined,
      end_date: formData.value.end_date ? new Date(formData.value.end_date).toISOString() : undefined,
    }
    await postData("/projects/create", payload)
    await cargarProyectos()
    info("Proyecto registrado correctamente")
    closeDialog()
  } catch (err) {
    console.error("Error al registrar proyecto:", err)
    error("No se pudo registrar el proyecto")
  }
}

// Actualizar proyecto
const actualizarProyecto = async () => {
  try {
    const payload = {
      project_name: formData.value.project_name,
      code: formData.value.code || undefined,
      description: formData.value.description || undefined,
      start_date: formData.value.start_date ? new Date(formData.value.start_date).toISOString() : undefined,
      end_date: formData.value.end_date ? new Date(formData.value.end_date).toISOString() : undefined,
    }
    await putData(`/projects/update/${editingProyecto.value._id}`, payload)
    await cargarProyectos()
    info("Proyecto actualizado correctamente")
    closeDialog()
  } catch (err) {
    console.error("Error al actualizar proyecto:", err)
    error("No se pudo actualizar el proyecto")
  }
}

// Activar / Desactivar proyecto
const handleToggleStatus = async (proyecto) => {
  try {
    const endpoint = proyecto.status === 'Active' ? 'inactivate' : 'activate'
    await putData(`/projects/${endpoint}/${proyecto._id}`)
    await cargarProyectos()
    info(`Proyecto ${endpoint === 'activate' ? 'activado' : 'desactivado'} correctamente`)
  } catch {
    error("No se pudo cambiar el estado del proyecto")
  }
}

// === ACCIONES ===
// Ver perfil
const handleViewDetalle = (p) => {
  selectedProyecto.value = p
  showDetailDialog.value = true
}

// Editar proyecto
const handleEditProyecto = (p) => {
  isEditMode.value = true
  editingProyecto.value = p
  formData.value = {
    project_name: p.project_name || "",
    code: p.code || "",
    description: p.description || "",
    start_date: p.start_date ? new Date(p.start_date).toISOString().slice(0, 10) : "",
    end_date: p.end_date ? new Date(p.end_date).toISOString().slice(0, 10) : "",
  }
  showAddDialog.value = true
}

// Cerrar modal
const closeDialog = () => {
  showAddDialog.value = false
  isEditMode.value = false
  editingProyecto.value = null
  formData.value = {
    project_name: "",
    code: "",
    description: "",
    start_date: "",
    end_date: "",
  }
}

// Enviar formulario
const onSubmitProyecto = () =>
  isEditMode.value ? actualizarProyecto() : registrarProyecto()

// === COLUMNAS ===
const columns = [
  { name: "project_name", label: "Nombre", field: "project_name", align: "left" },
  { name: "code", label: "Código", field: "code", align: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "start_date", label: "Fecha Inicio", field: "start_date", align: "center", format: val => formatDate(val) },
  { name: "options", label: "Opciones", field: "options", align: "center" },
]

// === HELPERS ===
function formatDate(d) {
  if (!d) return "-"
  const date = new Date(d)
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("es-CO")
}

onMounted(() => {
  cargarProyectos()
})
</script>

<!-- Los estilos globales están definidos en src/app.scss -->
