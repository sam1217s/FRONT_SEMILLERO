<template>
    <q-layout view="hHh lpR fFf">
      <q-header elevated class="custom-header">
        <div class="header-container">
          <div class="header-left">
            <q-btn 
              flat 
              dense 
              round
              icon="menu" 
              @click="toggleDrawer" 
              class="menu-toggle-btn"
              aria-label="Abrir menú"
            />
            <q-avatar size="48px" color="primary" text-color="white" class="header-avatar">
              <q-icon name="science" size="24px" />
            </q-avatar>
            <div class="header-branding">
              <span class="header-title">Semillero Investigación</span>
              <span class="header-subtitle">Sistema de Gestión Académica</span>
            </div>
          </div>
          <div class="header-actions">
            <q-btn 
              flat 
              round 
              dense
              icon="notifications"
              @click="toggleNotifications"
              class="header-icon-btn"
            >
              <q-badge v-if="unreadCount > 0" floating color="red" :label="unreadCount" />
            </q-btn>
            <q-btn 
              flat 
              round
              dense
              @click="showMorph = !showMorph" 
              class="header-user-btn"
            >
              <q-avatar size="32px" color="primary" text-color="white" class="text-weight-bold">
                {{ getInitials() }}
              </q-avatar>
            </q-btn>
          </div>
        </div>
      </q-header>
  
      <!-- Menú lateral con hover -->
      <q-drawer
        v-model="drawerOpen"
        show-if-above
        :width="miniState ? 72 : 280"
        :breakpoint="1024"
        class="sidebar-drawer"
        :class="{ 'sidebar-mini': miniState }"
        @mouseenter="miniState = false"
        @mouseleave="miniState = true"
      >
        <div class="sidebar-content">
          <!-- Header del sidebar -->
          <div class="sidebar-header" :class="{ 'sidebar-header-mini': miniState }">
            <q-avatar size="48px" color="primary" text-color="white" class="text-weight-bold text-h6">
              {{ getInitials() }}
            </q-avatar>
            <transition name="fade-slide">
              <div v-if="!miniState" class="sidebar-user-info">
                <div class="sidebar-user-name">{{ firstName }} {{ lastName }}</div>
                <div class="sidebar-user-role">{{ getRoleDisplayName(role) }}</div>
              </div>
            </transition>
          </div>
  
          <q-separator />
  
          <!-- Navegación -->
          <q-scroll-area class="sidebar-scroll-area">
            <q-list class="sidebar-menu">
              <!-- Super Administradores -->
              <template v-if="isSuper">
                <q-item-label v-if="!miniState" header class="menu-section-title">
                  <q-icon name="supervisor_account" size="18px" class="q-mr-xs" />
                  Super Administración
                </q-item-label>
                <q-separator v-else class="q-my-sm" />
                
                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/super/centros')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="business" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Gestionar Centros</q-item-label>
                    <q-item-label caption>Crear y gestionar centros de formación</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Centros
                  </q-tooltip>
                </q-item>

                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/super/administradores')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="admin_panel_settings" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Gestionar Administradores</q-item-label>
                    <q-item-label caption>Crear y gestionar administradores</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Administradores
                  </q-tooltip>
                </q-item>

              </template>

              <!-- Administradores -->
              <template v-if="isAdmin">
                <q-item-label v-if="!miniState" header class="menu-section-title">
                  <q-icon name="admin_panel_settings" size="18px" class="q-mr-xs" />
                  Administración
                </q-item-label>
                <q-separator v-else class="q-my-sm" />
                
                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/admin/estadisticas')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="analytics" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Estadísticas</q-item-label>
                    <q-item-label caption>Estadísticas generales del sistema</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Estadísticas
                  </q-tooltip>
                </q-item>
  
                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/admin/proyectos')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="approval" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Aprobar Proyectos</q-item-label>
                    <q-item-label caption>Aprobar o desaprobar proyectos</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Aprobar Proyectos
                  </q-tooltip>
                </q-item>
  
                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/admin/investigadores')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="person_add" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Investigadores</q-item-label>
                    <q-item-label caption>Crear y gestionar investigadores</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Investigadores
                  </q-tooltip>
                </q-item>
  
                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/admin/grupos')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="group_add" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Grupos</q-item-label>
                    <q-item-label caption>Crear y gestionar grupos de investigación</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Grupos
                  </q-tooltip>
                </q-item>
  
                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/admin/alertas')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="warning" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Alertas</q-item-label>
                    <q-item-label caption>Ver y gestionar alertas del sistema</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Alertas
                  </q-tooltip>
                </q-item>

              </template>
  
              <!-- Investigadores Líderes -->
              <template v-if="isResearcherLeader">
                <q-item-label v-if="!miniState" header class="menu-section-title">
                  <q-icon name="science" size="18px" class="q-mr-xs" />
                  Liderazgo
                </q-item-label>
                <q-separator v-else class="q-my-sm" />
                
                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/lider/actividades')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="event_note" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Actividades</q-item-label>
                    <q-item-label caption>Gestionar mis actividades</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Actividades
                  </q-tooltip>
                </q-item>
  
                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/lider/reuniones')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="meeting_room" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Reuniones</q-item-label>
                    <q-item-label caption>Programar y gestionar reuniones</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Reuniones
                  </q-tooltip>
                </q-item>
  
                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/lider/semilleros')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="school" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Semilleros</q-item-label>
                    <q-item-label caption>Gestionar semilleros de investigación</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Semilleros
                  </q-tooltip>
                </q-item>
  
                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/lider/proyectos')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="science" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Proyectos</q-item-label>
                    <q-item-label caption>Administrar proyectos de investigación</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Proyectos
                  </q-tooltip>
                </q-item>
  
                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/lider/productos')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="inventory" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Productos</q-item-label>
                    <q-item-label caption>Gestionar productos de investigación</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Productos
                  </q-tooltip>
                </q-item>
  
                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/lider/perfil')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="person" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Mi Perfil</q-item-label>
                    <q-item-label caption>Gestionar mi información</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Mi Perfil
                  </q-tooltip>
                </q-item>
              </template>
  
              <!-- Vistas de Líderes (visibles para administradores también) -->
              <template v-if="isAdmin">
                <q-separator class="q-my-md" />
                <q-item-label v-if="!miniState" header class="menu-section-title">
                  <q-icon name="visibility" size="18px" class="q-mr-xs" />
                  Vista de Líder
                </q-item-label>
                <q-separator v-else class="q-my-sm" />
                
                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/lider/actividades')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="event_note" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Actividades</q-item-label>
                    <q-item-label caption>Ver actividades de líderes</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Actividades de Líder
                  </q-tooltip>
                </q-item>

                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/lider/reuniones')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="meeting_room" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Reuniones</q-item-label>
                    <q-item-label caption>Ver reuniones de líderes</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Reuniones de Líder
                  </q-tooltip>
                </q-item>

                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/lider/semilleros')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="school" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Semilleros</q-item-label>
                    <q-item-label caption>Ver semilleros gestionados</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Semilleros
                  </q-tooltip>
                </q-item>

                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/lider/proyectos')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="science" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Proyectos</q-item-label>
                    <q-item-label caption>Ver proyectos de líderes</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Proyectos de Líder
                  </q-tooltip>
                </q-item>

                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/lider/productos')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="inventory" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Productos</q-item-label>
                    <q-item-label caption>Ver productos de líderes</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Productos de Líder
                  </q-tooltip>
                </q-item>
              </template>

              <!-- Investigadores -->
              <template v-if="isResearcher">
                <q-item-label v-if="!miniState" header class="menu-section-title">
                  <q-icon name="science" size="18px" class="q-mr-xs" />
                  Investigación
                </q-item-label>
                <q-separator v-else class="q-my-sm" />
                
                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/investigador/proyectos')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="assignment" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Proyectos</q-item-label>
                    <q-item-label caption>Mis proyectos asignados</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Proyectos
                  </q-tooltip>
                </q-item>
  
                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/investigador/documentos')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="folder_open" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Documentos</q-item-label>
                    <q-item-label caption>Subir y gestionar documentos</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Documentos
                  </q-tooltip>
                </q-item>
  
                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/investigador/actividades')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="event" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Actividades</q-item-label>
                    <q-item-label caption>Registrar actividades</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Actividades
                  </q-tooltip>
                </q-item>
  
                <q-item 
                  clickable 
                  v-ripple 
                  @click="navigateTo('/app/investigador/perfil')" 
                  class="menu-item"
                  :class="{ 'menu-item-mini': miniState }"
                >
                  <q-item-section avatar class="menu-item-icon">
                    <q-icon name="person" />
                  </q-item-section>
                  <q-item-section v-if="!miniState">
                    <q-item-label>Mi Perfil</q-item-label>
                    <q-item-label caption>Gestionar mi información</q-item-label>
                  </q-item-section>
                  <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
                    Mi Perfil
                  </q-tooltip>
                </q-item>
              </template>
  
              <q-separator class="q-my-md" />
            </q-list>
          </q-scroll-area>
        </div>
      </q-drawer>
  
      <!-- Card de usuario -->
      <transition name="fade">
        <div v-if="showMorph" class="user-float-card">
          <q-card flat bordered class="user-card">
            <q-card-section class="user-card-header">
              <q-avatar size="48px" color="primary" text-color="white" class="text-weight-bold">
                {{ getInitials() }}
              </q-avatar>
              <div class="user-card-info">
                <div class="user-card-name">{{ firstName }} {{ lastName }}</div>
                <div class="user-card-role">{{ getRoleDisplayName() }}</div>
              </div>
              <q-btn flat round dense icon="close" @click="showMorph = false" />
            </q-card-section>
            
            <q-separator />
            
            <q-card-actions>
              <q-btn 
                flat 
                icon="logout" 
                label="Cerrar sesión"
                color="negative"
                class="full-width"
                @click="logout"
              />
            </q-card-actions>
          </q-card>
        </div>
      </transition>
  
      <q-page-container>
        <router-view />
      </q-page-container>
  
      <!-- Panel de notificaciones -->
      <transition name="slide-up">
        <div v-if="showNotifications" class="notifications-panel">
          <q-card flat bordered class="notifications-card">
            <q-card-section class="notifications-header">
              <div>
                <div class="text-h6 text-weight-medium">Notificaciones</div>
                <div class="text-caption text-grey-7">{{ unreadCount }} sin leer</div>
              </div>
              <div class="row q-gutter-xs">
                <q-btn 
                  flat 
                  round 
                  dense 
                  icon="done_all" 
                  @click="markAllAsRead"
                  size="sm"
                >
                  <q-tooltip>Marcar todas como leídas</q-tooltip>
                </q-btn>
                <q-btn 
                  flat 
                  round 
                  dense 
                  icon="close" 
                  @click="showNotifications = false"
                  size="sm"
                >
                  <q-tooltip>Cerrar</q-tooltip>
                </q-btn>
              </div>
            </q-card-section>
  
            <q-separator />
  
            <q-scroll-area style="height: 320px;">
              <q-list separator>
                <q-item 
                  v-for="note in notifications" 
                  :key="note.id" 
                  clickable
                  :class="{ 'notification-unread': !note.read }"
                  class="notification-item"
                >
                  <q-item-section avatar>
                    <q-avatar color="grey-3" size="40px">
                      <q-icon name="notifications" color="grey-7" />
                    </q-avatar>
                  </q-item-section>
  
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ note.title }}</q-item-label>
                    <q-item-label caption lines="2">{{ note.description }}</q-item-label>
                    <q-item-label caption class="text-grey-6 q-mt-xs">
                      <q-icon name="schedule" size="14px" />
                      {{ note.time }}
                    </q-item-label>
                  </q-item-section>
  
                  <q-item-section side>
                    <div class="column q-gutter-xs">
                      <q-btn 
                        flat 
                        round 
                        dense 
                        icon="done" 
                        color="positive" 
                        size="xs"
                        @click.stop="markAsRead(note)"
                      >
                        <q-tooltip>Marcar como leída</q-tooltip>
                      </q-btn>
                      <q-btn 
                        flat 
                        round 
                        dense 
                        icon="close" 
                        color="grey-6" 
                        size="xs"
                        @click.stop="deleteNotification(note.id)"
                      >
                        <q-tooltip>Eliminar</q-tooltip>
                      </q-btn>
                    </div>
                  </q-item-section>
                </q-item>
  
                <q-item v-if="notifications.length === 0" class="text-center">
                  <q-item-section>
                    <q-icon name="notifications_none" size="48px" color="grey-5" />
                    <div class="text-grey-6 q-mt-sm">No hay notificaciones</div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
  
            <q-separator />
  
            <q-card-actions align="between">
              <q-btn 
                flat 
                label="Limpiar todas" 
                color="negative" 
                size="sm"
                @click="clearAll"
                :disable="notifications.length === 0"
              />
              <q-btn 
                flat 
                label="Ver todas" 
                color="primary" 
                size="sm"
                @click="openAll"
              />
            </q-card-actions>
          </q-card>
        </div>
      </transition>
  
      <q-footer class="custom-footer">
        <q-toolbar class="footer-toolbar">
          <q-toolbar-title class="footer-text">
            Semillero Investigación © {{ new Date().getFullYear() }} - Todos los derechos reservados
          </q-toolbar-title>
        </q-toolbar>
      </q-footer>
    </q-layout>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/authStore.js'
  import { useNotifications } from '../composables/useNotifications'
  
  const showMorph = ref(false)
  const drawerOpen = ref(true)
  const miniState = ref(true)
  const firstName = ref('')
  const lastName = ref('')
  const role = ref('')
  const router = useRouter()
  const { success, error, info } = useNotifications()
  const authStore = useAuthStore()
  
  // NOTIFICACIONES 
  const showNotifications = ref(false)
  const notifications = ref([
    { id: 1, title: 'Bienvenido al Semillero', description: 'Tu cuenta se configuró correctamente.', time: 'Hace 2 horas', read: false },
    { id: 2, title: 'Nuevo proyecto', description: 'Se ha asignado un nuevo proyecto de investigación.', time: 'Hace 5 horas', read: false },
    { id: 3, title: 'Actualización', description: 'Se actualizó tu perfil correctamente.', time: 'Ayer', read: true }
  ])
  
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
  
  function toggleNotifications() {
    showNotifications.value = !showNotifications.value
  }
  
  function markAsRead(note) {
    note.read = true
  }
  
  function markAllAsRead() {
    notifications.value.forEach(n => { n.read = true })
    success('Todas las notificaciones marcadas como leídas')
  }
  
  function deleteNotification(id) {
    const idx = notifications.value.findIndex(n => n.id === id)
    if (idx !== -1) {
      notifications.value.splice(idx, 1)
      info('Notificación eliminada')
    }
  }
  
  function clearAll() {
    notifications.value = []
    error('Notificaciones limpiadas')
  }
  
  function openAll() {
    router.push('/app/investigacion/proyectos')
  }
  
  // MENÚ LATERAL
  const toggleDrawer = () => {
    drawerOpen.value = !drawerOpen.value
  }
  
  const navigateTo = (route) => {
    router.push(route)
  }
  
  // Computed properties para roles
  const isResearcher = computed(() => {
    return role.value === 'RESEARCHER' || role.value === 'COORDINATOR'
  })

  const isResearcherLeader = computed(() => {
    return (
      role.value === 'LEAD_RESEARCHER' ||
      role.value === 'LEADER' ||
      role.value === 'LIDER' // para soportar ambos formatos
    );
  })

  const isAdmin = computed(() => {
    return role.value === 'ADMIN' || role.value === 'DEPUTY_DIRECTOR'
  })
  
  const isSuper = computed(() => {
    return role.value === 'SUPER'
  })
  
  const isAdminOrSuper = computed(() => {
    return role.value === 'ADMIN' || role.value === 'DEPUTY_DIRECTOR' || role.value === 'SUPER'
  })
  
  function getRoleDisplayName(rol) {
    if (!rol) return '';
    switch ((rol+'').toUpperCase()) {
      case 'LEADER':
        return 'LIDER';
      case 'INVESTIGADOR':
        return 'INVESTIGADOR';
      case 'ADMIN':
        return 'ADMIN';
      case 'SUPER':
        return 'SUPER';
      case 'COORDINATOR':
        return 'COORDINADOR';
      default:
        return rol;
    }
  }
  
  const getInitials = () => {
    const first = firstName.value?.charAt(0) || ''
    const last = lastName.value?.charAt(0) || ''
    return (first + last).toUpperCase() || 'U'
  }
  
  // CARGAR LA INFORMACIÓN DEL USUARIO DESDE EL STORE DE PINIA
  onMounted(() => {
    authStore.loadAuth();
    // Intenta recuperar desde localStorage de nuevo si no viene bien:
    let user = authStore.getUser(); // Corregido: llamar la función con ()
    if (!user) {
      const authRaw = localStorage.getItem('auth');
      if (authRaw) {
        try {
          const auth = JSON.parse(authRaw);
          if (auth.user) {
            user = auth.user;
            // Guarda en Pinia por si no estaba - orden correcto: (token, user)
            authStore.setAuth(auth.token, auth.user);
            console.log('🟡 Usuario restaurado manualmente desde localStorage:', user);
          }
        } catch (e) { console.error('❌ Error parseando auth:', e); }
      }
    }
    console.log('🟣 Datos usuario login:', user);
    if (user) {
      if(user.firstName && user.lastName){
        firstName.value = user.firstName
        lastName.value = user.lastName
      }else{
        const Names = user.name ? user.name.split(" ") : ['',''];
        firstName.value = Names[0]
        lastName.value = Names[1]
      }
      if(Array.isArray(user.role)) {
        role.value = user.role[0]
        console.warn('⚠️ Rol vino como array:', user.role)
      } else {
        role.value = user.role
      }
      console.log('🟣 Rol resuelto para layout:', role.value);
    }
  })
  
  const logout = () => {
    // Limpiar completamente el store de Pinia (esto ya limpia el localStorage también)
    authStore.clearAuth()
    
    // Limpiar variables locales del componente
    firstName.value = ''
    lastName.value = ''
    role.value = ''
    
    showMorph.value = false
    
    // Redirigir al login usando window.location para asegurar la redirección
    window.location.href = '/'
  }
  </script>
  
  <style scoped>
  /* Variables globales basadas en quasar-variables.sass */
  :root {
    --header-height: 64px;
    
    /* Colores principales de Quasar */
    --primary-color: #71277A;
    --secondary-color: #8b4392;
    --accent-color: #4cbb17;
    
    /* Colores de estado */
    --positive-color: #21BA45;
    --negative-color: #C10015;
    --info-color: #31CCEC;
    --warning-color: #F2C037;
    --dark-color: #1d1d1d;
    
    /* Variantes de primary */
    --primary-dark: #5b1f62;
    --primary-light: #8d3d97;
    
    /* Dimensiones */
    --sidebar-width-expanded: 280px;
    --sidebar-width-mini: 72px;
  }
  
  /* Layout base */
  .q-layout,
  .q-page-container {
    overflow: hidden;
  }
  
  /* Header con morado del tema */
  .custom-header {
    background: #71277A !important;
    background: linear-gradient(135deg, #71277A 0%, #5b1f62 100%) !important;
    color: white !important;
    height: var(--header-height);
    box-shadow: 0 2px 8px rgba(113, 39, 122, 0.3) !important;
  }
  
  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--header-height);
    padding: 0 24px;
    max-width: 100%;
  }
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .menu-toggle-btn {
    color: white !important;
    transition: all 0.2s ease;
  }
  
  .menu-toggle-btn:hover {
    background: rgba(255, 255, 255, 0.15) !important;
  }
  
  .header-avatar img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .header-branding {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .header-title {
    font-size: 1.35rem;
    font-weight: 700;
    color: white;
    line-height: 1;
    letter-spacing: -0.5px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .header-subtitle {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .header-icon-btn {
    color: white !important;
    transition: all 0.2s ease;
  }
  
  .header-icon-btn:hover {
    background: rgba(255, 255, 255, 0.15) !important;
  }
  
  .header-user-btn {
    transition: all 0.2s ease;
  }
  
  .header-user-btn:hover {
    transform: scale(1.05);
    background: rgba(255, 255, 255, 0.15) !important;
  }
  
  /* Card de usuario flotante */
  .user-float-card {
    position: fixed;
    top: calc(var(--header-height) + 12px);
    right: 24px;
    z-index: 9999;
    width: 280px;
  }
  
  .user-card {
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    border: 1px solid #e5e7eb;
  }
  
  .user-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
  }
  
  .user-card-info {
    flex: 1;
    min-width: 0;
  }
  
  .user-card-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: #2c3e50;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .user-card-role {
    font-size: 0.8rem;
    color: #6b7280;
  }
  
  /* Sidebar con hover expandible */
  .sidebar-drawer {
    background: white;
    border-right: 2px solid rgba(113, 39, 122, 0.1);
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  
  .sidebar-content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .sidebar-header {
    padding: 20px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    background: linear-gradient(135deg, rgba(113, 39, 122, 0.08) 0%, rgba(113, 39, 122, 0.03) 100%);
    border-bottom: 2px solid rgba(113, 39, 122, 0.15);
    transition: all 0.3s ease;
  }
  
  .sidebar-header-mini {
    padding: 16px 12px;
  }
  
  .sidebar-user-info {
    text-align: center;
    width: 100%;
  }
  
  .sidebar-user-name {
    font-size: 1rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 6px;
  }
  
  .sidebar-user-role {
    font-size: 0.8rem;
    color: var(--primary-dark);
    padding: 4px 12px;
    background: rgba(113, 39, 122, 0.1);
    border-radius: 12px;
    display: inline-block;
    border: 1px solid rgba(113, 39, 122, 0.2);
    font-weight: 600;
  }
  
  .sidebar-scroll-area {
    flex: 1;
    height: calc(100vh - var(--header-height) - 140px);
  }
  
  .sidebar-menu {
    padding: 8px 4px;
  }
  
  .menu-section-title {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--primary-dark);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 12px 12px 8px;
    display: flex;
    align-items: center;
    margin-top: 8px;
  }
  
  .menu-item {
    border-radius: 8px;
    margin: 4px 8px;
    transition: all 0.2s ease;
    position: relative;
    min-height: 48px;
  }
  
  .menu-item-mini {
    justify-content: center;
    padding-left: 0;
    padding-right: 0;
  }
  
  .menu-item-mini .menu-item-icon {
    min-width: auto;
    padding-right: 0;
  }
  
  .menu-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: var(--primary-color);
    border-radius: 0 4px 4px 0;
    transform: scaleY(0);
    transition: transform 0.2s ease;
  }
  
  .menu-item .q-item-section {
    color: #4b5563;
  }
  
  .menu-item .q-icon {
    color: #9ca3af;
    font-size: 22px;
    transition: all 0.2s ease;
  }
  
  .menu-item:hover::before {
    transform: scaleY(1);
  }
  
  .menu-item:hover {
    background: linear-gradient(135deg, rgba(113, 39, 122, 0.12) 0%, rgba(113, 39, 122, 0.08) 100%);
  }
  
  .menu-item:hover .q-item-section,
  .menu-item:hover .q-icon {
    color: var(--primary-dark);
  }
  
  .menu-item:hover .q-icon {
    transform: scale(1.1);
  }
  
  .menu-item .q-item-label {
    font-weight: 500;
    font-size: 0.875rem;
  }
  
  .menu-item .q-item-label.caption {
    font-size: 0.75rem;
    color: #9ca3af;
    line-height: 1.2;
  }
  
  /* Panel de notificaciones */
  .notifications-panel {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    width: 380px;
    max-width: calc(100vw - 48px);
  }
  
  .notifications-card {
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border: 1px solid #e5e7eb;
  }
  
  .notifications-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 2px solid rgba(113, 39, 122, 0.1);
  }
  
  .notification-item {
    transition: background 0.2s ease;
  }
  
  .notification-item:hover {
    background: #f9fafb;
  }
  
  .notification-unread {
    background: linear-gradient(135deg, rgba(113, 39, 122, 0.08) 0%, rgba(113, 39, 122, 0.03) 100%);
    border-left: 3px solid var(--primary-color);
  }
  
  /* Footer con acento verde */
  .custom-footer {
    background: white;
    border-top: 2px solid rgba(113, 39, 122, 0.15);
    height: 48px;
  }
  
  .footer-toolbar {
    min-height: 48px;
    padding: 0 24px;
  }
  
  .footer-text {
    font-size: 0.8rem;
    color: #6b7280;
    text-align: center;
    font-weight: 500;
  }
  
  /* Transiciones */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }
  
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .fade-slide-enter-from {
    opacity: 0;
    transform: translateX(-10px);
  }
  
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-10px);
  }
  
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .slide-up-enter-from,
  .slide-up-leave-to {
    opacity: 0;
    transform: translateY(16px);
  }
  
  /* Responsive */
  @media (max-width: 1023px) {
    .sidebar-drawer {
      width: 280px !important;
    }
    
    .menu-item-mini {
      padding-left: 16px;
    }
  }
  
  @media (max-width: 768px) {
    .header-container {
      padding: 0 16px;
    }
  
    .header-title {
      font-size: 1.15rem;
    }
  
    .header-subtitle {
      font-size: 0.7rem;
    }
  
    .user-float-card {
      right: 16px;
      width: calc(100vw - 32px);
      max-width: 320px;
    }
  
    .notifications-panel {
      right: 16px;
      bottom: 16px;
      width: calc(100vw - 32px);
    }
  
    .sidebar-drawer {
      width: 280px !important;
      max-width: 320px;
    }
  }
  
  @media (max-width: 480px) {
    .header-avatar {
      width: 40px;
      height: 40px;
    }
  
    .header-title {
      font-size: 1rem;
    }
  
    .header-subtitle {
      display: none;
    }
  
    .footer-text {
      font-size: 0.7rem;
    }
  }
  </style>