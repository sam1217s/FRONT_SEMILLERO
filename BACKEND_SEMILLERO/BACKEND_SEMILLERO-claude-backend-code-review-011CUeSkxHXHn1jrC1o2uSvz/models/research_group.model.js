import { Schema, model } from 'mongoose';
import { GENERAL_STATUS } from '../constants/status.constants.js';

const ResearchGroupSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre del grupo es obligatorio'],
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        trim: true,
        maxlength: 100
    },
    minciencias_registration: {
        type: String,
        trim: true,
        maxlength: 100
    },
    id_center: {
        type: Schema.Types.ObjectId,
        ref: 'TrainingCenter',
        required: [true, 'El centro de formación es obligatorio']
    },
    status: {
        type: Number,
        enum: [GENERAL_STATUS.ACTIVE, GENERAL_STATUS.INACTIVE],
        default: GENERAL_STATUS.ACTIVE
    }
}, {
    timestamps: true
});

// Índices optimizados
ResearchGroupSchema.index({ status: 1 });
ResearchGroupSchema.index({ id_center: 1, status: 1 });
ResearchGroupSchema.index({ category: 1 });
ResearchGroupSchema.index({ minciencias_registration: 1 });

export default model('ResearchGroup', ResearchGroupSchema);
