import { Router } from 'express';
import { productCtrl } from '../controllers/product.controller.js';
import { check } from 'express-validator';
import { valideFields } from '../middlewares/validateField.middleware.js';
import webToken from '../middlewares/webToken.middleware.js';

const {
    listProducts,
    getProductById,
    saveProduct,
    updateProduct,
    deleteProduct
} = productCtrl;

const routerProduct = Router();

// Listar productos
routerProduct.get('/list', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    valideFields
], listProducts);

// Obtener producto por ID
routerProduct.get('/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], getProductById);

// Crear producto
routerProduct.post('/create', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    check('id_project').isMongoId().withMessage('ID del proyecto inválido'),
    check('name').notEmpty().withMessage('El nombre del producto es obligatorio'),
    check('type').notEmpty().withMessage('El tipo de producto es obligatorio'),
    check('type').isIn(['article', 'book', 'book_chapter', 'presentation', 'poster', 'software', 'patent', 'prototype', 'technical_report', 'other']).withMessage('Tipo de producto inválido'),
    valideFields
], saveProduct);

// Actualizar producto
routerProduct.put('/update/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER', 'INVESTIGADOR']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], updateProduct);

// Eliminar producto
routerProduct.delete('/delete/:id', [
    webToken.validarJWT(['ADMIN', 'LIDER']),
    check('id').isMongoId().withMessage('ID inválido'),
    valideFields
], deleteProduct);

export { routerProduct };