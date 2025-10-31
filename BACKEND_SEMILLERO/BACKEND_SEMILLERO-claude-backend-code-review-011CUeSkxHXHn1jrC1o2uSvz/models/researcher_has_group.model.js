import { Schema, model } from 'mongoose';

const ResearcherHasGroupSchema = Schema({
    id_researcher: {
        type: Schema.Types.ObjectId,
        ref: 'Researcher',
        required: [true, 'El investigador es obligatorio']
    },
    id_group: {
        type: Schema.Types.ObjectId,
        ref: 'ResearchGroup',
        required: [true, 'El grupo de investigación es obligatorio']
    },
    incorporation_date: {
        type: Date,
        required: [true, 'La fecha de incorporación es obligatoria']
    }
}, {
    timestamps: true
});

// Índice compuesto único para evitar duplicados
ResearcherHasGroupSchema.index({ id_researcher: 1, id_group: 1 }, { unique: true });

export default model('ResearcherHasGroup', ResearcherHasGroupSchema);
