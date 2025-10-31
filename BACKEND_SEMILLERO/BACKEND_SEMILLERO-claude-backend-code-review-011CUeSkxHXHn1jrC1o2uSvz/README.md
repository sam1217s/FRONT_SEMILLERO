# 🎓 Sistema de Gestión de Semilleros de Investigación SENA

## 📋 Descripción

Sistema de gestión integral para semilleros de investigación del SENA, desarrollado con Node.js, Express y MongoDB. Este proyecto maneja la administración de investigadores, grupos de investigación, semilleros, proyectos, actividades, recursos, productos y más.

## 🏗️ Arquitectura

El proyecto sigue el patrón **MVC (Model-View-Controller)** con la siguiente estructura:

```
semillero-investigacion-sena/
├── database/
│   └── config.js                 # Configuración de MongoDB
├── models/                        # Modelos de Mongoose
│   ├── training_center.model.js
│   ├── researcher.model.js
│   ├── research_group.model.js
│   ├── seedbed.model.js
│   ├── project.model.js
│   ├── activity.model.js
│   ├── resource.model.js
│   ├── product.model.js
│   ├── certification.model.js
│   ├── notification.model.js
│   ├── meeting.model.js
│   ├── deputy_director.model.js
│   └── link_type.model.js
├── controllers/                   # Lógica de negocio
│   ├── training_center.controller.js ✅ COMPLETO
│   ├── researcher.controller.js      ✅ COMPLETO
│   ├── research_group.controller.js  ✅ COMPLETO
│   ├── seedbed.controller.js         ✅ COMPLETO
│   ├── project.controller.js         ✅ COMPLETO
│   ├── activity.controller.js        ✅ COMPLETO
│   ├── resource.controller.js        ✅ COMPLETO
│   ├── product.controller.js         ✅ COMPLETO
│   ├── certification.controller.js   ✅ COMPLETO
│   ├── notification.controller.js    ✅ COMPLETO
│   ├── meeting.controller.js         ✅ COMPLETO
│   ├── deputy_director.controller.js ✅ COMPLETO
│   └── link_type.controller.js       ✅ COMPLETO
├── routes/                        # Definición de endpoints
│   ├── training_center.route.js  ✅ COMPLETO
│   ├── researcher.route.js       ✅ COMPLETO
│   ├── research_group.route.js   ✅ COMPLETO
│   ├── seedbed.route.js          ✅ COMPLETO
│   ├── project.route.js          ✅ COMPLETO
│   ├── activity.route.js         ✅ COMPLETO
│   ├── resource.route.js         ✅ COMPLETO
│   ├── product.route.js          ✅ COMPLETO
│   ├── certification.route.js    ✅ COMPLETO
│   ├── notification.route.js     ✅ COMPLETO
│   ├── meeting.route.js          ✅ COMPLETO
│   ├── deputy_director.route.js  ✅ COMPLETO
│   └── link_type.route.js        ✅ COMPLETO
├── middlewares/                   # Middlewares personalizados
│   ├── validateField.middleware.js ✅
│   ├── webToken.middleware.js      ✅
│   └── log.middleware.js           ✅
├── helpers/                       # Funciones auxiliares
│   └── generateJWT.helper.js      ✅
├── .env                           # Variables de entorno
├── .gitignore
├── package.json
├── server.js                      # Punto de entrada
└── README.md
```

## 🚀 Instalación

### Prerrequisitos
- Node.js (v18 o superior)
- MongoDB (v6 o superior)
- npm o yarn

### Pasos

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Editar el archivo `.env` con tus configuraciones:

```env
PORT=5000
MONGODB_CNN=mongodb://localhost:27017/sena_research
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRATION=48h
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_password_de_aplicacion
NODE_ENV=development
```

4. **Iniciar MongoDB**
```bash
# Si usas MongoDB local
mongod

# O inicia el servicio según tu sistema operativo
```

5. **Iniciar el servidor**
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor estará corriendo en: `http://localhost:5000`

## 📊 Estructura de la Base de Datos

### Modelos Principales

