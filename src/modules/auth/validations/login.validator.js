const Joi = require("joi");

const loginSchema = Joi.object({

    username: Joi.string()
        .alphanum()
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.base": "Username debe ser texto",
            "string.empty": "Username es obligatorio",
            "string.min": "Username mínimo 3 caracteres",
            "any.required": "Username es obligatorio"
        }),

    /* password */
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.empty": "Password es obligatorio",
            "string.min": "Password mínimo 6 caracteres",
            "any.required": "Password es obligatorio"
        })

});

// Validador
const validateLogin = (req, res, next) => {

    const { error } = loginSchema.validate(req.body, {
        abortEarly: false
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Errores de validación",
            errors: error.details.map(e => e.message)
        });
    }

    next();
};

module.exports = validateLogin;