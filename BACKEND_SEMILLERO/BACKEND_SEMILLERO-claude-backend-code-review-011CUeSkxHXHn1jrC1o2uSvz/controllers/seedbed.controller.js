import seedbedModels from '../models/seedbed.model.js';
import { prepareUpdateData, buildSeedbedFilter } from '../helpers/seedbed.helper.js';
import logAction from '../middlewares/log.middleware.js';
import { GENERAL_STATUS } from '../constants/status.constants.js';

const seedbedCtrl = {};

// LISTAR TODOS LOS SEMILLEROS
seedbedCtrl.listSeedbeds = async (req, res) => {
    try {
        const filter = buildSeedbedFilter(req.query);

        const seedbeds = await seedbedModels
            .find(filter)
            .populate('id_group', 'name category')
            .populate('id_leader', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ msg: seedbeds });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// OBTENER SEMILLERO POR ID
seedbedCtrl.getSeedbedById = async (req, res) => {
    try {
        const { id } = req.params;
        const seedbed = await seedbedModels
            .findById(id)
            .populate('id_group', 'name category')
            .populate('id_leader', 'name email');

        if (!seedbed) {
            return res.status(404).json({ msg: 'Semillero no encontrado' });
        }

        res.status(200).json({ msg: seedbed });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// CREAR SEMILLERO
seedbedCtrl.saveSeedbed = async (req, res) => {
    try {
        const {
            name,
            description,
            research_lines,
            thematic_areas,
            technology_network,
            id_group,
            id_leader,
            logo,
            seedbed_creation_date
        } = req.body;

        const seedbed = new seedbedModels({
            name,
            description,
            research_lines,
            thematic_areas,
            technology_network,
            id_group,
            id_leader,
            logo,
            seedbed_creation_date
        });

        await seedbed.save();

        await logAction(
            {
                action: 'CREATE',
                affected_table: 'SEEDBEDS',
                module: 'SEEDBEDS',
                affected_record_id: seedbed._id,
                new_data: seedbed,
                level: 'INFO',
                description: 'Semillero creado'
            },
            req.headers['x-token'],
            req
        );

        res.status(201).json({ msg: 'Semillero creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ACTUALIZAR SEMILLERO
seedbedCtrl.updateSeedbed = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            research_lines,
            thematic_areas,
            technology_network,
            id_group,      
            id_leader,     
            logo,
            seedbed_creation_date
        } = req.body;

        const previousData = await seedbedModels.findById(id).lean();

        const updateData = {
            name: name || undefined,
            description: description || undefined,
            research_lines: research_lines || undefined,
            thematic_areas: thematic_areas || undefined,
            technology_network: technology_network || undefined,
            id_group: id_group || undefined,      // AGREGADO
            id_leader: id_leader || undefined,    // AGREGADO
            logo: logo || undefined,
            seedbed_creation_date: seedbed_creation_date || undefined
        };

        const cleanedUpdateData = prepareUpdateData(updateData);

        await seedbedModels.findByIdAndUpdate(id, cleanedUpdateData);

        await logAction(
            {
                action: 'UPDATE',
                affected_table: 'SEEDBEDS',
                module: 'SEEDBEDS',
                affected_record_id: id,
                previous_data: previousData,
                new_data: cleanedUpdateData,
                level: 'INFO',
                description: 'Semillero actualizado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Semillero actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ACTIVAR SEMILLERO
seedbedCtrl.activeSeedbed = async (req, res) => {
    try {
        const { id } = req.params;

        await seedbedModels.findByIdAndUpdate(id, { status: GENERAL_STATUS.ACTIVE });

        await logAction(
            {
                action: 'ACTIVATE',
                affected_table: 'SEEDBEDS',
                module: 'SEEDBEDS',
                affected_record_id: id,
                level: 'INFO',
                description: 'Semillero activado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Semillero activado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// DESACTIVAR SEMILLERO
seedbedCtrl.inactiveSeedbed = async (req, res) => {
    try {
        const { id } = req.params;

        await seedbedModels.findByIdAndUpdate(id, { status: GENERAL_STATUS.INACTIVE });

        await logAction(
            {
                action: 'INACTIVATE',
                affected_table: 'SEEDBEDS',
                module: 'SEEDBEDS',
                affected_record_id: id,
                level: 'INFO',
                description: 'Semillero desactivado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Semillero desactivado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ELIMINAR SEMILLERO
seedbedCtrl.deleteSeedbed = async (req, res) => {
    try {
        const { id } = req.params;

        await seedbedModels.findByIdAndDelete(id);

        await logAction(
            {
                action: 'DELETE',
                affected_table: 'SEEDBEDS',
                module: 'SEEDBEDS',
                affected_record_id: id,
                level: 'WARNING',
                description: 'Semillero eliminado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Semillero eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export { seedbedCtrl };