#### 1. **Training Center (Centro de Formación)**
- Gestiona los centros de formación del SENA
- Campos: nombre, dirección, ciudad, departamento, estado

#### 2. **Researcher (Investigador)**
- Usuarios del sistema (investigadores, coordinadores, etc.)
- Maneja autenticación con JWT
- Relaciones: grupos de investigación, roles
- Campos: nombre, documento, email, contraseña (encriptada), formación académica, etc.

#### 3. **Research Group (Grupo de Investigación)**
- Grupos reconocidos ante Minciencias
- Relación con Training Center
- Incluye investigadores miembros

#### 4. **Seedbed (Semillero)**
- Semilleros de investigación dentro de grupos
- Tiene un líder (Researcher)
- Campos: nombre, descripción, líneas de investigación, áreas temáticas

#### 5. **Project (Proyecto)**
- Proyectos de investigación dentro de semilleros
- Tiene líder y múltiples investigadores asignados
- Campos: código, nombre, descripción, objetivos, fechas, presupuesto

#### 6. **Activity (Actividad)**
- Actividades dentro de proyectos
- Asignadas a un investigador responsable
- Estados: PENDING, IN_PROGRESS, COMPLETED, CANCELLED

#### 7. **Resource (Recurso)**
- Recursos asignados a actividades
- Control de inventario y costos
- Estados: REQUESTED, APPROVED, ACQUIRED, IN_USE, etc.

#### 8. **Product (Producto)**
- Productos generados por proyectos
- Tipos: artículos, prototipos, software, etc.
- Estados: PLANNED, IN_PROGRESS, DELIVERED, APPROVED, REJECTED

#### 9. **Certification (Certificación)**
- Certificados emitidos a investigadores por su participación
- Vinculados a proyectos específicos

#### 10. **Notification (Notificación)**
- Sistema de notificaciones para investigadores
- Soporta email y notificaciones en plataforma
- Prioridades: LOW, MEDIUM, HIGH, URGENT

#### 11. **Meeting (Reunión)**
- Gestión de reuniones de proyectos y semilleros
- Modalidades: IN_PERSON, VIRTUAL, HYBRID
- Incluye participantes y actas

#### 12. **Deputy Director (Subdirector)**
- Subdirectores de centros de formación
- Pueden administrar múltiples centros

#### 13. **Link Type (Tipo de Vinculación)**
- Tipos de contrato de investigadores
- Estados: STAFF, CONTRACTED

## 🔐 Autenticación y Autorización

### Roles del Sistema
- **ADMIN**: Acceso completo al sistema
- **DEPUTY_DIRECTOR**: Subdirector de centro
- **COORDINATOR**: Coordinador de grupo/semillero
- **RESEARCHER**: Investigador general

### JWT (JSON Web Token)
El sistema usa JWT para autenticación. Duración del token: 48 horas.

#### Login de Investigador
```http
POST /api/researchers/login
Content-Type: application/json

{
  "document_number": "1234567890",
  "password": "mipassword"
}
```

**Respuesta:**
```json
{
  "msg": "Login exitoso",
  "researcher": {
    "id": "...",
    "name": "JUAN PEREZ",
    "email": "juan@example.com",
    "document_number": "1234567890",
    "role": "RESEARCHER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Uso del Token
Incluir el token en el header de cada petición autenticada:
```http
x-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📝 Endpoints Disponibles

### Training Centers (Centros de Formación)

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| GET | `/api/training-centers/list` | Listar centros | ADMIN, DEPUTY_DIRECTOR, COORDINATOR, RESEARCHER |
| GET | `/api/training-centers/:id` | Obtener por ID | ADMIN, DEPUTY_DIRECTOR, COORDINATOR, RESEARCHER |
| POST | `/api/training-centers/create` | Crear centro | ADMIN, DEPUTY_DIRECTOR |
| PUT | `/api/training-centers/update/:id` | Actualizar | ADMIN, DEPUTY_DIRECTOR |
| PUT | `/api/training-centers/activate/:id` | Activar | ADMIN, DEPUTY_DIRECTOR |
| PUT | `/api/training-centers/inactivate/:id` | Desactivar | ADMIN, DEPUTY_DIRECTOR |
| DELETE | `/api/training-centers/delete/:id` | Eliminar | ADMIN |

