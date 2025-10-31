import { Schema, model } from 'mongoose';
// Ver constants/status.constants.js para referencia completa de estados

const ProductSchema = Schema({
    id_project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'El proyecto es obligatorio']
    },
    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true,
        maxlength: 300
    },
    type: {
        type: String,
        required: [true, 'El tipo de producto es obligatorio'],
        enum: ['article', 'book', 'book_chapter', 'presentation', 'poster', 'software', 'patent', 'prototype', 'technical_report', 'other']
    },
    description: {
        type: String,
        trim: true
    },
    actual_delivery_date: {
        type: Date
    },
    status: {
        type: Number,
        enum: [2, 3, 4, 8, 9, 10], // 2: Planificado, 3: En desarrollo, 4: Entregado, 8: En revisión, 9: Publicado, 10: Rechazado
        default: 2 // Planificado
    },
    repository_url: {
        type: String,
        trim: true,
        maxlength: 500
    },
    authors: {
        type: String,
        trim: true
    },
    attached_file: {
        type: String,
        trim: true,
        maxlength: 500
    }
}, {
    timestamps: true
});

// Índices optimizados
ProductSchema.index({ status: 1 });
ProductSchema.index({ id_project: 1, status: 1 });
ProductSchema.index({ type: 1 });

export default model('Product', ProductSchema);
