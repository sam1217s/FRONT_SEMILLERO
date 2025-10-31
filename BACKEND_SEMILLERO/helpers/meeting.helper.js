
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

export const buildMeetingFilter = (query) => {
    const filter = {};
    
    if (query.title) {
        filter.title = { $regex: query.title, $options: 'i' };
    }
    if (query.id_project) {
        filter.id_project = query.id_project;
    }
    if (query.id_seedbed) {
        filter.id_seedbed = query.id_seedbed;
    }
    if (query.status) {
        filter.status = query.status;
    }
    if (query.modality) {
        filter.modality = query.modality;
    }
    
    return filter;
};