### Researchers (Investigadores)

| Método | Endpoint | Descripción | Roles Permitidos |
|--------|----------|-------------|------------------|
| POST | `/api/researchers/login` | Login | Público |
| GET | `/api/researchers/list` | Listar | ADMIN, DEPUTY_DIRECTOR, COORDINATOR, RESEARCHER |
| GET | `/api/researchers/:id` | Obtener por ID | ADMIN, DEPUTY_DIRECTOR, COORDINATOR, RESEARCHER |
| POST | `/api/researchers/create` | Crear | ADMIN, DEPUTY_DIRECTOR |
| PUT | `/api/researchers/update/:id` | Actualizar | ADMIN, DEPUTY_DIRECTOR, RESEARCHER |
| POST | `/api/researchers/add-role/:id` | Agregar rol | ADMIN, DEPUTY_DIRECTOR |
| POST | `/api/researchers/add-to-group/:id` | Agregar a grupo | ADMIN, DEPUTY_DIRECTOR, COORDINATOR |
| PUT | `/api/researchers/activate/:id` | Activar | ADMIN, DEPUTY_DIRECTOR |
| PUT | `/api/researchers/inactivate/:id` | Desactivar | ADMIN, DEPUTY_DIRECTOR |
| DELETE | `/api/researchers/delete/:id` | Eliminar | ADMIN |

> **Nota:** Los endpoints para los demás módulos siguen el mismo patrón y deben ser implementados.

## 🛠️ Guía de Desarrollo

### Cómo Completar los Controladores Faltantes

Todos los controladores deben seguir el patrón establecido en `training_center.controller.js` y `researcher.controller.js`.

**Estructura básica de un controlador:**

```javascript
import modelName from '../models/model_name.model.js';
import logAction from '../middlewares/log.middleware.js';

const modelCtrl = {};

// LISTAR (con filtros opcionales)
modelCtrl.listItems = async (req, res) => {
    try {
        const { /* filtros */ } = req.query;
        let filter = {};
        
        // Aplicar filtros si existen
        if (filtro) {
            filter.campo = valor;
        }
        
        const items = await modelName
            .find(filter)
            .populate('referencias') // Si tiene referencias
            .sort({ createdAt: -1 });
        
        res.status(200).json({ msg: items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// OBTENER POR ID
modelCtrl.getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await modelName
            .findById(id)
            .populate('referencias');
        
        if (!item) {
            return res.status(404).json({ msg: 'Item no encontrado' });
        }
        
        res.status(200).json({ msg: item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// CREAR
modelCtrl.saveItem = async (req, res) => {
    try {
        const { campo1, campo2 } = req.body;
        
        const item = new modelName({
            campo1: campo1.toUpperCase(), // Ajustar según necesidad
            campo2: campo2.toLowerCase(),
            // ... más campos
        });
        
        await item.save();
        
        await logAction({
            action: 'CREATE',
            affected_table: 'TABLE_NAME',
            module: 'MODULE_NAME',
            affected_record_id: item._id,
            new_data: item,
            level: 'INFO',
            description: 'Item creado'
        }, req.headers['x-token'], req);
        
        res.status(201).json({ msg: 'Item creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ACTUALIZAR
modelCtrl.updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { campo1, campo2 } = req.body;
        
        const previousData = await modelName.findById(id).lean();
        
        await modelName.findByIdAndUpdate(id, {
            campo1: campo1.toUpperCase(),
            campo2: campo2.toLowerCase()
        });
        
        await logAction({
            action: 'UPDATE',
            affected_table: 'TABLE_NAME',
            module: 'MODULE_NAME',
            affected_record_id: id,
            previous_data: previousData,
            new_data: { campo1, campo2 },
            level: 'INFO',
            description: 'Item actualizado'
        }, req.headers['x-token'], req);
        
        res.status(200).json({ msg: 'Item actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ACTIVAR (si aplica status 0/1)
modelCtrl.activeItem = async (req, res) => {
    try {
        const { id } = req.params;
        await modelName.findByIdAndUpdate(id, { status: 0 });
        
        await logAction({
            action: 'ACTIVATE',
            affected_table: 'TABLE_NAME',
            module: 'MODULE_NAME',
            affected_record_id: id,
            level: 'INFO',
            description: 'Item activado'
        }, req.headers['x-token'], req);
        
        res.status(200).json({ msg: 'Item activado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// DESACTIVAR (si aplica status 0/1)
modelCtrl.inactiveItem = async (req, res) => {
    try {
        const { id } = req.params;
        await modelName.findByIdAndUpdate(id, { status: 1 });
        
        await logAction({
            action: 'INACTIVATE',
            affected_table: 'TABLE_NAME',
            module: 'MODULE_NAME',
            affected_record_id: id,
            level: 'INFO',
            description: 'Item desactivado'
        }, req.headers['x-token'], req);
        
        res.status(200).json({ msg: 'Item desactivado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ELIMINAR
modelCtrl.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        await modelName.findByIdAndDelete(id);
        
        await logAction({
            action: 'DELETE',
            affected_table: 'TABLE_NAME',
            module: 'MODULE_NAME',
            affected_record_id: id,
            level: 'WARNING',
            description: 'Item eliminado'
        }, req.headers['x-token'], req);
        
        res.status(200).json({ msg: 'Item eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export { modelCtrl };
```

