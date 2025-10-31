import jwt from 'jsonwebtoken';

const logAction = async (logData, token, req) => {
    try {
        const { uid, role } = jwt.verify(token, process.env.JWT_SECRET);

        const logEntry = {
            user_id: uid,
            user_role: role,
            action: logData.action,
            affected_table: logData.affected_table,
            module: logData.module,
            affected_record_id: logData.affected_record_id,
            previous_data: logData.previous_data,
            new_data: logData.new_data,
            level: logData.level || 'INFO',
            description: logData.description,
            ip_address: req.ip || req.connection.remoteAddress,
            user_agent: req.get('user-agent'),
            timestamp: new Date()
        };

        // Aquí podrías guardar el log en una colección de MongoDB
        // Por ejemplo: await LogModel.create(logEntry);
        
        // Por ahora solo lo imprimimos en consola
        console.log('📝 LOG:', JSON.stringify(logEntry, null, 2));

        return logEntry;
    } catch (error) {
        console.error('Error al registrar log:', error);
        return null;
    }
};

export default logAction;
