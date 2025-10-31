import activityModels from '../models/activity.model.js';

const activityHelper = {}


activityHelper.validateExist = async (parameter, {req}) => {
    const id = req.params.id
    const searchActivity = await activityModels.findOne({ name: { $regex: `^${parameter}$`, $options: 'i' } })

    if(searchActivity && searchActivity._id != id){
        throw new Error(`La actividad con nombre ${parameter} ya esta registrada`)
    }
}


export{
    activityHelper
}
   