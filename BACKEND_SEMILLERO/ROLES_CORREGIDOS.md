# 👥 Roles del Sistema SENA - Corregidos

## ✅ **Solo 5 Roles Principales:**

### 1. **ADMIN** - Administrador del Sistema
- **Modelo**: `Researcher`
- **Ruta de Login**: `POST /api/researchers/login`
- **Documento**: `11111111`
- **Password**: `admin123`
- **Permisos**: Control total del sistema

### 2. **DEPUTY_DIRECTOR** - Subdirector
- **Modelo**: `DeputyDirector`
- **Ruta de Login**: `POST /api/deputy-directors/login`
- **Documento**: `22222222`
- **Password**: `subdirector123`
- **Permisos**: Gestión de coordinadores y líderes

### 3. **COORDINATOR** - Coordinador
- **Modelo**: `Researcher`
- **Ruta de Login**: `POST /api/researchers/login`
- **Documento**: `33333333`
- **Password**: `coordinador123`
- **Permisos**: Gestión de líderes de semillero

### 4. **LEADER** - Líder de Semillero
- **Modelo**: `Researcher`
- **Ruta de Login**: `POST /api/researchers/login`
- **Documento**: `44444444`
- **Password**: `lider123`
- **Permisos**: Gestión de semilleros

### 5. **RESEARCHER** - Investigador
- **Modelo**: `Researcher`
- **Ruta de Login**: `POST /api/researchers/login`
- **Documento**: `55555555`
- **Password**: `investigador123`
- **Permisos**: Acceso básico a sus recursos


## 🔐 **Rutas de Login Correctas:**

### **Solo 2 rutas de login necesarias:**

1. **`POST /api/researchers/login`**
   - Para: ADMIN, COORDINATOR, LEADER, RESEARCHER
   - Usa el modelo `Researcher`

2. **`POST /api/deputy-directors/login`**
   - Para: DEPUTY_DIRECTOR
   - Usa el modelo `DeputyDirector`

## 📊 **Jerarquía de Permisos:**

```
ADMIN (11111111)
├── Control total del sistema
├── Crear/editar/eliminar cualquier entidad
└── Gestionar todos los usuarios

DEPUTY_DIRECTOR (22222222)
├── Crear coordinadores y líderes
├── Gestionar centros de formación
└── Asignar roles a investigadores

COORDINATOR (33333333)
├── Crear líderes de semillero
├── Gestionar grupos de investigación
└── Supervisar proyectos

LEADER (44444444)
├── Gestionar semilleros
├── Crear proyectos
└── Asignar investigadores a proyectos

RESEARCHER (55555555)
├── Ver sus proyectos asignados
├── Crear actividades
└── Gestionar productos de investigación
```

## 🎯 **Colección de Postman Actualizada:**

- ✅ **5 requests de login** (uno por rol)
- ✅ **2 rutas de login** (una por modelo)
- ✅ **Variables actualizadas** sin usuarios genéricos
- ✅ **Documentación corregida**

¡Ahora el sistema tiene solo los 5 roles necesarios y las rutas de login correctas! 🚀
