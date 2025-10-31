<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="shadow-1">

          <!-- ENCABEZADO -->
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
            <!-- FILTROS -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="busqueda"
                  filled
                  clearable
                  label="Buscar centros"
                  placeholder="Buscar por nombre, código o ciudad..."
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
                Cargando centros...
              </div>
            </div>

            <!-- TABLA PRINCIPAL -->
            <Table
              v-else
              :rows="centrosFiltrados"
              :columns="columns"
              title="CENTROS DE FORMACIÓN"
              add-button-label="AGREGAR CENTRO"
              @add-item="handleAddCentro"
            >
              <template #options-column="{ row }">
                <ActionButtons
                  :row="row"
                  :show-view="true"
                  :show-edit="true"
                  :show-toggle-status="true"
                  view-tooltip="Ver detalle"
                  edit-tooltip="Editar centro"
                  activate-tooltip="Activar centro"
                  deactivate-tooltip="Desactivar centro"
                  @view="handleViewDetalle"
                  @edit="handleEditCentro"
                  @toggle-status="handleToggleStatus"
                />
              </template>
            </Table>
          </q-card-section>
        </q-card>

        <!-- MODAL DETALLE -->
        <q-dialog v-model="showDetailDialog">
          <q-card style="min-width: 800px; max-width: 1000px">
            <q-card-section class="modal-header">
              <div class="text-h6">
                <q-icon name="visibility" class="q-mr-sm" />
                Detalle del Centro
              </div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section v-if="selectedCentro">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <div class="text-h6 text-primary q-mb-md">
                    Información Básica
                  </div>
                  <div
                    v-for="(info, index) in infoBasica"
                    :key="index"
                    class="info-item"
                  >
                    <strong>{{ info.label }}:</strong> {{ info.value }}
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="text-h6 text-primary q-mb-md">
                    Información de Contacto
                  </div>
                  <div
                    v-for="(info, index) in infoContacto"
                    :key="index"
                    class="info-item"
                  >
                    <strong>{{ info.label }}:</strong> {{ info.value }}
                  </div>
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

        <!-- MODAL CREAR / EDITAR -->
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
                  <q-input v-model="formData.nombre" filled label="Nombre" />
                  <q-input v-model="formData.codigo" filled label="Código" class="q-mt-md" />
                  <q-input v-model="formData.ciudad" filled label="Ciudad" class="q-mt-md" />
                  <q-input v-model="formData.capacidad" type="number" filled label="Capacidad" class="q-mt-md" />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="formData.telefono" filled label="Teléfono" />
                  <q-input v-model="formData.email" filled label="Email" class="q-mt-md" />
                  <q-input v-model="formData.direccion" filled label="Dirección" class="q-mt-md" />
                  <q-input v-model="formData.departamento" filled label="Departamento" class="q-mt-md" />
                </div>
              </div>

              <div class="q-mt-md">
                <q-input v-model="formData.descripcion" type="textarea" filled label="Descripción" rows="3" />
              </div>

              <div class="q-mt-md">
                <q-checkbox
                  v-model="formData.estado"
                  :true-value="1"
                  :false-value="0"
                  color="primary"
                  label="Centro activo"
                />
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
import Table from "../../components/table.vue";
import ActionButtons from "../../components/ActionButtons.vue";
import { ref, onMounted, watch, computed } from "vue";
import { getData, postData, putData } from "../../services/apiClient";
import { useNotifications } from "../../composables/useNotifications";

const { error, info } = useNotifications();

const loading = ref(false);
const centros = ref([]);
const centrosFiltrados = ref([]);
const busqueda = ref("");
const showAddDialog = ref(false);
const showDetailDialog = ref(false);
const isEditMode = ref(false);
const selectedCentro = ref(null);
const editingCentro = ref(null);

// FORMULARIO
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
  estado: 1,
});

