import { Schema, model } from 'mongoose';

const ResearcherRoleSchema = Schema({
    id_researcher: {
        type: Schema.Types.ObjectId,
        ref: 'Researcher',
        required: [true, 'El investigador es obligatorio']
    },
    role: {
        type: String,
        required: [true, 'El rol es obligatorio'],
        trim: true,
        maxlength: 45
    },
    start_date: {
        type: Date,
        required: [true, 'La fecha de inicio es obligatoria']
    },
    end_date: {
        type: Date
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Índices
ResearcherRoleSchema.index({ id_researcher: 1, role: 1, start_date: 1 }, { unique: true });

export default model('ResearcherRole', ResearcherRoleSchema);
