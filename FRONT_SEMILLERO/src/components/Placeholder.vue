<template>
  <div class="placeholder-container">
    <q-card class="placeholder-card">
      <q-card-section class="text-center">
        <q-icon name="construction" size="64px" color="primary" class="q-mb-md" />
        <div class="text-h5 text-weight-bold text-primary q-mb-sm">
          Página en Construcción
        </div>
        <div class="text-subtitle1 text-grey-6">
          Esta funcionalidad estará disponible próximamente
        </div>
        <q-btn 
          color="primary" 
          label="Volver al Inicio" 
          @click="goHome"
          class="q-mt-md"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/app/inicio')
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.placeholder-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f5f5f5;
}

.placeholder-card {
  max-width: 400px;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
