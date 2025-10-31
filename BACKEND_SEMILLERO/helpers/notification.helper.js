import { prepareUpdateData } from './common.helper.js';

// Re-exportar para mantener compatibilidad
export { prepareUpdateData };

export const buildNotificationFilter = (query) => {
    const filter = {};

    if (query.id_researcher) {
        filter.id_researcher = query.id_researcher;
    }
    if (query.id_activity) {
        filter.id_activity = query.id_activity;
    }
    if (query.id_project) {
        filter.id_project = query.id_project;
    }
    if (query.priority) {
        filter.priority = query.priority;
    }
    if (query.read !== undefined) {
        filter.read = query.read === 'true';
    }

    return filter;
};
