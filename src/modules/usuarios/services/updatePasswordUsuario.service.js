const bcrypt = require("bcrypt");
const db = require("../../../database/models");

const { Usuario } = db;

// ==========================================================
// ACTUALIZAR CONTRASEÑA
// ==========================================================
const updatePasswordUsuarioService = async ({
  id_usuario,
  password_actual,
  password_nuevo,
}) => {
  if (!id_usuario) {
    throw new Error(
      "El identificador del usuario es obligatorio."
    );
  }

  if (!password_actual) {
    throw new Error(
      "La contraseña actual es obligatoria."
    );
  }

  if (!password_nuevo) {
    throw new Error(
      "La nueva contraseña es obligatoria."
    );
  }

  if (password_nuevo.length < 6) {
    throw new Error(
      "La nueva contraseña debe tener al menos 6 caracteres."
    );
  }

  // ========================================================
  // BUSCAR USUARIO
  // ========================================================
  const usuario = await Usuario.findOne({
    where: {
      id_usuario,
      estado: true,
    },

    attributes: [
      "id_usuario",
      "password",
      "estado",
    ],
  });

  if (!usuario) {
    throw new Error(
      "El usuario no existe o se encuentra inactivo."
    );
  }

  // ========================================================
  // VALIDAR CONTRASEÑA ACTUAL
  // ========================================================
  const passwordActualCorrecto =
    await bcrypt.compare(
      password_actual,
      usuario.password
    );

  if (!passwordActualCorrecto) {
    throw new Error(
      "La contraseña actual es incorrecta."
    );
  }

  // ========================================================
  // EVITAR USAR LA MISMA CONTRASEÑA
  // ========================================================
  const mismaPassword =
    await bcrypt.compare(
      password_nuevo,
      usuario.password
    );

  if (mismaPassword) {
    throw new Error(
      "La nueva contraseña debe ser diferente a la actual."
    );
  }

  // ========================================================
  // ENCRIPTAR NUEVA CONTRASEÑA
  // ========================================================
  const saltRounds = 12;

  const passwordHash =
    await bcrypt.hash(
      password_nuevo,
      saltRounds
    );

  // ========================================================
  // ACTUALIZAR
  // ========================================================
  await usuario.update({
    password: passwordHash,
  });

  return {
    id_usuario: Number(
      usuario.id_usuario
    ),
  };
};

module.exports = updatePasswordUsuarioService;