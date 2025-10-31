import { prepareUpdateData, buildRegexFilter } from './common.helper.js';

// Re-exportar para mantener compatibilidad
export { prepareUpdateData };

export const buildProjectFilter = (query) => {
    const filter = {};

    if (query.code) {
        filter.code = buildRegexFilter(query.code);
    }
    if (query.project_name) {
        filter.project_name = buildRegexFilter(query.project_name);
    }
    if (query.id_seedbed) {
        filter.id_seedbed = query.id_seedbed;
    }
    if (query.id_group) {
        filter.id_group = query.id_group;
    }
    if (query.id_leader) {
        filter.id_leader = query.id_leader;
    }
    if (query.validity) {
        filter.validity = Number(query.validity);
    }

    return filter;
};
