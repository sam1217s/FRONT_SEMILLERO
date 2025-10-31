# 📮 Instrucciones para Postman - Sistema SENA

## 🚀 Configuración Inicial

### 1. Importar la Colección
1. Abre Postman
2. Haz clic en **Import**
3. Selecciona el archivo `SENA_Research_System_API.postman_collection.json`
4. La colección se importará automáticamente

### 2. Verificar Variables de Entorno
La colección ya viene configurada con todas las variables necesarias:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `base_url` | `http://localhost:5000` | URL base de la API |
| `admin_document` | `11111111` | Documento del administrador |
| `admin_password` | `admin123` | Contraseña del administrador |
| `subdirector_document` | `22222222` | Documento del subdirector |
| `subdirector_password` | `subdirector123` | Contraseña del subdirector |
| `coordinator_document` | `33333333` | Documento del coordinador |
| `coordinator_password` | `coordinador123` | Contraseña del coordinador |
| `leader_document` | `44444444` | Documento del líder |
| `leader_password` | `lider123` | Contraseña del líder |
| `researcher_document` | `55555555` | Documento del investigador |
| `researcher_password` | `investigador123` | Contraseña del investigador |
| `user_document` | `66666666` | Documento del usuario genérico |
| `user_password` | `usuario123` | Contraseña del usuario genérico |

## 🔐 Flujo de Autenticación

### Paso 1: Iniciar el Servidor
```bash
npm run dev
```
El servidor debe estar corriendo en `http://localhost:5000`

### Paso 2: Hacer Login
1. Ve a la carpeta **🔐 Autenticación**
2. Selecciona el tipo de usuario que quieres probar:
   - **Login Administrador** - Control total del sistema
   - **Login Subdirector** - Gestión de coordinadores y líderes
   - **Login Coordinador** - Gestión de líderes de semillero
   - **Login Líder** - Gestión de semilleros
   - **Login Investigador** - Investigador básico
   - **Login Usuario Genérico** - Usuario del modelo User

3. Haz clic en **Send**
4. Copia el **token** de la respuesta

### Paso 3: Configurar el Token
1. Ve a la pestaña **Variables** de la colección
2. Pega el token en la variable `token`
3. O simplemente copia el token y úsalo en el header `x-token` de cada request

## 🧪 Casos de Prueba Recomendados

### 1. Flujo Completo de Administración
1. **Login Administrador** (11111111)
2. **Crear Centro de Formación**
3. **Crear Grupo de Investigación**
4. **Crear Semillero**
5. **Crear Proyecto**
6. **Asignar Investigadores**

### 2. Flujo de Coordinación
1. **Login Coordinador** (33333333)
2. **Crear Líder de Semillero**
3. **Asignar Rol de Líder**
4. **Gestionar Grupos de Investigación**

### 3. Flujo de Liderazgo
1. **Login Líder** (44444444)
2. **Crear Proyecto**
3. **Asignar Investigadores al Proyecto**
4. **Crear Actividades**
5. **Gestionar Productos**

### 4. Flujo de Investigación
1. **Login Investigador** (55555555)
2. **Ver Proyectos Asignados**
3. **Crear Actividades**
4. **Gestionar Recursos**
5. **Crear Productos**

## 📋 Estructura de la Colección

### 🔐 Autenticación
- Login Administrador
- Login Subdirector
- Login Coordinador
- Login Líder
- Login Investigador
- Login Usuario Genérico

### 🏢 Centros de Formación
- Listar Centros
- Obtener Centro por ID
- Crear Centro
- Actualizar Centro
- Activar Centro
- Desactivar Centro
- Eliminar Centro

### 👥 Investigadores
- Listar Investigadores
- Obtener Investigador por ID
- Crear Investigador
- Actualizar Investigador
- Agregar Rol a Investigador
- Agregar Investigador a Grupo
- Activar Investigador
- Desactivar Investigador
- Eliminar Investigador
- **Crear Coordinador**
- **Crear Líder de Semillero**
- **Crear Administrador**
- **Asignar Rol de Coordinador**
- **Asignar Rol de Líder**
- **Desactivar Rol**

