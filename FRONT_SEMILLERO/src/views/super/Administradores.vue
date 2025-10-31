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
            <!-- FILTROS -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="busqueda"
                  filled
                  clearable
                  label="Buscar administradores"
                  placeholder="Buscar por nombre, correo o teléfono..."
                  @update:model-value="aplicarFiltro"
                  @clear="limpiarFiltros"
                >
                  <template #prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </div>

            <!-- LOADING -->
            <div v-if="loading" class="text-center q-pa-xl">
              <q-spinner-dots size="50px" color="primary" />
              <div class="text-h6 text-grey-6 q-mt-md">
                Cargando administradores...
              </div>
            </div>

            <!-- TABLA PRINCIPAL -->
            <Table
              v-else
              :rows="administradoresFiltrados"
              :columns="columns"
              title="ADMINISTRADORES"
              add-button-label="AGREGAR ADMINISTRADOR"
              @add-item="handleAddAdministrador"
            >
              <!-- SLOT DE OPCIONES -->
              <template #options-column="{ row }">
                <ActionButtons
                  :row="row"
                  :show-view="true"
                  :show-edit="true"
                  :show-toggle-status="true"
                  view-tooltip="Ver perfil"
                  edit-tooltip="Editar administrador"
                  activate-tooltip="Activar"
                  deactivate-tooltip="Desactivar"
                  @view="handleViewPerfil"
                  @edit="handleEditAdministrador"
                  @toggle-status="handleToggleStatus"
                />
              </template>
            </Table>
          </q-card-section>
        </q-card>

        <!-- MODAL PERFIL -->
        <q-dialog v-model="showProfileDialog">
          <q-card style="min-width: 800px; max-width: 1000px">
            <q-card-section class="modal-header">
              <div class="text-h6">
                <q-icon name="visibility" class="q-mr-sm" />
                Perfil del Administrador
              </div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section v-if="selectedAdministrador">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <div class="text-h6 text-primary q-mb-md">Información Básica</div>
                  <div class="info-item">
                    <strong>Nombre:</strong> {{ selectedAdministrador.name }}
                  </div>
                  <div class="info-item">
                    <strong>Documento:</strong>
                    {{ selectedAdministrador.document_type }}
                    {{ selectedAdministrador.document_number }}
                  </div>
                  <div class="info-item"><strong>Rol:</strong> ADMIN</div>
                  <div class="info-item">
                    <strong>Estado:</strong>
                    <q-badge
                      :color="selectedAdministrador.status === 0 ? 'positive' : 'grey'"
                      :label="selectedAdministrador.status === 0 ? 'Activo' : 'Inactivo'"
                    />
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="text-h6 text-primary q-mb-md">Contacto</div>
                  <div class="info-item">
                    <strong>Celular:</strong> {{ selectedAdministrador.phone }}
                  </div>
                  <div class="info-item">
                    <strong>Email:</strong> {{ selectedAdministrador.email }}
                  </div>
                  <div class="info-item">
                    <strong>Área:</strong> {{ selectedAdministrador.knowledge_area }}
                  </div>
                  <div class="info-item">
                    <strong>Formación:</strong> {{ selectedAdministrador.academic_formation }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- MODAL CREAR/EDITAR -->
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
                  <q-input v-model="formData.document_number" filled label="Número de documento" class="q-mt-md" />
                  <q-input v-model="formData.phone" filled label="Teléfono" class="q-mt-md" />
                  <q-input v-model="formData.knowledge_area" filled label="Área de conocimiento" class="q-mt-md" />
                </div>
                <div class="col-12 col-md-6">
                  <q-select v-model="formData.document_type" filled label="Tipo de documento" :options="tipoDocumentoOptions" />
                  <q-input v-model="formData.email" filled label="Correo electrónico" class="q-mt-md" />
                  <q-input v-model="formData.academic_formation" filled label="Formación académica" class="q-mt-md" />
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
import Table from "../../components/table.vue";
import ActionButtons from "../../components/ActionButtons.vue";
import { ref, onMounted, watch } from "vue";
import { getData, postData, putData } from "../../services/apiClient";
import { useNotifications } from "../../composables/useNotifications";

const { error, info } = useNotifications(); // solo se usan error() e info()

const loading = ref(false);
const administradores = ref([]);
const administradoresFiltrados = ref([]);
const busqueda = ref("");
const showAddDialog = ref(false);
const showProfileDialog = ref(false);
const isEditMode = ref(false);
const selectedAdministrador = ref(null);
const editingAdministrador = ref(null);

const formData = ref({
  name: "",
  document_type: "",
  document_number: "",
  phone: "",
  email: "",
  academic_formation: "",
  knowledge_area: "",
  status: 0, // 0 = Activo, 1 = Inactivo
  roles: [{ role: "ADMIN", start_date: new Date(), active: true }],
});

const tipoDocumentoOptions = [
  { label: "Cédula de Ciudadanía (CC)", value: "CC" },
  { label: "Tarjeta de Identidad (TI)", value: "TI" },
  { label: "Cédula de Extranjería (CE)", value: "CE" },
  { label: "Pasaporte (PP)", value: "PP" },
];

// === CRUD ===
const cargarAdministradores = async () => {
  try {
    loading.value = true;
    const res = await getData("/researchers/list");

    // Normalizamos el status (0 = activo, 1 = inactivo)
    administradores.value = res.msg.map((a) => ({
      ...a,
      status: Number(a.status) === 0 ? 0 : 1,
    }));

    aplicarFiltro();
  } catch (e) {
    console.error(e);
    error("Error al cargar administradores");
  } finally {
    loading.value = false;
  }
};

const handleRegistrarAdministrador = async () => {
  try {
    await postData("/researchers/create", formData.value);
    await cargarAdministradores();
    info("Administrador registrado correctamente");
    closeDialog();
  } catch (e) {
    console.error(e);
    error("Error al registrar administrador");
  }
};

const handleActualizarAdministrador = async () => {
  try {
    await putData(`/researchers/update/${editingAdministrador.value._id}`, formData.value);
    await cargarAdministradores();
    info("Administrador actualizado correctamente");
    closeDialog();
  } catch (e) {
    console.error(e);
    error("Error al actualizar administrador");
  }
};

// Cambiar estado 0 ↔ 1
const handleToggleStatus = async (a) => {
  try {
    const nuevoEstado = a.status === 0 ? 1 : 0;
    await putData(`/researchers/update/${a._id}`, { ...a, status: nuevoEstado });
    await cargarAdministradores();
    info(`Administrador ${nuevoEstado === 0 ? "activado" : "desactivado"} correctamente`);
  } catch (e) {
    console.error(e);
    error("Error al cambiar estado del administrador");
  }
};

// === FILTROS ===
const aplicarFiltro = () => {
  const t = busqueda.value.toLowerCase();
  administradoresFiltrados.value = administradores.value.filter((a) =>
    [a.name, a.email, a.phone, a.document_number].some((f) =>
      f?.toLowerCase().includes(t)
    )
  );
};
const limpiarFiltros = () => {
  busqueda.value = "";
  aplicarFiltro();
};
watch(busqueda, aplicarFiltro);

// === ACCIONES ===
const handleAddAdministrador = () => (showAddDialog.value = true);
const handleViewPerfil = (a) => {
  selectedAdministrador.value = a;
  showProfileDialog.value = true;
};
const handleEditAdministrador = (a) => {
  isEditMode.value = true;
  editingAdministrador.value = a;
  formData.value = { ...a };
  showAddDialog.value = true;
};
const closeDialog = () => {
  showAddDialog.value = false;
  isEditMode.value = false;
  editingAdministrador.value = null;
};
const onSubmitAdministrador = () =>
  isEditMode.value ? handleActualizarAdministrador() : handleRegistrarAdministrador();

// === COLUMNAS ===
const columns = [
  { name: "name", label: "Nombre", field: "name", align: "left" },
  { name: "email", label: "Email", field: "email", align: "center" },
  { name: "phone", label: "Celular", field: "phone", align: "center" },
  {
    name: "status",
    label: "Estado",
    field: "status",
    align: "center",
    format: (val) => (val === 0 ? "Activo" : "Inactivo"),
  },
  { name: "options", label: "Opciones", field: "options", align: "center" },
];

onMounted(cargarAdministradores);
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