// COLUMNAS
const columns = [
  { name: "nombre", label: "Nombre", field: "nombre", align: "left" },
  { name: "codigo", label: "Código", field: "codigo", align: "center" },
  { name: "ciudad", label: "Ciudad", field: "ciudad", align: "center" },
  { name: "capacidad", label: "Capacidad", field: "capacidad", align: "center" },
  {
    name: "estado",
    label: "Estado",
    field: "estado",
    align: "center",
    format: (val) => (val === 1 ? "Activo" : "Inactivo"),
  },
  { name: "options", label: "Opciones", field: "options", align: "center" },
];

// CRUD
const cargarCentros = async () => {
  try {
    loading.value = true;
    const res = await getData("/training-centers/list");
    centros.value = res.msg.map((c) => ({
      id: c._id,
      nombre: c.name,
      codigo: c.code,
      ciudad: c.city,
      capacidad: c.student_capacity,
      estado: Number(c.status) === 1 ? 1 : 0,
      telefono: c.phone,
      email: c.email,
      direccion: c.address,
      departamento: c.department,
      descripcion: c.description,
    }));
    aplicarFiltro();
  } catch {
    error("Error al cargar centros de formación");
  } finally {
    loading.value = false;
  }
};

const handleAddCentro = () => (showAddDialog.value = true);
const handleViewDetalle = (c) => {
  selectedCentro.value = c;
  showDetailDialog.value = true;
};
const handleEditCentro = (c) => {
  isEditMode.value = true;
  editingCentro.value = c;
  formData.value = { ...c };
  showAddDialog.value = true;
};

// Activar / Desactivar Centro
const handleToggleStatus = async (c) => {
  try {
    const endpoint = c.estado === 1
      ? `/training-centers/inactivate/${c.id}`
      : `/training-centers/activate/${c.id}`;

    await putData(endpoint);
    info(`Centro ${c.estado === 1 ? "desactivado" : "activado"} correctamente`);
    await cargarCentros();
  } catch {
    error("No se pudo cambiar el estado del centro");
  }
};


// Guardar
const onSubmitCentro = async () => {
  const data = {
    name: formData.value.nombre,
    code: formData.value.codigo,
    city: formData.value.ciudad,
    phone: formData.value.telefono,
    email: formData.value.email,
    address: formData.value.direccion,
    department: formData.value.departamento,
    student_capacity: parseInt(formData.value.capacidad) || 0,
    description: formData.value.descripcion,
    status: formData.value.estado,
  };
  try {
    if (isEditMode.value) {
      await putData(`/training-centers/update/${editingCentro.value.id}`, data);
      info("Centro actualizado correctamente");
    } else {
      await postData("/training-centers/create", data);
      info("Centro registrado correctamente");
    }
    closeDialog();
    await cargarCentros();
  } catch {
    error("Error al guardar el centro");
  }
};

const closeDialog = () => {
  showAddDialog.value = false;
  isEditMode.value = false;
  editingCentro.value = null;
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
    estado: 1,
  };
};

// FILTROS
const aplicarFiltro = () => {
  const term = busqueda.value.toLowerCase();
  centrosFiltrados.value = term
    ? centros.value.filter((c) =>
        [c.nombre, c.codigo, c.ciudad].some((f) => f?.toLowerCase().includes(term))
      )
    : centros.value;
};
const limpiarFiltros = () => ((busqueda.value = ""), aplicarFiltro());
watch(busqueda, aplicarFiltro);

// INFO DETALLE
const infoBasica = computed(() => [
  { label: "Nombre", value: selectedCentro.value?.nombre },
  { label: "Código", value: selectedCentro.value?.codigo },
  { label: "Ciudad", value: selectedCentro.value?.ciudad },
  { label: "Departamento", value: selectedCentro.value?.departamento },
  { label: "Capacidad", value: `${selectedCentro.value?.capacidad} estudiantes` },
]);
const infoContacto = computed(() => [
  { label: "Teléfono", value: selectedCentro.value?.telefono || "No especificado" },
  { label: "Email", value: selectedCentro.value?.email || "No especificado" },
  { label: "Dirección", value: selectedCentro.value?.direccion || "No especificada" },
]);

onMounted(cargarCentros);
</script>

<style scoped>
.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #71277a;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #71277a;
  color: white;
}
.info-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}
.info-item strong {
  color: #71277a;
  font-weight: 600;
}
</style>
