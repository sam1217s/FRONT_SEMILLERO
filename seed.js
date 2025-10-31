/**
 * Script de Seed para la Base de Datos del Sistema de Semilleros
 *
 * Este script puebla la base de datos con datos de prueba para desarrollo
 *
 * Uso:
 * 1. Asegúrate de tener MongoDB corriendo
 * 2. Configura la URL de conexión en MONGODB_URI
 * 3. Ejecuta: node seed.js
 *
 * Nota: Este script ELIMINA todos los datos existentes antes de insertar los nuevos
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Configuración de conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/semilleros_db';

// Conexión a MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => {
  console.error('❌ Error conectando a MongoDB:', err);
  process.exit(1);
});

// ============= DEFINICIÓN DE ESQUEMAS =============

const researchCenterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: String,
  city: String,
  department: String,
  address: String,
  phone: String,
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

const researchGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  minciencias_registration: String,
  id_center: { type: mongoose.Schema.Types.ObjectId, ref: 'ResearchCenter' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

const researcherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  document_type: String,
  document_number: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  academic_training: String,
  knowledge_area: String,
  contract_type: String,
  contract_number: String,
  start_date: Date,
  end_date: Date,
  role: { type: String, enum: ['super', 'admin', 'lider'], default: 'lider' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
  project_name: { type: String, required: true },
  code: String,
  description: String,
  objectives: String,
  budget: Number,
  start_date: Date,
  end_date: Date,
  id_leader: { type: mongoose.Schema.Types.ObjectId, ref: 'Researcher' },
  id_group: { type: mongoose.Schema.Types.ObjectId, ref: 'ResearchGroup' },
  approval_status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

const seedbedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  id_group: { type: mongoose.Schema.Types.ObjectId, ref: 'ResearchGroup' },
  id_leader: { type: mongoose.Schema.Types.ObjectId, ref: 'Researcher' },
  members_count: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  activity_type: String,
  start_date: Date,
  end_date: Date,
  id_project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  id_responsible: { type: mongoose.Schema.Types.ObjectId, ref: 'Researcher' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], default: 'Pending' },
}, { timestamps: true });

const meetingSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  description: String,
  meeting_date: Date,
  location: String,
  id_project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  id_seedbed: { type: mongoose.Schema.Types.ObjectId, ref: 'Seedbed' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Researcher' }],
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  product_type: String,
  publication_date: Date,
  url: String,
  id_project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Researcher' }],
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

// Modelos
const ResearchCenter = mongoose.model('ResearchCenter', researchCenterSchema);
const ResearchGroup = mongoose.model('ResearchGroup', researchGroupSchema);
const Researcher = mongoose.model('Researcher', researcherSchema);
const Project = mongoose.model('Project', projectSchema);
const Seedbed = mongoose.model('Seedbed', seedbedSchema);
const Activity = mongoose.model('Activity', activitySchema);
const Meeting = mongoose.model('Meeting', meetingSchema);
const Product = mongoose.model('Product', productSchema);

// ============= DATOS DE PRUEBA =============

const seedData = async () => {
  try {
    console.log('🗑️  Limpiando base de datos...');

    // Limpiar todas las colecciones
    await ResearchCenter.deleteMany({});
    await ResearchGroup.deleteMany({});
    await Researcher.deleteMany({});
    await Project.deleteMany({});
    await Seedbed.deleteMany({});
    await Activity.deleteMany({});
    await Meeting.deleteMany({});
    await Product.deleteMany({});

    console.log('✅ Base de datos limpiada');
    console.log('');

    // Hash de contraseña por defecto
    const defaultPassword = await bcrypt.hash('password123', 10);

    // ========== 1. CENTROS DE INVESTIGACIÓN ==========
    console.log('📍 Creando Centros de Investigación...');

    const centers = await ResearchCenter.insertMany([
      {
        name: 'Centro de Investigación SENA - Bogotá',
        code: 'CIB001',
        city: 'Bogotá',
        department: 'Cundinamarca',
        address: 'Calle 57 # 8-69',
        phone: '3305555',
        status: 'Active'
      },
      {
        name: 'Centro de Tecnología e Innovación - Medellín',
        code: 'CTI002',
        city: 'Medellín',
        department: 'Antioquia',
        address: 'Carrera 48 # 12-234',
        phone: '3608888',
        status: 'Active'
      },
      {
        name: 'Centro de Desarrollo Agroindustrial - Cali',
        code: 'CDA003',
        city: 'Cali',
        department: 'Valle del Cauca',
        address: 'Avenida 6 # 34-50',
        phone: '4859999',
        status: 'Active'
      },
      {
        name: 'Centro de Biotecnología - Barranquilla',
        code: 'CBT004',
        city: 'Barranquilla',
        department: 'Atlántico',
        address: 'Calle 72 # 41-100',
        phone: '3777777',
        status: 'Active'
      },
      {
        name: 'Centro de Energías Renovables - Bucaramanga',
        code: 'CER005',
        city: 'Bucaramanga',
        department: 'Santander',
        address: 'Carrera 27 # 36-45',
        phone: '6431111',
        status: 'Inactive'
      }
    ]);

    console.log(`   ✓ ${centers.length} centros creados`);

    // ========== 2. GRUPOS DE INVESTIGACIÓN ==========
    console.log('👥 Creando Grupos de Investigación...');

    const groups = await ResearchGroup.insertMany([
      {
        name: 'Grupo de Inteligencia Artificial y Machine Learning',
        description: 'Investigación en algoritmos de aprendizaje automático y sus aplicaciones en la industria',
        category: 'A1',
        minciencias_registration: 'COL0123456',
        id_center: centers[0]._id,
        status: 'Active'
      },
      {
        name: 'Grupo de Biotecnología Aplicada',
        description: 'Desarrollo de soluciones biotecnológicas para el sector agroindustrial',
        category: 'A',
        minciencias_registration: 'COL0234567',
        id_center: centers[1]._id,
        status: 'Active'
      },
      {
        name: 'Grupo de Energías Renovables y Sostenibilidad',
        description: 'Investigación en energía solar, eólica y sistemas de eficiencia energética',
        category: 'B',
        minciencias_registration: 'COL0345678',
        id_center: centers[4]._id,
        status: 'Active'
      },
      {
        name: 'Grupo de Desarrollo de Software',
        description: 'Creación de aplicaciones empresariales y soluciones tecnológicas innovadoras',
        category: 'C',
        minciencias_registration: 'COL0456789',
        id_center: centers[1]._id,
        status: 'Active'
      },
      {
        name: 'Grupo de Ciberseguridad',
        description: 'Investigación en seguridad informática, criptografía y protección de datos',
        category: 'B',
        minciencias_registration: 'COL0567890',
        id_center: centers[0]._id,
        status: 'Active'
      },
      {
        name: 'Grupo de IoT y Ciudades Inteligentes',
        description: 'Desarrollo de soluciones IoT para automatización y ciudades inteligentes',
        category: 'C',
        minciencias_registration: 'COL0678901',
        id_center: centers[1]._id,
        status: 'Active'
      },
      {
        name: 'Grupo de Agricultura de Precisión',
        description: 'Aplicación de tecnologías avanzadas en agricultura sostenible',
        category: 'A',
        minciencias_registration: 'COL0789012',
        id_center: centers[2]._id,
        status: 'Inactive'
      },
      {
        name: 'Grupo de Robótica e Automatización',
        description: 'Diseño y desarrollo de sistemas robóticos para la industria',
        category: 'B',
        minciencias_registration: 'COL0890123',
        id_center: centers[0]._id,
        status: 'Active'
      }
    ]);

    console.log(`   ✓ ${groups.length} grupos creados`);

    // ========== 3. INVESTIGADORES ==========
    console.log('👨‍🔬 Creando Investigadores...');

    const researchers = await Researcher.insertMany([
      // Super Admin
      {
        name: 'María Fernanda Rodríguez',
        document_type: 'CC',
        document_number: '1234567890',
        email: 'super@sena.edu.co',
        password: defaultPassword,
        phone: '3001234567',
        academic_training: 'PhD en Ciencias de la Computación',
        knowledge_area: 'Inteligencia Artificial',
        contract_type: 'Planta',
        contract_number: 'CT-2020-001',
        start_date: new Date('2020-01-15'),
        end_date: new Date('2025-12-31'),
        role: 'super',
        status: 'Active'
      },
      // Administradores
      {
        name: 'Carlos Andrés Martínez',
        document_type: 'CC',
        document_number: '2345678901',
        email: 'admin1@sena.edu.co',
        password: defaultPassword,
        phone: '3012345678',
        academic_training: 'Magíster en Gestión de la Innovación',
        knowledge_area: 'Administración de Proyectos',
        contract_type: 'Planta',
        contract_number: 'CT-2020-002',
        start_date: new Date('2020-03-01'),
        end_date: new Date('2025-12-31'),
        role: 'admin',
        status: 'Active'
      },
      {
        name: 'Ana Lucía Gómez',
        document_type: 'CC',
        document_number: '3456789012',
        email: 'admin2@sena.edu.co',
        password: defaultPassword,
        phone: '3023456789',
        academic_training: 'Especialista en Gestión de Investigación',
        knowledge_area: 'Ciencias Administrativas',
        contract_type: 'Contrato',
        contract_number: 'CT-2021-015',
        start_date: new Date('2021-02-01'),
        end_date: new Date('2024-12-31'),
        role: 'admin',
        status: 'Active'
      },
      // Líderes de Investigación
      {
        name: 'Dr. Juan Pablo Hernández',
        document_type: 'CC',
        document_number: '4567890123',
        email: 'lider1@sena.edu.co',
        password: defaultPassword,
        phone: '3034567890',
        academic_training: 'PhD en Inteligencia Artificial',
        knowledge_area: 'Machine Learning',
        contract_type: 'Planta',
        contract_number: 'CT-2019-005',
        start_date: new Date('2019-08-01'),
        end_date: new Date('2025-12-31'),
        role: 'lider',
        status: 'Active'
      },
      {
        name: 'Dra. Patricia Moreno Silva',
        document_type: 'CC',
        document_number: '5678901234',
        email: 'lider2@sena.edu.co',
        password: defaultPassword,
        phone: '3045678901',
        academic_training: 'PhD en Biotecnología',
        knowledge_area: 'Ingeniería Genética',
        contract_type: 'Planta',
        contract_number: 'CT-2020-008',
        start_date: new Date('2020-06-01'),
        end_date: new Date('2025-12-31'),
        role: 'lider',
        status: 'Active'
      },
      {
        name: 'Ing. Roberto Sánchez Castro',
        document_type: 'CC',
        document_number: '6789012345',
        email: 'lider3@sena.edu.co',
        password: defaultPassword,
        phone: '3056789012',
        academic_training: 'Magíster en Energías Renovables',
        knowledge_area: 'Energía Solar',
        contract_type: 'Contrato',
        contract_number: 'CT-2021-012',
        start_date: new Date('2021-01-15'),
        end_date: new Date('2024-12-31'),
        role: 'lider',
        status: 'Active'
      },
      {
        name: 'Ing. Laura Vásquez Díaz',
        document_type: 'CC',
        document_number: '7890123456',
        email: 'lider4@sena.edu.co',
        password: defaultPassword,
        phone: '3067890123',
        academic_training: 'Especialista en Desarrollo de Software',
        knowledge_area: 'Ingeniería de Software',
        contract_type: 'Contrato',
        contract_number: 'CT-2022-003',
        start_date: new Date('2022-03-01'),
        end_date: new Date('2024-12-31'),
        role: 'lider',
        status: 'Active'
      },
      {
        name: 'MSc. Diego Ramírez Ortiz',
        document_type: 'CC',
        document_number: '8901234567',
        email: 'lider5@sena.edu.co',
        password: defaultPassword,
        phone: '3078901234',
        academic_training: 'Magíster en Ciberseguridad',
        knowledge_area: 'Seguridad Informática',
        contract_type: 'Planta',
        contract_number: 'CT-2021-018',
        start_date: new Date('2021-07-01'),
        end_date: new Date('2025-12-31'),
        role: 'lider',
        status: 'Active'
      },
      {
        name: 'Ing. Camila Torres Ruiz',
        document_type: 'CC',
        document_number: '9012345678',
        email: 'lider6@sena.edu.co',
        password: defaultPassword,
        phone: '3089012345',
        academic_training: 'Especialista en IoT',
        knowledge_area: 'Internet de las Cosas',
        contract_type: 'Contrato',
        contract_number: 'CT-2022-007',
        start_date: new Date('2022-01-10'),
        end_date: new Date('2024-12-31'),
        role: 'lider',
        status: 'Active'
      },
      {
        name: 'Ing. Andrés Felipe López',
        document_type: 'CC',
        document_number: '1122334455',
        email: 'lider7@sena.edu.co',
        password: defaultPassword,
        phone: '3091122334',
        academic_training: 'Magíster en Agronomía',
        knowledge_area: 'Agricultura de Precisión',
        contract_type: 'Contrato',
        contract_number: 'CT-2021-025',
        start_date: new Date('2021-09-01'),
        end_date: new Date('2024-12-31'),
        role: 'lider',
        status: 'Inactive'
      },
      {
        name: 'Dr. Santiago Medina Pérez',
        document_type: 'CC',
        document_number: '2233445566',
        email: 'lider8@sena.edu.co',
        password: defaultPassword,
        phone: '3102233445',
        academic_training: 'PhD en Robótica',
        knowledge_area: 'Sistemas Robóticos',
        contract_type: 'Planta',
        contract_number: 'CT-2019-012',
        start_date: new Date('2019-05-01'),
        end_date: new Date('2025-12-31'),
        role: 'lider',
        status: 'Active'
      }
    ]);

    console.log(`   ✓ ${researchers.length} investigadores creados`);
    console.log('   📧 Credenciales por defecto:');
    console.log('      Super Admin: super@sena.edu.co / password123');
    console.log('      Admin: admin1@sena.edu.co / password123');
    console.log('      Lider: lider1@sena.edu.co / password123');

    // ========== 4. PROYECTOS ==========
    console.log('📊 Creando Proyectos...');

    const projects = await Project.insertMany([
      {
        project_name: 'Sistema de Reconocimiento Facial con IA',
        code: 'PRY-2024-001',
        description: 'Desarrollo de un sistema de reconocimiento facial utilizando redes neuronales convolucionales para control de acceso',
        objectives: 'Implementar un sistema de seguridad biométrica con precisión superior al 95%',
        budget: 85000000,
        start_date: new Date('2024-01-15'),
        end_date: new Date('2024-12-31'),
        id_leader: researchers[3]._id,
        id_group: groups[0]._id,
        approval_status: 'Approved',
        status: 'Active'
      },
      {
        project_name: 'Desarrollo de Biomateriales Sostenibles',
        code: 'PRY-2024-002',
        description: 'Investigación y desarrollo de materiales biodegradables a partir de residuos agroindustriales',
        objectives: 'Crear alternativas sostenibles a los plásticos convencionales',
        budget: 120000000,
        start_date: new Date('2024-02-01'),
        end_date: new Date('2025-06-30'),
        id_leader: researchers[4]._id,
        id_group: groups[1]._id,
        approval_status: 'Approved',
        status: 'Active'
      },
      {
        project_name: 'Sistema de Paneles Solares Inteligentes',
        code: 'PRY-2024-003',
        description: 'Diseño de un sistema de paneles solares con seguimiento automático del sol y almacenamiento eficiente',
        objectives: 'Aumentar la eficiencia de captación solar en un 40%',
        budget: 95000000,
        start_date: new Date('2024-03-01'),
        end_date: new Date('2024-11-30'),
        id_leader: researchers[5]._id,
        id_group: groups[2]._id,
        approval_status: 'Approved',
        status: 'Active'
      },
      {
        project_name: 'Plataforma E-Learning con Gamificación',
        code: 'PRY-2024-004',
        description: 'Creación de una plataforma de aprendizaje en línea con elementos de gamificación para aumentar el engagement',
        objectives: 'Mejorar la retención de estudiantes en cursos virtuales',
        budget: 65000000,
        start_date: new Date('2024-01-20'),
        end_date: new Date('2024-10-31'),
        id_leader: researchers[6]._id,
        id_group: groups[3]._id,
        approval_status: 'Approved',
        status: 'Active'
      },
      {
        project_name: 'Sistema de Detección de Amenazas en Tiempo Real',
        code: 'PRY-2024-005',
        description: 'Implementación de un IDS/IPS basado en machine learning para detección de amenazas avanzadas',
        objectives: 'Reducir el tiempo de detección de amenazas a menos de 30 segundos',
        budget: 75000000,
        start_date: new Date('2024-02-15'),
        end_date: new Date('2024-12-15'),
        id_leader: researchers[7]._id,
        id_group: groups[4]._id,
        approval_status: 'Pending',
        status: 'Active'
      },
      {
        project_name: 'Red de Sensores IoT para Monitoreo Ambiental',
        code: 'PRY-2024-006',
        description: 'Despliegue de una red de sensores IoT para monitoreo de calidad del aire en la ciudad',
        objectives: 'Crear un sistema de alerta temprana de contaminación atmosférica',
        budget: 110000000,
        start_date: new Date('2024-03-10'),
        end_date: new Date('2025-03-10'),
        id_leader: researchers[8]._id,
        id_group: groups[5]._id,
        approval_status: 'Pending',
        status: 'Active'
      },
      {
        project_name: 'Sistema de Riego Inteligente con IA',
        code: 'PRY-2024-007',
        description: 'Desarrollo de un sistema de riego automatizado que optimiza el uso de agua basándose en datos climáticos y del suelo',
        objectives: 'Reducir el consumo de agua en cultivos en un 30%',
        budget: 88000000,
        start_date: new Date('2024-04-01'),
        end_date: new Date('2025-01-31'),
        id_leader: researchers[9]._id,
        id_group: groups[6]._id,
        approval_status: 'Rejected',
        status: 'Inactive'
      },
      {
        project_name: 'Robot Colaborativo para Manufactura',
        code: 'PRY-2024-008',
        description: 'Diseño y construcción de un cobot para asistir en procesos de ensamblaje industrial',
        objectives: 'Aumentar la productividad en líneas de producción en un 25%',
        budget: 135000000,
        start_date: new Date('2024-01-05'),
        end_date: new Date('2024-12-20'),
        id_leader: researchers[10]._id,
        id_group: groups[7]._id,
        approval_status: 'Approved',
        status: 'Active'
      }
    ]);

    console.log(`   ✓ ${projects.length} proyectos creados`);

    // ========== 5. SEMILLEROS ==========
    console.log('🌱 Creando Semilleros de Investigación...');

    const seedbeds = await Seedbed.insertMany([
      {
        name: 'Semillero de Inteligencia Artificial',
        description: 'Espacio para estudiantes interesados en aprender y desarrollar proyectos de IA',
        id_group: groups[0]._id,
        id_leader: researchers[3]._id,
        members_count: 18,
        status: 'Active'
      },
      {
        name: 'Semillero de Biotecnología Verde',
        description: 'Investigación estudiantil en biotecnología aplicada al medio ambiente',
        id_group: groups[1]._id,
        id_leader: researchers[4]._id,
        members_count: 12,
        status: 'Active'
      },
      {
        name: 'Semillero de Energías Alternativas',
        description: 'Desarrollo de proyectos de energía solar y eólica',
        id_group: groups[2]._id,
        id_leader: researchers[5]._id,
        members_count: 15,
        status: 'Active'
      },
      {
        name: 'Semillero de Desarrollo Web',
        description: 'Creación de aplicaciones web modernas y escalables',
        id_group: groups[3]._id,
        id_leader: researchers[6]._id,
        members_count: 22,
        status: 'Active'
      },
      {
        name: 'Semillero de Hacking Ético',
        description: 'Aprendizaje de técnicas de pentesting y seguridad ofensiva',
        id_group: groups[4]._id,
        id_leader: researchers[7]._id,
        members_count: 14,
        status: 'Active'
      },
      {
        name: 'Semillero de IoT y Smart Cities',
        description: 'Proyectos de Internet de las Cosas para ciudades inteligentes',
        id_group: groups[5]._id,
        id_leader: researchers[8]._id,
        members_count: 16,
        status: 'Active'
      },
      {
        name: 'Semillero de Robótica Educativa',
        description: 'Construcción y programación de robots educativos',
        id_group: groups[7]._id,
        id_leader: researchers[10]._id,
        members_count: 20,
        status: 'Active'
      }
    ]);

    console.log(`   ✓ ${seedbeds.length} semilleros creados`);

    // ========== 6. ACTIVIDADES ==========
    console.log('📅 Creando Actividades...');

    const activities = await Activity.insertMany([
      {
        name: 'Recolección de Dataset de Rostros',
        description: 'Capturar y etiquetar 10,000 imágenes faciales para entrenamiento del modelo',
        activity_type: 'Investigación',
        start_date: new Date('2024-01-15'),
        end_date: new Date('2024-03-15'),
        id_project: projects[0]._id,
        id_responsible: researchers[3]._id,
        status: 'Completed'
      },
      {
        name: 'Entrenamiento de Red Neuronal CNN',
        description: 'Entrenar el modelo de reconocimiento facial con el dataset recolectado',
        activity_type: 'Desarrollo',
        start_date: new Date('2024-03-16'),
        end_date: new Date('2024-05-30'),
        id_project: projects[0]._id,
        id_responsible: researchers[3]._id,
        status: 'In Progress'
      },
      {
        name: 'Pruebas de Campo en Instalaciones',
        description: 'Realizar pruebas del sistema en entornos reales con diferentes condiciones de iluminación',
        activity_type: 'Pruebas',
        start_date: new Date('2024-06-01'),
        end_date: new Date('2024-08-31'),
        id_project: projects[0]._id,
        id_responsible: researchers[3]._id,
        status: 'Pending'
      },
      {
        name: 'Caracterización de Residuos Agroindustriales',
        description: 'Análisis químico y físico de diferentes residuos agroindustriales',
        activity_type: 'Investigación',
        start_date: new Date('2024-02-01'),
        end_date: new Date('2024-04-30'),
        id_project: projects[1]._id,
        id_responsible: researchers[4]._id,
        status: 'Completed'
      },
      {
        name: 'Formulación de Biopolímeros',
        description: 'Desarrollo de diferentes formulaciones de biomateriales',
        activity_type: 'Desarrollo',
        start_date: new Date('2024-05-01'),
        end_date: new Date('2024-08-31'),
        id_project: projects[1]._id,
        id_responsible: researchers[4]._id,
        status: 'In Progress'
      },
      {
        name: 'Diseño de Prototipo de Panel Solar',
        description: 'Diseñar el sistema mecánico de seguimiento solar',
        activity_type: 'Diseño',
        start_date: new Date('2024-03-01'),
        end_date: new Date('2024-05-15'),
        id_project: projects[2]._id,
        id_responsible: researchers[5]._id,
        status: 'In Progress'
      },
      {
        name: 'Implementación de Sistema de Almacenamiento',
        description: 'Integrar baterías de litio con sistema de gestión inteligente',
        activity_type: 'Desarrollo',
        start_date: new Date('2024-05-16'),
        end_date: new Date('2024-08-31'),
        id_project: projects[2]._id,
        id_responsible: researchers[5]._id,
        status: 'Pending'
      },
      {
        name: 'Desarrollo de Frontend de Plataforma',
        description: 'Crear la interfaz de usuario con React y diseño responsivo',
        activity_type: 'Desarrollo',
        start_date: new Date('2024-01-20'),
        end_date: new Date('2024-04-30'),
        id_project: projects[3]._id,
        id_responsible: researchers[6]._id,
        status: 'Completed'
      },
      {
        name: 'Implementación de Mecánicas de Juego',
        description: 'Integrar sistemas de puntos, insignias y rankings',
        activity_type: 'Desarrollo',
        start_date: new Date('2024-05-01'),
        end_date: new Date('2024-07-31'),
        id_project: projects[3]._id,
        id_responsible: researchers[6]._id,
        status: 'In Progress'
      },
      {
        name: 'Configuración de Infraestructura de Sensores',
        description: 'Desplegar red de sensores IoT en 10 puntos de la ciudad',
        activity_type: 'Implementación',
        start_date: new Date('2024-03-10'),
        end_date: new Date('2024-06-30'),
        id_project: projects[5]._id,
        id_responsible: researchers[8]._id,
        status: 'In Progress'
      },
      {
        name: 'Desarrollo de Dashboard de Monitoreo',
        description: 'Crear panel de control para visualización de datos en tiempo real',
        activity_type: 'Desarrollo',
        start_date: new Date('2024-07-01'),
        end_date: new Date('2024-10-31'),
        id_project: projects[5]._id,
        id_responsible: researchers[8]._id,
        status: 'Pending'
      }
    ]);

    console.log(`   ✓ ${activities.length} actividades creadas`);

    // ========== 7. REUNIONES ==========
    console.log('🤝 Creando Reuniones...');

    const meetings = await Meeting.insertMany([
      {
        subject: 'Kickoff del Proyecto de Reconocimiento Facial',
        description: 'Reunión inicial para definir alcance, cronograma y responsabilidades',
        meeting_date: new Date('2024-01-15T09:00:00'),
        location: 'Sala de Juntas A - Centro Bogotá',
        id_project: projects[0]._id,
        participants: [researchers[0]._id, researchers[3]._id],
        status: 'Active'
      },
      {
        subject: 'Revisión Mensual de Avances - IA',
        description: 'Presentación de resultados del entrenamiento del modelo',
        meeting_date: new Date('2024-04-15T14:00:00'),
        location: 'Virtual - Google Meet',
        id_project: projects[0]._id,
        participants: [researchers[3]._id],
        status: 'Active'
      },
      {
        subject: 'Sesión de Trabajo - Semillero IA',
        description: 'Taller práctico sobre redes neuronales convolucionales',
        meeting_date: new Date('2024-05-20T15:00:00'),
        location: 'Laboratorio de Cómputo 3',
        id_seedbed: seedbeds[0]._id,
        participants: [researchers[3]._id],
        status: 'Active'
      },
      {
        subject: 'Presentación de Resultados - Biomateriales',
        description: 'Exposición de hallazgos en caracterización de residuos',
        meeting_date: new Date('2024-04-30T10:00:00'),
        location: 'Auditorio Principal',
        id_project: projects[1]._id,
        participants: [researchers[1]._id, researchers[4]._id],
        status: 'Active'
      },
      {
        subject: 'Comité Técnico - Energías Renovables',
        description: 'Evaluación de viabilidad técnica del prototipo',
        meeting_date: new Date('2024-05-10T11:00:00'),
        location: 'Sala de Reuniones 205',
        id_project: projects[2]._id,
        participants: [researchers[5]._id],
        status: 'Active'
      },
      {
        subject: 'Sprint Planning - Plataforma E-Learning',
        description: 'Planificación del sprint 3 - Módulo de gamificación',
        meeting_date: new Date('2024-05-05T09:00:00'),
        location: 'Sala de Desarrollo Ágil',
        id_project: projects[3]._id,
        participants: [researchers[6]._id],
        status: 'Active'
      },
      {
        subject: 'Encuentro Mensual - Semillero IoT',
        description: 'Presentación de proyectos individuales de los miembros',
        meeting_date: new Date('2024-05-25T16:00:00'),
        location: 'Salón 302',
        id_seedbed: seedbeds[5]._id,
        participants: [researchers[8]._id],
        status: 'Active'
      }
    ]);

    console.log(`   ✓ ${meetings.length} reuniones creadas`);

    // ========== 8. PRODUCTOS ==========
    console.log('📦 Creando Productos de Investigación...');

    const products = await Product.insertMany([
      {
        name: 'Paper: Deep Learning for Facial Recognition in Low Light Conditions',
        description: 'Artículo científico sobre técnicas de reconocimiento facial en condiciones de baja iluminación',
        product_type: 'Artículo Científico',
        publication_date: new Date('2024-03-20'),
        url: 'https://doi.org/10.1234/example.facial.recognition.2024',
        id_project: projects[0]._id,
        authors: [researchers[3]._id],
        status: 'Active'
      },
      {
        name: 'Software: FaceGuard Security System',
        description: 'Sistema de control de acceso basado en reconocimiento facial',
        product_type: 'Software',
        publication_date: new Date('2024-08-15'),
        url: 'https://github.com/sena-research/faceguard',
        id_project: projects[0]._id,
        authors: [researchers[3]._id],
        status: 'Active'
      },
      {
        name: 'Patente: Biopolímero Biodegradable de Residuos de Caña',
        description: 'Patente de invención para proceso de fabricación de biopolímero',
        product_type: 'Patente',
        publication_date: new Date('2024-06-10'),
        url: 'https://patents.example.com/COL2024001',
        id_project: projects[1]._id,
        authors: [researchers[4]._id],
        status: 'Active'
      },
      {
        name: 'Prototipo: Panel Solar con Seguimiento Dual-Axis',
        description: 'Prototipo funcional de panel solar con seguimiento en dos ejes',
        product_type: 'Prototipo',
        publication_date: new Date('2024-07-01'),
        url: null,
        id_project: projects[2]._id,
        authors: [researchers[5]._id],
        status: 'Active'
      },
      {
        name: 'Aplicación Web: LearnPlay Platform',
        description: 'Plataforma e-learning con gamificación integrada',
        product_type: 'Software',
        publication_date: new Date('2024-09-15'),
        url: 'https://learnplay.sena.edu.co',
        id_project: projects[3]._id,
        authors: [researchers[6]._id],
        status: 'Active'
      },
      {
        name: 'Documento Técnico: Guía de Implementación de IDS/IPS',
        description: 'Documento técnico con mejores prácticas de implementación',
        product_type: 'Documento Técnico',
        publication_date: new Date('2024-08-01'),
        url: null,
        id_project: projects[4]._id,
        authors: [researchers[7]._id],
        status: 'Active'
      },
      {
        name: 'Dashboard: AirQuality Monitor',
        description: 'Sistema de visualización de datos de calidad del aire en tiempo real',
        product_type: 'Software',
        publication_date: new Date('2024-10-15'),
        url: 'https://airquality.sena.edu.co',
        id_project: projects[5]._id,
        authors: [researchers[8]._id],
        status: 'Active'
      },
      {
        name: 'Paper: Collaborative Robotics in Modern Manufacturing',
        description: 'Artículo sobre aplicaciones de robots colaborativos en manufactura',
        product_type: 'Artículo Científico',
        publication_date: new Date('2024-06-25'),
        url: 'https://doi.org/10.1234/example.cobot.manufacturing.2024',
        id_project: projects[7]._id,
        authors: [researchers[10]._id],
        status: 'Active'
      },
      {
        name: 'Prototipo: SmartCobot Assembler',
        description: 'Prototipo de robot colaborativo para ensamblaje industrial',
        product_type: 'Prototipo',
        publication_date: new Date('2024-09-30'),
        url: null,
        id_project: projects[7]._id,
        authors: [researchers[10]._id],
        status: 'Active'
      }
    ]);

    console.log(`   ✓ ${products.length} productos creados`);

    console.log('');
    console.log('🎉 ¡Seed completado exitosamente!');
    console.log('');
    console.log('📊 Resumen de datos creados:');
    console.log(`   - ${centers.length} Centros de Investigación`);
    console.log(`   - ${groups.length} Grupos de Investigación`);
    console.log(`   - ${researchers.length} Investigadores`);
    console.log(`   - ${projects.length} Proyectos`);
    console.log(`   - ${seedbeds.length} Semilleros`);
    console.log(`   - ${activities.length} Actividades`);
    console.log(`   - ${meetings.length} Reuniones`);
    console.log(`   - ${products.length} Productos`);
    console.log('');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Conexión a MongoDB cerrada');
    process.exit(0);
  }
};

// Ejecutar el seed
seedData();
