const Joi = require("joi");

const schema = Joi.object({
    currentPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required()
}).custom((value, helpers) => {

    if (value.currentPassword === value.newPassword) {
        return helpers.message("La nueva contraseña no puede ser igual a la actual");
    }
    return value;
});

// Validador
const validatePassword = (req, res, next) => {

    const { error } = schema.validate(req.body, {
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

module.exports = validatePassword;