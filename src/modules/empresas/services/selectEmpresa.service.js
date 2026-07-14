const jwt = require("jsonwebtoken");

const db = require("../../../database/models");

const {
  Empresa,
  Usuario,
  Persona,
  Roles,
} = db;

const selectEmpresa = async ({
  id_usuario,
  id_empresa,
}) => {

  //--------------------------------------------------
  // Verificar empresa
  //--------------------------------------------------
  const empresa = await Empresa.findOne({
    where: {
      id_empresa,
      id_usuario,
      estado: true,
    },
  });

  if (!empresa) {
    throw new Error(
      "La empresa no pertenece al usuario autenticado."
    );
  }

  //--------------------------------------------------
  // Obtener usuario completo
  //--------------------------------------------------
  const usuario = await Usuario.findByPk(id_usuario, {
    include: [
      {
        model: Persona,
        as: "persona",
      },
      {
        model: Roles,
        as: "roles",
        through: {
          attributes: [],
        },
      },
    ],
  });

  if (!usuario) {
    throw new Error("Usuario no encontrado.");
  }

  //--------------------------------------------------
  // Generar nuevo JWT
  //--------------------------------------------------
  const token = jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      username: usuario.username,
      id_empresa: empresa.id_empresa,
      roles: usuario.roles.map(r => r.nombre),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES || "7d",
    }
  );

  //--------------------------------------------------
  // Respuesta
  //--------------------------------------------------
  return {
    token,
    usuario,
    empresa,
  };

};

module.exports = selectEmpresa;