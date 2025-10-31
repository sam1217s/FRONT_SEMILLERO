import { Router } from 'express';
import { notificationCtrl } from '../controllers/notification.controller.js';
import { check } from 'express-validator';
import { valideFields } from '../middlewares/validateField.middleware.js';
import webToken from '../middlewares/webToken.middleware.js';

const {
    listNotifications,
    getNotificationById,
    saveNotification,
    markAsRead,
    updateNotification,
    deleteNotification
} = notificationCtrl;

const routerNotification = Router();

// Listar notificaciones
routerNotification.get('/list', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    valideFields
], listNotifications);

// Obtener notificación por ID
routerNotification.get('/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], getNotificationById);

// Crear notificación
routerNotification.post('/create', [
    webToken.validarJWT(['ADMIN', 'LIDER']),
    check('id_researcher').isMongoId().withMessage('ID del investigador inválido'),
    check('title').notEmpty().withMessage('El título es obligatorio'),
    check('description').notEmpty().withMessage('La descripción es obligatoria'),
    check('priority').isIn(['low', 'medium', 'high', 'urgent']).withMessage('Prioridad inválida'),
    valideFields
], saveNotification);

// Marcar notificación como leída
routerNotification.put('/mark-read/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], markAsRead);

// Actualizar notificación
routerNotification.put('/update/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], updateNotification);

// Eliminar notificación
routerNotification.delete('/delete/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], deleteNotification);

export { routerNotification };