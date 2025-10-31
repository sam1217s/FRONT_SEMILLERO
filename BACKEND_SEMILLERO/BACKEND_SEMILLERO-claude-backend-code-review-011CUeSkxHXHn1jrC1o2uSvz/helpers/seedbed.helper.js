
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

export const buildSeedbedFilter = (query) => {
    const filter = {};
    
    if (query.name) {
        filter.name = { $regex: query.name, $options: 'i' };
    }
    if (query.status) {
        filter.status = query.status;
    }
    if (query.id_group) {
        filter.id_group = query.id_group;
    }
    if (query.id_leader) {
        filter.id_leader = query.id_leader;
    }
    
    return filter;
};
