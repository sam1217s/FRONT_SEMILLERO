import meetingModels from '../models/meeting.model.js';
import { prepareUpdateData, buildMeetingFilter } from '../helpers/meeting.helper.js';
import logAction from '../middlewares/log.middleware.js';

const meetingCtrl = {};

// LISTAR TODAS LAS REUNIONES
meetingCtrl.listMeetings = async (req, res) => {
    try {
        const filter = buildMeetingFilter(req.query);

        const meetings = await meetingModels
            .find(filter)
            .populate('id_project', 'project_name code')
            .populate('id_seedbed', 'name')
            .sort({ meeting_date: -1 });

        res.status(200).json({ msg: meetings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// OBTENER REUNIÓN POR ID
meetingCtrl.getMeetingById = async (req, res) => {
    try {
        const { id } = req.params;
        const meeting = await meetingModels
            .findById(id)
            .populate('id_project', 'project_name code')
            .populate('id_seedbed', 'name');

        if (!meeting) {
            return res.status(404).json({ msg: 'Reunión no encontrada' });
        }

        res.status(200).json({ msg: meeting });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// CREAR REUNIÓN
meetingCtrl.saveMeeting = async (req, res) => {
    try {
        const {
            id_project,
            id_seedbed,
            title,
            description,
            meeting_date,
            duration_minutes,
            location,
            modality,
            meeting_url,
            minutes
        } = req.body;

        const meeting = new meetingModels({
            id_project,
            id_seedbed,
            title,
            description,
            meeting_date,
            duration_minutes: duration_minutes || 60,
            location,
            modality: modality || 'in_person',
            meeting_url,
            minutes
        });

        await meeting.save();

        await logAction(
            {
                action: 'CREATE',
                affected_table: 'MEETINGS',
                module: 'MEETINGS',
                affected_record_id: meeting._id,
                new_data: meeting,
                level: 'INFO',
                description: 'Reunión creada'
            },
            req.headers['x-token'],
            req
        );

        res.status(201).json({ msg: 'Reunión creada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ACTUALIZAR REUNIÓN
meetingCtrl.updateMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            meeting_date,
            duration_minutes,
            location,
            modality,
            meeting_url,
            minutes,
            status
        } = req.body;

        const previousData = await meetingModels.findById(id).lean();

        const updateData = {
            title: title || undefined,
            description: description || undefined,
            meeting_date: meeting_date || undefined,
            duration_minutes: duration_minutes ? Number(duration_minutes) : undefined,
            location: location || undefined,
            modality: modality || undefined,
            meeting_url: meeting_url || undefined,
            minutes: minutes || undefined,
            status: status || undefined
        };

        const cleanedUpdateData = prepareUpdateData(updateData);

        await meetingModels.findByIdAndUpdate(id, cleanedUpdateData);

        await logAction(
            {
                action: 'UPDATE',
                affected_table: 'MEETINGS',
                module: 'MEETINGS',
                affected_record_id: id,
                previous_data: previousData,
                new_data: cleanedUpdateData,
                level: 'INFO',
                description: 'Reunión actualizada'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Reunión actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ELIMINAR REUNIÓN
meetingCtrl.deleteMeeting = async (req, res) => {
    try {
        const { id } = req.params;

        await meetingModels.findByIdAndDelete(id);

        await logAction(
            {
                action: 'DELETE',
                affected_table: 'MEETINGS',
                module: 'MEETINGS',
                affected_record_id: id,
                level: 'WARNING',
                description: 'Reunión eliminada'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Reunión eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export { meetingCtrl };
