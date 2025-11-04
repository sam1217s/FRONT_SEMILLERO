<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="shadow-1">
          <!-- HEADER -->
          <q-card-section>
            <div class="page-title">
              <q-icon name="groups" class="q-mr-sm" />
              Semilleros
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Crear y gestionar semilleros de investigación
            </div>
          </q-card-section>

          <!-- TABLA -->
          <q-card-section>
            <!-- LOADING -->
            <div v-if="loading" class="text-center q-pa-xl">
              <q-spinner-dots size="50px" color="primary" />
              <div class="text-h6 text-grey-6 q-mt-md">
                Cargando semilleros...
              </div>
            </div>

            <!-- TABLA PRINCIPAL -->
            <Table
              v-else
              :rows="filtradatos"
              :columns="tableColumns"
              title="SEMILLEROS"
              add-button-label="AGREGAR SEMILLERO"
              @add-item="openCreate"
            >
              <!-- 🔹 SLOT DE FILTROS -->
              <template #filters>
                <div class="row q-col-gutter-md items-center">
                  <!-- BUSCADOR -->
                  <div class="col-12 col-md-4">
                    <q-input
                      v-model="busqueda"
                      outlined
                      dense
                      debounce="300"
                      placeholder="Buscar por nombre..."
                    >
                      <template #prepend>
                        <q-icon name="search" color="grey-7" />
                      </template>
                    </q-input>
                  </div>

                  <!-- FILTRO ESTADO -->
                  <div class="col-12 col-md-3">
                    <q-select
                      v-model="filtroEstado"
                      :options="estadoOptions"
                      option-label="label"
                      option-value="value"
                      emit-value
                      map-options
                      outlined
                      dense
                      clearable
                      label="Filtrar por Estado"
                    >
                      <template #prepend>
                        <q-icon name="toggle_on" color="primary" />
                      </template>
                    </q-select>
                  </div>

                  <!-- FILTRO GRUPO -->
                  <div class="col-12 col-md-3">
                    <q-select
                      v-model="filtroGrupo"
                      :options="grupoOptions"
                      option-label="label"
                      option-value="value"
                      emit-value
                      map-options
                      outlined
                      dense
                      clearable
                      label="Filtrar por Grupo"
                    >
                      <template #prepend>
                        <q-icon name="science" color="purple" />
                      </template>
                    </q-select>
                  </div>

                  <!-- FILTRO LÍDER -->
                  <div class="col-12 col-md-2">
                    <q-select
                      v-model="filtroLider"
                      :options="liderOptions"
                      option-label="label"
                      option-value="value"
                      emit-value
                      map-options
                      outlined
                      dense
                      clearable
                      label="Filtrar por Líder"
                    >
                      <template #prepend>
                        <q-icon name="person" color="teal" />
                      </template>
                    </q-select>
                  </div>
                </div>
              </template>
              <!-- 🔹 SLOT DE OPCIONES POR FILA -->
              <template #options-column="{ row }">
                <ActionButtons
                  :row="row"
                  :show-view="true"
                  :show-edit="true"
                  :show-toggle-status="true"
                  view-tooltip="Ver detalle"
                  edit-tooltip="Editar semillero"
                  activate-tooltip="Activar"
                  deactivate-tooltip="Desactivar"
                  @view="openDetail(row)"
                  @edit="handleEditSemillero(row)"
                  @toggle-status="handleToggleStatus(row)"
                />
              </template>
            </Table>
          </q-card-section>
        </q-card>

        <!-- PERFIL DE SEMILLERO -->
        <q-dialog v-model="showDetailDialog">
          <q-card style="min-width: 800px; max-width: 1000px">
            <q-card-section class="modal-header">
              <div class="text-h6">
                <q-icon name="visibility" class="q-mr-sm" />
                Detalle del Semillero
              </div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section v-if="selectedSemillero">
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <div class="text-h6 text-primary q-mb-md">
                    {{ selectedSemillero.name }}
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="text-subtitle2 text-primary q-mb-sm">
                    Información General
                  </div>
                  <div class="info-item">
                    <strong>Grupo:</strong> {{ selectedSemillero.id_group?.name || "-" }}
                  </div>
                  <div class="info-item">
                    <strong>Líder:</strong> {{ selectedSemillero.id_leader?.name || "-" }}
                  </div>
                  <div class="info-item">
                    <strong>Estado:</strong>
                    <q-chip
                      :color="selectedSemillero.status === 'Active' ? 'positive' : 'negative'"
                      text-color="white"
                      outline
                      :label="selectedSemillero.status === 'Active' ? 'Activo' : 'Inactivo'"
                    />
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="text-subtitle2 text-primary q-mb-sm">
                    Detalles Académicos
                  </div>
                  <div class="info-item">
                    <strong>Fecha de creación:</strong>
                    {{ formatDate(selectedSemillero.seedbed_creation_date) }}
                  </div>
                  <div class="info-item">
                    <strong>Líneas de investigación:</strong>
                    {{ selectedSemillero.research_lines || "-" }}
                  </div>
                  <div class="info-item">
                    <strong>Áreas temáticas:</strong>
                    {{ selectedSemillero.thematic_areas || "-" }}
                  </div>
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

        <!-- MODAL CREAR/EDITAR -->
        <q-dialog v-model="showAddDialog">
          <q-card style="min-width: 800px; max-width: 900px">
            <q-card-section class="modal-header">
              <div class="text-h6">
                {{ isEditMode ? "Editar Semillero" : "Nuevo Semillero" }}
              </div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input v-model="formData.name" filled label="Nombre del semillero" />
                  <q-select
                    v-model="formData.id_group"
                    :options="grupoOptions"
                    option-label="label"
                    option-value="value"
                    emit-value
                    map-options
                    filled
                    label="Grupo de investigación"
                    class="q-mt-md"
                  />
                  <q-select
                    v-model="formData.id_leader"
                    :options="liderOptions"
                    option-label="label"
                    option-value="value"
                    emit-value
                    map-options
                    filled
                    label="Líder del semillero"
                    class="q-mt-md"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-input
                    v-model="formData.research_lines"
                    filled
                    label="Líneas de investigación"
                  />
                  <q-input
                    v-model="formData.thematic_areas"
                    filled
                    label="Áreas temáticas"
                    class="q-mt-md"
                  />
                  <q-input
                    v-model="formData.technology_network"
                    filled
                    label="Red tecnológica"
                    class="q-mt-md"
                  />
                </div>

                <div class="col-12">
                  <q-input
                    v-model="formData.description"
                    filled
                    type="textarea"
                    label="Descripción"
                    rows="3"
                  />
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="grey" @click="closeDialog" />
              <q-btn
                :label="isEditMode ? 'Actualizar' : 'Registrar'"
                color="primary"
                glossy
                @click="onSubmitSemillero"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getData, postData, putData } from "../../services/apiClient";
