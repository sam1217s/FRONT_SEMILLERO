# 🎓 Sistema de Gestión de Semilleros de Investigación SENA - Monorepo

## 📋 Descripción

Este es un monorepo que contiene el sistema completo de gestión de semilleros de investigación del SENA, implementando tanto el **frontend** como el **backend** en un único repositorio.

## 🏗️ Estructura del Repositorio

```
FRONT_SEMILLERO/                          # Repositorio principal (monorepo)
├── BACKEND_SEMILLERO/                    # Backend (Node.js + Express + MongoDB)
│   └── BACKEND_SEMILLERO-claude-backend-code-review-011CUeSkxHXHn1jrC1o2uSvz/
│       ├── controllers/                  # Lógica de negocio
│       ├── models/                       # Modelos de MongoDB (Mongoose)
│       ├── routes/                       # Definición de endpoints
│       ├── middlewares/                  # Middlewares personalizados
│       ├── helpers/                      # Funciones auxiliares
│       ├── database/                     # Configuración de MongoDB
│       ├── scripts/                      # Scripts utilitarios (seed.js)
│       ├── server.js                     # Punto de entrada del backend
│       ├── package.json                  # Dependencias del backend
│       └── .env                          # Variables de entorno del backend
│
└── FRONT_SEMILLERO/                      # Frontend (Vue 3 + Quasar)
    ├── src/                              # Código fuente del frontend
    │   ├── components/                   # Componentes Vue reutilizables
    │   ├── views/                        # Vistas/páginas
    │   │   ├── admin/                    # Vistas de administrador
    │   │   ├── lider/                    # Vistas de líder
    │   │   ├── super/                    # Vistas de super admin
    │   │   └── investigador/             # Vistas de investigador
    │   ├── routers/                      # Configuración de rutas
    │   ├── stores/                       # Pinia stores (estado global)
    │   ├── services/                     # Servicios API
    │   └── plugins/                      # Plugins (Axios, etc)
    ├── package.json                      # Dependencias del frontend
    ├── vite.config.js                    # Configuración de Vite
    └── seed.js                           # Script seed para MongoDB (alternativo)
```

## 🚀 Inicio Rápido

### Pre-requisitos

