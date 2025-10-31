import jwt from 'jsonwebtoken';

const generateJWT = (uid, role = 'RESEARCHER') => {
    return new Promise((resolve, reject) => {
        const payload = { uid, role };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRATION || '48h'
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject('No se pudo generar el token');
                } else {
                    resolve(token);
                }
            }
        );
    });
};

export { generateJWT };
