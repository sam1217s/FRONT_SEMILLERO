import { Router } from 'express';
import { researcherCtrl } from '../controllers/researcher.controller.js';
import { check } from 'express-validator';
import { valideFields } from '../middlewares/validateField.middleware.js';
import webToken from '../middlewares/webToken.middleware.js';
import { authLimiter, createLimiter } from '../middlewares/rateLimiter.middleware.js';

const {
    loginResearcher,
    listResearchers,
    listAdmins,
    getResearcherById,
    saveResearcher,
    updateResearcher,
    addRoleToResearcher,
    addResearcherToGroup,
    activeResearcher,
    inactiveResearcher,
    deleteResearcher,
    createSeedbedLeader,
    createAdministrator,
    createSuper,
    assignLeaderRole,
    deactivateRole
} = researcherCtrl;

const routerResearcher = Router();

// Login de investigador
routerResearcher.post('/login', [
    authLimiter, // Rate limiting estricto para login
    check('document_number').notEmpty().withMessage('El número de documento es obligatorio'),
    check('password').notEmpty().withMessage('La contraseña es obligatoria'),
    valideFields
], loginResearcher);

// Listar investigadores
routerResearcher.get('/list', [
    webToken.validarJWT(['SUPER', 'ADMIN', 'LIDER', 'INVESTIGADOR'])
], listResearchers);

// Listar administradores (solo SUPER)
routerResearcher.get('/list-admins', [
    webToken.validarJWT(['SUPER'])
], listAdmins);

// Obtener investigador por ID
routerResearcher.get('/:id', [
    webToken.validarJWT(['SUPER', 'ADMIN', 'LIDER', 'INVESTIGADOR']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], getResearcherById);

// Crear investigador
routerResearcher.post('/create', [
    webToken.validarJWT(['SUPER', 'ADMIN']),
    check('name').notEmpty().withMessage('El nombre es obligatorio'),
    check('document_type').notEmpty().withMessage('El tipo de documento es obligatorio'),
    check('document_number').notEmpty().withMessage('El número de documento es obligatorio'),
    check('email').notEmpty().withMessage('El email es obligatorio'),
    check('email').isEmail().withMessage('El email no es válido'),
    check('password').notEmpty().withMessage('La contraseña es obligatoria'),
    check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    check('entry_date').notEmpty().withMessage('La fecha de ingreso es obligatoria'),
    valideFields
], saveResearcher);

// Actualizar investigador
routerResearcher.put('/update/:id', [
    webToken.validarJWT(['SUPER', 'ADMIN']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], updateResearcher);

// Agregar rol a investigador
routerResearcher.post('/add-role/:id', [
    webToken.validarJWT(['SUPER', 'ADMIN']),
    check('id').isMongoId().withMessage('ID inválido'),
    check('role').notEmpty().withMessage('El rol es obligatorio'),
    check('start_date').notEmpty().withMessage('La fecha de inicio es obligatoria'),
    valideFields
], addRoleToResearcher);

// Agregar investigador a grupo
routerResearcher.post('/add-to-group/:id', [
    webToken.validarJWT(['SUPER', 'ADMIN', 'LIDER']),
    check('id').isMongoId().withMessage('ID inválido'),
    check('id_group').isMongoId().withMessage('ID de grupo inválido'),
    check('incorporation_date').notEmpty().withMessage('La fecha de incorporación es obligatoria'),
    valideFields
], addResearcherToGroup);

// Activar investigador
routerResearcher.put('/activate/:id', [
    webToken.validarJWT(['SUPER', 'ADMIN']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], activeResearcher);

// Desactivar investigador
routerResearcher.put('/inactivate/:id', [
    webToken.validarJWT(['SUPER', 'ADMIN']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], inactiveResearcher);

// Eliminar investigador
routerResearcher.delete('/delete/:id', [
    webToken.validarJWT(['SUPER', 'ADMIN']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], deleteResearcher);


// Crear líder de semillero
routerResearcher.post('/create-leader', [
    webToken.validarJWT(['SUPER', 'ADMIN', 'LIDER']),
    check('name').notEmpty().withMessage('El nombre es obligatorio'),
    check('document_type').notEmpty().withMessage('El tipo de documento es obligatorio'),
    check('document_number').notEmpty().withMessage('El número de documento es obligatorio'),
    check('email').notEmpty().withMessage('El email es obligatorio'),
    check('email').isEmail().withMessage('El email no es válido'),
    check('password').notEmpty().withMessage('La contraseña es obligatoria'),
    check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    check('entry_date').notEmpty().withMessage('La fecha de ingreso es obligatoria'),
    valideFields
], createSeedbedLeader);

// Crear administrador
routerResearcher.post('/create-administrator', [
    webToken.validarJWT(['SUPER']),
    check('name').notEmpty().withMessage('El nombre es obligatorio'),
    check('document_type').notEmpty().withMessage('El tipo de documento es obligatorio'),
    check('document_number').notEmpty().withMessage('El número de documento es obligatorio'),
    check('email').notEmpty().withMessage('El email es obligatorio'),
    check('email').isEmail().withMessage('El email no es válido'),
    check('password').notEmpty().withMessage('La contraseña es obligatoria'),
    check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    check('entry_date').notEmpty().withMessage('La fecha de ingreso es obligatoria'),
    valideFields
], createAdministrator);

// Crear super administrador
routerResearcher.post('/create-super', [
    webToken.validarJWT(['SUPER']),
    check('name').notEmpty().withMessage('El nombre es obligatorio'),
    check('document_type').notEmpty().withMessage('El tipo de documento es obligatorio'),
    check('document_number').notEmpty().withMessage('El número de documento es obligatorio'),
    check('email').notEmpty().withMessage('El email es obligatorio'),
    check('email').isEmail().withMessage('El email no es válido'),
    check('password').notEmpty().withMessage('La contraseña es obligatoria'),
    check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    check('entry_date').notEmpty().withMessage('La fecha de ingreso es obligatoria'),
    valideFields
], createSuper);


// Asignar rol de líder
routerResearcher.post('/assign-leader/:id', [
    webToken.validarJWT(['SUPER', 'ADMIN', 'LIDER']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], assignLeaderRole);

// Desactivar rol
routerResearcher.put('/deactivate-role/:id', [
    webToken.validarJWT(['SUPER', 'ADMIN']),
    check('id').isMongoId().withMessage('ID inválido'),
    check('role').notEmpty().withMessage('El rol es obligatorio'),
    valideFields
], deactivateRole);

export { routerResearcher };
