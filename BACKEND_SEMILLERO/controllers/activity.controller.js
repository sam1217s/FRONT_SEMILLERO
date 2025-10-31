import activityModels from '../models/activity.model.js';


const activityCtrl = {};

// LISTAR TODAS LAS ACTIVIDADES
activityCtrl.listActivities = async (req, res) => {
    try {
        const { name, id_project, responsible_researcher, status, priority } = req.query;
        let filter = {};

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        if (id_project) {
            filter.id_project = id_project;
        }
        if (responsible_researcher) {
            filter.responsible_researcher = responsible_researcher;
        }
        if (status) {
            filter.status = status;
        }
        if (priority) {
            filter.priority = priority;
        }

        const activities = await activityModels
            .find(filter)
            .populate('id_project', 'project_name code')
            .populate('responsible_researcher', 'name email contract_type contract_end_date')
            .sort({ createdAt: -1 });

        res.status(200).json({ msg: activities });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// OBTENER ACTIVIDAD POR ID
activityCtrl.getActivityById = async (req, res) => {
    try {
        const { id } = req.params;
        const activity = await activityModels
            .findById(id)
            .populate('id_project', 'project_name code')
            .populate('responsible_researcher', 'name email contract_type contract_end_date');
        if (!activity) {
            return res.status(404).json({ msg: 'Actividad no encontrada' });
        }
        res.status(200).json({ msg: activity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// CREAR ACTIVIDAD
activityCtrl.saveActivity = async (req, res) => {
    try {
        const {
            id_project,
            name,
            description,
            start_date,
            end_date,
            responsible_researcher,
            status,
            priority,
            observations
        } = req.body;

        const activity = new activityModels({
            id_project,
            name,
            description,
            start_date,
            end_date,
            responsible_researcher,
            status: status || 'pending',
            priority: priority || 'medium',
            observations
        });

        await activity.save();
        res.status(201).json({ msg: 'Actividad creada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ACTUALIZAR ACTIVIDAD
activityCtrl.updateActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            id_project,
            name,
            description,
            start_date,
            end_date,
            responsible_researcher,
            status,
            priority,
            observations
        } = req.body;

        const updateActivityById = await activityModels.findByIdAndUpdate({
            _id: id
        }, {
            id_project,
            name,
            description,
            start_date,
            end_date,
            responsible_researcher,
            status,
            priority,
            observations
        }, { new: true });

        res.status(200).json({ msg: 'Actividad actualizada correctamente', updateActivityById });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ELIMINAR ACTIVIDAD
activityCtrl.deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;
        await activityModels.findByIdAndDelete({ _id: id });
        res.status(200).json({ msg: 'Actividad eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export { activityCtrl };
