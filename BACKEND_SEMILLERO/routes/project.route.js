import { Router } from 'express';
import { projectCtrl } from '../controllers/project.controller.js';
import { check } from 'express-validator';
import { valideFields } from '../middlewares/validateField.middleware.js';
import webToken from '../middlewares/webToken.middleware.js';

const {
    listProjects,
    getProjectById,
    saveProject,
    updateProject,
    deleteProject
} = projectCtrl;

const routerProject = Router();

// Listar proyectos
routerProject.get('/list', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    valideFields
], listProjects);

// Obtener proyecto por ID
routerProject.get('/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], getProjectById);

// Crear proyecto
routerProject.post('/create', [
    webToken.validarJWT(['ADMIN', 'LIDER']),
    check('code').notEmpty().withMessage('El código del proyecto es obligatorio'),
    check('project_name').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    check('id_seedbed').isMongoId().withMessage('ID del semillero inválido'),
    check('id_group').isMongoId().withMessage('ID del grupo de investigación inválido'),
    check('id_leader').isMongoId().withMessage('ID del líder inválido'),
    check('start_date').notEmpty().withMessage('La fecha de inicio es obligatoria'),
    check('end_date').notEmpty().withMessage('La fecha de fin es obligatoria'),
    check('validity').isNumeric().withMessage('El año de vigencia debe ser numérico'),
    valideFields
], saveProject);

// Actualizar proyecto
routerProject.put('/update/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], updateProject);

// Eliminar proyecto
routerProject.delete('/delete/:id', [
    webToken.validarJWT(['ADMIN']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], deleteProject);

export { routerProject };