### Cómo Completar las Rutas Faltantes

Las rutas deben seguir el patrón de `training_center.route.js`:

```javascript
import { Router } from 'express';
import { modelCtrl } from '../controllers/model.controller.js';
import { check } from 'express-validator';
import { valideFields } from '../middlewares/validateField.middleware.js';
import webToken from '../middlewares/webToken.middleware.js';

const { listItems, getItemById, saveItem, updateItem, activeItem, inactiveItem, deleteItem } = modelCtrl;

const routerModel = Router();

// Listar
routerModel.get('/list', [
    webToken.validarJWT(['ADMIN', 'DEPUTY_DIRECTOR', 'COORDINATOR', 'RESEARCHER'])
], listItems);

// Obtener por ID
routerModel.get('/:id', [
    webToken.validarJWT(['ADMIN', 'DEPUTY_DIRECTOR', 'COORDINATOR', 'RESEARCHER']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], getItemById);

// Crear
routerModel.post('/create', [
    webToken.validarJWT(['ADMIN', 'DEPUTY_DIRECTOR']),
    check('campo_obligatorio').notEmpty().withMessage('Campo obligatorio'),
    // ... más validaciones
    valideFields
], saveItem);

// Actualizar
routerModel.put('/update/:id', [
    webToken.validarJWT(['ADMIN', 'DEPUTY_DIRECTOR']),
    check('id').isMongoId().withMessage('ID inválido'),
    // ... validaciones de campos
    valideFields
], updateItem);

// Activar
routerModel.put('/activate/:id', [
    webToken.validarJWT(['ADMIN', 'DEPUTY_DIRECTOR']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], activeItem);

// Desactivar
routerModel.put('/inactivate/:id', [
    webToken.validarJWT(['ADMIN', 'DEPUTY_DIRECTOR']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], inactiveItem);

// Eliminar
routerModel.delete('/delete/:id', [
    webToken.validarJWT(['ADMIN']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], deleteItem);

export { routerModel };
```

## 📌 Convenciones del Proyecto

### 1. **Nomenclatura**
- **Archivos**: snake_case (ej: `training_center.model.js`)
- **Variables/Funciones**: camelCase (ej: `listTrainingCenters`)
- **Constantes**: UPPER_CASE (ej: `JWT_SECRET`)
- **Clases/Modelos**: PascalCase (ej: `TrainingCenter`)

