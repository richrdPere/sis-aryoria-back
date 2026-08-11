const { Op } = require("sequelize");
const db = require("../../../database/models");

const {
  sequelize,
  Usuario,
  Persona,
} = db;

// ==========================================================
// ACTUALIZAR PERFIL USUARIO
// ==========================================================
const updatePerfilUsuarioService = async ({
  id_usuario,
  payload,
}) => {
  if (!id_usuario) {
    throw new Error(
      "El identificador del usuario es obligatorio."
    );
  }

  if (!payload || typeof payload !== "object") {
    throw new Error(
      "Los datos del perfil son obligatorios."
    );
  }

  const {
    // Usuario
    email,
    username,

    // Persona
    nombres,
    apellidos,
    email_personal,
    tipo_documento,
    numero_documento,
    fecha_nacimiento,
    celular,
    direccion,
    genero,
  } = payload;

  const transaction = await sequelize.transaction();

  try {
    // ========================================================
    // BUSCAR USUARIO
    // ========================================================
    const usuario = await Usuario.findOne({
      where: {
        id_usuario,
      },
      include: [
        {
          model: Persona,
          as: "persona",
          required: true,
        },
      ],
      transaction,
    });

    if (!usuario) {
      throw new Error(
        "El usuario no existe."
      );
    }

    const persona = usuario.persona;

    if (!persona) {
      throw new Error(
        "No se encontró la información personal asociada al usuario."
      );
    }

    // ========================================================
    // VALIDAR EMAIL DE USUARIO
    // ========================================================
    if (
      email !== undefined &&
      email !== null &&
      email.trim() !== ""
    ) {
      const emailNormalizado =
        email.trim().toLowerCase();

      const usuarioEmailExistente =
        await Usuario.findOne({
          where: {
            email: emailNormalizado,
            id_usuario: {
              [Op.ne]: id_usuario,
            },
          },
          transaction,
        });

      if (usuarioEmailExistente) {
        throw new Error(
          "El correo electrónico ya está registrado por otro usuario."
        );
      }
    }

    // ========================================================
    // VALIDAR USERNAME
    // ========================================================
    if (
      username !== undefined &&
      username !== null &&
      username.trim() !== ""
    ) {
      const usernameNormalizado =
        username.trim();

      const usuarioUsernameExistente =
        await Usuario.findOne({
          where: {
            username: usernameNormalizado,
            id_usuario: {
              [Op.ne]: id_usuario,
            },
          },
          transaction,
        });

      if (usuarioUsernameExistente) {
        throw new Error(
          "El nombre de usuario ya está registrado."
        );
      }
    }

    // ========================================================
    // VALIDAR DOCUMENTO
    // ========================================================
    if (
      numero_documento !== undefined &&
      numero_documento !== null &&
      numero_documento.trim() !== ""
    ) {
      const documentoNormalizado =
        numero_documento.trim();

      const personaDocumentoExistente =
        await Persona.findOne({
          where: {
            numero_documento:
              documentoNormalizado,
            id_persona: {
              [Op.ne]: persona.id_persona,
            },
          },
          transaction,
        });

      if (personaDocumentoExistente) {
        throw new Error(
          "El número de documento ya está registrado."
        );
      }
    }

    // ========================================================
    // ACTUALIZAR USUARIO
    // ========================================================
    const usuarioData = {};

    if (email !== undefined) {
      usuarioData.email =
        email?.trim().toLowerCase() || usuario.email;
    }

    if (username !== undefined) {
      usuarioData.username =
        username?.trim() || usuario.username;
    }

    if (
      Object.keys(usuarioData).length > 0
    ) {
      await usuario.update(
        usuarioData,
        {
          transaction,
        }
      );
    }

    // ========================================================
    // ACTUALIZAR PERSONA
    // ========================================================
    const personaData = {};

    if (nombres !== undefined) {
      personaData.nombres =
        nombres?.trim() || persona.nombres;
    }

    if (apellidos !== undefined) {
      personaData.apellidos =
        apellidos?.trim() || persona.apellidos;
    }

    if (email_personal !== undefined) {
      personaData.email =
        email_personal?.trim().toLowerCase() || null;
    }

    if (tipo_documento !== undefined) {
      personaData.tipo_documento =
        tipo_documento;
    }

    if (numero_documento !== undefined) {
      personaData.numero_documento =
        numero_documento?.trim() || null;
    }

    if (fecha_nacimiento !== undefined) {
      personaData.fecha_nacimiento =
        fecha_nacimiento || null;
    }

    if (celular !== undefined) {
      personaData.celular =
        celular?.trim() || null;
    }

    if (direccion !== undefined) {
      personaData.direccion =
        direccion?.trim() || null;
    }

    if (genero !== undefined) {
      personaData.genero =
        genero || null;
    }

    if (
      Object.keys(personaData).length > 0
    ) {
      await persona.update(
        personaData,
        {
          transaction,
        }
      );
    }

    // ========================================================
    // CONFIRMAR TRANSACCIÓN
    // ========================================================
    await transaction.commit();

    // ========================================================
    // DEVOLVER PERFIL ACTUALIZADO
    // ========================================================
    const usuarioActualizado =
      await Usuario.findOne({
        where: {
          id_usuario,
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
        ],
      });

    return {
      usuario: {
        id_usuario: Number(
          usuarioActualizado.id_usuario
        ),
        id_persona: Number(
          usuarioActualizado.id_persona
        ),
        email: usuarioActualizado.email,
        username: usuarioActualizado.username,
        estado: usuarioActualizado.estado,
        ultimo_acceso: usuarioActualizado.ultimo_acceso,
        created_at: usuarioActualizado.created_at,
        updated_at: usuarioActualizado.updated_at,
      },

      persona: {
        id_persona: Number(
          usuarioActualizado.persona.id_persona
        ),
        nombres: usuarioActualizado.persona.nombres,
        apellidos: usuarioActualizado.persona.apellidos,
        email: usuarioActualizado.persona.email,
        tipo_documento: usuarioActualizado.persona.tipo_documento,
        numero_documento: usuarioActualizado.persona.numero_documento,
        fecha_nacimiento: usuarioActualizado.persona.fecha_nacimiento,
        celular: usuarioActualizado.persona.celular,
        direccion: usuarioActualizado.persona.direccion,
        foto_url: usuarioActualizado.persona.foto_url,
        genero: usuarioActualizado.persona.genero,
        estado: usuarioActualizado.persona.estado,
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = updatePerfilUsuarioService;