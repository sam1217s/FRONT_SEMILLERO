import { Router } from 'express';
import { certificationCtrl } from '../controllers/certification.controller.js';
import { check } from 'express-validator';
import { valideFields } from '../middlewares/validateField.middleware.js';
import webToken from '../middlewares/webToken.middleware.js';

const {
    listCertifications,
    getCertificationById,
    saveCertification,
    updateCertification,
    deleteCertification
} = certificationCtrl;

const routerCertification = Router();

// Listar certificaciones
routerCertification.get('/list', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    valideFields
], listCertifications);

// Obtener certificación por ID
routerCertification.get('/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], getCertificationById);

// Crear certificación
routerCertification.post('/create', [
    webToken.validarJWT(['ADMIN', 'LIDER']),
    check('id_researcher').isMongoId().withMessage('ID del investigador inválido'),
    check('id_project').isMongoId().withMessage('ID del proyecto inválido'),
    check('certificate_description').notEmpty().withMessage('La descripción del certificado es obligatoria'),
    check('start_date').notEmpty().withMessage('La fecha de inicio es obligatoria'),
    check('end_date').notEmpty().withMessage('La fecha de fin es obligatoria'),
    check('contract_type').isIn(['contractor', 'staff']).withMessage('Tipo de contrato inválido'),
    valideFields
], saveCertification);

// Actualizar certificación
routerCertification.put('/update/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], updateCertification);

// Eliminar certificación
routerCertification.delete('/delete/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], deleteCertification);

export { routerCertification };