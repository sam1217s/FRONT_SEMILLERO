import notificationModels from '../models/notification.model.js';
import { prepareUpdateData, buildNotificationFilter } from '../helpers/notification.helper.js';
import logAction from '../middlewares/log.middleware.js';

const notificationCtrl = {};

// LISTAR TODAS LAS NOTIFICACIONES
notificationCtrl.listNotifications = async (req, res) => {
    try {
        const filter = buildNotificationFilter(req.query);

        const notifications = await notificationModels
            .find(filter)
            .populate('id_researcher', 'name email')
            .populate('id_activity', 'name')
            .populate('id_project', 'project_name code')
            .sort({ createdAt: -1 });

        res.status(200).json({ msg: notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// OBTENER NOTIFICACIÓN POR ID
notificationCtrl.getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await notificationModels
            .findById(id)
            .populate('id_researcher', 'name email')
            .populate('id_activity', 'name')
            .populate('id_project', 'project_name code');

        if (!notification) {
            return res.status(404).json({ msg: 'Notificación no encontrada' });
        }

        res.status(200).json({ msg: notification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// CREAR NOTIFICACIÓN
notificationCtrl.saveNotification = async (req, res) => {
    try {
        const {
            id_researcher,
            id_activity,
            id_project,
            title,
            description,
            priority,
            send_email
        } = req.body;

        const notification = new notificationModels({
            id_researcher,
            id_activity,
            id_project,
            title,
            description,
            priority: priority || 'medium',
            send_email: send_email !== undefined ? send_email : true
        });

        await notification.save();

        await logAction(
            {
                action: 'CREATE',
                affected_table: 'NOTIFICATIONS',
                module: 'NOTIFICATIONS',
                affected_record_id: notification._id,
                new_data: notification,
                level: 'INFO',
                description: 'Notificación creada'
            },
            req.headers['x-token'],
            req
        );

        res.status(201).json({ msg: 'Notificación creada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// MARCAR NOTIFICACIÓN COMO LEÍDA
notificationCtrl.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        await notificationModels.findByIdAndUpdate(id, {
            read: true,
            read_date: new Date()
        });

        await logAction(
            {
                action: 'MARK_READ',
                affected_table: 'NOTIFICATIONS',
                module: 'NOTIFICATIONS',
                affected_record_id: id,
                level: 'INFO',
                description: 'Notificación marcada como leída'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Notificación marcada como leída' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ACTUALIZAR NOTIFICACIÓN
notificationCtrl.updateNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            priority,
            send_email
        } = req.body;

        const previousData = await notificationModels.findById(id).lean();

        const updateData = {
            title: title || undefined,
            description: description || undefined,
            priority: priority || undefined,
            send_email: send_email !== undefined ? send_email : undefined
        };

        const cleanedUpdateData = prepareUpdateData(updateData);

        await notificationModels.findByIdAndUpdate(id, cleanedUpdateData);

        await logAction(
            {
                action: 'UPDATE',
                affected_table: 'NOTIFICATIONS',
                module: 'NOTIFICATIONS',
                affected_record_id: id,
                previous_data: previousData,
                new_data: cleanedUpdateData,
                level: 'INFO',
                description: 'Notificación actualizada'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Notificación actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ELIMINAR NOTIFICACIÓN
notificationCtrl.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        await notificationModels.findByIdAndDelete(id);

        await logAction(
            {
                action: 'DELETE',
                affected_table: 'NOTIFICATIONS',
                module: 'NOTIFICATIONS',
                affected_record_id: id,
                level: 'WARNING',
                description: 'Notificación eliminada'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Notificación eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export { notificationCtrl };
