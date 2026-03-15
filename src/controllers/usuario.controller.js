const Usuario = require("../models/usuarios.model");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

//  Crear usuario
const createUsuario = async (req, res) => {
  try {
    const {
      nombre,
      email,
      password,
      documento_identidad,
      fecha_nacimiento,
      celular,
      rol,
    } = req.body;

    //  Verificar si ya existe email o DNI
    const existeUsuario = await Usuario.findOne({
      where: {
        email,
      },
    });

    if (existeUsuario) {
      return res.status(400).json({
        message: "El email ya está registrado",
      });
    }

    //  Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    //  Username será el DNI
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      username: documento_identidad, //  username = DNI
      password: hashedPassword,
      documento_identidad,
      fecha_nacimiento,
      celular,
      rol,
    });

    return res.status(201).json({
      message: "Usuario creado correctamente",
      usuario: nuevoUsuario,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear el usuario",
      error: error.message,
    });
  }
};

//  Obtener todos los usuarios
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ["password"] }, //  no devolver password
    });

    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener usuarios",
      error: error.message,
    });
  }
};

//  Obtener usuario por ID
const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el usuario",
      error: error.message,
    });
  }
};

//  Actualizar usuario
const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    // Si actualizan contraseña → encriptar
    if (req.body.password) {
      req.body.password = await bcrypt.hash(
        req.body.password,
        SALT_ROUNDS
      );
    }

    // Si actualizan DNI → actualizar username también
    if (req.body.documento_identidad) {
      req.body.username = req.body.documento_identidad;
    }

    await usuario.update(req.body);

    return res.status(200).json({
      message: "Usuario actualizado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
};

//  Eliminar usuario
const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    await usuario.destroy();

    return res.status(200).json({
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar usuario",
      error: error.message,
    });
  }
};

module.exports = {
  createUsuario,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
};