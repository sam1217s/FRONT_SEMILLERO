/**
 * Script de Seed para la Base de Datos del Sistema de Semilleros SENA
 *
 * IMPORTANTE: Este script usa los modelos REALES del proyecto
 * NO define esquemas duplicados
 *
 * Uso:
 * npm run seed  (definir en package.json)
 * node scripts/seed.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Importar modelos REALES del proyecto
import TrainingCenter from '../models/training_center.model.js';
import ResearchGroup from '../models/research_group.model.js';
import Researcher from '../models/researcher.model.js';
import Seedbed from '../models/seedbed.model.js';
import Project from '../models/project.model.js';
import Activity from '../models/activity.model.js';
import Meeting from '../models/meeting.model.js';
import Product from '../models/product.model.js';
import Resource from '../models/resource.model.js';

dotenv.config();

// Configuración de conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_CNN;

if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_CNN no está configurada en .env');
    process.exit(1);
}

// Helper para hashear contraseñas
const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

// Helper para crear roles (igual que researcher.helper.js)
const createRole = (role, startDate, endDate = null) => {
    return {
        role: role.toUpperCase(),
        start_date: startDate || new Date(),
        end_date: endDate,
        active: true
    };
};

// ============= SEED FUNCTION =============

const seedDatabase = async () => {
    try {
        // Conectar a MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB');
        console.log('');

        // Advertencia
        console.log('⚠️  ADVERTENCIA: Este script eliminará TODOS los datos existentes');
        console.log('   Esperando 3 segundos...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('🗑️  Limpiando base de datos...');

        // Limpiar todas las colecciones
        await TrainingCenter.deleteMany({});
        await ResearchGroup.deleteMany({});
        await Researcher.deleteMany({});
        await Seedbed.deleteMany({});
        await Project.deleteMany({});
        await Activity.deleteMany({});
        await Meeting.deleteMany({});
        await Product.deleteMany({});
        await Resource.deleteMany({});

        console.log('✅ Base de datos limpiada');
        console.log('');

        // Contraseña por defecto hasheada
        const defaultPassword = hashPassword('password123');

        // ========== 1. CENTROS DE FORMACIÓN ==========
        console.log('🏢 Creando Centros de Formación...');

        const centers = await TrainingCenter.insertMany([
            {
                name: 'Centro de Investigación SENA - Bogotá',
                code: 'CIB001',
                city: 'Bogotá',
                department: 'Cundinamarca',
                address: 'Calle 57 # 8-69',
                phone: '601-3305555',
                email: 'cib@sena.edu.co',
                website: 'https://cib.sena.edu.co',
                directors: [
                    {
                        name: 'Director Principal CIB',
                        position: 'Director',
                        email: 'director.cib@sena.edu.co',
                        phone: '601-3305556',
                        status: 0 // Activo
                    }
                ],
                student_capacity: 500,
                description: 'Centro principal de investigación en Bogotá',
                status: 0 // Activo
            },
            {
                name: 'Centro de Tecnología e Innovación - Medellín',
                code: 'CTI002',
                city: 'Medellín',
                department: 'Antioquia',
                address: 'Carrera 48 # 12-234',
                phone: '604-3608888',
                email: 'cti@sena.edu.co',
                website: 'https://cti.sena.edu.co',
                directors: [
                    {
                        name: 'Director CTI',
                        position: 'Director',
                        email: 'director.cti@sena.edu.co',
                        phone: '604-3608889',
                        status: 0
                    }
                ],
                student_capacity: 400,
                description: 'Centro de tecnología e innovación',
                status: 0
            },
            {
                name: 'Centro de Desarrollo Agroindustrial - Cali',
                code: 'CDA003',
                city: 'Cali',
                department: 'Valle del Cauca',
                address: 'Avenida 6 # 34-50',
                phone: '602-4859999',
                email: 'cda@sena.edu.co',
                directors: [],
                student_capacity: 300,
                status: 0
            }
        ]);

        console.log(`   ✓ ${centers.length} centros creados`);

        // ========== 2. INVESTIGADORES (con roles correctos) ==========
        console.log('👨‍🔬 Creando Investigadores...');

        const researchers = await Researcher.insertMany([
            // SUPER ADMIN
            {
                name: 'SUPER ADMINISTRADOR SENA',
                document_type: 'CC',
                document_number: '99999999',
                email: 'super@sena.edu.co',
                password: defaultPassword,
                phone: '3001111111',
                academic_formation: 'PHD EN CIENCIAS DE LA COMPUTACIÓN',
                knowledge_area: 'ADMINISTRACIÓN DE SISTEMAS',
                contract_type: 'planta',
                contract_number: 'STAFF-SUPER-001',
                contract_start_date: new Date('2020-01-01'),
                contract_end_date: null,
                entry_date: new Date('2020-01-01'),
                role: 'SUPER', // ✅ Rol actual activo (requerido)
                roles: [createRole('SUPER', new Date('2020-01-01'))], // ✅ Historial de roles
                status: 0 // Activo
            },

            // ADMIN
            {
                name: 'CARLOS ANDRÉS MARTÍNEZ',
                document_type: 'CC',
                document_number: '11111111',
                email: 'admin@sena.edu.co',
                password: defaultPassword,
                phone: '3002222222',
                academic_formation: 'MAGÍSTER EN GESTIÓN DE LA INNOVACIÓN',
                knowledge_area: 'ADMINISTRACIÓN DE PROYECTOS',
                contract_type: 'planta',
                contract_number: 'STAFF-ADMIN-002',
                contract_start_date: new Date('2020-03-01'),
                contract_end_date: null,
                entry_date: new Date('2020-03-01'),
                id_training_center: centers[0]._id, // ✅ Asignado a CGTS
                role: 'ADMIN', // ✅ Rol actual activo (requerido)
                roles: [createRole('ADMIN', new Date('2020-03-01'))], // ✅ Historial de roles
                status: 0
            },

            // LIDER
            {
                name: 'DR. JUAN PABLO HERNÁNDEZ',
                document_type: 'CC',
                document_number: '33333333',
                email: 'lider@sena.edu.co',
                password: defaultPassword,
                phone: '3003333333',
                academic_formation: 'PHD EN INTELIGENCIA ARTIFICIAL',
                knowledge_area: 'MACHINE LEARNING',
                contract_type: 'contrato',
                contract_number: 'CT-2021-015',
                contract_start_date: new Date('2021-02-01'),
                contract_end_date: new Date('2025-12-31'),
                entry_date: new Date('2021-02-01'),
                id_training_center: centers[0]._id, // ✅ Asignado a CGTS
                role: 'LIDER', // ✅ Rol actual activo (requerido)
                roles: [createRole('LIDER', new Date('2021-02-01'))], // ✅ Historial de roles
                status: 0
            },

            // INVESTIGADOR
            {
                name: 'ING. LAURA VÁSQUEZ DÍAZ',
                document_type: 'CC',
                document_number: '44444444',
                email: 'investigador@sena.edu.co',
                password: defaultPassword,
                phone: '3004444444',
                academic_formation: 'ESPECIALISTA EN DESARROLLO DE SOFTWARE',
                knowledge_area: 'INGENIERÍA DE SOFTWARE',
                contract_type: 'contrato',
                contract_number: 'CT-2022-003',
                contract_start_date: new Date('2022-03-01'),
                contract_end_date: new Date('2025-12-31'),
                entry_date: new Date('2022-03-01'),
                id_training_center: centers[0]._id, // ✅ Asignado a CGTS
                role: 'INVESTIGADOR', // ✅ Rol actual activo (requerido)
                roles: [createRole('INVESTIGADOR', new Date('2022-03-01'))], // ✅ Historial de roles
                status: 0
            },

            // Más investigadores
            {
                name: 'MARÍA FERNANDA LÓPEZ',
                document_type: 'CC',
                document_number: '55555555',
                email: 'maria.lopez@sena.edu.co',
                password: defaultPassword,
                phone: '3005555555',
                academic_formation: 'INGENIERA BIOTECNÓLOGA',
                knowledge_area: 'BIOTECNOLOGÍA',
                contract_type: 'contrato',
                contract_number: 'CT-2023-001',
                contract_start_date: new Date('2023-01-15'),
                contract_end_date: new Date('2025-12-31'),
                entry_date: new Date('2023-01-15'),
                id_training_center: centers[1]._id, // ✅ Asignado a CLEM
                role: 'INVESTIGADOR', // ✅ Rol actual activo (requerido)
                roles: [createRole('INVESTIGADOR', new Date('2023-01-15'))], // ✅ Historial de roles
                status: 0
            },

            {
                name: 'ANDRÉS FELIPE TORRES',
                document_type: 'CC',
                document_number: '66666666',
                email: 'andres.torres@sena.edu.co',
                password: defaultPassword,
                phone: '3006666666',
                academic_formation: 'INGENIERO DE SISTEMAS',
                knowledge_area: 'DESARROLLO WEB',
                contract_type: 'contrato',
                contract_number: 'CT-2023-002',
                contract_start_date: new Date('2023-02-01'),
                contract_end_date: new Date('2025-12-31'),
                entry_date: new Date('2023-02-01'),
                id_training_center: centers[2]._id, // ✅ Asignado a CDA
                role: 'INVESTIGADOR', // ✅ Rol actual activo (requerido)
                roles: [createRole('INVESTIGADOR', new Date('2023-02-01'))], // ✅ Historial de roles
                status: 0
            }
        ]);

        console.log(`   ✓ ${researchers.length} investigadores creados`);
        console.log('');
        console.log('   📧 Credenciales de acceso (documento/password):');
        console.log('      SUPER:        99999999 / password123');
        console.log('      ADMIN:        11111111 / password123');
        console.log('      LIDER:        33333333 / password123');
        console.log('      INVESTIGADOR: 44444444 / password123');
        console.log('      INVESTIGADOR: 55555555 / password123');
        console.log('      INVESTIGADOR: 66666666 / password123');
        console.log('');

        // ========== 3. GRUPOS DE INVESTIGACIÓN ==========
        console.log('👥 Creando Grupos de Investigación...');

        const groups = await ResearchGroup.insertMany([
            {
                name: 'Grupo de Inteligencia Artificial y Machine Learning',
                description: 'Investigación en algoritmos de aprendizaje automático',
                category: 'A1',
                minciencias_registration: 'COL0123456',
                id_center: centers[0]._id,
                status: 0
            },
            {
                name: 'Grupo de Biotecnología Aplicada',
                description: 'Desarrollo de soluciones biotecnológicas',
                category: 'A',
                minciencias_registration: 'COL0234567',
                id_center: centers[1]._id,
                status: 0
            },
            {
                name: 'Grupo de Desarrollo de Software',
                description: 'Creación de aplicaciones empresariales',
                category: 'C',
                minciencias_registration: 'COL0456789',
                id_center: centers[0]._id,
                status: 0
            }
        ]);

        console.log(`   ✓ ${groups.length} grupos creados`);

        // ========== 4. SEMILLEROS ==========
        console.log('🌱 Creando Semilleros de Investigación...');

        const seedbeds = await Seedbed.insertMany([
            {
                name: 'Semillero de Inteligencia Artificial',
                description: 'Formación en IA y ML',
                id_group: groups[0]._id,
                id_leader: researchers[2]._id, // LIDER
                creation_date: new Date('2021-06-01'),
                members_count: 15,
                status: 0
            },
            {
                name: 'Semillero de Desarrollo Web',
                description: 'Formación en tecnologías web modernas',
                id_group: groups[2]._id,
                id_leader: researchers[2]._id, // LIDER
                creation_date: new Date('2022-01-15'),
                members_count: 20,
                status: 0
            }
        ]);

        console.log(`   ✓ ${seedbeds.length} semilleros creados`);

        // ========== 5. PROYECTOS ==========
        console.log('📁 Creando Proyectos...');

        const projects = await Project.insertMany([
            {
                code: 'PRY-2024-001',
                project_name: 'Sistema de Gestión de Inventarios con IA',
                description: 'Desarrollo de un sistema inteligente para gestión de inventarios',
                objectives: 'Optimizar el control de inventarios usando machine learning',
                id_seedbed: seedbeds[0]._id,
                id_group: groups[0]._id,
                id_leader: researchers[2]._id, // LIDER
                start_date: new Date('2024-01-15'),
                end_date: new Date('2024-12-31'),
                validity: 2024,
                budget: 15000000,
                observations: 'Proyecto prioritario',
                status: 3 // En progreso
            },
            {
                code: 'PRY-2024-002',
                project_name: 'Aplicación Web para Gestión de Semilleros',
                description: 'Plataforma web para administrar semilleros de investigación',
                objectives: 'Facilitar la gestión de semilleros y proyectos',
                id_seedbed: seedbeds[1]._id,
                id_group: groups[2]._id,
                id_leader: researchers[2]._id,
                start_date: new Date('2024-02-01'),
                end_date: new Date('2024-11-30'),
                validity: 2024,
                budget: 10000000,
                status: 2 // Pendiente
            }
        ]);

        console.log(`   ✓ ${projects.length} proyectos creados`);

        // ========== 6. ACTIVIDADES ==========
        console.log('📋 Creando Actividades...');

        const activities = await Activity.insertMany([
            {
                id_project: projects[0]._id,
                name: 'Diseño de arquitectura del sistema',
                description: 'Definición de la arquitectura técnica',
                start_date: new Date('2024-01-15'),
                end_date: new Date('2024-02-15'),
                responsible_researcher: researchers[3]._id, // INVESTIGADOR
                status: 4, // Completada
                priority: 'high',
                observations: 'Completada exitosamente'
            },
            {
                id_project: projects[0]._id,
                name: 'Desarrollo del módulo de predicción',
                description: 'Implementación del algoritmo de ML',
                start_date: new Date('2024-02-16'),
                end_date: new Date('2024-04-30'),
                responsible_researcher: researchers[4]._id, // INVESTIGADOR
                status: 3, // En proceso
                priority: 'high'
            }
        ]);

        console.log(`   ✓ ${activities.length} actividades creadas`);

        // ========== RESUMEN FINAL ==========
        console.log('');
        console.log('═══════════════════════════════════════════');
        console.log('✅ SEED COMPLETADO EXITOSAMENTE');
        console.log('═══════════════════════════════════════════');
        console.log(`   📊 Resumen de datos creados:`);
        console.log(`      • ${centers.length} Centros de Formación`);
        console.log(`      • ${researchers.length} Investigadores`);
        console.log(`      • ${groups.length} Grupos de Investigación`);
        console.log(`      • ${seedbeds.length} Semilleros`);
        console.log(`      • ${projects.length} Proyectos`);
        console.log(`      • ${activities.length} Actividades`);
        console.log('');
        console.log('   🔑 Usa las credenciales de arriba para hacer login');
        console.log('═══════════════════════════════════════════');

    } catch (error) {
        console.error('❌ Error en el seed:', error);
        process.exit(1);
    } finally {
        // Cerrar conexión
        await mongoose.disconnect();
        console.log('');
        console.log('👋 Desconectado de MongoDB');
    }
};

// Ejecutar el script
seedDatabase();
