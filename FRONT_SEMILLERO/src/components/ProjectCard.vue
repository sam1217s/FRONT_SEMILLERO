<template>
  <q-card class="project-card shadow-2">
    <q-card-section class="q-pa-lg">
      <!-- Título del proyecto -->
      <div class="text-h6 text-primary q-mb-md">
        {{ project.titulo }}
      </div>
      
      <!-- Información del proyecto -->
      <div class="project-info">
        <div class="info-row">
          <q-icon name="school" class="q-mr-sm text-grey-6" />
          <span class="text-grey-7">Semillero:</span>
          <span class="text-weight-medium q-ml-sm">{{ project.semillero }}</span>
        </div>
        
        <div class="info-row">
          <q-icon name="person" class="q-mr-sm text-grey-6" />
          <span class="text-grey-7">Líder:</span>
          <span class="text-weight-medium q-ml-sm">{{ project.lider }}</span>
        </div>
        
        <div class="info-row">
          <q-icon name="attach_money" class="q-mr-sm text-grey-6" />
          <span class="text-grey-7">Presupuesto:</span>
          <span class="text-weight-medium q-ml-sm text-green">{{ project.presupuesto }}</span>
        </div>
        
        <div class="info-row">
          <q-icon name="schedule" class="q-mr-sm text-grey-6" />
          <span class="text-grey-7">Fecha:</span>
          <span class="text-weight-medium q-ml-sm">{{ project.fecha }}</span>
        </div>
        
        <div class="info-row">
          <q-icon name="event" class="q-mr-sm text-grey-6" />
          <span class="text-grey-7">Solicitado:</span>
          <span class="text-weight-medium q-ml-sm">{{ project.solicitado }}</span>
        </div>
      </div>
    </q-card-section>
    
    <!-- Botones de acción -->
    <q-card-actions class="q-pa-lg q-pt-none">
      <div class="row q-gutter-sm full-width">
        <q-btn 
          flat 
          label="Ver Detalle" 
          color="primary" 
          class="col"
          @click="$emit('view-detail', project)"
        />
        <q-btn 
          unelevated 
          label="Aprobar" 
          color="positive" 
          class="col"
          @click="$emit('approve', project)"
        />
        <q-btn 
          unelevated 
          label="Rechazar" 
          color="negative" 
          class="col"
          @click="$emit('reject', project)"
        />
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup>
// Props
defineProps({
  project: {
    type: Object,
    required: true,
    default: () => ({
      id: 1,
      titulo: 'Sistema de Riego Inteligente con IoT',
      semillero: 'IA Aplicada',
      lider: 'Juan Pérez González',
      presupuesto: '$50,000,000 COP',
      fecha: '01/11/2024 - 31/12/2025',
      solicitado: '20/10/2024'
    })
  }
})

// Emits
defineEmits([
  'view-detail',
  'approve', 
  'reject'
])
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.project-card {
  border-radius: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #e0e0e0;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.text-primary {
  color: $primary-color !important;
  font-weight: 600;
  line-height: 1.3;
}

.text-green {
  color: #4caf50 !important;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .project-info {
    gap: 8px;
  }

  .info-row {
    font-size: 0.85rem;
  }

  .q-card-actions .row {
    flex-direction: column;
  }

  .q-card-actions .col {
    width: 100%;
    margin-bottom: 8px;
  }
}
</style>
