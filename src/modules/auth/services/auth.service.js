const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../../database/models");

// Modelos
const Usuario = db.Usuario;

// Services - Login
const login = async ({
  email,
  password,
}) => {
  const usuario = await Usuario.findOne({
    where: {
      email,
    },

    include: [
      {
        model: Persona,
      },
    ],
  });

  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  const validPassword =
    await bcrypt.compare(
      password,
      usuario.password
    );

  if (!validPassword) {
    throw new Error("Contraseña incorrecta");
  }

  const token = jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      rol: usuario.rol,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d",
    }
  );

  return {
    usuario,
    token,
  };
};

module.exports = {
  login,
};