<template>
  <q-layout view="hHh lpR fFf">
    <!-- HEADER -->
    <q-header elevated class="login-header">
      <q-toolbar>
        <q-toolbar-title class="text-center">
          <div class="header-logo">
            <q-icon name="science" size="32px" class="q-mr-sm" />
            <span class="header-title-text">SEMILLEROS</span>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- LOGIN PAGE -->
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-lg" style="width: 100%; max-width: 500px;">
          <q-card bordered class="login-card q-pa-xl">

            <!-- ICONO -->
            <div class="text-center q-mb-lg">
              <q-icon name="account_circle" size="80px" class="login-icon" />
            </div>

            <!-- ROL -->
            <q-select
              v-model="selectedRole"
              :options="roles"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              label="Rol"
              outlined
              class="q-mb-md login-input"
            >
              <template #prepend>
                <q-icon name="person" color="grey-6" />
              </template>
            </q-select>

            <!-- DOCUMENTO -->
            <q-input
              v-model="cedula"
              label="Cédula"
              outlined
              class="q-mb-md login-input"
              type="text"
              :rules="cedulaRules"
              lazy-rules
            >
              <template #prepend>
                <q-icon name="badge" color="grey-6" />
              </template>
            </q-input>

            <!-- CONTRASEÑA -->
            <q-input
              v-model="password"
              label="Contraseña"
              outlined
              class="q-mb-md login-input"
              :type="isPwd ? 'password' : 'text'"
              :rules="passwordRules"
              lazy-rules
            >
              <template #prepend>
                <q-icon name="lock" color="grey-6" />
              </template>
              <template #append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <!-- ERROR -->
            <div v-if="errorMessage" class="text-center q-mb-md">
              <q-banner rounded class="bg-red-1 text-red-8">
                {{ errorMessage }}
              </q-banner>
            </div>

            <!-- BOTÓN LOGIN -->
            <div class="text-center q-mt-lg">
              <q-btn
                label="INGRESAR"
                color="primary"
                unelevated
                rounded
                padding="md xl"
                class="text-weight-bold full-width login-button"
                @click="login"
                :loading="loading"
                :disable="loading"
              />
            </div>
          </q-card>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { useNotifications } from "../composables/useNotifications";

const router = useRouter();
const authStore = useAuthStore();
const { error, info } = useNotifications();

// === CAMPOS ===
const cedula = ref("");
const password = ref("");
const isPwd = ref(true);
const selectedRole = ref(null);
const loading = ref(false);
const errorMessage = ref("");

// === ROLES ===
const roles = [
  { label: "Administrador", value: "ADMINISTRADOR" },
  { label: "Investigador", value: "INVESTIGADOR" },
];

// === VALIDACIONES ===
const cedulaRules = [
  (val) => !!val || "El documento es obligatorio",
  (val) => /^\d{7,10}$/.test(val) || "Debe tener entre 7 y 10 dígitos",
];

const passwordRules = [
  (val) => !!val || "La contraseña es obligatoria",
  (val) => val.length >= 6 || "Debe tener al menos 6 caracteres",
];

// === LOGIN ===
const login = async () => {
  errorMessage.value = "";

  // Validaciones previas
  if (!selectedRole.value) return info("Selecciona tu rol");
  if (!cedula.value) return info("Ingresa tu cédula");
  if (!password.value) return info("Ingresa tu contraseña");

  loading.value = true;

  try {
    const response = await fetch("http://localhost:5000/api/researchers/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        document_number: cedula.value.trim(),
        password: password.value.trim(),
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || "Error en autenticación");

    const user = data.researcher || data.user || {};
    const backendRole = user.role?.trim().toUpperCase() || "";
    const selected = selectedRole.value.trim().toUpperCase();

    // Roles válidos
    const validRoles = {
      ADMINISTRADOR: ["SUPER", "ADMIN"],
      INVESTIGADOR: ["INVESTIGADOR", "LIDER"],
    };

    if (!validRoles[selected]?.includes(backendRole)) {
      errorMessage.value = "Acceso denegado: rol no autorizado.";
      return;
    }

    // Guardar sesión y redirigir
    authStore.setAuth(data.token, user);

    if (["SUPER", "ADMIN"].includes(backendRole)) {
      router.push("/app/super/centros");
    } else if (["INVESTIGADOR", "LIDER"].includes(backendRole)) {
      router.push("/app/lider/actividades");
    }

  } catch (err) {
    console.error("Error en login:", err);
    const msg = err.message || "Error de conexión. Verifica el servidor.";
    errorMessage.value = msg;
    error(msg);
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.login-header {
  background: linear-gradient(135deg, $primary-color 0%, $primary-hover 100%);
  box-shadow: 0 2px 8px $primary-shadow;
}

.header-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-title-text {
  font-size: 1.5rem;
  font-weight: 700;
}

.login-card {
  border-radius: 16px;
  border: 3px solid $primary-color !important;
  box-shadow: 0 4px 16px $shadow-light;
}

.login-icon {
  color: $primary-color;
}

.login-input :deep(.q-field__control) {
  border-radius: 8px;
}

.login-input :deep(.q-field--outlined .q-field__control) {
  border: 2px solid #e0e0e0;
  transition: border-color 0.3s ease;
}

.login-input :deep(.q-field--outlined.q-field--highlighted .q-field__control) {
  border: 2px solid $primary-color;
}

.login-input :deep(.q-field__label) {
  color: #6b7280;
  font-weight: 500;
}

.login-button {
  background: linear-gradient(135deg, $primary-color 0%, $primary-hover 100%);
  box-shadow: 0 4px 12px $primary-shadow;
  transition: all 0.3s ease;
}

.login-button:hover {
  box-shadow: 0 6px 16px $shadow-dark;
  transform: translateY(-2px);
}
</style>
