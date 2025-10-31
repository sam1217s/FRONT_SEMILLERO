import { Schema, model } from 'mongoose';

const CertificationSchema = Schema({
    id_researcher: {
        type: Schema.Types.ObjectId,
        ref: 'Researcher',
        required: [true, 'El investigador es obligatorio']
    },
    id_project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'El proyecto es obligatorio']
    },
    certificate_description: {
        type: String,
        required: [true, 'La descripción del certificado es obligatoria'],
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
    validity: {
        type: String,
        trim: true,
        maxlength: 100
    },
    contract_number: {
        type: String,
        trim: true,
        maxlength: 50
    },
    contract_type: {
        type: String,
        enum: ['contractor', 'staff']
    },
    participation_type: {
        type: String,
        trim: true,
        maxlength: 100
    },
    generated_by: {
        type: Schema.Types.ObjectId,
        ref: 'Researcher'
    }
}, {
    timestamps: true
});

// Índices para mejorar rendimiento de consultas
CertificationSchema.index({ id_researcher: 1 }); // Consultas por investigador
CertificationSchema.index({ id_project: 1 }); // Consultas por proyecto
CertificationSchema.index({ id_researcher: 1, id_project: 1 }); // Consultas combinadas
CertificationSchema.index({ start_date: 1, end_date: 1 }); // Filtrar por rango de fechas
CertificationSchema.index({ generated_by: 1 }); // Consultas por generador

export default model('Certification', CertificationSchema);
