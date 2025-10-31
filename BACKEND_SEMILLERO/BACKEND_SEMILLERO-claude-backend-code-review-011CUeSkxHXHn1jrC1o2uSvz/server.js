import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import { dbConnection } from './database/config.js';

// Import middlewares
import { apiLimiter } from './middlewares/rateLimiter.middleware.js';
import { errorHandler, notFound } from './middlewares/errorHandler.middleware.js';

// Import helpers
import { validateEnvVariables } from './helpers/validateEnv.helper.js';

// Import routes
import { routerTrainingCenter } from './routes/training_center.route.js';
import { routerResearcher } from './routes/researcher.route.js';
import { routerResearchGroup } from './routes/research_group.route.js';
import { routerSeedbed } from './routes/seedbed.route.js';
import { routerProject } from './routes/project.route.js';
import { routerActivity } from './routes/activity.route.js';
import { routerResource } from './routes/resource.route.js';
import { routerProduct } from './routes/product.route.js';
import { routerCertification } from './routes/certification.route.js';
import { routerNotification } from './routes/notification.route.js';
import { routerMeeting } from './routes/meeting.route.js';
import { routerLinkType } from './routes/link_type.route.js';

// Configuración
dotenv.config();

// Validar variables de entorno requeridas
try {
    validateEnvVariables();
} catch (error) {
    console.error(error.message);
    process.exit(1); // Salir si faltan variables críticas
}

const app = express();
const port = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Database connection
dbConnection();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Límite de 10MB para JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Límite de 10MB para URL-encoded
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 } // Límite de 50MB para archivos
}));

// Rate limiting para todas las rutas API
app.use('/api/', apiLimiter);

// Routes
app.use('/api/training-centers', routerTrainingCenter);
app.use('/api/researchers', routerResearcher);
app.use('/api/research-groups', routerResearchGroup);
app.use('/api/seedbeds', routerSeedbed);
app.use('/api/projects', routerProject);
app.use('/api/activities', routerActivity);
app.use('/api/resources', routerResource);
app.use('/api/products', routerProduct);
app.use('/api/certifications', routerCertification);
app.use('/api/notifications', routerNotification);
app.use('/api/meetings', routerMeeting);
app.use('/api/link-types', routerLinkType);

// Static assets (frontend build)
app.use(express.static(path.join(__dirname, 'public')));

// Root endpoint (API info)
app.get('/api', (req, res) => {
    res.json({
        message: 'API Sistema de Gestión de Semilleros de Investigación SENA',
        version: '1.0.0',
        status: 'running'
    });
});

// SPA fallback for non-API routes
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de rutas no encontradas (debe ir antes del error handler)
app.use(notFound);

// Error handling centralizado
app.use(errorHandler);

// Server
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en puerto ${port}`);
    console.log(`📍 URL: http://localhost:${port}`);
});

export default app;
