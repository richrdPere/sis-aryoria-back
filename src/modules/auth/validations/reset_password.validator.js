const Joi = require("joi");

const schema = Joi.object({

  newPassword: Joi.string()
    .min(6)
    .required()

});

// Validator
const validateResetPassword = (req, res, next) => {

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

module.exports = validateResetPassword;