import { useNotifications } from "../../composables/useNotifications";
import Table from "../../components/Table.vue";
import ActionButtons from "../../components/ActionButtons.vue";

const { error, info } = useNotifications();

const loading = ref(false);
const semilleros = ref([]);
const busqueda = ref("");
const filtroEstado = ref(null);
const filtroGrupo = ref(null);
const filtroLider = ref(null);
const showAddDialog = ref(false);
const showDetailDialog = ref(false);
const isEditMode = ref(false);
const selectedSemillero = ref(null);
const editingSemillero = ref(null);

const grupoOptions = ref([]);
const liderOptions = ref([]);

const estadoOptions = [
  { label: "Activo", value: "Active" },
  { label: "Inactivo", value: "Inactive" },
];

// === FILTRADO ===
const filtradatos = computed(() => {
  let filtrados = [...semilleros.value];
  if (filtroEstado.value) filtrados = filtrados.filter(s => s.status === filtroEstado.value);
  if (filtroGrupo.value) filtrados = filtrados.filter(s => (s.id_group?._id || s.id_group) === filtroGrupo.value);
  if (filtroLider.value) filtrados = filtrados.filter(s => (s.id_leader?._id || s.id_leader) === filtroLider.value);
  const term = busqueda.value.toLowerCase().trim();
  if (term) filtrados = filtrados.filter(s => s.name?.toLowerCase().includes(term));
  return filtrados.map(s => ({ ...s, id: s._id, opciones: "opciones" }));
});

