/**
 * Constantes de Estados del Sistema
 * Todos los estados usan números para mejor rendimiento y consistencia
 */

// Estados generales (comunes a todos los modelos)
export const GENERAL_STATUS = {
    ACTIVE: 0,        // Activo (por defecto)
    INACTIVE: 1,      // Inactivo
    PENDING: 2,       // Pendiente
    IN_PROGRESS: 3,   // En proceso
    COMPLETED: 4,     // Completado
    CANCELLED: 5,     // Cancelado
    SUSPENDED: 6,     // Suspendido
    ARCHIVED: 7,      // Archivado
    UNDER_REVIEW: 8,  // En revisión
    APPROVED: 9,      // Aprobado
    REJECTED: 10      // Rechazado
};

// Estados específicos para Proyectos
export const PROJECT_STATUS = {
    ACTIVE: 0,           // Activo
    INACTIVE: 1,         // Inactivo
    PENDING: 2,          // Pendiente de aprobación
    IN_PROGRESS: 3,      // En ejecución
    COMPLETED: 4,        // Completado
    CANCELLED: 5,        // Cancelado
    SUSPENDED: 6,        // Suspendido
    ARCHIVED: 7,         // Archivado
    UNDER_REVIEW: 8,     // En revisión
    APPROVED: 9,         // Aprobado
    REJECTED: 10         // Rechazado
};

// Estados específicos para Actividades
export const ACTIVITY_STATUS = {
    PENDING: 2,          // Pendiente
    IN_PROGRESS: 3,      // En proceso
    COMPLETED: 4,        // Completada
    CANCELLED: 5,        // Cancelada
    DELAYED: 6           // Retrasada
};

// Estados específicos para Productos
export const PRODUCT_STATUS = {
    PLANNED: 2,          // Planificado
    IN_DEVELOPMENT: 3,   // En desarrollo
    UNDER_REVIEW: 8,     // En revisión
    DELIVERED: 4,        // Entregado
    PUBLISHED: 9,        // Publicado
    REJECTED: 10         // Rechazado
};

// Estados específicos para Recursos
export const RESOURCE_STATUS = {
    AVAILABLE: 0,        // Disponible
    INACTIVE: 1,         // Inactivo
    ASSIGNED: 2,         // Asignado
    IN_USE: 3,           // En uso
    DEPLETED: 7          // Agotado/Archivado
};

// Estados específicos para Reuniones
export const MEETING_STATUS = {
    SCHEDULED: 2,        // Programada
    IN_PROGRESS: 3,      // En curso
    COMPLETED: 4,        // Completada
    CANCELLED: 5         // Cancelada
};

// Estados específicos para Participación en Proyectos
export const PROJECT_RESEARCHER_STATUS = {
    ACTIVE: 0,           // Activo
    INACTIVE: 1,         // Inactivo
    WITHDRAWN: 5         // Retirado
};

// Prioridades (se mantienen como string pero documentadas)
export const PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
};

// Mapeo de estados para mensajes
export const STATUS_LABELS = {
    [GENERAL_STATUS.ACTIVE]: 'Activo',
    [GENERAL_STATUS.INACTIVE]: 'Inactivo',
    [GENERAL_STATUS.PENDING]: 'Pendiente',
    [GENERAL_STATUS.IN_PROGRESS]: 'En proceso',
    [GENERAL_STATUS.COMPLETED]: 'Completado',
    [GENERAL_STATUS.CANCELLED]: 'Cancelado',
    [GENERAL_STATUS.SUSPENDED]: 'Suspendido',
    [GENERAL_STATUS.ARCHIVED]: 'Archivado',
    [GENERAL_STATUS.UNDER_REVIEW]: 'En revisión',
    [GENERAL_STATUS.APPROVED]: 'Aprobado',
    [GENERAL_STATUS.REJECTED]: 'Rechazado'
};

/**
 * Obtiene la etiqueta de un estado
 * @param {number} status - Código de estado
 * @returns {string} - Etiqueta del estado
 */
export const getStatusLabel = (status) => {
    return STATUS_LABELS[status] || 'Desconocido';
};

/**
 * Valida si un estado es válido
 * @param {number} status - Código de estado a validar
 * @param {Array<number>} allowedStatuses - Estados permitidos
 * @returns {boolean} - true si el estado es válido
 */
export const isValidStatus = (status, allowedStatuses) => {
    return allowedStatuses.includes(Number(status));
};

