
export const prepareUpdateData = (updateData) => {
    const cleanedData = { ...updateData };
    
    // Remover campos undefined
    Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key] === undefined) {
            delete cleanedData[key];
        }
    });
    
    return cleanedData;
};

export const buildResearchGroupFilter = (query) => {
    const filter = {};
    
    if (query.name) {
        filter.name = { $regex: query.name, $options: 'i' };
    }
    if (query.category) {
        filter.category = { $regex: query.category, $options: 'i' };
    }
    if (query.status) {
        filter.status = query.status;
    }
    if (query.id_center) {
        filter.id_center = query.id_center;
    }
    
    return filter;
};
