# 👥 Usuarios de Prueba - Sistema SENA

Este documento contiene las credenciales de los usuarios de prueba creados para el sistema de gestión de semilleros de investigación SENA.

## 🚀 Cómo Crear los Usuarios de Prueba

### Opción 1: Usando npm script (Recomendado)
```bash
npm run seed:users
```

### Opción 2: Ejecutar directamente
```bash
node scripts/seedUsers.js
```

## 📋 Credenciales de Usuarios

| Rol | Documento | Email | Password | Permisos |
|-----|-----------|-------|----------|----------|
| **ADMIN** | `11111111` | `admin@sena.edu.co` | `admin123` | Control total del sistema |
| **SUBDIRECTOR** | `22222222` | `subdirector@sena.edu.co` | `subdirector123` | Gestión de coordinadores y líderes |
| **COORDINADOR** | `33333333` | `coordinador@sena.edu.co` | `coordinador123` | Gestión de líderes de semillero |
| **LÍDER** | `44444444` | `lider@sena.edu.co` | `lider123` | Gestión de semilleros |
| **INVESTIGADOR** | `55555555` | `investigador@sena.edu.co` | `investigador123` | Investigador 

## 🔑 Obtener Token de Autenticación

Para obtener un token JWT, realiza una petición POST al endpoint de login:

### Para Investigadores (incluye ADMIN, COORDINADOR, LÍDER, INVESTIGADOR):
```http
POST {{base_url}}/api/researchers/login
Content-Type: application/json

{
  "document_number": "11111111",
  "password": "admin123"
}
```

### Para Subdirectores:
```http
POST {{base_url}}/api/deputy-directors/login
Content-Type: application/json

{
  "document_number": "22222222",
  "password": "subdirector123"
}
```

### Para Usuarios Genéricos:
```http
POST {{base_url}}/api/users/login
Content-Type: application/json

{
  "document_number": "66666666",
  "password": "usuario123"
}
```

## 📊 Jerarquía de Permisos

```
ADMIN (11111111)
├── Control total del sistema
├── Crear/editar/eliminar cualquier entidad
└── Gestionar todos los usuarios

SUBDIRECTOR (22222222)
├── Crear coordinadores y líderes
├── Gestionar centros de formación
└── Asignar roles a investigadores

COORDINADOR (33333333)
├── Crear líderes de semillero
├── Gestionar grupos de investigación
└── Supervisar proyectos

LÍDER (44444444)
├── Gestionar semilleros
├── Crear proyectos
└── Asignar investigadores a proyectos

INVESTIGADOR (55555555)
├── Ver sus proyectos asignados
├── Crear actividades
└── Gestionar productos de investigación

USUARIO GENÉRICO (66666666)
└── Acceso básico al sistema
```

## 🧪 Casos de Prueba Sugeridos

### 1. Flujo Completo de Administración
1. Login como ADMIN (11111111)
2. Crear centro de formación
3. Crear grupo de investigación
4. Crear semillero
5. Crear proyecto
6. Asignar investigadores

### 2. Flujo de Coordinación
1. Login como COORDINADOR (33333333)
2. Crear líder de semillero
3. Asignar rol de líder a investigador existente
4. Gestionar grupos de investigación

### 3. Flujo de Liderazgo
1. Login como LÍDER (44444444)
2. Crear proyecto
3. Asignar investigadores al proyecto
4. Crear actividades
5. Gestionar productos

### 4. Flujo de Investigación
1. Login como INVESTIGADOR (55555555)
2. Ver proyectos asignados
3. Crear actividades
4. Gestionar recursos
5. Crear productos

## 🔧 Configuración de Postman

1. Importa la colección `SENA_Research_System_API.postman_collection.json`
2. Configura las variables de entorno:
   - `base_url`: `http://localhost:3000`
   - `token`: (se obtiene del login)
3. Usa cualquiera de las credenciales de arriba para hacer login
4. El token se guardará automáticamente en la variable `{{token}}`

## ⚠️ Notas Importantes

- Los usuarios se crean solo si no existen (no se duplican)
- Las contraseñas están encriptadas con bcryptjs
- Los tokens JWT expiran según la configuración del sistema
- Los roles están configurados con fechas de inicio automáticas
- Todos los usuarios están activos por defecto

## 🗑️ Limpiar Usuarios de Prueba

Si necesitas eliminar los usuarios de prueba:

```javascript
// En MongoDB Compass o mongo shell
db.researchers.deleteMany({
  document_number: { $in: ["11111111", "33333333", "44444444", "55555555"] }
});

db.deputydirectors.deleteMany({
  document_number: "22222222"
});

db.users.deleteMany({
  document_number: "66666666"
});
```

## 🆘 Solución de Problemas

### Error: "Usuario no encontrado"
- Verifica que el seeder se ejecutó correctamente
- Revisa la conexión a la base de datos
- Confirma que el documento existe en la colección correcta

### Error: "Credenciales incorrectas"
- Verifica que estás usando la contraseña correcta
- Asegúrate de que el usuario esté activo
- Revisa que el tipo de documento coincida

### Error: "Token inválido"
- Verifica que el token no haya expirado
- Confirma que estás enviando el token en el header `x-token`
- Revisa la configuración JWT en el sistema
