# 📋 Listado de Rutas de la API - Postman Collection

**URL Base:** `http://localhost:5000`  
**Header de Autenticación:** `x-token: {{token}}`  
**Content-Type (para POST/PUT):** `application/json`

---

## 🔐 Autenticación

### 1. Login Super Administrador
- **Método:** `POST`
- **Ruta:** `/api/researchers/login`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "document_number": "{{super_document}}",
    "password": "{{super_password}}"
  }
  ```
- **Descripción:** Iniciar sesión como super administrador (control total del sistema)

### 2. Login Administrador
- **Método:** `POST`
- **Ruta:** `/api/researchers/login`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "document_number": "{{admin_document}}",
    "password": "{{admin_password}}"
  }
  ```
- **Descripción:** Iniciar sesión como administrador (control total)

### 3. Login Subdirector
- **Método:** `POST`
- **Ruta:** `/api/deputy-directors/login`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "document_number": "{{subdirector_document}}",
    "password": "{{subdirector_password}}"
  }
  ```
- **Descripción:** Iniciar sesión como subdirector

### 4. Login Líder
- **Método:** `POST`
- **Ruta:** `/api/researchers/login`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "document_number": "{{leader_document}}",
    "password": "{{leader_password}}"
  }
  ```
- **Descripción:** Iniciar sesión como líder de semillero

