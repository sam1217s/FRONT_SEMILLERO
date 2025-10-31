import projectModels from '../models/project.model.js';
import { prepareUpdateData, buildProjectFilter } from '../helpers/project.helper.js';
import { buildPagination, formatPaginatedResponse } from '../helpers/common.helper.js';
import logAction from '../middlewares/log.middleware.js';

const projectCtrl = {};

// LISTAR TODOS LOS PROYECTOS
projectCtrl.listProjects = async (req, res) => {
    try {
        const filter = buildProjectFilter(req.query);
        const { skip, limit, page } = buildPagination(req.query.page, req.query.limit);

        // Consulta optimizada con paginación
        const [projects, total] = await Promise.all([
            projectModels
                .find(filter)
                .populate('id_seedbed', 'name')
                .populate('id_group', 'name category')
                .populate('id_leader', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            projectModels.countDocuments(filter)
        ]);

        const response = formatPaginatedResponse(projects, total, page, limit);
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// OBTENER PROYECTO POR ID
projectCtrl.getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await projectModels
            .findById(id)
            .populate('id_seedbed', 'name')
            .populate('id_group', 'name category')
            .populate('id_leader', 'name email');

        if (!project) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        res.status(200).json({ msg: project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// CREAR PROYECTO
projectCtrl.saveProject = async (req, res) => {
    try {
        const {
            code,
            project_name,
            description,
            objectives,
            id_seedbed,
            id_group,
            id_leader,
            start_date,
            end_date,
            validity,
            budget,
            observations
        } = req.body;

        const project = new projectModels({
            code,
            project_name,
            description,
            objectives,
            id_seedbed,
            id_group,
            id_leader,
            start_date,
            end_date,
            validity,
            budget: budget || 0,
            observations
        });

        await project.save();

        await logAction(
            {
                action: 'CREATE',
                affected_table: 'PROJECTS',
                module: 'PROJECTS',
                affected_record_id: project._id,
                new_data: project,
                level: 'INFO',
                description: 'Proyecto creado'
            },
            req.headers['x-token'],
            req
        );

        res.status(201).json({ msg: 'Proyecto creado correctamente' });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({
                msg: 'El código del proyecto ya existe'
            });
        }
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ACTUALIZAR PROYECTO
projectCtrl.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            code,
            project_name,
            description,
            objectives,
            start_date,
            end_date,
            validity,
            budget,
            observations
        } = req.body;

        const previousData = await projectModels.findById(id).lean();

        const updateData = {
            code: code || undefined,
            project_name: project_name || undefined,
            description: description || undefined,
            objectives: objectives || undefined,
            start_date: start_date || undefined,
            end_date: end_date || undefined,
            validity: validity ? Number(validity) : undefined,
            budget: budget ? Number(budget) : undefined,
            observations: observations || undefined
        };

        const cleanedUpdateData = prepareUpdateData(updateData);

        await projectModels.findByIdAndUpdate(id, cleanedUpdateData);

        await logAction(
            {
                action: 'UPDATE',
                affected_table: 'PROJECTS',
                module: 'PROJECTS',
                affected_record_id: id,
                previous_data: previousData,
                new_data: cleanedUpdateData,
                level: 'INFO',
                description: 'Proyecto actualizado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Proyecto actualizado correctamente' });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({
                msg: 'El código del proyecto ya existe'
            });
        }
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ELIMINAR PROYECTO
projectCtrl.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        await projectModels.findByIdAndDelete(id);

        await logAction(
            {
                action: 'DELETE',
                affected_table: 'PROJECTS',
                module: 'PROJECTS',
                affected_record_id: id,
                level: 'WARNING',
                description: 'Proyecto eliminado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Proyecto eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export { projectCtrl };
