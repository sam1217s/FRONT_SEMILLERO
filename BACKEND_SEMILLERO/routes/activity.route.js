import { Router } from 'express';
import { activityCtrl } from '../controllers/activity.controller.js';
import { check } from 'express-validator';
import { valideFields } from '../middlewares/validateField.middleware.js';
import webToken from '../middlewares/webToken.middleware.js';
import {activityHelper} from '../helpers/activity.helper.js';



const routerActivity = Router();

// Listar actividades
routerActivity.get('/list', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    valideFields
], activityCtrl.listActivities);

// Obtener actividad por ID
routerActivity.get('/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], activityCtrl.getActivityById);

// Crear actividad
routerActivity.post('/create', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    check('id_project').isMongoId().withMessage('ID del proyecto inválido'),
    check('name').notEmpty().withMessage('El nombre de la actividad es obligatorio').custom(activityHelper.validateExist),
    check('start_date').notEmpty().withMessage('La fecha de inicio es obligatoria'),
    check('end_date').notEmpty().withMessage('La fecha de fin es obligatoria'),
    check('responsible_researcher').notEmpty().withMessage('ID del investigador obligatorio'),
    valideFields
], activityCtrl.saveActivity);

// Actualizar actividad
routerActivity.put('/update/:id', [
       webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    check('id_project').isMongoId().withMessage('ID del proyecto inválido'),
    check('name').notEmpty().withMessage('El nombre de la actividad es obligatorio').custom(activityHelper.validateExist),
    check('start_date').notEmpty().withMessage('La fecha de inicio es obligatoria'),
    check('end_date').notEmpty().withMessage('La fecha de fin es obligatoria'),
    check('responsible_researcher').notEmpty().withMessage('ID del investigador obligatorio'),
    valideFields
], activityCtrl.updateActivity);

// Eliminar actividad
routerActivity.delete('/delete/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    check('id').notEmpty().withMessage('ID del investigador obligatorio'),
    valideFields
], activityCtrl.deleteActivity);

export { routerActivity };
