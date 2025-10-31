# Guía de Uso - Colección Postman v3

## 📋 Archivo de Colección
**Archivo:** `SENA_Research_System_API_v2.postman_collection.json`

## 🆕 Novedades en la Versión 3

### 🔑 **Tokens Específicos por Rol**
Cada endpoint de login ahora guarda el token en **dos variables de entorno**:

1. **Variable específica del rol**: Permite mantener múltiples tokens activos simultáneamente
   - Login SUPER → guarda en `tokensuper`
   - Login ADMIN → guarda en `tokenadmin`
   - Login LIDER → guarda en `tokenlider`
   - Login INVESTIGADOR → guarda en `tokeninvestigador`

2. **Variable genérica**: `token` (se sobrescribe con cada login)

**Beneficios:**
- ✅ Probar diferentes roles sin perder los tokens anteriores
- ✅ Cambiar rápidamente entre roles durante testing
- ✅ Mantener sesiones activas de múltiples usuarios

**Uso:**
```javascript
// Los endpoints protegidos usan {{token}} por defecto
// Pero puedes cambiar manualmente a cualquier token específico:
{{tokensuper}}      // Para usar token de SUPER
{{tokenadmin}}      // Para usar token de ADMIN
{{tokenlider}}      // Para usar token de LIDER
{{tokeninvestigador}} // Para usar token de INVESTIGADOR
```

### 👥 **Credenciales Actualizadas**
Todas las contraseñas ahora son: `password123`

| Rol          | Documento | Password    | Variable Token       |
|--------------|-----------|-------------|----------------------|
| SUPER        | 99999999  | password123 | `{{tokensuper}}`     |
| ADMIN        | 11111111  | password123 | `{{tokenadmin}}`     |
| LIDER        | 33333333  | password123 | `{{tokenlider}}`     |
| INVESTIGADOR | 44444444  | password123 | `{{tokeninvestigador}}` |

## 🆕 Novedades de Versiones Anteriores

### 1. **Paginación Implementada**
Todos los endpoints de listado ahora soportan paginación:

```
GET /api/researchers/list?page=1&limit=10
GET /api/projects/list?page=2&limit=20
```

**Parámetros de Query:**
- `page`: Número de página (default: 1)
- `limit`: Registros por página (default: 10, max: 100)

**Respuesta Paginada:**
```json
{
  "data": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 2. **Rate Limiting Documentado**
- **Login (Auth)**: 5 intentos cada 15 minutos
- **API General**: 100 requests cada 15 minutos
- Headers de respuesta:
  - `RateLimit-Limit`: Límite total
  - `RateLimit-Remaining`: Requests restantes
  - `RateLimit-Reset`: Timestamp de reset

### 3. **Estados Numéricos Estandarizados**

#### Estados Generales (Researcher, TrainingCenter)
- `0`: Activo
- `1`: Inactivo

#### Estados de Actividades
- `2`: Pendiente
- `3`: En proceso
- `4`: Completada
- `5`: Cancelada
- `6`: Retrasada

#### Estados de Proyectos
- `0`: Activo
- `1`: Inactivo
- `2`: Pendiente
- `3`: En progreso
- `4`: Completado
- `5`: Cancelado
- `6`: Suspendido
- `7`: Archivado
- `8`: En revisión
- `9`: Aprobado
- `10`: Rechazado

#### Estados de Reuniones
- `2`: Programada
- `3`: En curso
- `4`: Completada
- `5`: Cancelada

#### Estados de Productos
- `2`: Planificado
- `3`: En desarrollo
- `4`: Entregado
- `8`: En revisión
- `9`: Publicado
- `10`: Rechazado

#### Estados de Recursos
- `0`: Disponible
- `1`: Inactivo
- `2`: Asignado
- `3`: En uso
- `7`: Agotado

**📚 Referencia completa:** Ver `constants/status.constants.js`

### 4. **Roles Actualizados**
Se eliminaron roles deprecados. Roles válidos:
- `SUPER`: Super administrador (control total)
- `ADMIN`: Administrador
- `LIDER`: Líder de grupo/semillero
- `INVESTIGADOR`: Investigador básico

❌ **Roles eliminados:** `DEPUTY_DIRECTOR`, `COORDINATOR`

## 🚀 Cómo Usar la Colección

### Paso 1: Importar la Colección
1. Abrir Postman
2. Click en **Import**
3. Seleccionar `SENA_Research_System_API_v2.postman_collection.json`
4. Click en **Import**

### Paso 2: Importar Environment (OBLIGATORIO)
**Archivo:** `SENA_Research_API.postman_environment.json`

1. En Postman: **Environments** → **Import**
2. Seleccionar archivo: `SENA_Research_API.postman_environment.json`
3. **Activar** el environment (click en el dropdown y seleccionar "SENA Research API - Environment")

El environment incluye estas variables (auto-llenadas por los logins):
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

**⚠️ IMPORTANTE:** Sin el environment, las colecciones NO funcionarán. Las variables como `{{base_url}}` y `{{token}}` deben estar definidas en el environment.

### Paso 3: Autenticación
1. Ir a la carpeta **🔐 Autenticación**
2. Ejecutar cualquier request de login (Super, Admin, Líder, Investigador)
3. El token se guardará automáticamente en:
   - Variable específica del rol: `{{tokensuper}}`, `{{tokenadmin}}`, etc.
   - Variable genérica: `{{token}}` (sobrescrita en cada login)
4. El rol actual se guardará en `{{current_role}}`

**Usuarios de Prueba (v3):**
```javascript
// Super Administrador
{
  "document_number": "99999999",
  "password": "password123"
}
// Token guardado en: tokensuper

