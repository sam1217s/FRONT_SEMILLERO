import { Schema, model } from 'mongoose';

const LinkTypeSchema = Schema({
    link_type_name: {
        type: String,
        trim: true,
        maxlength: 45,
        comment: 'staff or contracted'
    },
    contract_number: {
        type: String,
        trim: true,
        maxlength: 45
    },
    contract_object: {
        type: String,
        trim: true
    },
    obligations: {
        type: String,
        trim: true
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    id_center: {
        type: Schema.Types.ObjectId,
        ref: 'TrainingCenter',
        required: [true, 'El centro de formación es obligatorio']
    },
    id_researcher: {
        type: Schema.Types.ObjectId,
        ref: 'Researcher',
        required: [true, 'El investigador es obligatorio']
    }
}, {
    timestamps: true
});

export default model('LinkType', LinkTypeSchema);
