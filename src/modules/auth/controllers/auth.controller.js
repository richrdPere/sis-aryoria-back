const authService = require("../services/auth.service");
const registerService = require("../services/register.service");

/**
 * POST /auth/register
 */
const register = async (req, res, next) => {

  try {

    const usuario = await registerService.register(req.body);

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

/**
 * POST /auth/login
 */
const login = async (req, res, next) => {

  try {

    const result = await authService.login(req.body);

    return res.status(200).json({
      success: true,
      message: "Login exitoso.",
      data: result
    });

  } catch (error) {
    next(error);
  }

};

/**
 * GET /auth/me
 */
const me = async (req, res, next) => {

  try {

    const usuario = await authService.me(req.user.id_usuario);

    return res.status(200).json({
      success: true,
      data: usuario
    });

  } catch (error) {
    next(error);
  }

};

/**
 * GET /auth/:id
 */
const getById = async (req, res, next) => {

  try {

    const { id } = req.params;

    const usuario = await authService.getById(id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado."
      });
    }

    return res.status(200).json({
      success: true,
      data: usuario
    });

  } catch (error) {
    next(error);
  }

};

module.exports = {
  register,
  login,
  me,
  getById
};