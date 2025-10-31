import { Router } from 'express';
import { trainingCenterCtrl } from '../controllers/training_center.controller.js';
import { check } from 'express-validator';
import { valideFields } from '../middlewares/validateField.middleware.js';
import webToken from '../middlewares/webToken.middleware.js';

const {
    listTrainingCenters,
    getTrainingCenterById,
    saveTrainingCenter,
    updateTrainingCenter,
    activeTrainingCenter,
    inactiveTrainingCenter,
    deleteTrainingCenter
} = trainingCenterCtrl;

const routerTrainingCenter = Router();

// Listar centros (con filtros opcionales)
routerTrainingCenter.get('/list', [
    webToken.validarJWT(['SUPER', 'ADMIN', 'LIDER', 'INVESTIGADOR'])
], listTrainingCenters);

// Obtener centro por ID
routerTrainingCenter.get('/:id', [
    webToken.validarJWT(['SUPER', 'ADMIN', 'LIDER', 'INVESTIGADOR']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], getTrainingCenterById);

// Crear centro
routerTrainingCenter.post('/create', [
    webToken.validarJWT(['SUPER']),
    check('name').notEmpty().withMessage('El nombre del centro es obligatorio'),
    valideFields
], saveTrainingCenter);

// Actualizar centro
routerTrainingCenter.put('/update/:id', [
    webToken.validarJWT(['SUPER', 'ADMIN']),
    check('id').isMongoId().withMessage('ID inválido'),
    check('name').notEmpty().withMessage('El nombre del centro es obligatorio'),
    valideFields
], updateTrainingCenter);

// Activar centro
routerTrainingCenter.put('/activate/:id', [
    webToken.validarJWT(['SUPER', 'ADMIN']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], activeTrainingCenter);

// Desactivar centro
routerTrainingCenter.put('/inactivate/:id', [
    webToken.validarJWT(['SUPER', 'ADMIN']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], inactiveTrainingCenter);

// Eliminar centro
routerTrainingCenter.delete('/delete/:id', [
    webToken.validarJWT(['ADMIN']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], deleteTrainingCenter);

export { routerTrainingCenter };
