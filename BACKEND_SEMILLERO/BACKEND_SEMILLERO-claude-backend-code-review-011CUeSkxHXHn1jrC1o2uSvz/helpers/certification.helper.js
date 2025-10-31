
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

export const buildCertificationFilter = (query) => {
    const filter = {};
    
    if (query.id_researcher) {
        filter.id_researcher = query.id_researcher;
    }
    if (query.id_project) {
        filter.id_project = query.id_project;
    }
    if (query.contract_type) {
        filter.contract_type = query.contract_type;
    }
    
    return filter;
};