// Administrador
{
  "document_number": "11111111",
  "password": "password123"
}
// Token guardado en: tokenadmin

// Líder
{
  "document_number": "33333333",
  "password": "password123"
}
// Token guardado en: tokenlider

// Investigador
{
  "document_number": "44444444",
  "password": "password123"
}
// Token guardado en: tokeninvestigador
```

**💡 Ejemplo de Flujo de Trabajo con Múltiples Tokens:**

```bash
# 1. Login como SUPER (guarda en tokensuper y token)
POST /api/researchers/login { "document_number": "99999999", "password": "password123" }
# Variables: tokensuper=XXX, token=XXX

# 2. Login como ADMIN (guarda en tokenadmin y token)
POST /api/researchers/login { "document_number": "11111111", "password": "password123" }
# Variables: tokensuper=XXX, tokenadmin=YYY, token=YYY (actualizado)

# 3. Ahora puedes usar cualquier token:
# - Usa {{token}} para el último login (ADMIN)
# - Usa {{tokensuper}} para operaciones de SUPER
# - Cambia manualmente el header x-token a {{tokensuper}} cuando necesites permisos SUPER

# 4. Login como INVESTIGADOR
POST /api/researchers/login { "document_number": "44444444", "password": "password123" }
# Variables: tokensuper=XXX, tokenadmin=YYY, tokeninvestigador=ZZZ, token=ZZZ

# 5. Ahora tienes 3 tokens simultáneos disponibles para testing
```

### Paso 4: Usar Endpoints
El token se agrega automáticamente a todos los requests mediante el header:
```
x-token: {{token}}
```

## 📊 Endpoints Principales

### Investigadores
```
GET    /api/researchers/list?page=1&limit=10  [SUPER, ADMIN, LIDER, INVESTIGADOR]
GET    /api/researchers/:id                    [SUPER, ADMIN, LIDER, INVESTIGADOR]
POST   /api/researchers/create                 [SUPER, ADMIN]
PUT    /api/researchers/update/:id             [SUPER, ADMIN, owner]
POST   /api/researchers/add-role/:id           [SUPER, ADMIN]
PUT    /api/researchers/activate/:id           [SUPER, ADMIN]
PUT    /api/researchers/inactivate/:id         [SUPER, ADMIN]
DELETE /api/researchers/delete/:id             [SUPER, ADMIN]
```

### Proyectos
```
GET    /api/projects/list?page=1&limit=10     [SUPER, ADMIN, LIDER, INVESTIGADOR]
GET    /api/projects/:id                       [SUPER, ADMIN, LIDER, INVESTIGADOR]
POST   /api/projects/create                    [ADMIN, LIDER]
PUT    /api/projects/update/:id                [ADMIN, LIDER]
DELETE /api/projects/delete/:id                [ADMIN]
```

### Centros de Formación
```
GET    /api/training-centers/list             [SUPER, ADMIN, LIDER, INVESTIGADOR]
POST   /api/training-centers/create           [SUPER]
```

## 🔧 Scripts Automáticos

### Pre-request Script (Global)
Agrega automáticamente el token a todos los requests:
```javascript
const token = pm.environment.get('token');
if (token) {
    pm.request.headers.add({
        key: 'x-token',
        value: token
    });
}
```

### Test Script (Global)
Registra información de rate limiting:
```javascript
const rateLimit = pm.response.headers.get('RateLimit-Limit');
const rateLimitRemaining = pm.response.headers.get('RateLimit-Remaining');
if (rateLimit) {
    console.log(`Rate Limit: ${rateLimitRemaining}/${rateLimit}`);
}
```

### Test Script (Login) - v3
Guarda token en variable específica del rol y en variable genérica:
```javascript
// Ejemplo para Login SUPER
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set('tokensuper', jsonData.token);  // Token específico
    pm.environment.set('token', jsonData.token);       // Token genérico
    pm.environment.set('current_role', 'SUPER');
    console.log('✅ Token SUPER guardado en variables: tokensuper y token');
    console.log('Token:', jsonData.token);
}

