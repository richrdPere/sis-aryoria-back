const Joi = require("joi");

const registerSchema = Joi.object({

    persona: Joi.object({
        nombres: Joi.string().min(2).max(100).required(),
        apellidos: Joi.string().min(2).max(100).required(),
        numero_documento: Joi.string().min(6).max(20).required(),
        tipo_documento: Joi.string()
            .valid("DNI", "RUC", "CE", "PASAPORTE")
            .default("DNI"),
        email: Joi.string().email().optional(),
        celular: Joi.string().min(6).max(20).optional(),
        direccion: Joi.string().max(255).optional(),
        genero: Joi.string().valid("M", "F", "OTRO").optional(),
        fecha_nacimiento: Joi.date().optional()
    }).required(),

    usuario: Joi.object({
        username: Joi.string().alphanum().min(4).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        rol: Joi.string().valid(
            "SUPER_ADMIN",
            "ADMIN",
            "EMPLEADO",
            "CONTADOR"
        ).default("ADMIN")
    }).required(),

    roles: Joi.array()
        .items(Joi.string())
        .optional()

});

// Validador
const validateRegister = (req, res, next) => {

    const { error } = registerSchema.validate(req.body, {
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

module.exports = validateRegister;