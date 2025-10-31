import jwt from 'jsonwebtoken';
import researcherModels from '../models/researcher.model.js';

const webToken = {};

// Validar JWT genérico
webToken.validarJWT = (allowedRoles = []) => {
    return async (req, res, next) => {
        const token = req.header('x-token');

        if (!token) {
            return res.status(401).json({
                msg: 'No hay token en la petición'
            });
        }

        try {
            const { uid, role } = jwt.verify(token, process.env.JWT_SECRET);

            // Normalizar el rol antes de comparar
            const normalizedRole = role.toUpperCase();
            
            // Verificar si el rol del usuario está en los roles permitidos
            if (allowedRoles.length > 0 && !allowedRoles.includes(normalizedRole)) {
                return res.status(403).json({
                    msg: 'No tiene permisos para realizar esta acción'
                });
            }


            // Buscar el usuario en researchers
            const user = await researcherModels.findById(uid);

            if (!user) {
                return res.status(401).json({
                    msg: 'Token no válido - usuario no existe'
                });
            }

            if (user.status === 1) {
                return res.status(401).json({
                    msg: 'Token no válido - usuario inactivo'
                });
            }

            req.user = user;
            req.uid = uid;
            req.role = normalizedRole;
            next();

        } catch (error) {
            console.log(error);
            return res.status(401).json({
                msg: 'Token no válido'
            });
        }
    };
};

// Validar JWT específico para investigadores
webToken.validarResearcherJWT = async (req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        const researcher = await researcherModels.findById(uid);

        if (!researcher) {
            return res.status(401).json({
                msg: 'Token no válido - investigador no existe'
            });
        }

        if (researcher.status === 1) {
            return res.status(401).json({
                msg: 'Token no válido - investigador inactivo'
            });
        }

        req.researcher = researcher;
        req.researcherId = uid;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Token no válido'
        });
    }
};

export default webToken;
