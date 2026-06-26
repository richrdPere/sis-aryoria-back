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

// Services - Register
const register = async (data) => {

  const transaction = await sequelize.transaction();

  try {

    const {
      persona,
      usuario,
      roles = []
    } = data;

    // - Validaciones
    const personaExistente = await Persona.findOne({
      where: {
        numero_documento: persona.numero_documento
      },
      transaction
    });

    if (personaExistente) {
      throw new Error("Ya existe una persona con ese documento.");
    }

    const usuarioExistente = await Usuario.findOne({
      where: {
        username: usuario.username
      },
      transaction
    });

    if (usuarioExistente) {
      throw new Error("El nombre de usuario ya existe.");
    }

    const emailExistente = await Usuario.findOne({
      where: {
        email: usuario.email
      },
      transaction
    });

    if (emailExistente) {
      throw new Error("El correo del usuario ya existe.");
    }

    // ============================
    // Crear Persona
    // ============================
    const nuevaPersona = await Persona.create(
      persona,
      { transaction }
    );

    // - Hash Password
    const passwordHash = await bcrypt.hash(
      usuario.password,
      10
    );

    // ============================
    // Crear Usuario
    // ============================
    const nuevoUsuario = await Usuario.create({
      ...usuario,
      id_persona: nuevaPersona.id_persona,
      password: passwordHash
    }, {
      transaction
    });

    // ============================
    // Asignar Roles
    // ============================
    if (roles.length > 0) {

      const rolesDB = await Rol.findAll({
        where: {
          nombre: roles
        },
        transaction
      });

      const usuarioRoles = rolesDB.map(rol => ({
        id_usuario: nuevoUsuario.id_usuario,
        id_rol: rol.id_rol
      }));

      await UsuarioRol.bulkCreate(
        usuarioRoles,
        { transaction }
      );
    }

    await transaction.commit();

    return await Usuario.findByPk(
      nuevoUsuario.id_usuario,
      {
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
      }
    );

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};


module.exports = {
  register,
};