### 5. Login Investigador
- **Método:** `POST`
- **Ruta:** `/api/researchers/login`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "document_number": "{{researcher_document}}",
    "password": "{{researcher_password}}"
  }
  ```
- **Descripción:** Iniciar sesión como investigador básico

---

## 🏢 Centros de Formación

### 1. Listar Centros
- **Método:** `GET`
- **Ruta:** `/api/training-centers/list`
- **Query Params:**
  - `name` (opcional): Filtrar por nombre
  - `city` (opcional): Filtrar por ciudad
  - `department` (opcional): Filtrar por departamento
  - `status` (opcional): Filtrar por estado (0: Activo, 1: Inactivo)
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener lista de centros de formación con filtros opcionales

### 2. Obtener Centro por ID
- **Método:** `GET`
- **Ruta:** `/api/training-centers/{{center_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener un centro de formación específico por ID

### 3. Crear Centro
- **Método:** `POST`
- **Ruta:** `/api/training-centers/create`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "name": "Centro de Formación Tecnológica",
    "address": "Calle 123 #45-67",
    "city": "Bogotá",
    "department": "Cundinamarca"
  }
  ```
- **Descripción:** Crear un nuevo centro de formación (solo SUPER)

### 4. Actualizar Centro
- **Método:** `PUT`
- **Ruta:** `/api/training-centers/update/{{center_id}}`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "name": "Centro de Formación Tecnológica Actualizado",
    "address": "Calle 123 #45-67",
    "city": "Bogotá",
    "department": "Cundinamarca"
  }
  ```
- **Descripción:** Actualizar un centro de formación existente

### 5. Activar Centro
- **Método:** `PUT`
- **Ruta:** `/api/training-centers/activate/{{center_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Activar un centro de formación

### 6. Desactivar Centro
- **Método:** `PUT`
- **Ruta:** `/api/training-centers/inactivate/{{center_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Desactivar un centro de formación

### 7. Eliminar Centro
- **Método:** `DELETE`
- **Ruta:** `/api/training-centers/delete/{{center_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Eliminar un centro de formación (solo ADMIN)

---

## 👨‍🔬 Investigadores

### 1. Listar Investigadores
- **Método:** `GET`
- **Ruta:** `/api/researchers/list`
- **Query Params:**
  - `name` (opcional): Filtrar por nombre
  - `document_number` (opcional): Filtrar por número de documento
  - `email` (opcional): Filtrar por email
  - `status` (opcional): Filtrar por estado (0: Activo, 1: Inactivo)
  - `contract_type` (opcional): Filtrar por tipo de contrato (CONTRACTOR, STAFF)
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener lista de investigadores con filtros opcionales

### 2. Obtener Investigador por ID
- **Método:** `GET`
- **Ruta:** `/api/researchers/{{researcher_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener un investigador específico por ID

### 3. Crear Investigador
- **Método:** `POST`
- **Ruta:** `/api/researchers/create`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "name": "Juan Pérez",
    "document_type": "CC",
    "document_number": "12345678",
    "email": "juan.perez@email.com",
    "phone": "3001234567",
    "password": "password123",
    "academic_formation": "Ingeniero de Sistemas",
    "knowledge_area": "Tecnología",
    "contract_number": "CT001",
    "contract_type": "CONTRACTOR",
    "contract_start_date": "2024-01-01",
    "contract_end_date": "2024-12-31",
    "entry_date": "2024-01-01"
  }
  ```
- **Descripción:** Crear un nuevo investigador

### 4. Actualizar Investigador
- **Método:** `PUT`
- **Ruta:** `/api/researchers/update/{{researcher_id}}`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "name": "Juan Pérez Actualizado",
    "email": "juan.perez.actualizado@email.com",
    "phone": "3001234567",
    "academic_formation": "Magíster en Ingeniería de Sistemas",
    "knowledge_area": "Inteligencia Artificial",
    "contract_number": "CT001",
    "contract_type": "STAFF",
    "contract_start_date": "2024-01-01",
    "contract_end_date": "2024-12-31"
  }
  ```
- **Descripción:** Actualizar un investigador existente

### 5. Agregar Rol a Investigador
- **Método:** `POST`
- **Ruta:** `/api/researchers/add-role/{{researcher_id}}`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "role": "LIDER",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31"
  }
  ```
- **Descripción:** Agregar un rol a un investigador

### 6. Agregar Investigador a Grupo
- **Método:** `POST`
- **Ruta:** `/api/researchers/add-to-group/{{researcher_id}}`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "id_group": "{{group_id}}",
    "incorporation_date": "2024-01-01"
  }
  ```
- **Descripción:** Agregar un investigador a un grupo de investigación

### 7. Activar Investigador
- **Método:** `PUT`
- **Ruta:** `/api/researchers/activate/{{researcher_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Activar un investigador

### 8. Desactivar Investigador
- **Método:** `PUT`
- **Ruta:** `/api/researchers/inactivate/{{researcher_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Desactivar un investigador

### 9. Eliminar Investigador
- **Método:** `DELETE`
- **Ruta:** `/api/researchers/delete/{{researcher_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Eliminar un investigador (solo ADMIN)

### 10. Crear Líder de Semillero
- **Método:** `POST`
- **Ruta:** `/api/researchers/create-leader`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "name": "Dr. Carlos López",
    "document_type": "CC",
    "document_number": "11223344",
    "email": "carlos.lopez@sena.edu.co",
    "phone": "3001122334",
    "password": "password123",
    "academic_formation": "Magíster en Ciencias de la Computación",
    "knowledge_area": "Inteligencia Artificial",
    "contract_number": "CT003",
    "contract_type": "CONTRACTOR",
    "contract_start_date": "2024-01-01",
    "contract_end_date": "2024-12-31",
    "entry_date": "2024-01-01",
    "id_seedbed": "{{seedbed_id}}"
  }
  ```
- **Descripción:** Crear un nuevo líder de semillero

### 11. Crear Administrador
- **Método:** `POST`
- **Ruta:** `/api/researchers/create-administrator`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "name": "Admin Sistema",
    "document_type": "CC",
    "document_number": "00000000",
    "email": "admin@sena.edu.co",
    "phone": "3000000000",
    "password": "admin123",
    "academic_formation": "Ingeniero de Sistemas",
    "knowledge_area": "Sistemas de Información",
    "contract_number": "ADM001",
    "contract_type": "STAFF",
    "contract_start_date": "2024-01-01",
    "contract_end_date": "2024-12-31",
    "entry_date": "2024-01-01"
  }
  ```
- **Descripción:** Crear un nuevo administrador (solo SUPER)

### 12. Crear Super Administrador
- **Método:** `POST`
- **Ruta:** `/api/researchers/create-super`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "name": "Dr. Carlos Super",
    "document_type": "CC",
    "document_number": "00000000",
    "email": "carlos.super@sena.edu.co",
    "phone": "3000000000",
    "password": "password123",
    "academic_formation": "Doctorado en Sistemas",
    "knowledge_area": "Tecnología",
    "contract_number": "CT000",
    "contract_type": "STAFF",
    "contract_start_date": "2024-01-01",
    "contract_end_date": "2024-12-31",
    "entry_date": "2024-01-01"
  }
  ```
- **Descripción:** Crear un nuevo super administrador (solo SUPER)

### 13. Asignar Rol de Líder
- **Método:** `POST`
- **Ruta:** `/api/researchers/assign-leader/{{researcher_id}}`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "start_date": "2024-01-01",
    "end_date": "2024-12-31"
  }
  ```
- **Descripción:** Asignar rol de líder a un investigador existente

### 14. Desactivar Rol
- **Método:** `PUT`
- **Ruta:** `/api/researchers/deactivate-role/{{researcher_id}}`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "role": "LIDER"
  }
  ```
- **Descripción:** Desactivar un rol específico de un investigador

---

## 🔬 Grupos de Investigación

### 1. Listar Grupos
- **Método:** `GET`
- **Ruta:** `/api/research-groups/list`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener lista de grupos de investigación

### 2. Obtener Grupo por ID
- **Método:** `GET`
- **Ruta:** `/api/research-groups/{{group_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener un grupo de investigación específico por ID

### 3. Crear Grupo
- **Método:** `POST`
- **Ruta:** `/api/research-groups/create`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "name": "Grupo de Investigación en Tecnologías Emergentes",
    "description": "Grupo enfocado en el desarrollo de tecnologías emergentes",
    "category": "A1",
    "minciencias_registration": "COL123456789",
    "id_center": "{{center_id}}"
  }
  ```
- **Descripción:** Crear un nuevo grupo de investigación

### 4. Actualizar Grupo
- **Método:** `PUT`
- **Ruta:** `/api/research-groups/update/{{group_id}}`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "name": "Grupo de Investigación en Tecnologías Emergentes Actualizado",
    "description": "Grupo enfocado en el desarrollo de tecnologías emergentes y IA",
    "category": "A1",
    "minciencias_registration": "COL123456789"
  }
  ```
- **Descripción:** Actualizar un grupo de investigación existente

### 5. Activar Grupo
- **Método:** `PUT`
- **Ruta:** `/api/research-groups/activate/{{group_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Activar un grupo de investigación

### 6. Desactivar Grupo
- **Método:** `PUT`
- **Ruta:** `/api/research-groups/inactivate/{{group_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Desactivar un grupo de investigación

### 7. Eliminar Grupo
- **Método:** `DELETE`
- **Ruta:** `/api/research-groups/delete/{{group_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Eliminar un grupo de investigación (solo ADMIN)

---

## 🌱 Semilleros

### 1. Listar Semilleros
- **Método:** `GET`
- **Ruta:** `/api/seedbeds/list`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener lista de semilleros de investigación

### 2. Obtener Semillero por ID
- **Método:** `GET`
- **Ruta:** `/api/seedbeds/{{seedbed_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener un semillero específico por ID

### 3. Crear Semillero
- **Método:** `POST`
- **Ruta:** `/api/seedbeds/create`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "name": "Semillero de Inteligencia Artificial",
    "description": "Semillero enfocado en el desarrollo de soluciones con IA",
    "research_lines": "Machine Learning, Deep Learning, NLP",
    "thematic_areas": "Inteligencia Artificial",
    "technology_network": "Red de Tecnologías Emergentes",
    "id_group": "{{group_id}}",
    "id_leader": "{{researcher_id}}",
    "logo": "https://example.com/logo.png",
    "seedbed_creation_date": "2024-01-01"
  }
  ```
- **Descripción:** Crear un nuevo semillero de investigación

### 4. Actualizar Semillero
- **Método:** `PUT`
- **Ruta:** `/api/seedbeds/update/{{seedbed_id}}`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "name": "Semillero de Inteligencia Artificial y Machine Learning",
    "description": "Semillero enfocado en el desarrollo de soluciones con IA y ML",
    "research_lines": "Machine Learning, Deep Learning, NLP, Computer Vision",
    "thematic_areas": "Inteligencia Artificial",
    "technology_network": "Red de Tecnologías Emergentes"
  }
  ```
- **Descripción:** Actualizar un semillero existente

### 5. Activar Semillero
- **Método:** `PUT`
- **Ruta:** `/api/seedbeds/activate/{{seedbed_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Activar un semillero de investigación

### 6. Desactivar Semillero
- **Método:** `PUT`
- **Ruta:** `/api/seedbeds/inactivate/{{seedbed_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Desactivar un semillero de investigación

### 7. Eliminar Semillero
- **Método:** `DELETE`
- **Ruta:** `/api/seedbeds/delete/{{seedbed_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Eliminar un semillero de investigación (solo ADMIN)

---

## 📋 Proyectos

### 1. Listar Proyectos
- **Método:** `GET`
- **Ruta:** `/api/projects/list`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener lista de proyectos de investigación

### 2. Obtener Proyecto por ID
- **Método:** `GET`
- **Ruta:** `/api/projects/{{project_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener un proyecto específico por ID

### 3. Crear Proyecto
- **Método:** `POST`
- **Ruta:** `/api/projects/create`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "code": "PROJ-2024-001",
    "project_name": "Desarrollo de Sistema de Reconocimiento Facial",
    "description": "Proyecto para desarrollar un sistema de reconocimiento facial usando IA",
    "objectives": "Crear un sistema robusto de reconocimiento facial",
    "id_seedbed": "{{seedbed_id}}",
    "id_group": "{{group_id}}",
    "id_leader": "{{researcher_id}}",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "validity": 2024,
    "budget": 50000000,
    "observations": "Proyecto prioritario para el semillero"
  }
  ```
- **Descripción:** Crear un nuevo proyecto de investigación

### 4. Actualizar Proyecto
- **Método:** `PUT`
- **Ruta:** `/api/projects/update/{{project_id}}`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "code": "PROJ-2024-001",
    "project_name": "Desarrollo de Sistema Avanzado de Reconocimiento Facial",
    "description": "Proyecto para desarrollar un sistema avanzado de reconocimiento facial usando IA y ML",
    "objectives": "Crear un sistema robusto y escalable de reconocimiento facial",
    "budget": 75000000,
    "observations": "Proyecto prioritario para el semillero - Presupuesto actualizado"
  }
  ```
- **Descripción:** Actualizar un proyecto existente

### 5. Eliminar Proyecto
- **Método:** `DELETE`
- **Ruta:** `/api/projects/delete/{{project_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Eliminar un proyecto de investigación (solo ADMIN)

---

## 📝 Actividades

### 1. Listar Actividades
- **Método:** `GET`
- **Ruta:** `/api/activities/list`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener lista de actividades de investigación

### 2. Obtener Actividad por ID
- **Método:** `GET`
- **Ruta:** `/api/activities/{{activity_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener una actividad específica por ID

### 3. Crear Actividad
- **Método:** `POST`
- **Ruta:** `/api/activities/create`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "id_project": "{{project_id}}",
    "name": "Recolección de Datos para Entrenamiento",
    "description": "Recolectar y etiquetar imágenes para el entrenamiento del modelo",
    "start_date": "2024-01-15",
    "end_date": "2024-02-15",
    "responsible_researcher": "{{researcher_id}}",
    "status": "pending",
    "priority": "high",
    "observations": "Actividad crítica para el proyecto"
  }
  ```
- **Descripción:** Crear una nueva actividad de investigación

### 4. Actualizar Actividad
- **Método:** `PUT`
- **Ruta:** `/api/activities/update/{{activity_id}}`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "name": "Recolección y Análisis de Datos para Entrenamiento",
    "description": "Recolectar, etiquetar y analizar imágenes para el entrenamiento del modelo",
    "status": "in_progress",
    "priority": "urgent",
    "observations": "Actividad en progreso - Se requiere acelerar el proceso"
  }
  ```
- **Descripción:** Actualizar una actividad existente

### 5. Eliminar Actividad
- **Método:** `DELETE`
- **Ruta:** `/api/activities/delete/{{activity_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Eliminar una actividad de investigación (solo ADMIN)

---

## 📊 Recursos

### 1. Listar Recursos
- **Método:** `GET`
- **Ruta:** `/api/resources/list`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener lista de recursos de investigación

### 2. Obtener Recurso por ID
- **Método:** `GET`
- **Ruta:** `/api/resources/{{resource_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener un recurso específico por ID

### 3. Crear Recurso
- **Método:** `POST`
- **Ruta:** `/api/resources/create`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "id_activity": "{{activity_id}}",
    "type": "Hardware",
    "description": "GPU NVIDIA RTX 4090 para entrenamiento de modelos",
    "quantity": 2,
    "unit_of_measure": "unidades",
    "unit_cost": 15000000,
    "total_cost": 30000000,
    "resource_status": "available",
    "supplier": "Tecnología Avanzada S.A.S",
    "acquisition_date": "2024-01-20",
    "observations": "Recurso crítico para el proyecto"
  }
  ```
- **Descripción:** Crear un nuevo recurso de investigación

### 4. Actualizar Recurso
- **Método:** `PUT`
- **Ruta:** `/api/resources/update/{{resource_id}}`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "type": "Hardware",
    "description": "GPU NVIDIA RTX 4090 para entrenamiento de modelos de IA",
    "quantity": 2,
    "unit_cost": 15000000,
    "total_cost": 30000000,
    "resource_status": "in_use",
    "observations": "Recurso en uso - Proyecto en progreso"
  }
  ```
- **Descripción:** Actualizar un recurso existente

### 5. Eliminar Recurso
- **Método:** `DELETE`
- **Ruta:** `/api/resources/delete/{{resource_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Eliminar un recurso de investigación (solo ADMIN)

---

## 📚 Productos

### 1. Listar Productos
- **Método:** `GET`
- **Ruta:** `/api/products/list`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener lista de productos de investigación

### 2. Obtener Producto por ID
- **Método:** `GET`
- **Ruta:** `/api/products/{{product_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener un producto específico por ID

### 3. Crear Producto
- **Método:** `POST`
- **Ruta:** `/api/products/create`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "id_project": "{{project_id}}",
    "name": "Sistema de Reconocimiento Facial con IA",
    "type": "software",
    "description": "Sistema desarrollado en Python para reconocimiento facial usando redes neuronales",
    "actual_delivery_date": "2024-11-30",
    "status": "in_development",
    "repository_url": "https://github.com/semillero/face-recognition-system",
    "authors": "Juan Pérez, María García, Carlos López",
    "attached_file": "https://drive.google.com/file/face-recognition-v1.0.zip"
  }
  ```
- **Descripción:** Crear un nuevo producto de investigación

### 4. Actualizar Producto
- **Método:** `PUT`
- **Ruta:** `/api/products/update/{{product_id}}`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "name": "Sistema Avanzado de Reconocimiento Facial con IA",
    "description": "Sistema desarrollado en Python para reconocimiento facial usando redes neuronales profundas",
    "status": "under_review",
    "repository_url": "https://github.com/semillero/advanced-face-recognition-system",
    "authors": "Juan Pérez, María García, Carlos López, Ana Martínez"
  }
  ```
- **Descripción:** Actualizar un producto existente

### 5. Eliminar Producto
- **Método:** `DELETE`
- **Ruta:** `/api/products/delete/{{product_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Eliminar un producto de investigación (solo ADMIN)

---

## 🏆 Certificaciones

### 1. Listar Certificaciones
- **Método:** `GET`
- **Ruta:** `/api/certifications/list`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener lista de certificaciones

### 2. Obtener Certificación por ID
- **Método:** `GET`
- **Ruta:** `/api/certifications/{{certification_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener una certificación específica por ID

### 3. Crear Certificación
- **Método:** `POST`
- **Ruta:** `/api/certifications/create`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "id_researcher": "{{researcher_id}}",
    "id_project": "{{project_id}}",
    "certificate_description": "Certificación de participación en proyecto de investigación sobre IA",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "validity": "1 año",
    "contract_number": "CT001",
    "contract_type": "contractor",
    "participation_type": "Investigador Principal",
    "generated_by": "{{admin_id}}"
  }
  ```
- **Descripción:** Crear una nueva certificación

### 4. Actualizar Certificación
- **Método:** `PUT`
- **Ruta:** `/api/certifications/update/{{certification_id}}`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "certificate_description": "Certificación de participación en proyecto de investigación sobre Inteligencia Artificial",
    "validity": "2 años",
    "participation_type": "Co-investigador Principal"
  }
  ```
- **Descripción:** Actualizar una certificación existente

### 5. Eliminar Certificación
- **Método:** `DELETE`
- **Ruta:** `/api/certifications/delete/{{certification_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Eliminar una certificación (solo ADMIN)

---

## 🔔 Notificaciones

### 1. Listar Notificaciones
- **Método:** `GET`
- **Ruta:** `/api/notifications/list`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener lista de notificaciones

### 2. Obtener Notificación por ID
- **Método:** `GET`
- **Ruta:** `/api/notifications/{{notification_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener una notificación específica por ID

### 3. Crear Notificación
- **Método:** `POST`
- **Ruta:** `/api/notifications/create`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "id_researcher": "{{researcher_id}}",
    "id_activity": "{{activity_id}}",
    "id_project": "{{project_id}}",
    "title": "Recordatorio de Entrega",
    "description": "Se recuerda que la actividad debe ser entregada antes del 30 de noviembre",
    "priority": "high",
    "send_email": true,
    "email_sent": false
  }
  ```
- **Descripción:** Crear una nueva notificación

### 4. Marcar como Leída
- **Método:** `PUT`
- **Ruta:** `/api/notifications/mark-read/{{notification_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Marcar una notificación como leída

### 5. Eliminar Notificación
- **Método:** `DELETE`
- **Ruta:** `/api/notifications/delete/{{notification_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Eliminar una notificación (solo ADMIN)

---

## 🤝 Reuniones

### 1. Listar Reuniones
- **Método:** `GET`
- **Ruta:** `/api/meetings/list`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener lista de reuniones

### 2. Obtener Reunión por ID
- **Método:** `GET`
- **Ruta:** `/api/meetings/{{meeting_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener una reunión específica por ID

### 3. Crear Reunión
- **Método:** `POST`
- **Ruta:** `/api/meetings/create`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "id_project": "{{project_id}}",
    "id_seedbed": "{{seedbed_id}}",
    "title": "Reunión de Seguimiento del Proyecto",
    "description": "Reunión para revisar el avance del proyecto de reconocimiento facial",
    "meeting_date": "2024-12-15T14:00:00.000Z",
    "duration_minutes": 120,
    "location": "Aula 101 - Centro de Formación",
    "modality": "in_person",
    "meeting_url": "",
    "minutes": ""
  }
  ```
- **Descripción:** Crear una nueva reunión

### 4. Actualizar Reunión
- **Método:** `PUT`
- **Ruta:** `/api/meetings/update/{{meeting_id}}`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "title": "Reunión de Seguimiento del Proyecto - Actualizada",
    "description": "Reunión para revisar el avance del proyecto de reconocimiento facial y definir próximos pasos",
    "duration_minutes": 150,
    "status": "scheduled"
  }
  ```
- **Descripción:** Actualizar una reunión existente

### 5. Eliminar Reunión
- **Método:** `DELETE`
- **Ruta:** `/api/meetings/delete/{{meeting_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Eliminar una reunión (solo ADMIN)

---

## 👨‍💼 Subdirectores

### 1. Listar Subdirectores
- **Método:** `GET`
- **Ruta:** `/api/deputy-directors/list`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener lista de subdirectores

### 2. Obtener Subdirector por ID
- **Método:** `GET`
- **Ruta:** `/api/deputy-directors/{{deputy_director_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener un subdirector específico por ID

### 3. Crear Subdirector
- **Método:** `POST`
- **Ruta:** `/api/deputy-directors/create`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "name": "Dr. Ana María Rodríguez",
    "document_type": "CC",
    "document_number": "87654321",
    "email": "ana.rodriguez@sena.edu.co",
    "phone": "3009876543",
    "password": "password123"
  }
  ```
- **Descripción:** Crear un nuevo subdirector

### 4. Actualizar Subdirector
- **Método:** `PUT`
- **Ruta:** `/api/deputy-directors/update/{{deputy_director_id}}`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "name": "Dra. Ana María Rodríguez",
    "email": "ana.rodriguez.actualizada@sena.edu.co",
    "phone": "3009876543"
  }
  ```
- **Descripción:** Actualizar un subdirector existente

### 5. Eliminar Subdirector
- **Método:** `DELETE`
- **Ruta:** `/api/deputy-directors/delete/{{deputy_director_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Eliminar un subdirector (solo ADMIN)

---

## 🔗 Tipos de Vinculación

### 1. Listar Tipos de Vinculación
- **Método:** `GET`
- **Ruta:** `/api/link-types/list`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener lista de tipos de vinculación

### 2. Obtener Tipo de Vinculación por ID
- **Método:** `GET`
- **Ruta:** `/api/link-types/{{link_type_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener un tipo de vinculación específico por ID

### 3. Crear Tipo de Vinculación
- **Método:** `POST`
- **Ruta:** `/api/link-types/create`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "link_type_name": "staff",
    "contract_number": "CT2024001",
    "contract_object": "Prestación de servicios de investigación",
    "obligations": "Desarrollar proyectos de investigación, publicar artículos, formar estudiantes",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "id_center": "{{center_id}}",
    "id_researcher": "{{researcher_id}}"
  }
  ```
- **Descripción:** Crear un nuevo tipo de vinculación

### 4. Actualizar Tipo de Vinculación
- **Método:** `PUT`
- **Ruta:** `/api/link-types/update/{{link_type_id}}`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "contract_object": "Prestación de servicios de investigación y desarrollo tecnológico",
    "obligations": "Desarrollar proyectos de investigación, publicar artículos, formar estudiantes, transferir conocimiento",
    "end_date": "2025-12-31"
  }
  ```
- **Descripción:** Actualizar un tipo de vinculación existente

### 5. Eliminar Tipo de Vinculación
- **Método:** `DELETE`
- **Ruta:** `/api/link-types/delete/{{link_type_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Eliminar un tipo de vinculación (solo ADMIN)

---

## 👥 Usuarios

> **Nota:** Las rutas de usuarios pueden no estar implementadas en el backend actual. Verificar en el servidor.

### 1. Listar Usuarios
- **Método:** `GET`
- **Ruta:** `/api/users/list`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener lista de usuarios del sistema

### 2. Obtener Usuario por ID
- **Método:** `GET`
- **Ruta:** `/api/users/{{user_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Obtener un usuario específico por ID

### 3. Crear Usuario
- **Método:** `POST`
- **Ruta:** `/api/users/create`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "name": "Admin Sistema",
    "document_type": "CC",
    "document_number": "11223344",
    "email": "admin@sena.edu.co",
    "phone": "3001234567",
    "password": "admin123",
    "role": "ADMIN"
  }
  ```
- **Descripción:** Crear un nuevo usuario del sistema

### 4. Actualizar Usuario
- **Método:** `PUT`
- **Ruta:** `/api/users/update/{{user_id}}`
- **Headers:** 
  - `Content-Type: application/json`
  - `x-token: {{token}}`
- **Body:**
  ```json
  {
    "name": "Admin Sistema Actualizado",
    "email": "admin.actualizado@sena.edu.co",
    "phone": "3001234567",
    "role": "ADMIN"
  }
  ```
- **Descripción:** Actualizar un usuario existente

### 5. Eliminar Usuario
- **Método:** `DELETE`
- **Ruta:** `/api/users/delete/{{user_id}}`
- **Headers:** `x-token: {{token}}`
- **Descripción:** Eliminar un usuario del sistema (solo ADMIN)

---

## 🏠 Endpoints Generales

### 1. Información de la API
- **Método:** `GET`
- **Ruta:** `/api`
- **Headers:** Ninguno
- **Descripción:** Obtener información general de la API

---

## 📝 Variables de Postman

Las siguientes variables están configuradas en la colección de Postman:

- `base_url`: `http://localhost:5000`
- `token`: Token JWT de autenticación (se obtiene del login)
- `super_document`: `00000000`
- `super_password`: `super123`
- `admin_document`: `11111111`
- `admin_password`: `admin123`
- `subdirector_document`: `22222222`
- `subdirector_password`: `subdirector123`
- `leader_document`: `44444444`
- `leader_password`: `lider123`
- `researcher_document`: `55555555`
- `researcher_password`: `investigador123`
- `center_id`: ID del centro de formación
- `researcher_id`: ID del investigador
- `group_id`: ID del grupo de investigación
- `seedbed_id`: ID del semillero
- `project_id`: ID del proyecto
- `activity_id`: ID de la actividad
- `resource_id`: ID del recurso
- `product_id`: ID del producto
- `certification_id`: ID de la certificación
- `notification_id`: ID de la notificación
- `meeting_id`: ID de la reunión
- `deputy_director_id`: ID del subdirector
- `link_type_id`: ID del tipo de vinculación
- `user_id`: ID del usuario
- `admin_id`: ID del administrador

---

## 🔒 Roles y Permisos

### Roles disponibles:
- **SUPER**: Super Administrador - Control total del sistema
- **ADMIN**: Administrador - Control administrativo
- **LIDER**: Líder de Semillero - Gestión de proyectos y semilleros
- **INVESTIGADOR**: Investigador básico - Acceso a recursos propios
- **DEPUTY_DIRECTOR**: Subdirector - Revisión y aprobación

### Permisos generales:
- Las rutas marcadas con "(solo ADMIN)" requieren rol ADMIN o SUPER
- Las rutas marcadas con "(solo SUPER)" requieren rol SUPER
- Todas las rutas (excepto login y `/api`) requieren token JWT válido
- El token se envía en el header `x-token`

---

**Última actualización:** Diciembre 2024  
**Versión de la API:** 1.0.0

