
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

export const buildResourceFilter = (query) => {
    const filter = {};
    
    if (query.type) {
        filter.type = { $regex: query.type, $options: 'i' };
    }
    if (query.id_activity) {
        filter.id_activity = query.id_activity;
    }
    if (query.resource_status) {
        filter.resource_status = query.resource_status;
    }
    
    return filter;
};
