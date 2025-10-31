<template>
  <div class="row q-gutter-xs justify-center">
    <!-- Botones base -->
    <template v-for="btn in baseButtons" :key="btn.key">
      <q-btn
        v-if="btn.show"
        v-bind="btn.props"
        @click="$emit(btn.event, row)"
      >
        <q-tooltip>{{ btn.tooltip }}</q-tooltip>
      </q-btn>
    </template>

    <!-- Botones personalizados -->
    <q-btn
      v-for="custom in customButtons"
      :key="custom.key"
      v-bind="custom.props"
      @click="$emit(custom.event, row)"
    >
      <q-tooltip v-if="custom.tooltip">{{ custom.tooltip }}</q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  row: { type: Object, required: true },

  // Mostrar botones
  showEdit: { type: Boolean, default: false },
  showToggleStatus: { type: Boolean, default: false },
  showView: { type: Boolean, default: false },
  showApprove: { type: Boolean, default: false },
  showReject: { type: Boolean, default: false },

  // Tooltips
  editTooltip: { type: String, default: 'Editar' },
  activateTooltip: { type: String, default: 'Activar' },
  deactivateTooltip: { type: String, default: 'Desactivar' },
  viewTooltip: { type: String, default: 'Ver' },
  approveTooltip: { type: String, default: 'Aprobar' },
  rejectTooltip: { type: String, default: 'Rechazar' },

  // Botones extra
  customButtons: { type: Array, default: () => [] }
})

defineEmits(['edit', 'toggle-status', 'view', 'approve', 'reject'])

// Estado activo/inactivo
const isInactive = computed(() =>
  ['Inactivo', 'Inactive', 'cancelled'].includes(props.row?.estado || props.row?.status)
)

// Botones base declarativos
const baseButtons = computed(() => [
  {
    key: 'edit',
    show: props.showEdit,
    event: 'edit',
    tooltip: props.editTooltip,
    props: {
      icon: 'edit',
      color: 'info',
      size: 'sm',
      dense: true,
      round: true,
      unelevated: true
    }
  },
  {
    key: 'toggle-status',
    show: props.showToggleStatus,
    event: 'toggle-status',
    tooltip: isInactive.value ? props.activateTooltip : props.deactivateTooltip,
    props: {
      icon: isInactive.value ? 'check_circle' : 'block',
      color: isInactive.value ? 'positive' : 'grey',
      size: 'sm',
      dense: true,
      round: true,
      unelevated: true
    }
  },
  {
    key: 'view',
    show: props.showView,
    event: 'view',
    tooltip: props.viewTooltip,
    props: {
      icon: 'visibility',
      color: 'grey-7',
      size: 'sm',
      dense: true,
      round: true,
      flat: true
    }
  },
  {
    key: 'approve',
    show: props.showApprove,
    event: 'approve',
    tooltip: props.approveTooltip,
    props: {
      icon: 'thumb_up',
      color: 'positive',
      size: 'sm',
      dense: true,
      round: true,
      unelevated: true
    }
  },
  {
    key: 'reject',
    show: props.showReject,
    event: 'reject',
    tooltip: props.rejectTooltip,
    props: {
      icon: 'thumb_down',
      color: 'negative',
      size: 'sm',
      dense: true,
      round: true,
      unelevated: true
    }
  }
])
</script>

<style scoped>
.q-btn {
  transition: all 0.2s ease;
}
.q-btn:hover {
  transform: scale(1.1);
}
</style>
