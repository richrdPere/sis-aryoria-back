const db = require("../../../database/models");

const {
  Usuario,
  Persona,
} = db;

// ==========================================================
// ACTUALIZAR FOTO DE PERFIL
// ==========================================================
const updateFotoUsuarioService = async ({ id_usuario, foto_url, }) => {
  if (!id_usuario) {
    throw new Error(
      "El identificador del usuario es obligatorio."
    );
  }

  if (!foto_url) {
    throw new Error(
      "La URL de la fotografía es obligatoria."
    );
  }

  // ========================================================
  // BUSCAR USUARIO + PERSONA
  // ========================================================
  const usuario = await Usuario.findOne({
    where: {
      id_usuario,
      estado: true,
    },

    include: [
      {
        model: Persona,
        as: "persona",
        required: true,
      },
    ],
  });

  if (!usuario) {
    throw new Error(
      "El usuario no existe o se encuentra inactivo."
    );
  }

  if (!usuario.persona) {
    throw new Error(
      "No se encontró la persona asociada al usuario."
    );
  }
  const fotoAnterior =
    usuario.persona.foto_url;

  // ========================================================
  // ACTUALIZAR PERSONA
  // ========================================================
  await usuario.persona.update({
    foto_url,
  });

  return {
    id_usuario: Number(
      usuario.id_usuario
    ),
    id_persona: Number(
      usuario.persona.id_persona
    ),
    foto_url,
    foto_anterior: fotoAnterior,
  };
};

module.exports = updateFotoUsuarioService;