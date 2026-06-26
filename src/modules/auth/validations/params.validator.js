const Joi = require("joi");

const schema = Joi.object({

  id: Joi.number()
    .integer()
    .positive()
    .required()

});

// Validador
const validateIdParam = (req, res, next) => {

  const { error } = schema.validate(req.params);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "ID inválido",
      errors: error.details.map(e => e.message)
    });
  }

  next();
};

module.exports = validateIdParam;