# 📮 Ejemplos de Peticiones HTTP

Este archivo contiene ejemplos de peticiones HTTP para probar la API del Sistema de Gestión de Semilleros de Investigación SENA.

## 🔐 1. Autenticación

### Login de Investigador
```http
POST http://localhost:5000/api/researchers/login
Content-Type: application/json

{
  "document_number": "11111111",
  "password": "admin123"
}
```

### Login de Coordinador
```http
POST http://localhost:5000/api/researchers/login
Content-Type: application/json

{
  "document_number": "22222222",
  "password": "coord123"
}
```

### Login de Líder
```http
POST http://localhost:5000/api/researchers/login
Content-Type: application/json

{
  "document_number": "33333333",
  "password": "leader123"
}
```

### Login de Investigador
```http
POST http://localhost:5000/api/researchers/login
Content-Type: application/json

{
  "document_number": "44444444",
  "password": "research123"
}
```

**Respuesta esperada:**
```json
{
  "msg": "Login exitoso",
  "researcher": {
    "id": "507f1f77bcf86cd799439011",
    "name": "JUAN PEREZ",
    "email": "juan@example.com",
    "document_number": "1234567890",
    "role": "RESEARCHER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> **Importante:** Guardar el token recibido para usarlo en las siguientes peticiones.

---

## 🏢 2. Training Centers (Centros de Formación)

### Listar todos los centros
```http
GET http://localhost:5000/api/training-centers/list
x-token: {tu_token_jwt}
```

### Listar centros con filtros
```http
GET http://localhost:5000/api/training-centers/list?city=BOGOTA&status=0
x-token: {tu_token_jwt}
```

### Obtener centro por ID
```http
GET http://localhost:5000/api/training-centers/507f1f77bcf86cd799439011
x-token: {tu_token_jwt}
```

### Crear centro
```http
POST http://localhost:5000/api/training-centers/create
x-token: {tu_token_jwt}
Content-Type: application/json

{
  "name": "Centro de Formación Tecnológico",
  "address": "Calle 123 #45-67",
  "city": "Bogotá",
  "department": "Cundinamarca"
}
```

### Actualizar centro
```http
PUT http://localhost:5000/api/training-centers/update/507f1f77bcf86cd799439011
x-token: {tu_token_jwt}
Content-Type: application/json

{
  "name": "Centro de Formación Tecnológico Actualizado",
  "address": "Nueva dirección",
  "city": "Bogotá",
  "department": "Cundinamarca"
}
```

### Activar centro
```http
PUT http://localhost:5000/api/training-centers/activate/507f1f77bcf86cd799439011
x-token: {tu_token_jwt}
```

### Desactivar centro
```http
PUT http://localhost:5000/api/training-centers/inactivate/507f1f77bcf86cd799439011
x-token: {tu_token_jwt}
```

### Eliminar centro
```http
DELETE http://localhost:5000/api/training-centers/delete/507f1f77bcf86cd799439011
x-token: {tu_token_jwt}
```

---

## 👨‍🔬 3. Researchers (Investigadores)

### Listar investigadores
```http
GET http://localhost:5000/api/researchers/list
x-token: {tu_token_jwt}
```

### Listar con filtros
```http
GET http://localhost:5000/api/researchers/list?status=0&contract_type=CONTRACTOR
x-token: {tu_token_jwt}
```

### Obtener investigador por ID
```http
GET http://localhost:5000/api/researchers/507f1f77bcf86cd799439011
x-token: {tu_token_jwt}
```

### Crear investigador
```http
POST http://localhost:5000/api/researchers/create
x-token: {tu_token_jwt}
Content-Type: application/json

{
  "name": "Juan Pérez García",
  "document_type": "CC",
  "document_number": "1234567890",
  "email": "juan.perez@sena.edu.co",
  "phone": "3001234567",
  "password": "password123",
  "academic_formation": "Ingeniero de Sistemas",
  "knowledge_area": "Inteligencia Artificial",
  "contract_number": "CONT-2024-001",
  "contract_type": "CONTRACTOR",
  "contract_start_date": "2024-01-15",
  "contract_end_date": "2024-12-31",
  "entry_date": "2024-01-15"
}
```

### Actualizar investigador
```http
PUT http://localhost:5000/api/researchers/update/507f1f77bcf86cd799439011
x-token: {tu_token_jwt}
Content-Type: application/json

{
  "name": "Juan Pérez García",
  "email": "juan.perez.nuevo@sena.edu.co",
  "phone": "3009876543",
  "academic_formation": "Magister en Ciencias de la Computación",
  "knowledge_area": "Machine Learning"
}
```

### Agregar rol a investigador
```http
POST http://localhost:5000/api/researchers/add-role/507f1f77bcf86cd799439011
x-token: {tu_token_jwt}
Content-Type: application/json

