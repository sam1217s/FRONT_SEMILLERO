# Colecciones Postman Disponibles

Este proyecto incluye **DOS colecciones de Postman** optimizadas para diferentes estilos de trabajo:

## 📁 Colecciones Disponibles

### 1. `SENA_Research_System_API_v2.postman_collection.json`
**Estilo:** Manual / Flexible

**Características:**
- Un solo request por endpoint
- Todos los requests usan la variable genérica `{{token}}`
- Debes cambiar manualmente entre roles
- Los logins guardan en variables específicas (`tokensuper`, `tokenadmin`, etc.) Y en `token`
- Más compacto, menos requests

**Ideal para:**
- ✅ Usuarios que prefieren control manual
- ✅ Testing rápido con un solo rol
- ✅ Familiarizarse con la API
- ✅ Exploración inicial

**Flujo de trabajo:**
```
1. Login como SUPER → guarda en tokensuper y token
2. Usar endpoints (usan {{token}})
3. Para cambiar de rol: Login como ADMIN → actualiza token
4. O cambiar manualmente el header x-token a {{tokensuper}}
```

---

### 2. `SENA_Research_System_API_v3.postman_collection.json` ⭐ **RECOMENDADO**
**Estilo:** Automático / Organizado por Rol

**Características:**
- ✅ **Tokens automáticos por carpeta**
- Requests organizados por rol en carpetas separadas
- Cada carpeta usa su token específico automáticamente
- No necesitas cambiar headers manualmente

**Estructura:**
```
📁 🔐 Autenticación
   ├─ Login SUPER
   ├─ Login ADMIN
   ├─ Login LIDER
   └─ Login INVESTIGADOR

📁 👥 Investigadores - Como SUPER (usa {{tokensuper}})
   ├─ Listar Investigadores
   ├─ Crear Investigador
   ├─ Agregar Rol
   └─ Eliminar Investigador

📁 👥 Investigadores - Como ADMIN (usa {{tokenadmin}})
   ├─ Listar Investigadores
   ├─ Crear Investigador
   └─ Inactivar Investigador

📁 👥 Investigadores - Como LIDER (usa {{tokenlider}})
   ├─ Listar Investigadores
   └─ Ver Investigador

📁 👥 Investigadores - Como INVESTIGADOR (usa {{tokeninvestigador}})
   ├─ Listar Investigadores
   └─ Ver Mi Perfil

📁 📁 Proyectos - Como ADMIN (usa {{tokenadmin}})
📁 📁 Proyectos - Como LIDER (usa {{tokenlider}})
📁 🏢 Centros - Como SUPER (usa {{tokensuper}})
```

**Ideal para:**
- ✅ Testing de permisos y RBAC
- ✅ Probar múltiples roles simultáneamente
- ✅ Workflow organizado y claro
- ✅ Evitar errores de permisos
- ✅ Demos y presentaciones

**Flujo de trabajo:**
```
1. Ejecutar los 4 logins una vez
2. Navegar a "Investigadores - Como SUPER"
3. Ejecutar requests → usan tokensuper automáticamente
4. Cambiar a "Investigadores - Como ADMIN"
5. Ejecutar requests → usan tokenadmin automáticamente
```

---

## 🚀 Inicio Rápido

### Para Cualquier Colección:

**Paso 1:** Importar colección en Postman
- Arrastra el archivo `.json` de la colección a Postman
- O usa: File → Import

**Paso 2:** Importar Environment (IMPORTANTE)
- **Archivo:** `SENA_Research_API.postman_environment.json`
- En Postman: Environments → Import
- Seleccionar el archivo de environment
- **Activar** el environment importado (click en el dropdown)

El environment incluye las siguientes variables:
```json
{
  "base_url": "http://localhost:5000",
  "tokensuper": "",
  "tokenadmin": "",
  "tokenlider": "",
  "tokeninvestigador": "",
  "token": "",
  "current_role": ""
}
```

**Paso 3:** Ejecutar logins
```
Carpeta: 🔐 Autenticación
Ejecutar: Login SUPER, Login ADMIN, Login LIDER, Login INVESTIGADOR
```

**Paso 4:** Usar endpoints
- **v2**: Ejecuta cualquier request (usa el último token)
- **v3**: Navega a la carpeta del rol que necesitas

