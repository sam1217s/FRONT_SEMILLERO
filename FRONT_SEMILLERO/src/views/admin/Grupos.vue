<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="shadow-1">
          <!-- HEADER -->
          <q-card-section>
            <div class="page-title">
              <q-icon name="group_add" class="q-mr-sm" />
              Grupos de Investigación
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Crear y gestionar grupos de investigación
            </div>
          </q-card-section>

          <!-- TABLA -->
          <q-card-section>
            <!-- FILTRO -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-6">
                <q-input v-model="busqueda" filled clearable label="Buscar grupos"
                  placeholder="Buscar por nombre, categoría o centro..." @clear="busqueda = ''">
                  <template #prepend><q-icon name="search" /></template>
                </q-input>
              </div>
            </div>

            <!-- LOADING -->
            <div v-if="loading" class="text-center q-pa-xl">
              <q-spinner-dots size="50px" color="primary" />
              <div class="text-h6 text-grey-6 q-mt-md">Cargando grupos...</div>
            </div>

            <!-- TABLA PRINCIPAL -->
            <Table v-else :rows="filtradatos" :columns="columns" title="GRUPOS DE INVESTIGACIÓN"
              add-button-label="AGREGAR GRUPO" @add-item="showAddDialog = true">
              <template #options-column="{ row }">
                <ActionButtons :row="row" :show-view="true" :show-edit="true" :show-toggle-status="true"
                  view-tooltip="Ver detalle" edit-tooltip="Editar grupo" activate-tooltip="Activar"
                  deactivate-tooltip="Desactivar" @view="handleViewDetalle(row)" @edit="handleEditGrupo(row)"
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
                <q-icon name="visibility" class="q-mr-sm" /> Detalle del Grupo
              </div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section v-if="selectedGrupo">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <div class="text-h6 text-primary q-mb-md">Información Básica</div>
                  <div class="info-item"><strong>Nombre:</strong> {{ selectedGrupo.name }}</div>
                  <div class="info-item"><strong>Categoría:</strong> {{ selectedGrupo.category }}</div>
                  <div class="info-item"><strong>Registro MinCiencias:</strong> {{ selectedGrupo.minciencias_registration || 'No especificado' }}</div>
                  <div class="info-item">
                    <strong>Estado:</strong>
                    <q-badge :color="selectedGrupo.status === 'Active' ? 'positive' : 'grey'"
                      :label="selectedGrupo.status === 'Active' ? 'Activo' : 'Inactivo'" />
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="text-h6 text-primary q-mb-md">Centro</div>
                  <div class="info-item"><strong>Centro:</strong> {{ selectedGrupo.id_center?.name || 'Sin centro' }}</div>
                  <div class="info-item"><strong>Ciudad:</strong> {{ selectedGrupo.id_center?.city || 'No especificada' }}</div>
                  <div class="info-item"><strong>Departamento:</strong> {{ selectedGrupo.id_center?.department || 'No especificado' }}</div>
                </div>

                <div class="col-12">
                  <div class="text-h6 text-primary q-mb-md">Descripción</div>
                  <div class="info-item">{{ selectedGrupo.description || 'Sin descripción' }}</div>
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
                {{ isEditMode ? "Editar Grupo de Investigación" : "Registrar Grupo de Investigación" }}
              </div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input v-model="formData.name" filled label="Nombre del grupo" />
                  <q-input v-model="formData.minciencias_registration" filled label="Registro MinCiencias" class="q-mt-md" />
                  <q-select v-model="formData.category" filled label="Categoría" :options="categoriaOptions" class="q-mt-md" />
                  <q-select v-model="formData.id_center" filled label="Centro de investigación" :options="centros" option-label="name" option-value="_id" emit-value map-options class="q-mt-md" />
                </div>

                <div class="col-12 col-md-6">
                  <q-input v-model="formData.description" filled label="Descripción" type="textarea" rows="9" />
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="grey" @click="closeDialog" />
              <q-btn :label="isEditMode ? 'Actualizar' : 'Registrar'" color="primary" @click="onSubmitGrupo" />
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
const grupos = ref([])
const centros = ref([])
const busqueda = ref("")
const showAddDialog = ref(false)
const showDetailDialog = ref(false)
const isEditMode = ref(false)
const selectedGrupo = ref(null)
const editingGrupo = ref(null)

