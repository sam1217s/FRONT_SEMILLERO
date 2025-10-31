import { Router } from 'express';
import { researchGroupCtrl } from '../controllers/research_group.controller.js';
import { check } from 'express-validator';
import { valideFields } from '../middlewares/validateField.middleware.js';
import webToken from '../middlewares/webToken.middleware.js';

const {
    listResearchGroups,
    getResearchGroupById,
    saveResearchGroup,
    updateResearchGroup,
    activeResearchGroup,
    inactiveResearchGroup,
    deleteResearchGroup
} = researchGroupCtrl;

const routerResearchGroup = Router();

// Listar grupos de investigación
routerResearchGroup.get('/list', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    valideFields
], listResearchGroups);

// Obtener grupo por ID
routerResearchGroup.get('/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], getResearchGroupById);

// Crear grupo de investigación
routerResearchGroup.post('/create', [
    webToken.validarJWT(['ADMIN']),
    check('name').notEmpty().withMessage('El nombre del grupo es obligatorio'),
    check('id_center').isMongoId().withMessage('ID del centro de formación inválido'),
    valideFields
], saveResearchGroup);

// Actualizar grupo de investigación
routerResearchGroup.put('/update/:id', [
    webToken.validarJWT(['ADMIN']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], updateResearchGroup);

// Activar grupo de investigación
routerResearchGroup.put('/activate/:id', [
    webToken.validarJWT(['ADMIN']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], activeResearchGroup);

// Desactivar grupo de investigación
routerResearchGroup.put('/inactivate/:id', [
    webToken.validarJWT(['ADMIN']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], inactiveResearchGroup);

// Eliminar grupo de investigación
routerResearchGroup.delete('/delete/:id', [
    webToken.validarJWT(['ADMIN']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], deleteResearchGroup);

export { routerResearchGroup };