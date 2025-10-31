
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

export const buildProductFilter = (query) => {
    const filter = {};
    
    if (query.name) {
        filter.name = { $regex: query.name, $options: 'i' };
    }
    if (query.type) {
        filter.type = query.type;
    }
    if (query.id_project) {
        filter.id_project = query.id_project;
    }
    if (query.status) {
        filter.status = query.status;
    }
    
    return filter;
};
