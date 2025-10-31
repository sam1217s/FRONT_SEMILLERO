import productModels from '../models/product.model.js';
import { prepareUpdateData, buildProductFilter } from '../helpers/product.helper.js';
import logAction from '../middlewares/log.middleware.js';

const productCtrl = {};

// LISTAR TODOS LOS PRODUCTOS
productCtrl.listProducts = async (req, res) => {
    try {
        const filter = buildProductFilter(req.query);

        const products = await productModels
            .find(filter)
            .populate('id_project', 'project_name code')
            .sort({ createdAt: -1 });

        res.status(200).json({ msg: products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// OBTENER PRODUCTO POR ID
productCtrl.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModels
            .findById(id)
            .populate('id_project', 'project_name code');

        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        res.status(200).json({ msg: product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// CREAR PRODUCTO
productCtrl.saveProduct = async (req, res) => {
    try {
        const {
            id_project,
            name,
            type,
            description,
            actual_delivery_date,
            status,
            repository_url,
            authors,
            attached_file
        } = req.body;

        const product = new productModels({
            id_project,
            name,
            type,
            description,
            actual_delivery_date,
            status: status || 'planned',
            repository_url,
            authors,
            attached_file
        });

        await product.save();

        await logAction(
            {
                action: 'CREATE',
                affected_table: 'PRODUCTS',
                module: 'PRODUCTS',
                affected_record_id: product._id,
                new_data: product,
                level: 'INFO',
                description: 'Producto creado'
            },
            req.headers['x-token'],
            req
        );

        res.status(201).json({ msg: 'Producto creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ACTUALIZAR PRODUCTO
productCtrl.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            type,
            description,
            actual_delivery_date,
            status,
            repository_url,
            authors,
            attached_file
        } = req.body;

        const previousData = await productModels.findById(id).lean();

        const updateData = {
            name: name || undefined,
            type: type || undefined,
            description: description || undefined,
            actual_delivery_date: actual_delivery_date || undefined,
            status: status || undefined,
            repository_url: repository_url || undefined,
            authors: authors || undefined,
            attached_file: attached_file || undefined
        };

        const cleanedUpdateData = prepareUpdateData(updateData);

        await productModels.findByIdAndUpdate(id, cleanedUpdateData);

        await logAction(
            {
                action: 'UPDATE',
                affected_table: 'PRODUCTS',
                module: 'PRODUCTS',
                affected_record_id: id,
                previous_data: previousData,
                new_data: cleanedUpdateData,
                level: 'INFO',
                description: 'Producto actualizado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Producto actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ELIMINAR PRODUCTO
productCtrl.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        await productModels.findByIdAndDelete(id);

        await logAction(
            {
                action: 'DELETE',
                affected_table: 'PRODUCTS',
                module: 'PRODUCTS',
                affected_record_id: id,
                level: 'WARNING',
                description: 'Producto eliminado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export { productCtrl };
