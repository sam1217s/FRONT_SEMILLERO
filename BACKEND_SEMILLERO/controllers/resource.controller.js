import resourceModels from '../models/resource.model.js';
import { prepareUpdateData, buildResourceFilter } from '../helpers/resource.helper.js';
import logAction from '../middlewares/log.middleware.js';

const resourceCtrl = {};

// LISTAR TODOS LOS RECURSOS
resourceCtrl.listResources = async (req, res) => {
    try {
        const filter = buildResourceFilter(req.query);

        const resources = await resourceModels
            .find(filter)
            .populate('id_activity', 'name id_project')
            .sort({ createdAt: -1 });

        res.status(200).json({ msg: resources });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// OBTENER RECURSO POR ID
resourceCtrl.getResourceById = async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await resourceModels
            .findById(id)
            .populate('id_activity', 'name id_project');

        if (!resource) {
            return res.status(404).json({ msg: 'Recurso no encontrado' });
        }

        res.status(200).json({ msg: resource });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// CREAR RECURSO
resourceCtrl.saveResource = async (req, res) => {
    try {
        const {
            id_activity,
            type,
            description,
            quantity,
            unit_of_measure,
            unit_cost,
            total_cost,
            resource_status,
            supplier,
            acquisition_date,
            observations
        } = req.body;

        const resource = new resourceModels({
            id_activity,
            type,
            description,
            quantity: quantity || 1,
            unit_of_measure,
            unit_cost: unit_cost || 0,
            total_cost: total_cost || 0,
            resource_status: resource_status || 'available',
            supplier,
            acquisition_date,
            observations
        });

        await resource.save();

        await logAction(
            {
                action: 'CREATE',
                affected_table: 'RESOURCES',
                module: 'RESOURCES',
                affected_record_id: resource._id,
                new_data: resource,
                level: 'INFO',
                description: 'Recurso creado'
            },
            req.headers['x-token'],
            req
        );

        res.status(201).json({ msg: 'Recurso creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ACTUALIZAR RECURSO
resourceCtrl.updateResource = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            type,
            description,
            quantity,
            unit_of_measure,
            unit_cost,
            total_cost,
            resource_status,
            supplier,
            acquisition_date,
            observations
        } = req.body;

        const previousData = await resourceModels.findById(id).lean();

        const updateData = {
            type: type || undefined,
            description: description || undefined,
            quantity: quantity ? Number(quantity) : undefined,
            unit_of_measure: unit_of_measure || undefined,
            unit_cost: unit_cost ? Number(unit_cost) : undefined,
            total_cost: total_cost ? Number(total_cost) : undefined,
            resource_status: resource_status || undefined,
            supplier: supplier || undefined,
            acquisition_date: acquisition_date || undefined,
            observations: observations || undefined
        };

        const cleanedUpdateData = prepareUpdateData(updateData);

        await resourceModels.findByIdAndUpdate(id, cleanedUpdateData);

        await logAction(
            {
                action: 'UPDATE',
                affected_table: 'RESOURCES',
                module: 'RESOURCES',
                affected_record_id: id,
                previous_data: previousData,
                new_data: cleanedUpdateData,
                level: 'INFO',
                description: 'Recurso actualizado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Recurso actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ELIMINAR RECURSO
resourceCtrl.deleteResource = async (req, res) => {
    try {
        const { id } = req.params;

        await resourceModels.findByIdAndDelete(id);

        await logAction(
            {
                action: 'DELETE',
                affected_table: 'RESOURCES',
                module: 'RESOURCES',
                affected_record_id: id,
                level: 'WARNING',
                description: 'Recurso eliminado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Recurso eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export { resourceCtrl };
