import mongoose from 'mongoose';

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN);
        console.log('✅ Base de datos conectada exitosamente');
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error);
        throw new Error('Error en la base de datos');
    }
};

export { dbConnection };
