
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

export const buildLinkTypeFilter = (query) => {
    const filter = {};
    
    if (query.link_type_name) {
        filter.link_type_name = { $regex: query.link_type_name, $options: 'i' };
    }
    if (query.id_center) {
        filter.id_center = query.id_center;
    }
    if (query.id_researcher) {
        filter.id_researcher = query.id_researcher;
    }
    
    return filter;
};
