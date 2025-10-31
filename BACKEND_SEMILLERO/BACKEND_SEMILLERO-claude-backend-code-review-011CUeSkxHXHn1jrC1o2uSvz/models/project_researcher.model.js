import { Schema, model } from 'mongoose';
import { PROJECT_RESEARCHER_STATUS } from '../constants/status.constants.js';

const ProjectResearcherSchema = Schema({
    id_project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'El proyecto es obligatorio']
    },
    id_researcher: {
        type: Schema.Types.ObjectId,
        ref: 'Researcher',
        required: [true, 'El investigador es obligatorio']
    },
    project_role: {
        type: String,
        enum: ['Leader', 'Collaborator'],
        default: 'Collaborator'
    },
    incorporation_date: {
        type: Date,
        required: [true, 'La fecha de incorporación es obligatoria']
    },
    withdrawal_date: {
        type: Date
    },
    status: {
        type: Number,
        enum: [
            PROJECT_RESEARCHER_STATUS.ACTIVE,
            PROJECT_RESEARCHER_STATUS.INACTIVE,
            PROJECT_RESEARCHER_STATUS.WITHDRAWN
        ],
        default: PROJECT_RESEARCHER_STATUS.ACTIVE
    },
    contributions: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Índice compuesto único para evitar duplicados
ProjectResearcherSchema.index({ id_project: 1, id_researcher: 1 }, { unique: true });
// Índices optimizados adicionales
ProjectResearcherSchema.index({ status: 1 });
ProjectResearcherSchema.index({ id_researcher: 1, status: 1 });

export default model('ProjectResearcher', ProjectResearcherSchema);
