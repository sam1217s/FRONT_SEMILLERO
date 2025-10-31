import researcherModels from '../models/researcher.model.js';
import { generateJWT } from '../helpers/generateJWT.helper.js';
import {
    hashPassword,
    comparePassword,
    formatName,
    formatEmail,
    formatContractType,
    formatRole,
    determinePrimaryRole,
    hasActiveRole,
    createRole,
    prepareUpdateData,
    buildResearcherFilter
} from '../helpers/researcher.helper.js';
import { buildPagination, formatPaginatedResponse } from '../helpers/common.helper.js';
import logAction from '../middlewares/log.middleware.js';

const researcherCtrl = {};


// LOGIN DE INVESTIGADOR
researcherCtrl.loginResearcher = async (req, res) => {
  try {
    const { document_number, password } = req.body;
    if (!document_number || !password)
      return res.status(400).json({ msg: "Documento y contraseña son obligatorios" });

    const researcher = await researcherModels.findOne({ document_number }).select("+password");
    if (!researcher)
      return res.status(400).json({ msg: "Credenciales inválidas" });

    if (researcher.status === 1)
      return res.status(403).json({ msg: "Usuario inactivo" });

    if (!comparePassword(password, researcher.password))
      return res.status(401).json({ msg: "Contraseña incorrecta" });

    const role = determinePrimaryRole(researcher.roles);
    const token = await generateJWT(researcher._id, role);

    res.status(200).json({
      msg: "Login exitoso",
      researcher: {
        id: researcher._id,
        name: researcher.name,
        email: researcher.email,
        document_number: researcher.document_number,
        role,
      },
      token,
    });
  } catch (err) {
    console.error("❌ loginResearcher:", err.message);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};


// LISTAR INVESTIGADORES
researcherCtrl.listResearchers = async (req, res) => {
    try {
        const filter = buildResearcherFilter(req.query);
        const { skip, limit, page } = buildPagination(req.query.page, req.query.limit);

        // 🔹 Filtrar por centro de formación según el rol
        // SUPER puede ver todos
        // ADMIN, LIDER, INVESTIGADOR solo ven su centro
        if (req.role !== 'SUPER') {
            // Obtener el centro de formación del usuario actual
            const currentUser = await researcherModels.findById(req.userId).select('id_training_center');

            if (currentUser && currentUser.id_training_center) {
                filter.id_training_center = currentUser.id_training_center;
            } else {
                // Si no tiene centro asignado, no puede ver nada
                return res.status(200).json(formatPaginatedResponse([], 0, page, limit));
            }
        }

        // Consulta optimizada con paginación
        const [researchers, total] = await Promise.all([
            researcherModels
                .find(filter)
                .populate('id_training_center', 'name code city') // Incluir info del centro
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            researcherModels.countDocuments(filter)
        ]);

        const response = formatPaginatedResponse(researchers, total, page, limit);
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// OBTENER INVESTIGADOR POR ID
researcherCtrl.getResearcherById = async (req, res) => {
    try {
        const { id } = req.params;

        const researcher = await researcherModels
            .findById(id)
            .select('-password');

        if (!researcher) {
            return res.status(404).json({ msg: 'Investigador no encontrado' });
        }

        res.status(200).json({ msg: researcher });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// CREAR INVESTIGADOR (versión segura)
researcherCtrl.saveResearcher = async (req, res) => {
  try {
    const data = req.body;

    // 🔹 Validaciones básicas
    if (!data.name || !data.document_type || !data.document_number || !data.email || !data.password || !data.entry_date) {
      return res.status(400).json({ msg: "Faltan campos obligatorios" });
    }

    // 🔹 Normalización segura
    const name = typeof data.name === "string" ? formatName(data.name) : "";
    const document_type = typeof data.document_type === "string" ? data.document_type.trim().toUpperCase() : "CC";
    const email = typeof data.email === "string" ? formatEmail(data.email) : "";
    const contract_type = typeof data.contract_type === "string"
      ? formatContractType(data.contract_type)
      : "contrato";

    // 🔹 Encriptar contraseña
    const hashedPassword = hashPassword(data.password);

    // 🔹 Validar y crear roles
    const validRoles = ["SUPER", "ADMIN", "LIDER", "INVESTIGADOR"];
    let researcherRoles = [createRole("INVESTIGADOR", new Date())];

    if (Array.isArray(data.roles) && data.roles.length > 0) {
      researcherRoles = data.roles.map((r) => {
        const roleName = typeof r === "string" ? r : r.role;
        const roleUpper = formatRole(roleName);
        if (!validRoles.includes(roleUpper)) throw new Error(`Rol inválido: ${roleName}`);
        return createRole(roleUpper, r.start_date || new Date(), r.end_date || null);
      });
    }

    // 🔹 Determinar rol principal
    const primaryRole = researcherRoles[0].role;

    // 🔹 Validar centro de formación para roles que no son SUPER
    if (primaryRole !== 'SUPER' && !data.id_training_center) {
      return res.status(400).json({
        msg: 'El campo id_training_center es obligatorio para roles ADMIN, LIDER e INVESTIGADOR'
      });
    }

    // 🔹 Crear modelo
    const researcher = new researcherModels({
      name,
      document_type, // ✅ ahora sí coincide con el enum del schema
      document_number: String(data.document_number),
      email,
      phone: data.phone || "",
      password: hashedPassword,
      academic_formation: formatName(data.academic_formation),
      knowledge_area: formatName(data.knowledge_area),
      contract_number: data.contract_number || "N/A",
      contract_type, // ✅ siempre minúscula ('planta' o 'contrato')
      contract_start_date: data.contract_start_date || new Date(),
      contract_end_date: data.contract_end_date || null,
      entry_date: data.entry_date || new Date(),
      id_training_center: primaryRole !== 'SUPER' ? data.id_training_center : null, // Solo si no es SUPER
      role: primaryRole,
      roles: researcherRoles,
    });

    await researcher.save();

    await logAction(
      {
        action: "CREATE",
        affected_table: "RESEARCHERS",
        module: "RESEARCHERS",
        affected_record_id: researcher._id,
        new_data: { ...researcher.toObject(), password: "***" },
        level: "INFO",
        description: "Investigador creado",
      },
      req.headers["x-token"],
      req
    );

    res.status(201).json({ msg: "Investigador creado correctamente" });
  } catch (error) {
    console.error("❌ Error en saveResearcher:", error);

    if (error.code === 11000) {
      return res.status(400).json({ msg: "El documento o email ya está registrado" });
    }
    if (error.message?.includes("Rol inválido")) {
      return res.status(400).json({ msg: error.message });
    }

    res.status(500).json({ msg: "Error en el servidor" });
  }
};


// ACTUALIZAR INVESTIGADOR
researcherCtrl.updateResearcher = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            email,
            phone,
            academic_formation,
            knowledge_area,
            contract_number,
            contract_type,
            contract_start_date,
            contract_end_date,
            status // posíblemente undefined
        } = req.body;

        const previousData = await researcherModels.findById(id).lean();

        const updateData = {
            name: formatName(name),
            email: formatEmail(email),
            phone,
            academic_formation: formatName(academic_formation),
            knowledge_area: formatName(knowledge_area),
            contract_number,
            contract_type: formatContractType(contract_type),
            contract_start_date,
            contract_end_date
        };

        // Permitir actualizar status sólo si es ADMIN o SUPER
        if ((req.role === 'ADMIN' || req.role === 'SUPER') && (status === 0 || status === 1)) {
            updateData.status = status;
        }

        const cleanedUpdateData = prepareUpdateData(updateData);
        console.log('🟣 Datos enviados al update investigador:', cleanedUpdateData);
        await researcherModels.findByIdAndUpdate(id, cleanedUpdateData, { runValidators: true });

        await logAction(
            {
                action: 'UPDATE',
                affected_table: 'RESEARCHERS',
                module: 'RESEARCHERS',
                affected_record_id: id,
                previous_data: previousData,
                new_data: cleanedUpdateData,
                level: 'INFO',
                description: 'Investigador actualizado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Investigador actualizado correctamente' });
    } catch (error) {
        console.error(error.stack || error);
        // Manejo explícito de duplicados en email/document_number
        if (error.code === 11000) {
            return res.status(400).json({
                msg: 'El documento o email ya está registrado'
            });
        }
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// AGREGAR ROL A INVESTIGADOR
researcherCtrl.addRoleToResearcher = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, start_date, end_date } = req.body;

        const researcher = await researcherModels.findById(id);

        if (!researcher) {
            return res.status(404).json({ msg: 'Investigador no encontrado' });
        }

        researcher.roles.push(createRole(role, start_date, end_date));

        await researcher.save();

        await logAction(
            {
                action: 'ADD_ROLE',
                affected_table: 'RESEARCHERS',
                module: 'RESEARCHERS',
                affected_record_id: id,
                new_data: { role, start_date, end_date },
                level: 'INFO',
                description: 'Rol agregado a investigador'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Rol agregado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};


// CREAR LÍDER DE SEMILLERO
researcherCtrl.createSeedbedLeader = async (req, res) => {
    try {
        const {
            name,
            document_type,
            document_number,
            email,
            phone,
            password,
            academic_formation,
            knowledge_area,
            contract_number,
            contract_type,
            contract_start_date,
            contract_end_date,
            entry_date,
            id_seedbed
        } = req.body;

        // Encriptar contraseña
        const hashedPassword = hashPassword(password);

        const researcher = new researcherModels({
            name: formatName(name),
            document_type: formatName(document_type),
            document_number,
            email: formatEmail(email),
            phone,
            password: hashedPassword,
            academic_formation: formatName(academic_formation),
            knowledge_area: formatName(knowledge_area),
            contract_number,
            contract_type: formatContractType(contract_type) || 'Contrato',
            contract_start_date,
            contract_end_date,
            entry_date,
            role: 'LIDER', // ✅ Campo requerido: rol actual activo
            roles: [createRole('LIDER', new Date())]
        });

        await researcher.save();

        await logAction(
            {
                action: 'CREATE_LEADER',
                affected_table: 'RESEARCHERS',
                module: 'RESEARCHERS',
                affected_record_id: researcher._id,
                new_data: { ...researcher.toObject(), password: '***' },
                level: 'INFO',
                description: 'Líder de semillero creado'
            },
            req.headers['x-token'],
            req
        );

        res.status(201).json({ 
            msg: 'Líder de semillero creado correctamente',
            researcher_id: researcher._id
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({
                msg: 'El documento o email ya está registrado'
            });
        }
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// CREAR ADMINISTRADOR
researcherCtrl.createAdministrator = async (req, res) => {
    try {
        const {
            name,
            document_type,
            document_number,
            email,
            phone,
            password,
            academic_formation,
            knowledge_area,
            contract_number,
            contract_type,
            contract_start_date,
            contract_end_date,
            entry_date
        } = req.body;

        // Encriptar contraseña
        const hashedPassword = hashPassword(password);

        const researcher = new researcherModels({
            name: formatName(name),
            document_type: formatName(document_type),
            document_number,
            email: formatEmail(email),
            phone,
            password: hashedPassword,
            academic_formation: formatName(academic_formation),
            knowledge_area: formatName(knowledge_area),
            contract_number,
            contract_type: formatContractType(contract_type) || 'Planta',
            contract_start_date,
            contract_end_date,
            entry_date,
            role: 'ADMIN', // ✅ Campo requerido: rol actual activo
            roles: [createRole('ADMIN', new Date())]
        });

        await researcher.save();

        await logAction(
            {
                action: 'CREATE_ADMIN',
                affected_table: 'RESEARCHERS',
                module: 'RESEARCHERS',
                affected_record_id: researcher._id,
                new_data: { ...researcher.toObject(), password: '***' },
                level: 'INFO',
                description: 'Administrador creado'
            },
            req.headers['x-token'],
            req
        );

        res.status(201).json({ 
            msg: 'Administrador creado correctamente',
            researcher_id: researcher._id
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({
                msg: 'El documento o email ya está registrado'
            });
        }
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// CREAR SUPER ADMINISTRADOR
researcherCtrl.createSuper = async (req, res) => {
    try {
        const {
            name,
            document_type,
            document_number,
            email,
            phone,
            password,
            academic_formation,
            knowledge_area,
            contract_number,
            contract_type,
            contract_start_date,
            contract_end_date,
            entry_date
        } = req.body;

        // Encriptar contraseña
        const hashedPassword = hashPassword(password);

        const researcher = new researcherModels({
            name: formatName(name),
            document_type: formatName(document_type),
            document_number,
            email: formatEmail(email),
            phone,
            password: hashedPassword,
            academic_formation: formatName(academic_formation),
            knowledge_area: formatName(knowledge_area),
            contract_number,
            contract_type: formatContractType(contract_type) || 'Planta',
            contract_start_date,
            contract_end_date,
            entry_date,
            role: 'SUPER', // ✅ Campo requerido: rol actual activo
            roles: [createRole('SUPER', new Date())]
        });

        await researcher.save();

        await logAction(
            {
                action: 'CREATE_SUPER',
                affected_table: 'RESEARCHERS',
                module: 'RESEARCHERS',
                affected_record_id: researcher._id,
                new_data: { ...researcher.toObject(), password: '***' },
                level: 'INFO',
                description: 'Super administrador creado'
            },
            req.headers['x-token'],
            req
        );

        res.status(201).json({ 
            msg: 'Super administrador creado correctamente',
            researcher_id: researcher._id
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({
                msg: 'El documento o email ya está registrado'
            });
        }
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ASIGNAR ROL DE LÍDER
researcherCtrl.assignLeaderRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { start_date, end_date } = req.body;

        const researcher = await researcherModels.findById(id);

        if (!researcher) {
            return res.status(404).json({ msg: 'Investigador no encontrado' });
        }

        // Verificar si ya es líder
        const isAlreadyLeader = researcher.roles.some(r => r.role === 'LIDER' && r.active);

        if (isAlreadyLeader) {
            return res.status(400).json({
                msg: 'El investigador ya tiene el rol de líder'
            });
        }

        researcher.roles.push({
            role: 'LIDER',
            start_date: start_date || new Date(),
            end_date,
            active: true
        });

        await researcher.save();

        await logAction(
            {
                action: 'ASSIGN_LEADER',
                affected_table: 'RESEARCHERS',
                module: 'RESEARCHERS',
                affected_record_id: id,
                new_data: { role: 'LIDER', start_date, end_date },
                level: 'INFO',
                description: 'Rol de líder asignado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Rol de líder asignado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// DESACTIVAR ROL
researcherCtrl.deactivateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const researcher = await researcherModels.findById(id);

        if (!researcher) {
            return res.status(404).json({ msg: 'Investigador no encontrado' });
        }

        const roleIndex = researcher.roles.findIndex(r => r.role === role.toUpperCase() && r.active);

        if (roleIndex === -1) {
            return res.status(404).json({ msg: 'Rol no encontrado o ya está inactivo' });
        }

        researcher.roles[roleIndex].active = false;
        researcher.roles[roleIndex].end_date = new Date();

        await researcher.save();

        await logAction(
            {
                action: 'DEACTIVATE_ROLE',
                affected_table: 'RESEARCHERS',
                module: 'RESEARCHERS',
                affected_record_id: id,
                new_data: { role, end_date: new Date() },
                level: 'INFO',
                description: 'Rol desactivado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Rol desactivado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// AGREGAR INVESTIGADOR A GRUPO
researcherCtrl.addResearcherToGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_group, incorporation_date } = req.body;

        const researcher = await researcherModels.findById(id);

        if (!researcher) {
            return res.status(404).json({ msg: 'Investigador no encontrado' });
        }

        // Verificar si ya está en el grupo usando el modelo de relación
        const ResearcherHasGroup = (await import('../models/researcher_has_group.model.js')).default;
        const existingRelation = await ResearcherHasGroup.findOne({
            id_researcher: id,
            id_group: id_group
        });

        if (existingRelation) {
            return res.status(400).json({
                msg: 'El investigador ya pertenece a este grupo'
            });
        }

        // Crear la relación en la tabla intermedia
        const newRelation = new ResearcherHasGroup({
            id_researcher: id,
            id_group: id_group,
            incorporation_date: incorporation_date
        });

        await newRelation.save();

        await logAction(
            {
                action: 'ADD_TO_GROUP',
                affected_table: 'RESEARCHERS',
                module: 'RESEARCHERS',
                affected_record_id: id,
                new_data: { id_group, incorporation_date },
                level: 'INFO',
                description: 'Investigador agregado a grupo'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Investigador agregado al grupo correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ACTIVAR INVESTIGADOR
researcherCtrl.activeResearcher = async (req, res) => {
    try {
        const { id } = req.params;
        await researcherModels.findByIdAndUpdate(id, { status: 0 });
        await logAction(
            {
                action: 'ACTIVATE',
                affected_table: 'RESEARCHERS',
                module: 'RESEARCHERS',
                affected_record_id: id,
                level: 'INFO',
                description: 'Investigador activado'
            },
            req.headers['x-token'],
            req
        );
        res.status(200).json({ msg: 'Investigador activado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// DESACTIVAR INVESTIGADOR
researcherCtrl.inactiveResearcher = async (req, res) => {
    try {
        const { id } = req.params;
        await researcherModels.findByIdAndUpdate(id, { status: 1 });
        await logAction(
            {
                action: 'INACTIVATE',
                affected_table: 'RESEARCHERS',
                module: 'RESEARCHERS',
                affected_record_id: id,
                level: 'INFO',
                description: 'Investigador desactivado'
            },
            req.headers['x-token'],
            req
        );
        res.status(200).json({ msg: 'Investigador desactivado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// ELIMINAR INVESTIGADOR
researcherCtrl.deleteResearcher = async (req, res) => {
    try {
        const { id } = req.params;

        await researcherModels.findByIdAndDelete(id);

        await logAction(
            {
                action: 'DELETE',
                affected_table: 'RESEARCHERS',
                module: 'RESEARCHERS',
                affected_record_id: id,
                level: 'WARNING',
                description: 'Investigador eliminado'
            },
            req.headers['x-token'],
            req
        );

        res.status(200).json({ msg: 'Investigador eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// LISTAR ADMINISTRADORES (solo para SUPER)
researcherCtrl.listAdmins = async (req, res) => {
    try {
        const { skip, limit, page } = buildPagination(req.query.page, req.query.limit);

        // Filtrar solo por rol ADMIN
        const filter = { role: 'ADMIN' };

        // Agregar filtros adicionales si vienen en query
        if (req.query.status !== undefined) {
            filter.status = parseInt(req.query.status);
        }
        if (req.query.id_training_center) {
            filter.id_training_center = req.query.id_training_center;
        }

        // Consulta optimizada con paginación
        const [admins, total] = await Promise.all([
            researcherModels
                .find(filter)
                .populate('id_training_center', 'name code city department') // Incluir info completa del centro
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            researcherModels.countDocuments(filter)
        ]);

        const response = formatPaginatedResponse(admins, total, page, limit);
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export { researcherCtrl };