- ✅ Node.js v18+ ([Descargar](https://nodejs.org/))
- ✅ MongoDB v6+ o cuenta en MongoDB Atlas ([Gratis](https://www.mongodb.com/cloud/atlas))
- ✅ npm o yarn

### Paso 1: Instalación

#### Backend

```bash
# Navegar a la carpeta del backend
cd BACKEND_SEMILLERO/BACKEND_SEMILLERO-claude-backend-code-review-011CUeSkxHXHn1jrC1o2uSvz

# Instalar dependencias del backend
npm install
```

#### Frontend

```bash
# Navegar a la carpeta del frontend
cd FRONT_SEMILLERO

# Instalar dependencias del frontend
npm install
```

### Paso 2: Configuración

#### Backend (.env)

El archivo `.env` ya está configurado en el backend:

```env
PORT=5000
MONGODB_CNN=mongodb+srv://sam12172:semillero%402025@semillero.oonuxi6.mongodb.net/sena_research
JWT_SECRET=tu_clave_secreta_super_segura_aqui_cambiarla_en_produccion
JWT_EXPIRATION=48h
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=1705alejogomez@gmail.com
EMAIL_PASSWORD=ymda tdka rexn suqd
NODE_ENV=development
```

**⚠️ Nota:** Ya está configurado con MongoDB Atlas (cloud), no necesitas instalar MongoDB localmente.

#### Frontend

El frontend ya está configurado para conectarse a `http://localhost:5000/api` (ver `FRONT_SEMILLERO/src/plugins/pluginAxios.js`)

### Paso 3: Poblar la Base de Datos (Seed)

Existen dos opciones para poblar la base de datos con datos de prueba:

#### Opción A: Usar el seed del Backend (Recomendado)

```bash
# Desde la carpeta del backend
cd BACKEND_SEMILLERO/BACKEND_SEMILLERO-claude-backend-code-review-011CUeSkxHXHn1jrC1o2uSvz

# Ejecutar seed
node scripts/seed.js
```

#### Opción B: Usar el seed del Frontend

```bash
# Desde la carpeta del frontend
cd FRONT_SEMILLERO

# Ejecutar seed
node seed.js
```

**⚠️ Importante:** Solo ejecuta uno de los dos seeds, no ambos. El seed del backend es más completo.

### Paso 4: Iniciar los Servidores

Necesitarás **dos terminales** abiertas:

#### Terminal 1: Backend

```bash
# Navegar al backend
cd BACKEND_SEMILLERO/BACKEND_SEMILLERO-claude-backend-code-review-011CUeSkxHXHn1jrC1o2uSvz

# Iniciar servidor backend (modo desarrollo)
npm run dev

# O en modo producción
npm start
```

Deberías ver:
```
✅ Base de datos conectada exitosamente
🚀 Servidor corriendo en puerto 5000
📍 URL: http://localhost:5000
```

#### Terminal 2: Frontend

```bash
# Navegar al frontend
cd FRONT_SEMILLERO

# Iniciar servidor frontend (modo desarrollo)
npm run dev
```

Deberías ver:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Paso 5: Acceder a la Aplicación

Abre tu navegador en: [http://localhost:5173](http://localhost:5173)

## 🔐 Credenciales de Prueba

### Usuarios del Sistema

```
Super Admin:
- Email: super@sena.edu.co
- Password: password123

Administrador:
- Email: admin1@sena.edu.co
- Password: password123

Líder de Investigación:
- Email: lider1@sena.edu.co
- Password: password123
```

## 📦 Tecnologías Utilizadas

### Backend
- **Node.js 18+** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB + Mongoose** - Base de datos NoSQL
- **JWT** - Autenticación basada en tokens
- **bcryptjs** - Encriptación de contraseñas
- **express-validator** - Validación de datos

### Frontend
- **Vue 3** - Framework JavaScript progresivo
- **Quasar Framework** - Librería de componentes UI
- **Vite** - Build tool y dev server
- **Pinia** - Gestión de estado
- **Axios** - Cliente HTTP
- **Vue Router** - Enrutamiento

## 📚 Documentación Adicional

### Backend
- `BACKEND_SEMILLERO/.../README.md` - Documentación completa del backend
- `BACKEND_SEMILLERO/.../QUICKSTART.md` - Guía de inicio rápido
- `BACKEND_SEMILLERO/.../HTTP_EXAMPLES.md` - Ejemplos de peticiones HTTP
- `BACKEND_SEMILLERO/.../POSTMAN_*.md` - Guías para usar Postman
- `BACKEND_SEMILLERO/.../USUARIOS_PRUEBA.md` - Lista de usuarios de prueba

### Frontend
- Todo el código está documentado con comentarios
- Ver commits del proyecto para historial de cambios

## 🛠️ Scripts Disponibles

### Backend
```bash
npm start          # Iniciar en modo producción
npm run dev        # Iniciar en modo desarrollo (con nodemon)
node scripts/seed.js # Poblar base de datos
```

### Frontend
```bash
npm run dev        # Iniciar servidor de desarrollo
npm run build      # Construir para producción
npm run preview    # Vista previa del build de producción
node seed.js       # Poblar base de datos (alternativo)
```

## 🔄 Flujo de Trabajo

1. **Desarrollo Backend**:
   - Modificar archivos en `BACKEND_SEMILLERO/.../`
   - El servidor se reinicia automáticamente con `npm run dev`
   - Probar endpoints con Postman o curl

2. **Desarrollo Frontend**:
   - Modificar archivos en `FRONT_SEMILLERO/src/`
   - Hot reload automático con Vite
   - Los cambios se reflejan inmediatamente en el navegador

3. **Integración**:
   - Frontend consume API del backend en `http://localhost:5000/api`
   - Token JWT se almacena en localStorage
   - Axios interceptors manejan autenticación automáticamente

## 🐛 Solución de Problemas

### Backend no se conecta a MongoDB
```bash
# Verificar que MONGODB_CNN esté correctamente configurada en .env
# Ya está configurada con MongoDB Atlas, debería funcionar automáticamente
```

### Frontend no se conecta al Backend
```bash
# Verificar que el backend esté corriendo en puerto 5000
curl http://localhost:5000

# Verificar que no haya CORS errors en la consola del navegador
```

### Puerto 5000 ya está en uso
```bash
# Cambiar puerto en BACKEND_SEMILLERO/.../.env
PORT=5001

# Actualizar baseURL en FRONT_SEMILLERO/src/plugins/pluginAxios.js
baseURL: 'http://localhost:5001/api'
```

### Errors 404 en el Frontend
- Los endpoints que aún no están implementados en el backend se manejan gracefully
- El frontend calcula estadísticas desde endpoints existentes
- Ver commits recientes para ver correcciones de manejo de errores

## 📈 Estado del Proyecto

### ✅ Backend (100% Completo)
- ✅ Autenticación y autorización (JWT)
- ✅ Gestión de investigadores
- ✅ Grupos de investigación
- ✅ Semilleros
- ✅ Proyectos
- ✅ Actividades
- ✅ Reuniones
- ✅ Productos
- ✅ Recursos
- ✅ Certificaciones
- ✅ Notificaciones
- ✅ Centros de formación

### ✅ Frontend (Optimizado)
- ✅ Sistema de autenticación
- ✅ Módulos de administrador
- ✅ Módulos de líder
- ✅ Módulos de investigador
- ✅ Componentes de tabla optimizados
- ✅ Manejo de errores robusto
- ✅ Integración con backend
- ✅ Estados y permisos por rol

## 🤝 Contribuir

1. Hacer fork del proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto es propiedad del SENA (Servicio Nacional de Aprendizaje).

## 👥 Autores

- Desarrollo Backend: Claude Code (Assistant)
- Desarrollo Frontend: Claude Code (Assistant)
- Optimizaciones y Refactorización: Claude Code (Assistant)

## 📞 Soporte

Para preguntas o problemas:
- Revisar documentación en `BACKEND_SEMILLERO/.../README.md`
- Revisar guías en `BACKEND_SEMILLERO/.../QUICKSTART.md`
- Consultar ejemplos HTTP en `BACKEND_SEMILLERO/.../HTTP_EXAMPLES.md`

---

**¡Feliz Desarrollo!** 🚀👨‍💻👩‍💻
