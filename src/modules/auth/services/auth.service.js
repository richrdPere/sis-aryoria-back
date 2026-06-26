const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../../../database/models");

// Modelos
const {
  sequelize,
  Persona,
  Usuario,
  Rol,
  UsuarioRol
} = db;

// 1. Services - Login
const login = async ({
  username,
  password
}) => {

  const usuario = await Usuario.findOne({

    where: {
      username
    },

    include: [
      {
        model: Persona,
        as: "persona"
      },
      {
        model: Rol,
        as: "roles",
        through: {
          attributes: []
        }
      }
    ]

  });

  if (!usuario) {
    throw new Error("Usuario o contraseña incorrectos.");
  }

  if (!usuario.estado) {
    throw new Error("El usuario está deshabilitado.");
  }

  const passwordCorrecto = await bcrypt.compare(
    password,
    usuario.password
  );

  if (!passwordCorrecto) {
    throw new Error("Usuario o contraseña incorrectos.");
  }

  usuario.ultimo_acceso = new Date();

  await usuario.save();

  const token = jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      username: usuario.username
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES || "8h"
    }
  );

  return {
    token,
    usuario
  };

};

// 2. Services - Perfil
const me = async (id_usuario) => {

  return await Usuario.findByPk(id_usuario, {

    attributes: {
      exclude: ["password"]
    },

    include: [
      {
        model: Persona,
        as: "persona"
      },
      {
        model: Rol,
        as: "roles",
        through: {
          attributes: []
        }
      }
    ]

  });

};

// 3. Services - Obtener usuario por ID
const getById = async (id_usuario) => {

  return await Usuario.findByPk(id_usuario, {

    attributes: {
      exclude: ["password"]
    },

    include: [
      {
        model: Persona,
        as: "persona"
      },
      {
        model: Rol,
        as: "roles",
        through: {
          attributes: []
        }
      }
    ]
  });
};

module.exports = {
  login,
  me,
  getById
};