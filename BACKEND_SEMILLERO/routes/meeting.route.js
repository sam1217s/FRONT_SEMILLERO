import { Router } from 'express';
import { meetingCtrl } from '../controllers/meeting.controller.js';
import { check } from 'express-validator';
import { valideFields } from '../middlewares/validateField.middleware.js';
import webToken from '../middlewares/webToken.middleware.js';

const {
    listMeetings,
    getMeetingById,
    saveMeeting,
    updateMeeting,
    deleteMeeting
} = meetingCtrl;

const routerMeeting = Router();

// Listar reuniones
routerMeeting.get('/list', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    valideFields
], listMeetings);

// Obtener reunión por ID
routerMeeting.get('/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], getMeetingById);

// Crear reunión
routerMeeting.post('/create', [
    webToken.validarJWT(['ADMIN', 'LIDER']),
    check('title').notEmpty().withMessage('El título de la reunión es obligatorio'),
    check('meeting_date').notEmpty().withMessage('La fecha de la reunión es obligatoria'),
    check('duration_minutes').isNumeric().withMessage('La duración debe ser numérica'),
    check('modality').isIn(['in_person', 'virtual', 'hybrid']).withMessage('Modalidad inválida'),
    valideFields
], saveMeeting);

// Actualizar reunión
routerMeeting.put('/update/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], updateMeeting);

// Eliminar reunión
routerMeeting.delete('/delete/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], deleteMeeting);

export { routerMeeting };