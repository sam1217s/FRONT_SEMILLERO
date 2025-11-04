<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="shadow-1">
          <!-- HEADER -->
          <q-card-section>
            <div class="page-title">
              <q-icon name="inventory" class="q-mr-sm" />
              Productos
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Crear y gestionar productos de investigación
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
                  label="Buscar productos"
                  placeholder="Buscar por nombre o tipo..."
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
                Cargando productos...
              </div>
            </div>

            <!-- TABLA PRINCIPAL -->
            <Table
              v-else
              :rows="productosFiltrados"
              :columns="columns"
              title="PRODUCTOS"
              add-button-label="AGREGAR PRODUCTO"
              @add-item="handleAddProducto"
            >
              <!-- SLOT DE OPCIONES -->
              <template #options-column="{ row }">
                <ActionButtons
                  :row="row"
                  :show-view="true"
                  :show-edit="true"
                  :show-toggle-status="true"
                  view-tooltip="Ver detalle"
                  edit-tooltip="Editar producto"
                  activate-tooltip="Activar"
                  deactivate-tooltip="Desactivar"
                  @view="handleViewDetalle"
                  @edit="handleEditProducto"
                  @toggle-status="handleToggleStatus"
                />
              </template>
            </Table>
          </q-card-section>
        </q-card>

        <!-- MODAL PERFIL -->
        <q-dialog v-model="showDetailDialog">
          <q-card style="min-width: 800px; max-width: 1000px">
            <q-card-section class="modal-header">
              <div class="text-h6">
                <q-icon name="visibility" class="q-mr-sm" />
                Detalle del Producto
              </div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section v-if="selectedProducto">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <div class="text-h6 text-primary q-mb-md">Información Básica</div>
                  <div class="info-item">
                    <strong>Nombre:</strong> {{ selectedProducto.name }}
                  </div>
                  <div class="info-item">
                    <strong>Tipo:</strong> {{ selectedProducto.product_type || 'No especificado' }}
                  </div>
                  <div class="info-item">
                    <strong>Estado:</strong>
                    <q-badge
                      :color="selectedProducto.status === 'Active' ? 'positive' : 'grey'"
                      :label="selectedProducto.status === 'Active' ? 'Activo' : 'Inactivo'"
                    />
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <div class="text-h6 text-primary q-mb-md">Detalles</div>
                  <div class="info-item">
                    <strong>Fecha de publicación:</strong> {{ selectedProducto.publication_date ? new Date(selectedProducto.publication_date).toLocaleDateString('es-CO') : 'No especificada' }}
                  </div>
                  <div class="info-item">
                    <strong>Proyecto:</strong> {{ selectedProducto.id_project?.project_name || 'No asignado' }}
                  </div>
                  <div class="info-item" v-if="selectedProducto.url">
                    <strong>URL:</strong> <a :href="selectedProducto.url" target="_blank">{{ selectedProducto.url }}</a>
                  </div>
                </div>

                <div class="col-12">
                  <div class="text-h6 text-primary q-mb-md">Descripción</div>
                  <div class="info-item">{{ selectedProducto.description || 'Sin descripción' }}</div>
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
                {{ isEditMode ? "Editar Producto" : "Registrar Producto" }}
              </div>
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input v-model="formData.name" filled label="Nombre del producto" />
                  <q-input v-model="formData.product_type" filled label="Tipo de producto" class="q-mt-md" />
                  <q-input v-model="formData.url" filled label="URL" class="q-mt-md" />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="formData.publication_date" filled label="Fecha de publicación" type="date" />
                  <q-select
                    v-model="formData.id_project"
                    filled
                    label="Proyecto"
                    :options="proyectos"
                    option-label="project_name"
                    option-value="_id"
                    emit-value
                    map-options
                    class="q-mt-md"
                  />
                </div>
                <div class="col-12">
                  <q-input
                    v-model="formData.description"
                    filled
                    label="Descripción"
                    type="textarea"
                    rows="4"
                  />
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="grey" @click="closeDialog" />
              <q-btn :label="isEditMode ? 'Actualizar' : 'Registrar'" color="primary" @click="onSubmitProducto" />
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

