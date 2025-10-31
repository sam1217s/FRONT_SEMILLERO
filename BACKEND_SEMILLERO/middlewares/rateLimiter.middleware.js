import rateLimit from 'express-rate-limit';

/**
 * Rate limiter general para la API
 * Límite: 100 requests por 15 minutos por IP
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de requests por ventana
    message: {
        msg: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde',
        retryAfter: '15 minutos'
    },
    standardHeaders: true, // Retorna info de rate limit en headers `RateLimit-*`
    legacyHeaders: false, // Deshabilita headers `X-RateLimit-*`
    // Store en memoria por defecto (para producción considerar Redis)
});

/**
 * Rate limiter estricto para endpoints de autenticación
 * Límite: 5 intentos por 15 minutos por IP
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Máximo 5 intentos
    message: {
        msg: 'Demasiados intentos de autenticación, por favor intente más tarde',
        retryAfter: '15 minutos'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // No contar requests exitosos
});

/**
 * Rate limiter para operaciones de creación
 * Límite: 20 creaciones por 15 minutos por IP
 */
export const createLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 20,
    message: {
        msg: 'Demasiadas operaciones de creación, por favor intente más tarde',
        retryAfter: '15 minutos'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
