import trainingCenterModels from '../models/training_center.model.js';
import { formatName, formatAddress, formatCity, formatDepartment, buildTrainingCenterFilter } from '../helpers/training_center.helper.js';
import logAction from '../middlewares/log.middleware.js';
import { GENERAL_STATUS } from '../constants/status.constants.js';

const trainingCenterCtrl = {};

// LISTAR TODOS LOS CENTROS
trainingCenterCtrl.listTrainingCenters = async (req, res) => {
    try {
        const filter = buildTrainingCenterFilter(req.query);

        const centers = await trainingCenterModels.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ msg: centers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// OBTENER CENTRO POR ID
trainingCenterCtrl.getTrainingCenterById = async (req, res) => {
    try {
        const { id } = req.params;
        const center = await trainingCenterModels.findById(id);

        if (!center) {
            return res.status(404).json({ msg: 'Centro de formación no encontrado' });
        }

        res.status(200).json({ msg: center });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// CREAR CENTRO
trainingCenterCtrl.saveTrainingCenter = async (req, res) => {
    try {
        const { 
            name, 
            code, 
            address, 
            city, 
            department, 
            phone, 
            email, 
            website, 
            directors, 
            student_capacity, 
            description, 
            status 
        } = req.body;

        const center = new trainingCenterModels({
            name: formatName(name),
            code: code?.trim().toUpperCase(),
            address: formatAddress(address),
            city: formatCity(city),
            department: formatDepartment(department),
            phone: phone?.trim(),
            email: email?.trim().toLowerCase(),
            website: website?.trim(),
            directors: directors || [],
            student_capacity: parseInt(student_capacity) || 0,
            description: description?.trim(),
            status: status !== undefined ? Number(status) : GENERAL_STATUS.ACTIVE
        });

        await center.save();

        await logAction(
            {
                action: 'CREATE',
                affected_table: 'TRAINING_CENTERS',
                module: 'TRAINING_CENTERS',
                affected_record_id: center._id,
                new_data: center,
                level: 'INFO',
                description: 'Centro de formación creado'
            },
            req.headers['x-token'],
            req
        );

        res.status(201).json({ msg: 'Centro de formación creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ACTUALIZAR CENTRO
trainingCenterCtrl.updateTrainingCenter = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            name, 
            code, 
            address, 
            city, 
            department, 
            phone, 
            email, 
            website, 
            directors, 
            student_capacity, 
            description, 
            status 
        } = req.body;

        const previousData = await trainingCenterModels.findById(id).lean();

        const updateData = {
            name: formatName(name),
            code: code?.trim().toUpperCase(),
            address: formatAddress(address),
            city: formatCity(city),
            department: formatDepartment(department),
            phone: phone?.trim(),
            email: email?.trim().toLowerCase(),
            website: website?.trim(),
            directors: directors || [],
            student_capacity: parseInt(student_capacity) || 0,
            description: description?.trim(),
            status: status !== undefined ? Number(status) : GENERAL_STATUS.ACTIVE
        };

        await trainingCenterModels.findByIdAndUpdate(id, updateData);

        await logAction(
            {
                action: 'UPDATE',
                affected_table: 'TRAINING_CENTERS',
                module: 'TRAINING_CENTERS',
                affected_record_id: id,
                previous_data: previousData,
                new_data: updateData,
                level: 'INFO',
                description: 'Centro de formación actualizado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Centro de formación actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ACTIVAR CENTRO
trainingCenterCtrl.activeTrainingCenter = async (req, res) => {
    try {
        const { id } = req.params;

        await trainingCenterModels.findByIdAndUpdate(id, { status: GENERAL_STATUS.ACTIVE });

        await logAction(
            {
                action: 'ACTIVATE',
                affected_table: 'TRAINING_CENTERS',
                module: 'TRAINING_CENTERS',
                affected_record_id: id,
                level: 'INFO',
                description: 'Centro de formación activado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Centro de formación activado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// DESACTIVAR CENTRO
trainingCenterCtrl.inactiveTrainingCenter = async (req, res) => {
    try {
        const { id } = req.params;

        await trainingCenterModels.findByIdAndUpdate(id, { status: GENERAL_STATUS.INACTIVE });

        await logAction(
            {
                action: 'INACTIVATE',
                affected_table: 'TRAINING_CENTERS',
                module: 'TRAINING_CENTERS',
                affected_record_id: id,
                level: 'INFO',
                description: 'Centro de formación desactivado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Centro de formación desactivado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ELIMINAR CENTRO
trainingCenterCtrl.deleteTrainingCenter = async (req, res) => {
    try {
        const { id } = req.params;

        await trainingCenterModels.findByIdAndDelete(id);

        await logAction(
            {
                action: 'DELETE',
                affected_table: 'TRAINING_CENTERS',
                module: 'TRAINING_CENTERS',
                affected_record_id: id,
                level: 'WARNING',
                description: 'Centro de formación eliminado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Centro de formación eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export { trainingCenterCtrl };
