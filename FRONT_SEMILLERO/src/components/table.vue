<template>
  <div class="seedbeds-table-container">
    <!-- ENCABEZADO -->
    <div class="table-header">
      <div class="table-header-left">
        <div class="table-title">{{ title }}</div>
        <slot name="filters"></slot>
      </div>
      <div class="table-actions">
        <slot name="header-actions"></slot>
        <q-btn
          v-if="showAddButton"
          :label="addButtonLabel"
          color="primary"
          glossy
          padding="sm lg"
          icon="add"
          class="text-weight-bold text-white"
          @click="$emit('add-item')"
        />
      </div>
    </div>

    <!-- TABLA -->
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      flat
      bordered
      class="seedbeds-table"
      :hide-pagination="!usePagination"
      :rows-per-page-options="[5, 10, 20, 50]"
    >
      <!-- ENCABEZADO -->
      <template #header="props">
        <q-tr :props="props" class="table-header-row">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="table-header-cell"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <!-- CUERPO -->
      <template #body="props">
        <q-tr :props="props" class="table-body-row">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            :class="getCellClass(col.name)"
          >
            <!-- Slot personalizado -->
            <slot
              :name="`cell-${col.name}`"
              :row="props.row"
              :value="props.row[col.field]"
              :col="col"
            >
              <!-- Columna de opciones -->
              <template v-if="col.name === 'options' || col.name === 'opciones'">
                <slot name="options-column" :row="props.row" />
              </template>

              <!-- Estado -->
              <template v-else-if="col.name === 'status'">
                <q-chip
                  :color="props.row.status === 'Active' ? 'positive' : 'negative'"
                  text-color="white"
                  outline
                  :label="props.row.status === 'Active' ? 'Activo' : 'Inactivo'"
                />
              </template>

              <!-- Contenido normal -->
              <template v-else>
                {{
                  col.format
                    ? col.format(
                        typeof col.field === "function"
                          ? col.field(props.row)
                          : props.row[col.field]
                      )
                    : typeof col.field === "function"
                    ? col.field(props.row)
                    : props.row[col.field]
                }}
              </template>
            </slot>
          </q-td>
        </q-tr>
      </template>

      <!-- SIN DATOS -->
      <template #no-data>
        <div class="q-pa-md flex flex-center column text-grey">
          <q-icon name="search_off" size="2.5em" color="negative" />
          <div class="text-subtitle2 q-mt-sm">No hay registros disponibles</div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  title: { type: String, default: "Lista de Semilleros" },
  rows: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  addButtonLabel: { type: String, default: "Agregar" },
  showAddButton: { type: Boolean, default: true },
  usePagination: { type: Boolean, default: false },
});

defineEmits(["add-item"]);

const getCellClass = (colName) => {
  const base = "table-body-cell";
  const nameCols = ["name", "nombre"];
  return nameCols.includes(colName)
    ? `${base} name-cell`
    : `${base} center-cell`;
};
</script>

<style lang="scss" scoped>
@import "../variables.scss";

.seedbeds-table-container {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* HEADER */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.table-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: $primary-color;
}

/* TABLE CORE */
.seedbeds-table {
  box-shadow: none;
}

.table-header-row {
  background: $primary-color !important;
}

.table-header-cell {
  background: $primary-color !important;
  color: white !important;
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  text-align: center !important;
}

.table-body-row {
  border-bottom: 1px solid #e0e0e0;
}

.table-body-row:hover {
  background: #f9f9f9;
}

.table-body-cell {
  padding: 14px 12px !important;
  font-size: 0.9rem;
  color: #424242;
}

.name-cell {
  color: $primary-color !important;
  font-weight: 600 !important;
  text-align: left !important;
}

.center-cell {
  text-align: center !important;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .table-actions {
    width: 100%;
    flex-direction: column;
  }

  .table-header-cell,
  .table-body-cell {
    padding: 12px 8px !important;
    font-size: 0.8rem !important;
  }

  .name-cell {
    font-size: 0.75rem !important;
  }
}
</style>
