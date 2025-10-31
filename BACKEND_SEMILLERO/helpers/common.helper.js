/**
 * Utilidades comunes compartidas entre helpers
 * Centraliza funciones duplicadas para mejorar mantenibilidad
 */

/**
 * Limpia un objeto eliminando campos undefined o null
 * @param {Object} updateData - Objeto con datos a actualizar
 * @returns {Object} - Objeto limpio sin campos undefined/null
 */
export const prepareUpdateData = (updateData) => {
    const cleanedData = { ...updateData };

    // Remover campos undefined y null
    Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key] === undefined || cleanedData[key] === null) {
            delete cleanedData[key];
        }
    });

    return cleanedData;
};

/**
 * Construye un filtro regex para búsqueda case-insensitive
 * @param {string} value - Valor a buscar
 * @returns {Object} - Objeto con $regex y $options
 */
export const buildRegexFilter = (value) => {
    return { $regex: value, $options: 'i' };
};

/**
 * Construye paginación para consultas MongoDB
 * @param {number} page - Número de página (default: 1)
 * @param {number} limit - Registros por página (default: 10, max: 100)
 * @returns {Object} - Objeto con skip y limit
 */
export const buildPagination = (page = 1, limit = 10) => {
    const parsedPage = Math.max(1, parseInt(page) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));

    return {
        skip: (parsedPage - 1) * parsedLimit,
        limit: parsedLimit,
        page: parsedPage
    };
};

/**
 * Formatea respuesta paginada
 * @param {Array} data - Datos de la página
 * @param {number} total - Total de registros
 * @param {number} page - Página actual
 * @param {number} limit - Registros por página
 * @returns {Object} - Respuesta con metadata de paginación
 */
export const formatPaginatedResponse = (data, total, page, limit) => {
    const totalPages = Math.ceil(total / limit);

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };
};

/**
 * Valida que un ID sea un ObjectId válido de MongoDB
 * @param {string} id - ID a validar
 * @returns {boolean} - true si es válido
 */
export const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
};