---

## 🔑 Credenciales de Prueba

Todos los usuarios usan la misma contraseña: `password123`

| Rol          | Documento | Password    | Variable Guardada      |
|--------------|-----------|-------------|------------------------|
| SUPER        | 99999999  | password123 | `tokensuper`           |
| ADMIN        | 11111111  | password123 | `tokenadmin`           |
| LIDER        | 33333333  | password123 | `tokenlider`           |
| INVESTIGADOR | 44444444  | password123 | `tokeninvestigador`    |

---

## 💡 Ejemplos de Uso

### Escenario 1: Probar Permisos de RBAC

**Con v3 (Recomendado):**
```
1. Ejecutar todos los logins
2. Ir a "Investigadores - Como INVESTIGADOR"
3. Ejecutar "Crear Investigador"
   → ❌ Debería fallar (403 Forbidden) ✅
4. Ir a "Investigadores - Como SUPER"
5. Ejecutar "Crear Investigador"
   → ✅ Debería funcionar ✅
```

**Con v2:**
```
1. Login INVESTIGADOR
2. Ejecutar "Crear Investigador"
   → ❌ Falla (403)
3. Login SUPER
4. Ejecutar "Crear Investigador"
   → ✅ Funciona
```

### Escenario 2: Workflow Multi-Rol

**Con v3 (Recomendado):**
```
1. Ejecutar todos los logins UNA VEZ
2. Navegar entre carpetas según necesites
3. Los tokens se usan automáticamente
4. Sin re-login necesario
```

**Con v2:**
```
1. Login como rol A
2. Probar endpoints
3. Login como rol B (sobrescribe token)
4. Probar endpoints
5. Para volver a rol A: cambiar header manualmente a {{tokensuper}}
```

---

## 📋 Comparación Rápida

| Característica | v2 Manual | v3 Auto ⭐ |
|----------------|-----------|------------|
| Requests duplicados | No | Sí (organizados por rol) |
| Token automático por rol | No | ✅ Sí |
| Cambio manual de headers | ✅ Sí | No necesario |
| Ideal para testing RBAC | ⚠️ Requiere cambios manuales | ✅ Perfecto |
| Tamaño de colección | Compacto | Mayor (más requests) |
| Curva de aprendizaje | Baja | Muy baja |
| Evita errores de permisos | No | ✅ Sí |

---

## 🎯 Recomendación

### Usa **v3** si:
- ✅ Vas a probar múltiples roles
- ✅ Quieres evitar errores de token incorrecto
- ✅ Prefieres organización clara
- ✅ Haces testing de permisos RBAC

### Usa **v2** si:
- ✅ Prefieres colección compacta
- ✅ Solo usas un rol la mayoría del tiempo
- ✅ Prefieres control manual total
- ✅ Tienes familiaridad con cambio manual de variables

---

## 📚 Documentación Adicional

Ver `POSTMAN_v2_GUIDE.md` para guía completa de uso, endpoints, scripts automáticos y troubleshooting.

---

## 📄 Archivos de la Colección

### Colecciones:
1. **`SENA_Research_System_API_v2.postman_collection.json`** - Colección manual/flexible
2. **`SENA_Research_System_API_v3.postman_collection.json`** - Colección automática por rol ⭐

### Environment:
3. **`SENA_Research_API.postman_environment.json`** - Variables de environment (REQUERIDO)

**⚠️ IMPORTANTE:** El archivo de environment es **OBLIGATORIO** para ambas colecciones. Sin él, las variables como `{{base_url}}`, `{{tokensuper}}`, etc. no estarán disponibles.

### Cómo Usar el Environment:
1. Importar: Environments → Import → Seleccionar `SENA_Research_API.postman_environment.json`
2. Activar: Click en el dropdown de environments y seleccionar "SENA Research API - Environment"
3. Verificar: Las variables deben aparecer en el panel de environments
4. Los tokens se llenarán automáticamente al ejecutar los logins

---

**Última actualización:** 2025-10-31
**Versiones:** v2 (Manual) | v3 (Auto) ⭐
**Environment:** SENA_Research_API.postman_environment.json (Requerido)