### 2. **Manejo de Texto**
- **Nombres propios**: MAYÚSCULAS (ej: `name: name.toUpperCase()`)
- **Emails**: minúsculas (ej: `email: email.toLowerCase()`)

### 3. **Estados**
- **Status numérico**: 0 = Activo, 1 = Inactivo
- **Status string**: Usar ENUM en mayúsculas (ej: `'PENDING'`, `'IN_PROGRESS'`)

### 4. **Fechas**
- Usar tipo `Date` de MongoDB
- Mongoose maneja automáticamente `createdAt` y `updatedAt` con `timestamps: true`

### 5. **Relaciones**
- **Uno a Muchos**: Usar referencias con ObjectId
- **Muchos a Muchos**: Usar arrays de objetos con referencias
```javascript
// Ejemplo de relación muchos a muchos
researchers: [{
    id_researcher: {
        type: Schema.Types.ObjectId,
        ref: 'Researcher'
    },
    incorporation_date: Date
}]
```

### 6. **Populate**
- Usar `.populate()` para traer datos relacionados
```javascript
const project = await projectModels
    .findById(id)
    .populate('id_seedbed')
    .populate('id_leader')
    .populate('project_researchers.id_researcher');
```

### 7. **Logs de Auditoría**
- Registrar TODAS las operaciones CUD (Create, Update, Delete)
- Usar niveles: `INFO`, `WARNING`, `ERROR`
- Incluir `previous_data` y `new_data` cuando aplique

### 8. **Manejo de Errores**
- Usar try-catch en todos los controladores
- Responder con status codes apropiados:
  - `200`: OK
  - `201`: Created
  - `400`: Bad Request
  - `401`: Unauthorized
  - `403`: Forbidden
  - `404`: Not Found
  - `500`: Internal Server Error

### 9. **Validaciones**
- Usar `express-validator` para validar campos
- Validar tipos de datos, longitudes, formatos
- Usar el middleware `valideFields` para procesar errores

### 10. **Seguridad**
- NUNCA enviar contraseñas en respuestas
- Usar `.select('-password')` al consultar usuarios
- Encriptar contraseñas con bcryptjs (salt rounds: 10)
- Validar JWT en rutas protegidas

## 🧪 Ejemplos de Uso

### Crear un Centro de Formación
```http
POST /api/training-centers/create
x-token: {tu_token_jwt}
Content-Type: application/json

{
  "name": "Centro de Formación Tecnológico",
  "address": "Calle 123 #45-67",
  "city": "Bogotá",
  "department": "Cundinamarca"
}
```

### Registrar un Investigador
```http
POST /api/researchers/create
x-token: {tu_token_jwt}
Content-Type: application/json

{
  "name": "Juan Pérez",
  "document_type": "CC",
  "document_number": "1234567890",
  "email": "juan.perez@sena.edu.co",
  "phone": "3001234567",
  "password": "password123",
  "academic_formation": "Ingeniero de Sistemas",
  "knowledge_area": "Inteligencia Artificial",
  "contract_type": "CONTRACTOR",
  "entry_date": "2024-01-15"
}
```

### Listar Investigadores con Filtros
```http
GET /api/researchers/list?status=0&contract_type=CONTRACTOR
x-token: {tu_token_jwt}
```

## 📚 Módulos Pendientes por Implementar

### Prioridad Alta 🔴
1. **Research Groups** (Grupos de Investigación)
2. **Seedbeds** (Semilleros)
3. **Projects** (Proyectos)

### Prioridad Media 🟡
4. **Activities** (Actividades)
5. **Products** (Productos)
6. **Meetings** (Reuniones)

### Prioridad Baja 🟢
7. **Resources** (Recursos)
8. **Certifications** (Certificaciones)
9. **Notifications** (Notificaciones)
10. **Deputy Directors** (Subdirectores)
11. **Link Types** (Tipos de Vinculación)
12. **User** (Módulo de Usuarios General)

## 🔄 Flujos de Trabajo Típicos

### 1. Registro de un Nuevo Semillero
1. Crear Centro de Formación (si no existe)
2. Crear Grupo de Investigación
3. Registrar Investigadores
4. Asignar Investigadores al Grupo
5. Crear Semillero con líder asignado
6. Asignar más investigadores al semillero

