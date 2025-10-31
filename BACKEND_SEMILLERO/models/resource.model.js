import { Schema, model } from 'mongoose';
// Ver constants/status.constants.js para referencia completa de estados

const ResourceSchema = Schema({
    id_activity: {
        type: Schema.Types.ObjectId,
        ref: 'Activity',
        required: [true, 'La actividad es obligatoria']
    },
    type: {
        type: String,
        required: [true, 'El tipo de recurso es obligatorio'],
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, 'La cantidad es obligatoria'],
        default: 1,
        min: 0
    },
    unit_of_measure: {
        type: String,
        trim: true,
        maxlength: 50
    },
    unit_cost: {
        type: Number,
        default: 0.00,
        min: 0
    },
    total_cost: {
        type: Number,
        default: 0.00,
        min: 0
    },
    resource_status: {
        type: Number,
        enum: [0, 1, 2, 3, 7], // 0: Disponible, 1: Inactivo, 2: Asignado, 3: En uso, 7: Agotado
        default: 0 // Disponible
    },
    supplier: {
        type: String,
        trim: true,
        maxlength: 200
    },
    acquisition_date: {
        type: Date
    },
    observations: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Índices optimizados
ResourceSchema.index({ resource_status: 1 });
ResourceSchema.index({ id_activity: 1, resource_status: 1 });
ResourceSchema.index({ type: 1 });
ResourceSchema.index({ acquisition_date: 1 });

export default model('Resource', ResourceSchema);
