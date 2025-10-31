import { validationResult } from 'express-validator';

const valideFields = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            msg: "Error en validación de campos",
            errors: errors.array()
        });
    }
    next();
};

export { valideFields };
