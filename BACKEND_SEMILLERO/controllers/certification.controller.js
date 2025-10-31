import certificationModels from '../models/certification.model.js';
import { prepareUpdateData, buildCertificationFilter } from '../helpers/certification.helper.js';
import logAction from '../middlewares/log.middleware.js';

const certificationCtrl = {};

// LISTAR TODAS LAS CERTIFICACIONES
certificationCtrl.listCertifications = async (req, res) => {
    try {
        const filter = buildCertificationFilter(req.query);

        const certifications = await certificationModels
            .find(filter)
            .populate('id_researcher', 'name email document_number')
            .populate('id_project', 'project_name code')
            .populate('generated_by', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ msg: certifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// OBTENER CERTIFICACIÓN POR ID
certificationCtrl.getCertificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const certification = await certificationModels
            .findById(id)
            .populate('id_researcher', 'name email document_number')
            .populate('id_project', 'project_name code')
            .populate('generated_by', 'name email');

        if (!certification) {
            return res.status(404).json({ msg: 'Certificación no encontrada' });
        }

        res.status(200).json({ msg: certification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// CREAR CERTIFICACIÓN
certificationCtrl.saveCertification = async (req, res) => {
    try {
        const {
            id_researcher,
            id_project,
            certificate_description,
            start_date,
            end_date,
            validity,
            contract_number,
            contract_type,
            participation_type,
            generated_by
        } = req.body;

        const certification = new certificationModels({
            id_researcher,
            id_project,
            certificate_description,
            start_date,
            end_date,
            validity,
            contract_number,
            contract_type,
            participation_type,
            generated_by
        });

        await certification.save();

        await logAction(
            {
                action: 'CREATE',
                affected_table: 'CERTIFICATIONS',
                module: 'CERTIFICATIONS',
                affected_record_id: certification._id,
                new_data: certification,
                level: 'INFO',
                description: 'Certificación creada'
            },
            req.headers['x-token'],
            req
        );

        res.status(201).json({ msg: 'Certificación creada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ACTUALIZAR CERTIFICACIÓN
certificationCtrl.updateCertification = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            certificate_description,
            start_date,
            end_date,
            validity,
            contract_number,
            contract_type,
            participation_type
        } = req.body;

        const previousData = await certificationModels.findById(id).lean();

        const updateData = {
            certificate_description: certificate_description || undefined,
            start_date: start_date || undefined,
            end_date: end_date || undefined,
            validity: validity || undefined,
            contract_number: contract_number || undefined,
            contract_type: contract_type || undefined,
            participation_type: participation_type || undefined
        };

        const cleanedUpdateData = prepareUpdateData(updateData);

        await certificationModels.findByIdAndUpdate(id, cleanedUpdateData);

        await logAction(
            {
                action: 'UPDATE',
                affected_table: 'CERTIFICATIONS',
                module: 'CERTIFICATIONS',
                affected_record_id: id,
                previous_data: previousData,
                new_data: cleanedUpdateData,
                level: 'INFO',
                description: 'Certificación actualizada'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Certificación actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ELIMINAR CERTIFICACIÓN
certificationCtrl.deleteCertification = async (req, res) => {
    try {
        const { id } = req.params;

        await certificationModels.findByIdAndDelete(id);

        await logAction(
            {
                action: 'DELETE',
                affected_table: 'CERTIFICATIONS',
                module: 'CERTIFICATIONS',
                affected_record_id: id,
                level: 'WARNING',
                description: 'Certificación eliminada'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Certificación eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export { certificationCtrl };