// Similar para ADMIN → tokenadmin
// Similar para LIDER → tokenlider
// Similar para INVESTIGADOR → tokeninvestigador
```

## 🛡️ Límites de Seguridad

### Request Size Limits
- **JSON Body**: 10 MB máximo
- **URL-encoded**: 10 MB máximo
- **File Upload**: 50 MB máximo

### Rate Limiting
| Endpoint | Límite | Ventana |
|----------|--------|---------|
| Login | 5 requests | 15 minutos |
| Create Operations | 20 requests | 15 minutos |
| General API | 100 requests | 15 minutos |

## ❓ Preguntas Frecuentes

### ¿Por qué recibo 401 Unauthorized?
- Verificar que el token esté configurado en las variables de entorno
- Verificar que el token no haya expirado (duración: 48 horas)
- Hacer login nuevamente

### ¿Por qué recibo 403 Forbidden?
- Tu rol no tiene permisos para ese endpoint
- Verificar los roles permitidos en la descripción del request

### ¿Por qué recibo 429 Too Many Requests?
- Has excedido el rate limit
- Esperar el tiempo indicado en el mensaje de error (típicamente 15 minutos)
- Ver headers `RateLimit-*` para más información

### ¿Cómo filtrar resultados paginados?
Usar query parameters adicionales:
```
GET /api/researchers/list?page=1&limit=10&name=juan&status=0
```

## 📝 Notas Importantes

1. **Hard Deletes**: Los endpoints DELETE eliminan permanentemente los registros. No hay recuperación.

2. **Status Updates**: Solo SUPER y ADMIN pueden modificar el campo `status` de investigadores.

3. **Token Expiration**: Los tokens JWT expiran después de 48 horas. Hacer login nuevamente.

4. **Validation Errors**: Los errores de validación retornan status 400 con detalles:
   ```json
   {
     "success": false,
     "msg": "Error de validación de datos",
     "statusCode": 400,
     "data": {
       "errors": [
         {
           "field": "email",
           "message": "Email ya existe"
         }
       ]
     }
   }
   ```

5. **Structured Error Responses**: Todos los errores siguen el formato:
   ```json
   {
     "success": false,
     "msg": "Descripción del error",
     "statusCode": 400,
     "data": {...}
   }
   ```

## 🔗 Enlaces Útiles

- **Documentación API**: `http://localhost:5000/api`
- **GitHub Repository**: [sam1217s/BACKEND_SEMILLERO](https://github.com/sam1217s/BACKEND_SEMILLERO)
- **Status Constants Reference**: `/constants/status.constants.js`

---

**Última actualización:** 2025-10-31
**Versión:** 3.0.0 (Tokens por Rol)
**Características principales:**
- ✅ Tokens específicos por rol (tokensuper, tokenadmin, tokenlider, tokeninvestigador)
- ✅ Paginación en endpoints de listado
- ✅ Rate limiting documentado
- ✅ Estados numéricos estandarizados
- ✅ Credenciales actualizadas (password123)
