import { Schema, model } from 'mongoose';
import { GENERAL_STATUS } from '../constants/status.constants.js';

const SeedbedSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre del semillero es obligatorio'],
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        trim: true
    },
    research_lines: {
        type: String,
        trim: true
    },
    thematic_areas: {
        type: String,
        trim: true,
        maxlength: 100
    },
    technology_network: {
        type: String,
        trim: true,
        maxlength: 100
    },
    id_group: {
        type: Schema.Types.ObjectId,
        ref: 'ResearchGroup',
        required: [true, 'El grupo de investigación es obligatorio']
    },
    id_leader: {
        type: Schema.Types.ObjectId,
        ref: 'Researcher',
        required: [true, 'El líder del semillero es obligatorio']
    },
    logo: {
        type: String,
        trim: true,
        maxlength: 300
    },
    status: {
        type: Number,
        enum: [GENERAL_STATUS.ACTIVE, GENERAL_STATUS.INACTIVE],
        default: GENERAL_STATUS.ACTIVE
    },
    seedbed_creation_date: {
        type: Date
    }
}, {
    timestamps: true
});

// Índices optimizados
SeedbedSchema.index({ status: 1 });
SeedbedSchema.index({ id_group: 1, status: 1 });
SeedbedSchema.index({ id_leader: 1 });
SeedbedSchema.index({ thematic_areas: 1 });

export default model('Seedbed', SeedbedSchema);
