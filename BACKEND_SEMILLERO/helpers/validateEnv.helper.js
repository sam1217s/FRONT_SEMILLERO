/**
 * Validador de variables de entorno
 * Asegura que todas las variables requeridas estén configuradas
 */

/**
 * Variables de entorno requeridas para la aplicación
 */
const requiredEnvVars = [
    'MONGODB_CNN',
    'JWT_SECRET',
    'PORT'
];

/**
 * Variables de entorno opcionales con valores por defecto
 */
const optionalEnvVars = {
    NODE_ENV: 'development',
    JWT_EXPIRATION: '48h',
    PORT: '5000'
};

/**
 * Valida que todas las variables de entorno requeridas estén presentes
 * @throws {Error} Si falta alguna variable requerida
 */
export const validateEnvVariables = () => {
    const missingVars = [];

    // Verificar variables requeridas
    requiredEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            missingVars.push(varName);
        }
    });

    // Si faltan variables, lanzar error
    if (missingVars.length > 0) {
        throw new Error(
            `❌ Faltan las siguientes variables de entorno requeridas:\n` +
            `${missingVars.map(v => `   - ${v}`).join('\n')}\n` +
            `Por favor configúralas en el archivo .env`
        );
    }

    // Establecer valores por defecto para variables opcionales
    Object.entries(optionalEnvVars).forEach(([key, defaultValue]) => {
        if (!process.env[key]) {
            process.env[key] = defaultValue;
            console.log(`⚠️  ${key} no configurado, usando valor por defecto: ${defaultValue}`);
        }
    });

    // Validaciones específicas
    validateMongoDBConnection();
    validateJWTSecret();

    console.log('✅ Variables de entorno validadas correctamente');
};

/**
 * Valida el formato de la conexión a MongoDB
 */
const validateMongoDBConnection = () => {
    const mongoUrl = process.env.MONGODB_CNN;

    if (!mongoUrl.startsWith('mongodb://') && !mongoUrl.startsWith('mongodb+srv://')) {
        throw new Error(
            '❌ MONGODB_CNN debe comenzar con "mongodb://" o "mongodb+srv://"'
        );
    }
};

/**
 * Valida que el JWT_SECRET tenga una longitud segura
 */
const validateJWTSecret = () => {
    const secret = process.env.JWT_SECRET;

    if (secret.length < 32) {
        console.warn(
            '⚠️  ADVERTENCIA: JWT_SECRET debería tener al menos 32 caracteres para mayor seguridad'
        );
    }
};

/**
 * Obtiene el valor de una variable de entorno con fallback
 * @param {string} key - Nombre de la variable
 * @param {*} defaultValue - Valor por defecto si no existe
 * @returns {*} - Valor de la variable
 */
export const getEnvVar = (key, defaultValue = undefined) => {
    return process.env[key] || defaultValue;
};
