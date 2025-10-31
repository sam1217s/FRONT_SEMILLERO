import { Schema, model } from 'mongoose';
// Ver constants/status.constants.js para referencia completa de estados

const TrainingCenterSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre del centro es obligatorio'],
        trim: true,
        maxlength: 200
    },
    code: {
        type: String,
        required: [true, 'El código del centro es obligatorio'],
        unique: true,
        trim: true,
        maxlength: 50
    },
    address: {
        type: String,
        trim: true,
        maxlength: 300
    },
    city: {
        type: String,
        trim: true,
        maxlength: 100
    },
    department: {
        type: String,
        trim: true,
        maxlength: 100
    },
    phone: {
        type: String,
        trim: true,
        maxlength: 20
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 100
    },
    website: {
        type: String,
        trim: true,
        maxlength: 200
    },
    directors: [{
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        position: {
            type: String,
            required: true,
            enum: ['Director', 'Subdirector'],
            default: 'Director'
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            maxlength: 100
        },
        phone: {
            type: String,
            trim: true,
            maxlength: 20
        },
        status: {
            type: Number,
            enum: [0, 1], // 0: Activo, 1: Inactivo
            default: 0 // Activo
        }
    }],
    student_capacity: {
        type: Number,
        default: 0,
        min: 0
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    status: {
        type: Number,
        enum: [0, 1], // 0: Activo, 1: Inactivo
        default: 0 // Activo
    }
}, {
    timestamps: true
});

export default model('TrainingCenter', TrainingCenterSchema);
