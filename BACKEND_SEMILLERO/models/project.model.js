import { Schema, model } from 'mongoose';
// Ver constants/status.constants.js para referencia completa de estados

const ProjectSchema = Schema({
    code: {
        type: String,
        required: [true, 'El código del proyecto es obligatorio'],
        unique: true,
        trim: true,
        maxlength: 50
    },
    project_name: {
        type: String,
        required: [true, 'El nombre del proyecto es obligatorio'],
        trim: true,
        maxlength: 300
    },
    description: {
        type: String,
        trim: true
    },
    objectives: {
        type: String,
        trim: true
    },
    id_seedbed: {
        type: Schema.Types.ObjectId,
        ref: 'Seedbed',
        required: [true, 'El semillero es obligatorio']
    },
    id_group: {
        type: Schema.Types.ObjectId,
        ref: 'ResearchGroup',
        required: [true, 'El grupo de investigación es obligatorio']
    },
    id_leader: {
        type: Schema.Types.ObjectId,
        ref: 'Researcher',
        required: [true, 'El líder del proyecto es obligatorio']
    },
    start_date: {
        type: Date,
        required: [true, 'La fecha de inicio es obligatoria']
    },
    end_date: {
        type: Date,
        required: [true, 'La fecha de fin es obligatoria']
    },
    validity: {
        type: Number,
        required: [true, 'El año de vigencia es obligatorio']
    },
    budget: {
        type: Number,
        default: 0.00,
        min: 0
    },
    observations: {
        type: String,
        trim: true
    },
    status: {
        type: Number,
        // 0: Activo, 1: Inactivo, 2: Pendiente, 3: En progreso, 4: Completado
        // 5: Cancelado, 6: Suspendido, 7: Archivado, 8: En revisión, 9: Aprobado, 10: Rechazado
        enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        default: 2 // Pendiente
    }
}, {
    timestamps: true
});

// Índices optimizados
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ id_seedbed: 1, status: 1 });
ProjectSchema.index({ id_group: 1 });
ProjectSchema.index({ id_leader: 1 });
ProjectSchema.index({ start_date: 1, end_date: 1 });
// Note: code index is automatically created by 'unique: true' in schema definition

export default model('Project', ProjectSchema);
