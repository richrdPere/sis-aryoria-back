const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../../database/models");

// Modelos
const Usuario = db.Usuario;
const Persona = db.Persona;

// Services - Register
const register = async (data) => {
  const persona =
    await Persona.create({
      nombres: data.nombres,
      apellidos: data.apellidos,
      tipo_documento:
        data.tipo_documento,
      numero_documento:
        data.numero_documento,
      celular: data.celular,
    });

  const hashedPassword =
    await bcrypt.hash(
      data.password,
      12
    );

  const usuario =
    await Usuario.create({
      id_persona:
        persona.id_persona,

      email: data.email,

      username:
        data.username,

      password:
        hashedPassword,

      rol: "ADMIN",
    });

  return usuario;
};


module.exports = {
  register,
};