const { error, info } = useNotifications();

const loading = ref(false);
const productos = ref([]);
const productosFiltrados = ref([]);
const proyectos = ref([]);
const busqueda = ref("");
const showAddDialog = ref(false);
const showDetailDialog = ref(false);
const isEditMode = ref(false);
const selectedProducto = ref(null);
const editingProducto = ref(null);

const formData = ref({
  name: "",
  product_type: "",
  description: "",
  publication_date: "",
  url: "",
  id_project: null,
});

// === CRUD ===
const cargarProductos = async () => {
  try {
    loading.value = true;
    const res = await getData("/products/list");
    productos.value = res.msg || [];
    aplicarFiltro();
  } catch (e) {
    console.error(e);
    error("Error al cargar productos");
  } finally {
    loading.value = false;
  }
};

const cargarProyectos = async () => {
  try {
    const res = await getData("/projects/list");
    proyectos.value = res.msg || [];
  } catch (e) {
    console.error(e);
  }
};

const handleRegistrarProducto = async () => {
  try {
    await postData("/products/create", formData.value);
    await cargarProductos();
    info("Producto registrado correctamente");
    closeDialog();
  } catch (e) {
    console.error(e);
    error("Error al registrar producto");
  }
};

const handleActualizarProducto = async () => {
  try {
    await putData(`/products/update/${editingProducto.value._id}`, formData.value);
    await cargarProductos();
    info("Producto actualizado correctamente");
    closeDialog();
  } catch (e) {
    console.error(e);
    error("Error al actualizar producto");
  }
};

const handleToggleStatus = async (p) => {
  try {
    const endpoint = p.status === 'Active' ? 'inactivate' : 'activate';
    await putData(`/products/${endpoint}/${p._id}`);
    await cargarProductos();
    info(`Producto ${endpoint === 'activate' ? 'activado' : 'desactivado'} correctamente`);
  } catch (e) {
    console.error(e);
    error("Error al cambiar estado del producto");
  }
};

// === FILTROS ===
const aplicarFiltro = () => {
  const t = busqueda.value.toLowerCase();
  productosFiltrados.value = productos.value.filter((p) =>
    [p.name, p.product_type, p.description].some((f) =>
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
const handleAddProducto = () => {
  formData.value = {
    name: "",
    product_type: "",
    description: "",
    publication_date: "",
    url: "",
    id_project: null,
  };
  isEditMode.value = false;
  showAddDialog.value = true;
};

const handleViewDetalle = (p) => {
  selectedProducto.value = p;
  showDetailDialog.value = true;
};

const handleEditProducto = (p) => {
  isEditMode.value = true;
  editingProducto.value = p;
  formData.value = {
    name: p.name || "",
    product_type: p.product_type || "",
    description: p.description || "",
    publication_date: p.publication_date ? new Date(p.publication_date).toISOString().slice(0, 10) : "",
    url: p.url || "",
    id_project: p.id_project?._id || null,
  };
  showAddDialog.value = true;
};

const closeDialog = () => {
  showAddDialog.value = false;
  isEditMode.value = false;
  editingProducto.value = null;
};

const onSubmitProducto = () =>
  isEditMode.value ? handleActualizarProducto() : handleRegistrarProducto();

// === COLUMNAS ===
const columns = [
  { name: "name", label: "Nombre", field: "name", align: "left" },
  { name: "product_type", label: "Tipo", field: "product_type", align: "center" },
  {
    name: "status",
    label: "Estado",
    field: "status",
    align: "center",
    format: (val) => (val === "Active" ? "Activo" : "Inactivo"),
  },
  {
    name: "publication_date",
    label: "Fecha Publicación",
    field: "publication_date",
    align: "center",
    format: (val) => val ? new Date(val).toLocaleDateString('es-CO') : 'N/A',
  },
  { name: "options", label: "Opciones", field: "options", align: "center" },
];

onMounted(() => {
  cargarProductos();
  cargarProyectos();
});
</script>

<!-- Los estilos globales están definidos en src/app.scss -->
