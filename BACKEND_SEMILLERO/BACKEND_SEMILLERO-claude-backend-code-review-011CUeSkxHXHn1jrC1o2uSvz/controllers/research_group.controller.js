import researchGroupModels from '../models/research_group.model.js';
import { prepareUpdateData, buildResearchGroupFilter } from '../helpers/research_group.helper.js';
import logAction from '../middlewares/log.middleware.js';
import { GENERAL_STATUS } from '../constants/status.constants.js';

const researchGroupCtrl = {};

// LISTAR TODOS LOS GRUPOS DE INVESTIGACIÓN
researchGroupCtrl.listResearchGroups = async (req, res) => {
    try {
        const filter = buildResearchGroupFilter(req.query);

        const groups = await researchGroupModels
            .find(filter)
            .populate('id_center', 'name city department')
            .sort({ createdAt: -1 });

        res.status(200).json({ msg: groups });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// OBTENER GRUPO POR ID
researchGroupCtrl.getResearchGroupById = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await researchGroupModels
            .findById(id)
            .populate('id_center', 'name city department');

        if (!group) {
            return res.status(404).json({ msg: 'Grupo de investigación no encontrado' });
        }

        res.status(200).json({ msg: group });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// CREAR GRUPO DE INVESTIGACIÓN
researchGroupCtrl.saveResearchGroup = async (req, res) => {
    try {
        const { name, description, category, minciencias_registration, id_center } = req.body;

        const group = new researchGroupModels({
            name,
            description,
            category,
            minciencias_registration,
            id_center
        });

        await group.save();

        await logAction(
            {
                action: 'CREATE',
                affected_table: 'RESEARCH_GROUPS',
                module: 'RESEARCH_GROUPS',
                affected_record_id: group._id,
                new_data: group,
                level: 'INFO',
                description: 'Grupo de investigación creado'
            },
            req.headers['x-token'],
            req
        );

        res.status(201).json({ msg: 'Grupo de investigación creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ACTUALIZAR GRUPO DE INVESTIGACIÓN
researchGroupCtrl.updateResearchGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, minciencias_registration } = req.body;

        const previousData = await researchGroupModels.findById(id).lean();

        const updateData = {
            name: name || undefined,
            description: description || undefined,
            category: category || undefined,
            minciencias_registration: minciencias_registration || undefined
        };

        const cleanedUpdateData = prepareUpdateData(updateData);

        await researchGroupModels.findByIdAndUpdate(id, cleanedUpdateData);

        await logAction(
            {
                action: 'UPDATE',
                affected_table: 'RESEARCH_GROUPS',
                module: 'RESEARCH_GROUPS',
                affected_record_id: id,
                previous_data: previousData,
                new_data: cleanedUpdateData,
                level: 'INFO',
                description: 'Grupo de investigación actualizado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Grupo de investigación actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ACTIVAR GRUPO DE INVESTIGACIÓN
researchGroupCtrl.activeResearchGroup = async (req, res) => {
    try {
        const { id } = req.params;

        await researchGroupModels.findByIdAndUpdate(id, { status: GENERAL_STATUS.ACTIVE });

        await logAction(
            {
                action: 'ACTIVATE',
                affected_table: 'RESEARCH_GROUPS',
                module: 'RESEARCH_GROUPS',
                affected_record_id: id,
                level: 'INFO',
                description: 'Grupo de investigación activado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Grupo de investigación activado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// DESACTIVAR GRUPO DE INVESTIGACIÓN
researchGroupCtrl.inactiveResearchGroup = async (req, res) => {
    try {
        const { id } = req.params;

        await researchGroupModels.findByIdAndUpdate(id, { status: GENERAL_STATUS.INACTIVE });

        await logAction(
            {
                action: 'INACTIVATE',
                affected_table: 'RESEARCH_GROUPS',
                module: 'RESEARCH_GROUPS',
                affected_record_id: id,
                level: 'INFO',
                description: 'Grupo de investigación desactivado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Grupo de investigación desactivado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ELIMINAR GRUPO DE INVESTIGACIÓN
researchGroupCtrl.deleteResearchGroup = async (req, res) => {
    try {
        const { id } = req.params;

        await researchGroupModels.findByIdAndDelete(id);

        await logAction(
            {
                action: 'DELETE',
                affected_table: 'RESEARCH_GROUPS',
                module: 'RESEARCH_GROUPS',
                affected_record_id: id,
                level: 'WARNING',
                description: 'Grupo de investigación eliminado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Grupo de investigación eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export { researchGroupCtrl };