{
  "role": "COORDINATOR",
  "start_date": "2024-06-01",
  "end_date": null
}
```

### Agregar investigador a grupo
```http
POST http://localhost:5000/api/researchers/add-to-group/507f1f77bcf86cd799439011
x-token: {tu_token_jwt}
Content-Type: application/json

{
  "id_group": "507f191e810c19729de860ea",
  "incorporation_date": "2024-01-20"
}
```

### Activar investigador
```http
PUT http://localhost:5000/api/researchers/activate/507f1f77bcf86cd799439011
x-token: {tu_token_jwt}
```

### Desactivar investigador
```http
PUT http://localhost:5000/api/researchers/inactivate/507f1f77bcf86cd799439011
x-token: {tu_token_jwt}
```

### Eliminar investigador
```http
DELETE http://localhost:5000/api/researchers/delete/507f1f77bcf86cd799439011
x-token: {tu_token_jwt}
```

---

## 📝 Notas Importantes

### Headers Requeridos
Todas las peticiones autenticadas deben incluir:
```http
x-token: {tu_token_jwt}
Content-Type: application/json  (para POST/PUT)
```

### Códigos de Estado HTTP
- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Error en la validación de datos
- `401 Unauthorized`: Token inválido o no proporcionado
- `403 Forbidden`: No tiene permisos para esta operación
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

### Formato de Fechas
Las fechas deben enviarse en formato ISO 8601:
```
"2024-01-15"  o  "2024-01-15T10:30:00Z"
```

### IDs de MongoDB
Los IDs tienen el formato ObjectId de MongoDB (24 caracteres hexadecimales):
```
507f1f77bcf86cd799439011
```

### Valores Enum

#### Document Types
- `CC` - Cédula de Ciudadanía
- `TI` - Tarjeta de Identidad
- `CE` - Cédula de Extranjería
- `PASSPORT` - Pasaporte

#### Contract Types
- `CONTRACTOR` - Contratista
- `STAFF` - Planta

#### Status (numérico)
- `0` - Activo
- `1` - Inactivo

#### Activity Status
- `PENDING` - Pendiente
- `IN_PROGRESS` - En progreso
- `COMPLETED` - Completada
- `CANCELLED` - Cancelada

#### Priority Levels
- `LOW` - Baja
- `MEDIUM` - Media
- `HIGH` - Alta
- `URGENT` - Urgente

#### Meeting Modalities
- `IN_PERSON` - Presencial
- `VIRTUAL` - Virtual
- `HYBRID` - Híbrida

---

## 🧪 Probar con cURL

### Ejemplo de login con cURL
```bash
curl -X POST http://localhost:5000/api/researchers/login \
  -H "Content-Type: application/json" \
  -d '{"document_number":"1234567890","password":"mipassword"}'
```

### Ejemplo de crear centro con cURL
```bash
curl -X POST http://localhost:5000/api/training-centers/create \
  -H "Content-Type: application/json" \
  -H "x-token: tu_token_aqui" \
  -d '{"name":"Centro Tecnológico","address":"Calle 123","city":"Bogotá","department":"Cundinamarca"}'
```

---

## 📱 Importar en Postman

Para usar estos ejemplos en Postman:

1. Crear una nueva colección en Postman
2. Crear variables de entorno:
   - `base_url`: `http://localhost:5000/api`
   - `token`: `{dejar_vacio_inicialmente}`
3. Crear un script de Pre-request para login:
   ```javascript
   if (!pm.collectionVariables.get("token")) {
       pm.sendRequest({
           url: pm.environment.get("base_url") + '/researchers/login',
           method: 'POST',
           header: 'Content-Type: application/json',
           body: {
               mode: 'raw',
               raw: JSON.stringify({
                   document_number: "1234567890",
                   password: "mipassword"
               })
           }
       }, function (err, response) {
           pm.collectionVariables.set("token", response.json().token);
       });
   }
   ```
4. En cada petición autenticada, agregar header:
   ```
   Key: x-token
   Value: {{token}}
   ```

---

## 🔄 Flujo de Trabajo Completo

### 1. Iniciar Sesión
```http
POST /api/researchers/login
```

### 2. Crear Centro de Formación
```http
POST /api/training-centers/create
```

### 3. Crear Grupo de Investigación
```http
POST /api/research-groups/create
```

### 4. Crear Investigadores
```http
POST /api/researchers/create
```

### 5. Asignar Investigadores al Grupo
```http
POST /api/researchers/add-to-group/:id
```

### 6. Crear Semillero
```http
POST /api/seedbeds/create
```

### 7. Crear Proyecto
```http
POST /api/projects/create
```

### 8. Crear Actividades del Proyecto
```http
POST /api/activities/create
```

### 9. Registrar Productos
```http
POST /api/products/create
```

### 10. Generar Certificaciones
```http
POST /api/certifications/create
```

---

**Tip:** Puedes usar extensiones de VS Code como "REST Client" o "Thunder Client" para probar estas peticiones directamente desde el editor.
