import { Router } from 'express';
import { seedbedCtrl } from '../controllers/seedbed.controller.js';
import { check } from 'express-validator';
import { valideFields } from '../middlewares/validateField.middleware.js';
import webToken from '../middlewares/webToken.middleware.js';

const {
    listSeedbeds,
    getSeedbedById,
    saveSeedbed,
    updateSeedbed,
    activeSeedbed,
    inactiveSeedbed,
    deleteSeedbed
} = seedbedCtrl;

const routerSeedbed = Router();

// Listar semilleros
routerSeedbed.get('/list', [
    webToken.validarJWT(['SUPER', 'ADMIN', 'LIDER', 'INVESTIGADOR']),
    valideFields
], listSeedbeds);

// Obtener semillero por ID
routerSeedbed.get('/:id', [
    webToken.validarJWT(['SUPER', 'ADMIN', 'LIDER', 'INVESTIGADOR']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], getSeedbedById);

// Crear semillero
routerSeedbed.post('/create', [
    webToken.validarJWT(['SUPER', 'ADMIN', 'LIDER']),
    check('name').notEmpty().withMessage('El nombre del semillero es obligatorio'),
    check('id_group').isMongoId().withMessage('ID del grupo de investigación inválido'),
    check('id_leader').isMongoId().withMessage('ID del líder inválido'),
    valideFields
], saveSeedbed);

// Actualizar semillero
routerSeedbed.put('/update/:id', [
    webToken.validarJWT(['SUPER', 'ADMIN', 'LIDER']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], updateSeedbed);

// Activar semillero
routerSeedbed.put('/activate/:id', [
    webToken.validarJWT(['SUPER', 'ADMIN', 'LIDER']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], activeSeedbed);

// Desactivar semillero
routerSeedbed.put('/inactivate/:id', [
    webToken.validarJWT(['SUPER', 'ADMIN', 'LIDER']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], inactiveSeedbed);

// Eliminar semillero
routerSeedbed.delete('/delete/:id', [
    webToken.validarJWT(['SUPER', 'ADMIN']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], deleteSeedbed);

export { routerSeedbed };