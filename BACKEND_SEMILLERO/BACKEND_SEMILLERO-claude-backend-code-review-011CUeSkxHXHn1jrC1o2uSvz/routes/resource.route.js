import { Router } from 'express';
import { resourceCtrl } from '../controllers/resource.controller.js';
import { check } from 'express-validator';
import { valideFields } from '../middlewares/validateField.middleware.js';
import webToken from '../middlewares/webToken.middleware.js';

const {
    listResources,
    getResourceById,
    saveResource,
    updateResource,
    deleteResource
} = resourceCtrl;

const routerResource = Router();

// Listar recursos
routerResource.get('/list', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    valideFields
], listResources);

// Obtener recurso por ID
routerResource.get('/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], getResourceById);

// Crear recurso
routerResource.post('/create', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    check('id_activity').isMongoId().withMessage('ID de la actividad inválido'),
    check('type').notEmpty().withMessage('El tipo de recurso es obligatorio'),
    check('quantity').isNumeric().withMessage('La cantidad debe ser numérica'),
    check('unit_cost').isNumeric().withMessage('El costo unitario debe ser numérico'),
    check('total_cost').isNumeric().withMessage('El costo total debe ser numérico'),
    valideFields
], saveResource);

// Actualizar recurso
routerResource.put('/update/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], updateResource);

// Eliminar recurso
routerResource.delete('/delete/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], deleteResource);

export { routerResource };