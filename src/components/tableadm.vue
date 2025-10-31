<template>
  <div class="projects-table-container">
    <!-- Header -->
    <div class="table-header">
      <div class="table-title">{{ title || 'TABLA' }}</div>
      <div class="table-actions">
        <slot name="filters"></slot>
        <q-btn 
          :label="addButtonLabel || 'AGREGAR'" 
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
      <template v-slot:header="props">
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

      <template v-slot:body="props">
        <q-tr :props="props" class="table-body-row">
          <q-td 
            v-for="col in props.cols" 
            :key="col.name" 
            :props="props" 
            :class="col.name === 'nombre' || col.name === 'proyecto' ? 'table-body-cell name-cell' : 'table-body-cell center-cell'"
          >
            <!-- Columnas de datos normales -->
            <template v-if="col.name !== 'opciones' && col.name !== 'status' && col.name !== 'estado'">
              <span>{{ col.format ? col.format(props.row[col.field]) : props.row[col.field] }}</span>
            </template>

            <!-- Columna opciones, con ver/editar/toggle -->
            <template v-else-if="col.name === 'opciones'">
              <ActionButtons
                :row="props.row"
                :show-view="true"
                :show-edit="true"
                :show-toggle-status="true"
                view-tooltip="Ver Perfil"
                edit-tooltip="Editar"
                :activate-tooltip="props.row.estado === 'Inactivo' ? 'Activar' : 'Desactivar'"
                :deactivate-tooltip="props.row.estado === 'Inactivo' ? 'Activar' : 'Desactivar'"
                @view="$emit('view-item', props.row)"
                @edit="$emit('edit-item', props.row)"
                @toggle-status="$emit('toggle-status', props.row)"
              />
            </template>

            <!-- Estado admite 'status' o 'estado' -->
            <template v-else-if="col.name === 'status' || col.name === 'estado'">
              <q-badge
                :color="(props.row.status === 'Active' || props.row.estado === 'Activo') ? 'positive' : 'grey'"
                :label="col.format ? col.format(props.row[col.field]) : props.row[col.field]"
                class="estado-badge"/>
            </template>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import ActionButtons from './ActionButtons.vue'

// Props
defineProps({
  rows: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: 'TABLA'
  },
  addButtonLabel: {
    type: String,
    default: 'AGREGAR'
  }
})

// Emits
defineEmits([
  'add-item', 
  'view-item', 
  'edit-item',
  'toggle-status'
])
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
}

.center-cell {
  text-align: center !important;
}

.estado-badge {
  padding: 6px 16px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: capitalize;
}
</style>

