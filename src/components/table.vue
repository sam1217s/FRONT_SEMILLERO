<template>
  <div class="projects-table-container">
    <!-- Header -->
    <div class="table-header">
      <div class="table-title">{{ title }}</div>
      <div class="table-actions">
        <slot name="filters"></slot>
        <q-btn
          v-if="showAddButton"
          :label="addButtonLabel"
          color="primary"
          unelevated
          padding="sm lg"
          class="text-weight-bold"
          @click="$emit('add-item')"
        />
      </div>
    </div>

    <!-- Tabla -->
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      flat
      :hide-pagination="true"
      :rows-per-page-options="[0]"
      class="projects-table"
    >
      <!-- Header personalizado -->
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

      <!-- Cuerpo dinámico -->
      <template #body="props">
        <q-tr :props="props" class="table-body-row">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            :class="getCellClass(col.name)"
          >
            <!-- Slot personalizado por columna -->
            <slot
              :name="`cell-${col.name}`"
              :row="props.row"
              :value="props.row[col.field]"
              :col="col"
            >
              <!-- Columna de opciones (slot obligatorio) -->
              <template v-if="col.name === 'options' || col.name === 'opciones'">
                <slot name="options-column" :row="props.row">
                  <!-- Fallback por defecto -->
                </slot>
              </template>

              <!-- Columna normal con formato -->
              <template v-else>
                {{ col.format ? col.format(props.row[col.field]) : props.row[col.field] }}
              </template>
            </slot>
          </q-td>
        </q-tr>
      </template>

      <!-- Sin datos -->
      <template #no-data>
        <div class="q-pa-md flex flex-center column text-grey">
          <q-icon name="warning" size="2.5em" color="orange" />
          <div class="text-subtitle2 q-mt-sm">No hay datos disponibles</div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'TABLA' },
  rows: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  addButtonLabel: { type: String, default: 'AGREGAR' },
  showAddButton: { type: Boolean, default: true }
})

defineEmits(['add-item'])

// Clase dinámica para celdas
const getCellClass = (colName) => {
  const baseClass = 'table-body-cell'
  const nameColumns = ['nombre', 'proyecto', 'name', 'title']

  if (nameColumns.includes(colName)) {
    return `${baseClass} name-cell`
  }
  return `${baseClass} center-cell`
}
</script>

<style scoped>
.projects-table-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Header */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #71277A;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Tabla */
.projects-table {
  box-shadow: none;
}

.projects-table :deep(.q-table__card) {
  box-shadow: none;
}

.projects-table :deep(.q-table) {
  border-collapse: separate;
  border-spacing: 0;
}

/* Header */
.table-header-row {
  background: #71277A !important;
}

.table-header-cell {
  background: #71277A !important;
  color: white !important;
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  padding: 16px 12px !important;
  text-align: center !important;
}

.table-header-cell:first-child {
  text-align: left !important;
  border-radius: 8px 0 0 0;
}

.table-header-cell:last-child {
  border-radius: 0 8px 0 0;
}

/* Cuerpo */
.table-body-row {
  border-bottom: 1px solid #e0e0e0;
}

.table-body-row:hover {
  background: #f5f5f5;
}

.table-body-cell {
  padding: 16px 12px !important;
  font-size: 0.9rem;
  color: #424242;
}

.name-cell {
  color: #71277A !important;
  font-weight: 600 !important;
  text-transform: uppercase;
  font-size: 0.875rem !important;
  text-align: left !important;
}

.center-cell {
  text-align: center !important;
}

/* Responsive */
@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .table-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .projects-table :deep(.q-table) {
    font-size: 0.8rem;
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
