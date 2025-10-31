import { Schema, model } from 'mongoose';

const NotificationSchema = Schema({
    id_researcher: {
        type: Schema.Types.ObjectId,
        ref: 'Researcher',
        required: [true, 'El investigador es obligatorio']
    },
    id_activity: {
        type: Schema.Types.ObjectId,
        ref: 'Activity'
    },
    id_project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true,
        maxlength: 255
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    send_email: {
        type: Boolean,
        default: true
    },
    email_sent: {
        type: Boolean,
        default: false
    },
    send_date: {
        type: Date
    },
    read: {
        type: Boolean,
        default: false
    },
    read_date: {
        type: Date
    }
}, {
    timestamps: true
});

// Índices para mejorar rendimiento de consultas
NotificationSchema.index({ id_researcher: 1 }); // Consultas por investigador
NotificationSchema.index({ read: 1 }); // Filtrar por leídas/no leídas
NotificationSchema.index({ id_researcher: 1, read: 1 }); // Consultas combinadas
NotificationSchema.index({ id_activity: 1 }); // Consultas por actividad
NotificationSchema.index({ id_project: 1 }); // Consultas por proyecto
NotificationSchema.index({ priority: 1 }); // Filtrar por prioridad
NotificationSchema.index({ createdAt: -1 }); // Ordenar por fecha de creación

export default model('Notification', NotificationSchema);
