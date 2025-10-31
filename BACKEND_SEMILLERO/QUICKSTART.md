# ⚡ Guía de Inicio Rápido

Esta guía te ayudará a tener el proyecto funcionando en menos de 10 minutos.

## 📋 Pre-requisitos

Asegúrate de tener instalado:
- ✅ Node.js v18+ ([Descargar aquí](https://nodejs.org/))
- ✅ MongoDB v6+ ([Descargar aquí](https://www.mongodb.com/try/download/community))
- ✅ Git (opcional)

## 🚀 Paso 1: Instalación

```bash
# Navegar a la carpeta del proyecto
cd semillero-investigacion-sena

# Instalar dependencias
npm install
```

## 🔧 Paso 2: Configuración

1. **Editar el archivo `.env`** con tus datos:
```env
PORT=5000
MONGODB_CNN=mongodb://localhost:27017/sena_research
JWT_SECRET=cambia_este_secreto_por_uno_muy_seguro
JWT_EXPIRATION=48h
```

> **Importante:** Cambia `JWT_SECRET` por una clave secreta fuerte y única.

## 🗄️ Paso 3: Iniciar MongoDB

### Windows:
```cmd
# Abre una terminal y ejecuta:
mongod
```

### macOS/Linux:
```bash
# Opción 1: Si instalaste como servicio
sudo systemctl start mongod

# Opción 2: Ejecutar directamente
mongod --dbpath /ruta/a/tu/carpeta/data
```

### Alternativa: MongoDB Atlas (Cloud)
Si prefieres no instalar MongoDB localmente:
1. Crea una cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster
3. Obtén tu connection string
4. Actualiza `.env`:
```env
MONGODB_CNN=mongodb+srv://usuario:password@cluster.mongodb.net/sena_research
```

## ▶️ Paso 4: Iniciar el Servidor

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# O modo producción
npm start
```

Deberías ver:
```
✅ Base de datos conectada exitosamente
🚀 Servidor corriendo en puerto 5000
📍 URL: http://localhost:5000
```

## 🧪 Paso 5: Probar la API

### Opción A: Navegador
Abre tu navegador y ve a: [http://localhost:5000](http://localhost:5000)

Deberías ver:
```json
{
  "message": "API Sistema de Gestión de Semilleros de Investigación SENA",
  "version": "1.0.0",
  "status": "running"
}
```

### Opción B: Con cURL
```bash
curl http://localhost:5000
```

### Opción C: Con Postman
1. Descarga [Postman](https://www.postman.com/downloads/)
2. Importa los ejemplos del archivo `HTTP_EXAMPLES.md`
3. Empieza a probar los endpoints

## 👤 Paso 6: Usuarios de Prueba

El sistema ya incluye usuarios de prueba preconfigurados en la base de datos:

- **Admin**: Documento `11111111`, Password `admin123`
- **Coordinador**: Documento `22222222`, Password `coord123`
- **Líder**: Documento `33333333`, Password `leader123`
- **Investigador**: Documento `44444444`, Password `research123`

> **Nota**: Los usuarios de prueba ya están creados en la base de datos y listos para usar.

## 🔐 Paso 7: Hacer Login

```bash
curl -X POST http://localhost:5000/api/researchers/login \
  -H "Content-Type: application/json" \
  -d '{
    "document_number": "11111111",
    "password": "admin123"
  }'
```

Copia el `token` que recibes en la respuesta. Lo necesitarás para todas las peticiones autenticadas.

## 📋 Paso 8: Importar Colección de Postman

1. Abre Postman
2. Importa el archivo `SENA_Research_System_API.postman_collection.json`
3. Configura las variables de entorno en Postman:
   - `base_url`: `http://localhost:5000`
   - `admin_token`: (el token que obtuviste del login)
4. ¡Ya puedes probar todos los endpoints!

## ✅ ¡Listo!

Ya tienes el sistema funcionando. Ahora puedes:

1. 📖 Leer el `README.md` completo para entender la estructura
2. 🧪 Revisar `HTTP_EXAMPLES.md` para ver ejemplos de todas las peticiones
3. 💻 Empezar a desarrollar los módulos faltantes siguiendo los patrones establecidos

## 🆘 ¿Problemas?

### MongoDB no se conecta
```
❌ Error al conectar a la base de datos
```
**Solución:** Asegúrate de que MongoDB esté corriendo:
```bash
# Verificar si MongoDB está corriendo
mongosh  # o mongo en versiones antiguas

# Si no se conecta, inicia MongoDB:
mongod
```

### Puerto 5000 ya está en uso
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solución:** Cambia el puerto en `.env`:
```env
PORT=5001  # o cualquier otro puerto disponible
```

### Módulo no encontrado
```
Error: Cannot find module 'express'
```
**Solución:** Reinstala las dependencias:
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Token no válido
```
{"msg": "Token no válido"}
```
**Solución:** 
- Verifica que estés enviando el header `x-token` correctamente
- Verifica que el token no haya expirado (duración: 48h)
- Haz login nuevamente para obtener un token nuevo

## 📚 Siguientes Pasos

1. **¡El sistema está completo!** Todos los módulos están implementados:
   - ✅ Research Groups
   - ✅ Seedbeds
   - ✅ Projects
   - ✅ Activities
   - ✅ Resources
   - ✅ Products
   - ✅ Certifications
   - ✅ Notifications
   - ✅ Meetings
   - ✅ Deputy Directors
   - ✅ Link Types

2. **Personalizar según tu necesidad**: Ajusta los modelos, controladores y rutas según los requerimientos específicos de tu institución.

3. **Agregar funcionalidades extra**: 
   - Sistema de archivos/uploads
   - Reportes en PDF
   - Dashboard con estadísticas
   - Notificaciones por email
   - Tests unitarios
   - Y mucho más...

## 💡 Tips Útiles

- **Auto-reload en desarrollo**: Usa `npm run dev` para que el servidor se reinicie automáticamente al hacer cambios
- **Ver logs en consola**: Todos los logs se muestran en la terminal donde corriste el servidor
- **MongoDB GUI**: Usa [MongoDB Compass](https://www.mongodb.com/products/compass) para visualizar tu base de datos
- **Debugging**: Usa `console.log()` libremente durante desarrollo, pero recuerda quitarlos en producción

---

¡Feliz coding! 🚀👨‍💻👩‍💻