// === COLUMNAS ===
const tableColumns = [
  { name: "name", label: "Nombre del Semillero", field: "name", align: "left" },
  { name: "id_group", label: "Grupo de Investigación", field: "id_group", align: "center", format: val => val?.name || "-" },
  { name: "id_leader", label: "Líder", field: "id_leader", align: "center", format: val => val?.name || "-" },
  { name: "seedbed_creation_date", label: "Fecha de Creación", field: "seedbed_creation_date", align: "center", format: val => formatDate(val) },
  { name: "status", label: "Estado", field: "status", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
];

// === CRUD ===
const cargarSemilleros = async () => {
  loading.value = true;
  try {
    const res = await getData("/seedbeds/list");
    semilleros.value = Array.isArray(res) ? res : res?.msg || [];
  } catch (err) {
    console.error("Error al cargar semilleros:", err);
    error("No se pudieron cargar los semilleros");
  } finally {
    loading.value = false;
  }
};

const registrarSemillero = async () => {
  try {
    await postData("/seedbeds/create", formData.value);
    await cargarSemilleros();
    info("Semillero registrado correctamente");
    closeDialog();
  } catch (err) {
    console.error("Error al registrar semillero:", err);
    error("No se pudo registrar el semillero");
  }
};

const actualizarSemillero = async () => {
  try {
    await putData(`/seedbeds/update/${editingSemillero.value._id}`, formData.value);
    await cargarSemilleros();
    info("Semillero actualizado correctamente");
    closeDialog();
  } catch (err) {
    console.error("Error al actualizar semillero:", err);
    error("No se pudo actualizar el semillero");
  }
};

const handleToggleStatus = async semillero => {
  try {
    const newStatus = semillero.status === "Active" ? "Inactive" : "Active";
    await putData(`/seedbeds/${newStatus === "Active" ? "activate" : "inactivate"}/${semillero.id}`);
    await cargarSemilleros();
    info(`Semillero ${newStatus === "Active" ? "activado" : "desactivado"} correctamente`);
  } catch (err) {
    console.error("Error al cambiar estado:", err);
    error("No se pudo cambiar el estado del semillero");
  }
};

// === ACCIONES ===
const openCreate = () => {
  formData.value = { name: "", description: "", research_lines: "", thematic_areas: "", technology_network: "", id_group: "", id_leader: "", logo: "", seedbed_creation_date: "" };
  isEditMode.value = false;
  showAddDialog.value = true;
};

const openDetail = semillero => {
  selectedSemillero.value = semillero;
  showDetailDialog.value = true;
};

const handleEditSemillero = semillero => {
  editingSemillero.value = semillero;
  formData.value = { ...semillero, id_group: semillero.id_group?._id, id_leader: semillero.id_leader?._id };
  isEditMode.value = true;
  showAddDialog.value = true;
};

const openEditFromDetail = () => {
  showDetailDialog.value = false;
  handleEditSemillero(selectedSemillero.value);
};

const closeDialog = () => {
  showAddDialog.value = false;
  isEditMode.value = false;
};

const formatDate = date => (date ? new Date(date).toLocaleDateString("es-CO") : "-");

const formData = ref({
  name: "",
  description: "",
  research_lines: "",
  thematic_areas: "",
  technology_network: "",
  id_group: "",
  id_leader: "",
  logo: "",
  seedbed_creation_date: "",
});

onMounted(async () => {
  await cargarSemilleros();
  const resGrupos = await getData("/research-groups/list");
  grupoOptions.value = (resGrupos?.msg || []).map(g => ({ label: g.name, value: g._id }));
  const resLideres = await getData("/researchers/list");
  liderOptions.value = (resLideres?.msg || []).map(l => ({ label: l.name, value: l._id }));
});
</script>

<style lang="scss" scoped>
@import "../../variables.scss";
.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: $primary-color;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: $primary-color;
  color: white;
}
.text-primary {
  color: $primary-color !important;
}
.info-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}
</style>
