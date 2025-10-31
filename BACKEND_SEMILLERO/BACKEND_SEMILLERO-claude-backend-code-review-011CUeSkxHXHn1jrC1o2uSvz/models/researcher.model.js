import { Schema, model } from 'mongoose';

const RoleSchema = new Schema({
  role: {
    type: String,
    enum: ['SUPER', 'ADMIN', 'LIDER', 'INVESTIGADOR'],
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date
  },
  active: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const ResearcherSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: 100
  },
  document_type: {
    type: String,
    required: [true, 'El tipo de documento es obligatorio'],
    enum: ['CC', 'TI', 'CE', 'PP']
  },
  document_number: {
    type: String,
    required: [true, 'El número de documento es obligatorio'],
    unique: true,
    trim: true,
    maxlength: 20
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 100
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    select: false // No exponer nunca salvo que se solicite
  },
  academic_formation: {
    type: String,
    trim: true,
    maxlength: 200
  },
  knowledge_area: {
    type: String,
    trim: true,
    maxlength: 150
  },
  contract_number: {
    type: String,
    trim: true,
    maxlength: 50
  },
  contract_type: {
    type: String,
    enum: ['planta', 'contrato'],
    default: 'contrato'
  },
  contract_start_date: {
    type: Date
  },
  contract_end_date: {
    type: Date
  },
  status: {
    type: Number,
    enum: [0, 1], // 0: Activo, 1: Inactivo
    default: 0
  },
  entry_date: {
    type: Date,
    required: [true, 'La fecha de ingreso es obligatoria']
  },

  // 🔹 Centro de formación (requerido para ADMIN, LIDER, INVESTIGADOR)
  id_training_center: {
    type: Schema.Types.ObjectId,
    ref: 'TrainingCenter'
  },

  // 🔹 Rol actual activo
  role: {
    type: String,
    enum: ['SUPER', 'ADMIN', 'LIDER', 'INVESTIGADOR'],
    required: true
  },

  // 🔹 Historial de roles (array)
  roles: {
    type: [RoleSchema],
    default: []
  }

}, {
  timestamps: true
});

// Índices para mejorar búsquedas
ResearcherSchema.index({ status: 1 });
ResearcherSchema.index({ contract_type: 1 });
ResearcherSchema.index({ contract_number: 1 });
ResearcherSchema.index({ id_training_center: 1 }); // Índice para filtrar por centro

export default model('Researcher', ResearcherSchema);
