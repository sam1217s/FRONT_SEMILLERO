<template>
  <q-card 
    class="menu-card" 
    :style="{ backgroundColor: color, color: textColor }"
    @click="navigateToRoute"
  >
    <q-card-section class="card-content">
      <div class="card-icon-section">
        <q-icon :name="iconName" size="48px" class="card-icon" />
      </div>
      <div class="card-text-section">
        <div class="text-h6 text-weight-bold card-title">{{ title }}</div>
        <div class="text-subtitle2 card-subtitle">{{ subtitle }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  iconName: {
    type: String,
    required: true
  },
  route: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#39a900'
  },
  textColor: {
    type: String,
    default: 'white'
  }
})

const navigateToRoute = () => {
  // Por ahora, todas las rutas van a la página de inicio
  // excepto la ruta de inicio que ya está en el router
  if (props.route === 'inicio') {
    router.push('/app/inicio')
  } else {
    // Mostrar mensaje de que la funcionalidad está en construcción
    router.push('/app/inicio')
    // Aquí podrías mostrar una notificación
    console.log(`Funcionalidad "${props.title}" en construcción`)
  }
}
</script>

<style scoped>
.menu-card {
  width: 100%;
  max-width: 300px;
  height: 200px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.menu-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.card-content {
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.card-icon-section {
  margin-bottom: 16px;
}

.card-icon {
  opacity: 0.9;
}

.card-text-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-title {
  margin-bottom: 8px;
  line-height: 1.2;
}

.card-subtitle {
  opacity: 0.9;
  line-height: 1.3;
}

@media (max-width: 768px) {
  .menu-card {
    max-width: 250px;
    height: 180px;
  }
  
  .card-content {
    padding: 20px;
  }
  
  .card-icon {
    font-size: 40px;
  }
}

@media (max-width: 480px) {
  .menu-card {
    max-width: 100%;
    height: 160px;
  }
  
  .card-content {
    padding: 16px;
  }
  
  .card-icon {
    font-size: 36px;
  }
}
</style>
