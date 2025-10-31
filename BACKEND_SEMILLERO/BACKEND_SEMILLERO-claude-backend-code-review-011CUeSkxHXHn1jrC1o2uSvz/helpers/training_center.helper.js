
export const formatName = (str) => {
    return str ? str.toUpperCase().trim() : undefined;
};

export const formatAddress = (str) => {
    return str ? str.toUpperCase().trim() : undefined;
};

export const formatCity = (str) => {
    return str ? str.toUpperCase().trim() : undefined;
};

export const formatDepartment = (str) => {
    return str ? str.toUpperCase().trim() : undefined;
};

export const buildTrainingCenterFilter = (query) => {
    const filter = {};
    
    if (query.name) {
        filter.name = { $regex: query.name, $options: 'i' };
    }
    if (query.city) {
        filter.city = { $regex: query.city, $options: 'i' };
    }
    if (query.department) {
        filter.department = { $regex: query.department, $options: 'i' };
    }
    if (query.status !== undefined) {
        // Acepta tanto números como strings y los convierte a número
        filter.status = Number(query.status);
    }
    
    return filter;
};