### 🔬 Grupos de Investigación
- Listar Grupos
- Obtener Grupo por ID
- Crear Grupo
- Actualizar Grupo
- Activar Grupo
- Desactivar Grupo
- Eliminar Grupo

### 🌱 Semilleros
- Listar Semilleros
- Obtener Semillero por ID
- Crear Semillero
- Actualizar Semillero
- Activar Semillero
- Desactivar Semillero
- Eliminar Semillero

### 📊 Proyectos
- Listar Proyectos
- Obtener Proyecto por ID
- Crear Proyecto
- Actualizar Proyecto
- Eliminar Proyecto

### 📝 Actividades
- Listar Actividades
- Obtener Actividad por ID
- Crear Actividad
- Actualizar Actividad
- Eliminar Actividad

### 💰 Recursos
- Listar Recursos
- Obtener Recurso por ID
- Crear Recurso
- Actualizar Recurso
- Eliminar Recurso

### 📦 Productos
- Listar Productos
- Obtener Producto por ID
- Crear Producto
- Actualizar Producto
- Eliminar Producto

### 🏆 Certificaciones
- Listar Certificaciones
- Obtener Certificación por ID
- Crear Certificación
- Actualizar Certificación
- Eliminar Certificación

### 🔔 Notificaciones
- Listar Notificaciones
- Obtener Notificación por ID
- Crear Notificación
- Marcar como Leída
- Actualizar Notificación
- Eliminar Notificación

### 🤝 Reuniones
- Listar Reuniones
- Obtener Reunión por ID
- Crear Reunión
- Actualizar Reunión
- Eliminar Reunión

### 👨‍💼 Subdirectores
- Login Subdirector
- Listar Subdirectores
- Obtener Subdirector por ID
- Crear Subdirector
- Actualizar Subdirector
- Eliminar Subdirector

### 🔗 Tipos de Vinculación
- Listar Tipos de Vinculación
- Obtener Tipo por ID
- Crear Tipo de Vinculación
- Actualizar Tipo de Vinculación
- Eliminar Tipo de Vinculación

### 👤 Usuarios
- Login Usuario
- Listar Usuarios
- Obtener Usuario por ID
- Crear Usuario
- Actualizar Usuario
- Eliminar Usuario

## ⚠️ Notas Importantes

### Headers Requeridos
- **Content-Type**: `application/json` (para requests con body)
- **x-token**: Token JWT obtenido del login (para requests autenticados)

### Códigos de Respuesta
- **200**: Éxito
- **201**: Creado exitosamente
- **400**: Error de validación
- **401**: No autorizado
- **403**: Prohibido (sin permisos)
- **404**: No encontrado
- **500**: Error del servidor

### Permisos por Rol
- **ADMIN**: Acceso total
- **DEPUTY_DIRECTOR**: Gestión de coordinadores y líderes
- **COORDINATOR**: Gestión de líderes de semillero
- **LEADER**: Gestión de semilleros
- **RESEARCHER**: Acceso básico

## 🆘 Solución de Problemas

### Error: "Ruta no encontrada"
- Verifica que el servidor esté corriendo en el puerto 5000
- Confirma que la variable `base_url` esté configurada correctamente

### Error: "No autorizado"
- Verifica que hayas hecho login correctamente
- Confirma que el token esté en el header `x-token`
- Revisa que el token no haya expirado

### Error: "Prohibido"
- Verifica que el usuario tenga los permisos necesarios para la operación
- Confirma que estés usando el rol correcto

### Error: "No encontrado"
- Verifica que el ID del recurso sea correcto
- Confirma que el recurso exista en la base de datos

## 🎯 Próximos Pasos

1. **Importa la colección** en Postman
2. **Inicia el servidor** con `npm run dev`
3. **Haz login** con cualquier usuario de prueba
4. **Copia el token** de la respuesta
5. **Configura el token** en las variables de la colección
6. **Explora los endpoints** según el rol del usuario

¡Listo para probar el sistema completo! 🚀
