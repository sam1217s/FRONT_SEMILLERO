<template>
  <div class="center">
    <div class="grid">
      <!-- ADMIN -->
      <Card
        v-if="role === 'ADMIN'"
        title="Aprobar Proyectos" 
        subtitle="Revisar, aprobar o rechazar proyectos con observaciones" 
        iconName="approval"
        route="admin/aprobar-proyectos" 
        color="#39a900" 
        textColor="white" />
      
      <Card
        v-if="role === 'ADMIN'"
        title="Métricas Generales" 
        subtitle="Ver estadísticas y métricas del semillero" 
        iconName="analytics"
        route="admin/metricas" 
        color="#39a900" 
        textColor="white" />
      
      <Card
        v-if="role === 'ADMIN'"
        title="Crear Investigadores" 
        subtitle="Registrar nuevos investigadores en el sistema" 
        iconName="person_add"
        route="admin/crear-investigadores" 
        color="#39a900" 
        textColor="white" />
      
      <Card
        v-if="role === 'ADMIN'"
        title="Crear Grupos" 
        subtitle="Crear y gestionar grupos de investigación" 
        iconName="group_add"
        route="admin/crear-grupos" 
        color="#39a900" 
        textColor="white" />
      
      <Card
        v-if="role === 'ADMIN'"
        title="Mi Perfil" 
        subtitle="Gestionar mi información personal" 
        iconName="person"
        route="admin/perfil" 
        color="#39a900" 
        textColor="white" />

      <!-- INVESTIGADOR LIDER -->
      <Card
        v-if="role === 'LIDER'"
        title="Mis Actividades" 
        subtitle="Gestionar mis actividades de investigación" 
        iconName="event_note"
        route="lider/actividades" 
        color="#39a900" 
        textColor="white" />
      
      <Card
        v-if="role === 'LIDER'"
        title="Reuniones" 
        subtitle="Programar y gestionar reuniones" 
        iconName="meeting_room"
        route="lider/reuniones" 
        color="#39a900" 
        textColor="white" />
      
      <Card
        v-if="role === 'LIDER'"
        title="Proyectos" 
        subtitle="Administrar proyectos de investigación" 
        iconName="science"
        route="lider/proyectos" 
        color="#39a900" 
        textColor="white" />
      
      <Card
        v-if="role === 'LIDER'"
        title="Semilleros" 
        subtitle="Gestionar semilleros de investigación" 
        iconName="school"
        route="lider/semilleros"
        color="#39a900" 
        textColor="white" />
      
      <Card
        v-if="role === 'LIDER'"
        title="Mi Perfil" 
        subtitle="Gestionar mi información personal" 
        iconName="person"
        route="lider/perfil" 
        color="#39a900" 
        textColor="white" />

      <!-- INVESTIGADOR -->
      <Card
        v-if="role === 'INVESTIGADOR'"
        title="Mis Proyectos" 
        subtitle="Ver mis proyectos asignados" 
        iconName="assignment_turned_in"
        route="investigador/proyectos" 
        color="#39a900" 
        textColor="white" />
      
      <Card
        v-if="role === 'INVESTIGADOR'"
        title="Documentos" 
        subtitle="Subir y gestionar documentos" 
        iconName="upload_file"
        route="investigador/documentos" 
        color="#39a900" 
        textColor="white" />
      
      <Card
        v-if="role === 'INVESTIGADOR'"
        title="Actividades" 
        subtitle="Registrar actividades de investigación" 
        iconName="event_note"
        route="investigador/actividades" 
        color="#39a900" 
        textColor="white" />
      
      <Card
        v-if="role === 'INVESTIGADOR'"
        title="Mi Perfil" 
        subtitle="Gestionar mi información personal" 
        iconName="person"
        route="investigador/perfil"
        color="#39a900" 
        textColor="white" />
    </div>
  </div>
</template>

<script setup>
import Card from './cards/MenuCard.vue';
import { ref, onMounted } from 'vue'

const role = ref('')

onMounted(() => {
  const Auth = JSON.parse(localStorage.getItem("auth"))
  if (Auth.user) {
    role.value = Auth.user.role
    if(role.value == "INSTRUCTOR OWNER" || role.value == 'INSTRUCTOR'){
      role.value = role.value.split(" ")
    }
  }
  console.log(role.value);
})
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 0px;
  justify-items: center;
  align-items: center;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100vw;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>
