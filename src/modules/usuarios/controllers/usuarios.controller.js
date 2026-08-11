const {
  getPerfilUsuarioService,
  updateFotoUsuarioService,
  updatePasswordUsuarioService,
  updatePerfilUsuarioService,
} = require("../services");

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");


/*
|--------------------------------------------------------------------------
| 1. Obtener usuario - perfil
|--------------------------------------------------------------------------
*/
const getPerfilUsuarioController = async (req, res) => {
  try {
    const id_usuario =
      req.usuario?.id_usuario ??
      req.usuario?.id;

    if (!id_usuario) {
      return res.status(401).json({
        success: false,
        message:
          "No se pudo identificar al usuario autenticado.",
      });
    }

    const perfil =
      await getPerfilUsuarioService({ id_usuario, });

    return res.status(200).json({
      success: true,
      message: "Perfil del usuario obtenido correctamente.",
      data: perfil,
    });
  } catch (error) {
    console.error("Error al obtener perfil de usuario:", error);

    return res.status(500).json({
      success: false,
      message: "No se pudo obtener el perfil del usuario.",
      error: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| 2. Actualizar usuario - perfil
|--------------------------------------------------------------------------
*/
const updatePerfilUsuarioController = async (req, res) => {
  try {
    const id_usuario =
      req.usuario?.id_usuario ??
      req.usuario?.id;

    if (!id_usuario) {
      return res.status(401).json({
        success: false,
        message:
          "No se pudo identificar al usuario autenticado.",
      });
    }

    const perfil =
      await updatePerfilUsuarioService({ id_usuario, payload: req.body, });

    return res.status(200).json({
      success: true,
      message: "Perfil actualizado correctamente.",
      data: perfil,
    });
  } catch (error) {
    console.error(
      "Error al actualizar perfil:",
      error
    );

    // ========================================================
    // ERRORES DE VALIDACIÓN / NEGOCIO
    // ========================================================
    const validationMessages = [
      "El correo electrónico ya está registrado",
      "El nombre de usuario ya está registrado",
      "El número de documento ya está registrado",
      "El usuario no existe",
      "No se encontró la información personal",
    ];

    const isValidationError =
      validationMessages.some(
        (message) =>
          error.message.includes(message)
      );

    return res
      .status(
        isValidationError ? 400 : 500
      )
      .json({
        success: false,
        message: isValidationError
          ? error.message
          : "No se pudo actualizar el perfil.",
        error: error.message,
      });
  }
};
/*
|--------------------------------------------------------------------------
| 3. Actualizar contraseña - perfil
|--------------------------------------------------------------------------
*/
const updatePasswordUsuarioController = async (req, res) => {
  try {
    const id_usuario =
      req.usuario?.id_usuario ??
      req.usuario?.id;

    if (!id_usuario) {
      return res.status(401).json({
        success: false,
        message:
          "No se pudo identificar al usuario autenticado.",
      });
    }

    const {
      password_actual,
      password_nuevo,
    } = req.body;

    const result =
      await updatePasswordUsuarioService({
        id_usuario,
        password_actual,
        password_nuevo,
      });

    return res.status(200).json({
      success: true,
      message: "Contraseña actualizada correctamente.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Error al actualizar contraseña:",
      error
    );

    const validationMessages = [
      "La contraseña actual es obligatoria.",
      "La nueva contraseña es obligatoria.",
      "La nueva contraseña debe tener al menos 6 caracteres.",
      "La contraseña actual es incorrecta.",
      "La nueva contraseña debe ser diferente a la actual.",
      "El usuario no existe o se encuentra inactivo.",
    ];

    const isValidationError =
      validationMessages.some(
        (message) =>
          error.message.includes(message)
      );

    return res
      .status(
        isValidationError ? 400 : 500
      )
      .json({
        success: false,
        message: isValidationError
          ? error.message
          : "No se pudo actualizar la contraseña.",
        error: error.message,
      });
  }
};
/*
|--------------------------------------------------------------------------
| 4. Actualizar foto del usuario - perfil
|--------------------------------------------------------------------------
*/
const updateFotoUsuarioController = async (req, res) => {

  let nuevaFotoPath = null;

  try {
    // ========================================================
    // USUARIO AUTENTICADO
    // ========================================================
    const id_usuario =
      req.usuario?.id_usuario ??
      req.usuario?.id;

    if (!id_usuario) {
      return res.status(401).json({
        success: false,
        message:
          "No se pudo identificar al usuario autenticado.",
      });
    }

    // ========================================================
    // ARCHIVO
    // ========================================================
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Debes seleccionar una imagen.",
      });
    }

    // ========================================================
    // DIRECTORIO
    // ========================================================
    const uploadsRoot =
      process.env.UPLOADS_DIR ||
      path.join(
        process.cwd(),
        "uploads"
      );

    const perfilDir = path.join(
      uploadsRoot,
      "perfiles"
    );

    await fs.promises.mkdir(
      perfilDir,
      {
        recursive: true,
      }
    );

    // ========================================================
    // NOMBRE SEGURO Y ÚNICO
    // ========================================================
    const uuid = crypto.randomUUID();

    const fileName = `perfil-${id_usuario}-${uuid}.webp`;

    nuevaFotoPath = path.join(
      perfilDir,
      fileName
    );

    // ========================================================
    // PROCESAR IMAGEN
    // ========================================================
    await sharp(req.file.buffer)
      .rotate()
      .resize({
        width: 600,
        height: 600,
        fit: "cover",
        withoutEnlargement: true,
      })
      .webp({
        quality: 82,
      })
      .toFile(
        nuevaFotoPath
      );

    // ========================================================
    // URL GUARDADA EN BD
    // ========================================================
    const fotoUrl =
      `/uploads/perfiles/${fileName}`;

    // ========================================================
    // ACTUALIZAR BD
    // ========================================================
    const result = await updateFotoUsuarioService({
      id_usuario,
      foto_url: fotoUrl,
    });

    // ========================================================
    // ELIMINAR FOTO ANTERIOR
    // ========================================================
    if (
      result.foto_anterior &&
      result.foto_anterior.startsWith(
        "/uploads/perfiles/"
      )
    ) {
      const oldFileName =
        path.basename(
          result.foto_anterior
        );

      const oldFilePath =
        path.join(
          perfilDir,
          oldFileName
        );

      if (
        oldFilePath !== nuevaFotoPath
      ) {
        try {
          await fs.promises.unlink(
            oldFilePath
          );
        } catch (error) {
          // Si ya no existe, no afecta
          // la actualización del perfil.
          if (
            error.code !== "ENOENT"
          ) {
            console.error(
              "No se pudo eliminar la foto anterior:",
              error
            );
          }
        }
      }
    }

    // ========================================================
    // RESPUESTA
    // ========================================================
    return res.status(200).json({
      success: true,
      message:
        "Foto de perfil actualizada correctamente.",
      data: {
        id_usuario:
          result.id_usuario,

        id_persona:
          result.id_persona,

        foto_url:
          result.foto_url,
      },
    });
  } catch (error) {
    console.error(
      "Error al actualizar foto de perfil:",
      error
    );

    // ========================================================
    // SI ALGO FALLÓ DESPUÉS DE CREAR EL ARCHIVO
    // ========================================================
    if (nuevaFotoPath) {
      try {
        await fs.promises.unlink(
          nuevaFotoPath
        );
      } catch (_) { }
    }

    return res.status(500).json({
      success: false,
      message: "No se pudo actualizar la foto de perfil.",
      error: error.message,
    });
  }
};


module.exports = {
  getPerfilUsuarioController,
  updateFotoUsuarioController,
  updatePasswordUsuarioController,
  updatePerfilUsuarioController,
}