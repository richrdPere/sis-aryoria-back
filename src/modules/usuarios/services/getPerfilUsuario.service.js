const db = require("../../../database/models");

const {
  Usuario,
  Persona,
  Roles,
} = db;

// ==========================================================
// GET PERFIL USUARIO
// ==========================================================
const getPerfilUsuarioService = async ({
  id_usuario,
}) => {
  if (!id_usuario) {
    throw new Error(
      "El identificador del usuario es obligatorio."
    );
  }

  const usuario = await Usuario.findOne({
    where: {
      id_usuario,
      estado: true,
    },

    attributes: [
      "id_usuario",
      "id_persona",
      "email",
      "username",
      "estado",
      "ultimo_acceso",
      "created_at",
      "updated_at",
    ],

    include: [
      // ======================================================
      // PERSONA
      // ======================================================
      {
        model: Persona,
        as: "persona",

        attributes: [
          "id_persona",
          "nombres",
          "apellidos",
          "email",
          "tipo_documento",
          "numero_documento",
          "fecha_nacimiento",
          "celular",
          "direccion",
          "foto_url",
          "genero",
          "estado",
        ],

        required: true,
      },

      // ======================================================
      // ROLES
      // ======================================================
      {
        model: Roles,
        as: "roles",

        attributes: [
          "id_rol",
          "nombre",
        ],

        through: {
          attributes: [],
        },

        required: false,
      },
    ],
  });

  if (!usuario) {
    throw new Error(
      "El usuario no existe o se encuentra inactivo."
    );
  }

  // ========================================================
  // RESPUESTA
  // ========================================================
  return {
    usuario: {
      id_usuario: Number(usuario.id_usuario),
      id_persona: Number(usuario.id_persona),
      email: usuario.email,
      username: usuario.username,
      estado: usuario.estado,
      ultimo_acceso: usuario.ultimo_acceso,
      created_at: usuario.created_at,
      updated_at: usuario.updated_at,
    },

    persona: {
      id_persona: Number(
        usuario.persona.id_persona
      ),
      nombres: usuario.persona.nombres,
      apellidos: usuario.persona.apellidos,
      email: usuario.persona.email,
      tipo_documento: usuario.persona.tipo_documento,
      numero_documento: usuario.persona.numero_documento,
      fecha_nacimiento: usuario.persona.fecha_nacimiento,
      celular: usuario.persona.celular,
      direccion: usuario.persona.direccion,
      foto_url: usuario.persona.foto_url,
      genero: usuario.persona.genero,
      estado: usuario.persona.estado,
    },

    roles: (usuario.roles ?? []).map(
      (rol) => ({
        id_rol: Number(rol.id_rol),
        nombre: rol.nombre,
      })
    ),
  };
};

module.exports = getPerfilUsuarioService;