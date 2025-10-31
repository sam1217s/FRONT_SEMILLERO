import linkTypeModels from '../models/link_type.model.js';
import { prepareUpdateData, buildLinkTypeFilter } from '../helpers/link_type.helper.js';
import logAction from '../middlewares/log.middleware.js';

const linkTypeCtrl = {};

// LISTAR TODOS LOS TIPOS DE VINCULACIÓN
linkTypeCtrl.listLinkTypes = async (req, res) => {
    try {
        const filter = buildLinkTypeFilter(req.query);

        const linkTypes = await linkTypeModels
            .find(filter)
            .populate('id_center', 'name city department')
            .populate('id_researcher', 'name email document_number')
            .sort({ createdAt: -1 });

        res.status(200).json({ msg: linkTypes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// OBTENER TIPO DE VINCULACIÓN POR ID
linkTypeCtrl.getLinkTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const linkType = await linkTypeModels
            .findById(id)
            .populate('id_center', 'name city department')
            .populate('id_researcher', 'name email document_number');

        if (!linkType) {
            return res.status(404).json({ msg: 'Tipo de vinculación no encontrado' });
        }

        res.status(200).json({ msg: linkType });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// CREAR TIPO DE VINCULACIÓN
linkTypeCtrl.saveLinkType = async (req, res) => {
    try {
        const {
            link_type_name,
            contract_number,
            contract_object,
            obligations,
            start_date,
            end_date,
            id_center,
            id_researcher
        } = req.body;

        const linkType = new linkTypeModels({
            link_type_name,
            contract_number,
            contract_object,
            obligations,
            start_date,
            end_date,
            id_center,
            id_researcher
        });

        await linkType.save();

        await logAction(
            {
                action: 'CREATE',
                affected_table: 'LINK_TYPES',
                module: 'LINK_TYPES',
                affected_record_id: linkType._id,
                new_data: linkType,
                level: 'INFO',
                description: 'Tipo de vinculación creado'
            },
            req.headers['x-token'],
            req
        );

        res.status(201).json({ msg: 'Tipo de vinculación creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ACTUALIZAR TIPO DE VINCULACIÓN
linkTypeCtrl.updateLinkType = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            link_type_name,
            contract_number,
            contract_object,
            obligations,
            start_date,
            end_date
        } = req.body;

        const previousData = await linkTypeModels.findById(id).lean();

        const updateData = {
            link_type_name: link_type_name || undefined,
            contract_number: contract_number || undefined,
            contract_object: contract_object || undefined,
            obligations: obligations || undefined,
            start_date: start_date || undefined,
            end_date: end_date || undefined
        };

        const cleanedUpdateData = prepareUpdateData(updateData);

        await linkTypeModels.findByIdAndUpdate(id, cleanedUpdateData);

        await logAction(
            {
                action: 'UPDATE',
                affected_table: 'LINK_TYPES',
                module: 'LINK_TYPES',
                affected_record_id: id,
                previous_data: previousData,
                new_data: cleanedUpdateData,
                level: 'INFO',
                description: 'Tipo de vinculación actualizado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Tipo de vinculación actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ELIMINAR TIPO DE VINCULACIÓN
linkTypeCtrl.deleteLinkType = async (req, res) => {
    try {
        const { id } = req.params;

        await linkTypeModels.findByIdAndDelete(id);

        await logAction(
            {
                action: 'DELETE',
                affected_table: 'LINK_TYPES',
                module: 'LINK_TYPES',
                affected_record_id: id,
                level: 'WARNING',
                description: 'Tipo de vinculación eliminado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Tipo de vinculación eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export { linkTypeCtrl };
