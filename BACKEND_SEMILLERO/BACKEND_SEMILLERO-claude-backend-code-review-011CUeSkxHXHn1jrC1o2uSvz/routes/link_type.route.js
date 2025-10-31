import { Router } from 'express';
import { linkTypeCtrl } from '../controllers/link_type.controller.js';
import { check } from 'express-validator';
import { valideFields } from '../middlewares/validateField.middleware.js';
import webToken from '../middlewares/webToken.middleware.js';

const {
    listLinkTypes,
    getLinkTypeById,
    saveLinkType,
    updateLinkType,
    deleteLinkType
} = linkTypeCtrl;

const routerLinkType = Router();

// Listar tipos de vinculación
routerLinkType.get('/list', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    valideFields
], listLinkTypes);

// Obtener tipo de vinculación por ID
routerLinkType.get('/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], getLinkTypeById);

// Crear tipo de vinculación
routerLinkType.post('/create', [
    webToken.validarJWT(['ADMIN', 'LIDER']),
    check('id_center').isMongoId().withMessage('ID del centro de formación inválido'),
    check('id_researcher').isMongoId().withMessage('ID del investigador inválido'),
    check('start_date').notEmpty().withMessage('La fecha de inicio es obligatoria'),
    valideFields
], saveLinkType);

// Actualizar tipo de vinculación
routerLinkType.put('/update/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], updateLinkType);

// Eliminar tipo de vinculación
routerLinkType.delete('/delete/:id', [
    webToken.validarJWT(['ADMIN']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], deleteLinkType);

export { routerLinkType };