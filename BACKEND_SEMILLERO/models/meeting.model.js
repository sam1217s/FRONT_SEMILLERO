import { Schema, model } from 'mongoose';
// Ver constants/status.constants.js para referencia completa de estados

const MeetingSchema = Schema({
    id_project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    id_seedbed: {
        type: Schema.Types.ObjectId,
        ref: 'Seedbed'
    },
    title: {
        type: String,
        required: [true, 'El título de la reunión es obligatorio'],
        trim: true,
        maxlength: 300
    },
    description: {
        type: String,
        trim: true
    },
    meeting_date: {
        type: Date,
        required: [true, 'La fecha de la reunión es obligatoria']
    },
    duration_minutes: {
        type: Number,
        default: 60,
        min: 0
    },
    location: {
        type: String,
        trim: true,
        maxlength: 200
    },
    modality: {
        type: String,
        enum: ['in_person', 'virtual', 'hybrid'],
        default: 'in_person'
    },
    meeting_url: {
        type: String,
        trim: true,
        maxlength: 500
    },
    minutes: {
        type: String,
        trim: true
    },
    status: {
        type: Number,
        enum: [2, 3, 4, 5], // 2: Programada, 3: En curso, 4: Completada, 5: Cancelada
        default: 2 // Programada
    }
}, {
    timestamps: true
});

// Índices optimizados
MeetingSchema.index({ status: 1 });
MeetingSchema.index({ id_project: 1, status: 1 });
MeetingSchema.index({ id_seedbed: 1 });
MeetingSchema.index({ meeting_date: 1 });

export default model('Meeting', MeetingSchema);