const formData = ref({
  name: "",
  description: "",
  category: "",
  minciencias_registration: "",
  id_center: null,
})

const categoriaOptions = [
  { label: "A1 - Reconocido Internacionalmente", value: "A1" },
  { label: "A - Reconocido Nacionalmente", value: "A" },
  { label: "B - Reconocido Regionalmente", value: "B" },
  { label: "C - En Formación", value: "C" }
]

// === CRUD ===
// Cargar grupos
const cargarGrupos = async () => {
  try {
    loading.value = true
    const res = await getData("/research-groups/list")
    grupos.value = Array.isArray(res?.msg) ? res.msg : []
  } catch (err) {
    console.error("Error al cargar grupos:", err)
    error("No se pudieron cargar los grupos")
  } finally {
    loading.value = false
  }
}

// Cargar centros
const cargarCentros = async () => {
  try {
    const res = await getData("/research-centers/list")
    centros.value = Array.isArray(res?.msg) ? res.msg : []
  } catch (err) {
    console.error("Error al cargar centros:", err)
  }
}

// Registrar grupo
const registrarGrupo = async () => {
  try {
    await postData("/research-groups/create", formData.value)
    await cargarGrupos()
    info("Grupo registrado correctamente")
    closeDialog()
  } catch (err) {
    console.error("Error al registrar grupo:", err)
    error("No se pudo registrar el grupo")
  }
}

// Actualizar grupo
const actualizarGrupo = async () => {
  try {
    await putData(`/research-groups/update/${editingGrupo.value._id}`, formData.value)
    await cargarGrupos()
    info("Grupo actualizado correctamente")
    closeDialog()
  } catch (err) {
    console.error("Error al actualizar grupo:", err)
    error("No se pudo actualizar el grupo")
  }
}

// Activar / Desactivar grupo
const handleToggleStatus = async (grupo) => {
  try {
    const endpoint = grupo.status === 'Active' ? 'inactivate' : 'activate'
    await putData(`/research-groups/${endpoint}/${grupo._id}`)
    await cargarGrupos()
    info(`Grupo ${endpoint === 'activate' ? 'activado' : 'desactivado'} correctamente`)
  } catch {
    error("No se pudo cambiar el estado del grupo")
  }
}

// === FILTRO AUTOMÁTICO ===
const filtradatos = computed(() => {
  if (!busqueda.value.toLowerCase()) {
    return grupos.value
  }
  return grupos.value.filter(item => {
    return (
      item.name.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(busqueda.value.toLowerCase())) ||
      (item.minciencias_registration && item.minciencias_registration.toLowerCase().includes(busqueda.value.toLowerCase())) ||
      (item.id_center?.name && item.id_center.name.toLowerCase().includes(busqueda.value.toLowerCase()))
    )
  })
})

// === ACCIONES ===
const handleViewDetalle = (g) => {
  selectedGrupo.value = g
  showDetailDialog.value = true
}

// Editar grupo
const handleEditGrupo = (g) => {
  isEditMode.value = true
  editingGrupo.value = g
  formData.value = {
    name: g.name || "",
    description: g.description || "",
    category: g.category || "",
    minciencias_registration: g.minciencias_registration || "",
    id_center: g.id_center?._id || null,
  }
  showAddDialog.value = true
}

// Cerrar modal
const closeDialog = () => {
  showAddDialog.value = false
  isEditMode.value = false
  editingGrupo.value = null
  formData.value = {
    name: "",
    description: "",
    category: "",
    minciencias_registration: "",
    id_center: null,
  }
}

// Enviar formulario
const onSubmitGrupo = () =>
  isEditMode.value ? actualizarGrupo() : registrarGrupo()

// === COLUMNAS ===
const columns = [
  { name: "name", label: "Nombre", field: "name", align: "left" },
  {
    name: "id_center",
    label: "Centro",
    field: "id_center",
    align: "center",
    format: val => val?.name || "Sin centro"
  },
  { name: "category", label: "Categoría", field: "category", align: "center" },
  { name: "status", label: "Estado", field: "status", align: "center", format: val => val === "Active" ? "Activo" : "Inactivo" },
  { name: "options", label: "Opciones", field: "options", align: "center" },
]

onMounted(() => {
  cargarGrupos()
  cargarCentros()
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