### 2. Gestión de un Proyecto
1. Crear Proyecto vinculado a un Semillero
2. Asignar Investigadores al Proyecto con roles
3. Crear Actividades del Proyecto
4. Asignar Recursos a Actividades
5. Registrar Productos Generados
6. Emitir Certificaciones a Participantes

### 3. Sistema de Notificaciones
1. Crear Notificación para Investigador
2. Sistema envía email automáticamente (si configurado)
3. Investigador ve notificación en plataforma
4. Marcar como leída

## ⚙️ Configuración Avanzada

### Email con Nodemailer

Para habilitar el envío de emails:

1. Configurar variables en `.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_password_de_aplicacion
```

2. Para Gmail, generar "Contraseña de aplicación":
   - Ir a cuenta de Google > Seguridad
   - Activar verificación en 2 pasos
   - Generar contraseña de aplicación

### MongoDB en la Nube (MongoDB Atlas)

Para usar MongoDB Atlas:

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un cluster gratuito
3. Obtener string de conexión
4. Actualizar `.env`:
```env
MONGODB_CNN=mongodb+srv://usuario:password@cluster.mongodb.net/sena_research
```

## 🐛 Troubleshooting

### Error: "No hay token en la petición"
- Asegúrate de incluir el header `x-token` en la petición
- Verifica que el token no haya expirado

### Error: "E11000 duplicate key error"
- Estás intentando crear un registro con un campo único que ya existe
- Ejemplo: documento o email ya registrados

### Error: "Cast to ObjectId failed"
- Estás enviando un ID inválido
- Los IDs de MongoDB tienen un formato específico (24 caracteres hexadecimales)

### Error de conexión a MongoDB
- Verifica que MongoDB esté corriendo
- Revisa la string de conexión en `.env`
- Si usas Atlas, verifica tu IP en la whitelist

## 📖 Recursos Adicionales

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Introduction](https://jwt.io/introduction)
- [Express Validator](https://express-validator.github.io/docs/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)

## 👥 Contribución

Para contribuir al proyecto:

1. Seguir las convenciones establecidas
2. Implementar los controladores y rutas faltantes siguiendo los patrones existentes
3. Documentar cualquier cambio significativo
4. Probar exhaustivamente antes de integrar

## 📄 Licencia

Este proyecto es de uso interno del SENA.

---

## ✅ Checklist de Implementación

### Completado ✅
- [x] Configuración inicial del proyecto
- [x] Conexión a MongoDB
- [x] Todos los modelos creados
- [x] Middlewares esenciales
- [x] Helper de JWT
- [x] Controlador de Training Centers
- [x] Controlador de Researchers (completo con login)
- [x] Controlador de Research Groups
- [x] Controlador de Seedbeds
- [x] Controlador de Projects
- [x] Controlador de Activities
- [x] Controlador de Resources
- [x] Controlador de Products
- [x] Controlador de Certifications
- [x] Controlador de Notifications
- [x] Controlador de Meetings
- [x] Controlador de Deputy Directors
- [x] Controlador de Link Types
- [x] Rutas de Training Centers
- [x] Rutas de Researchers
- [x] Rutas de Research Groups
- [x] Rutas de Seedbeds
- [x] Rutas de Projects
- [x] Rutas de Activities
- [x] Rutas de Resources
- [x] Rutas de Products
- [x] Rutas de Certifications
- [x] Rutas de Notifications
- [x] Rutas de Meetings
- [x] Rutas de Deputy Directors
- [x] Rutas de Link Types
- [x] Colección de Postman completa
- [x] Usuarios de prueba creados
- [x] README completo
- [x] Documentación completa

### Por Completar ⚠️
- [ ] Tests unitarios (opcional)
- [ ] Documentación de API con Swagger (opcional)
- [ ] Optimizaciones de rendimiento (opcional)

---

**Fecha de creación:** Octubre 2025
**Versión:** 1.0.0
