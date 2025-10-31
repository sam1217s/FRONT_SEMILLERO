/**
 * Middleware centralizado de manejo de errores
 * Proporciona respuestas estructuradas y consistentes
 */

/**
 * Clase para errores de aplicación personalizados
 */
export class AppError extends Error {
    constructor(message, statusCode, data = null) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Middleware de manejo de errores global
 */
export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log del error en consola (en producción usar logger)
    if (process.env.NODE_ENV === 'development') {
        console.error('Error Stack:', err.stack);
    }

    // Error de Mongoose - ID inválido
    if (err.name === 'CastError') {
        const message = 'ID inválido o formato incorrecto';
        error = new AppError(message, 400);
    }

    // Error de Mongoose - Duplicado (unique constraint)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        const message = `El valor del campo '${field}' ya existe`;
        error = new AppError(message, 400, { field });
    }

    // Error de validación de Mongoose
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => ({
            field: e.path,
            message: e.message
        }));
        const message = 'Error de validación de datos';
        error = new AppError(message, 400, { errors });
    }

    // Error de JWT
    if (err.name === 'JsonWebTokenError') {
        const message = 'Token inválido o malformado';
        error = new AppError(message, 401);
    }

    // Error de JWT expirado
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expirado, por favor inicie sesión nuevamente';
        error = new AppError(message, 401);
    }

    // Error de tamaño de payload
    if (err.type === 'entity.too.large') {
        const message = 'El tamaño de la solicitud excede el límite permitido';
        error = new AppError(message, 413);
    }

    // Respuesta estructurada
    const response = {
        success: false,
        msg: error.message || 'Error interno del servidor',
        statusCode: error.statusCode || 500
    };

    // Agregar data adicional si existe
    if (error.data) {
        response.data = error.data;
    }

    // En desarrollo, incluir stack trace
    if (process.env.NODE_ENV === 'development' && err.stack) {
        response.stack = err.stack;
    }

    res.status(error.statusCode || 500).json(response);
};

/**
 * Middleware para rutas no encontradas (404)
 */
export const notFound = (req, res, next) => {
    const message = `Ruta no encontrada: ${req.originalUrl}`;
    const error = new AppError(message, 404);
    next(error);
};

/**
 * Helper para crear respuestas exitosas consistentes
 */
export const successResponse = (data, message = 'Operación exitosa', statusCode = 200) => {
    return {
        success: true,
        msg: message,
        statusCode,
        data
    };
};
