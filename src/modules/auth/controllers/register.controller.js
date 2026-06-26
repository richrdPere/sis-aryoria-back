const authService = require("../services/auth.service");

/**
 * POST /auth/register
 */
const register = async (req, res, next) => {

    try {

        const usuario = await registerService.register(req.body);

        // Ocultar password antes de responder
        if (usuario?.dataValues) {
            delete usuario.dataValues.password;
        }

        return res.status(201).json({
            success: true,
            message: "Usuario registrado correctamente.",
            data: usuario
        });

    } catch (error) {
        next(error);
    }

};

module.exports = {
    register
};