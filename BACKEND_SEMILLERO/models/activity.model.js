import { Schema, model } from 'mongoose';
// Ver constants/status.constants.js para referencia completa de estados

const ActivitySchema = Schema({
    id_project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'El proyecto es obligatorio']
    },
    name: {
        type: String,
        required: [true, 'El nombre de la actividad es obligatorio'],
        trim: true,
        maxlength: 300
    },
    description: {
        type: String,
        trim: true
    },
    start_date: {
        type: Date,
        required: [true, 'La fecha de inicio es obligatoria']
    },
    end_date: {
        type: Date,
        required: [true, 'La fecha de fin es obligatoria']
    },
    responsible_researcher: {
        type: Schema.Types.ObjectId,
        ref: 'Researcher',
        required: [true, 'El investigador responsable es obligatorio']
    },
    status: {
        type: Number,
        enum: [2, 3, 4, 5, 6], // 2: Pendiente, 3: En proceso, 4: Completada, 5: Cancelada, 6: Retrasada
        default: 2 // Pendiente
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    observations: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Índices optimizados
ActivitySchema.index({ status: 1 });
ActivitySchema.index({ id_project: 1, status: 1 });
ActivitySchema.index({ responsible_researcher: 1 });
ActivitySchema.index({ start_date: 1, end_date: 1 });
ActivitySchema.index({ priority: 1 });

export default model('Activity', ActivitySchema);
