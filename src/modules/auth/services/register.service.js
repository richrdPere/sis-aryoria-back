const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../../../database/models");

// Modelos
const {
  sequelize,
  Persona,
  Usuario,
  Roles,
  UsuarioRol
} = db;

// Services - Register
const register = async (data) => {

  const transaction = await sequelize.transaction();

  try {

    const {
      persona,
      usuario,
      roles = [],
    } = data;

    //--------------------------------------------------
    // Validaciones Persona
    //--------------------------------------------------

    const personaExistente = await Persona.findOne({
      where: {
        numero_documento: persona.numero_documento,
      },
      transaction,
    });

    if (personaExistente) {
      throw new Error("Ya existe una persona con ese documento.");
    }

    if (persona.email) {

      const emailPersona = await Persona.findOne({
        where: {
          email: persona.email,
        },
        transaction,
      });

      if (emailPersona) {
        throw new Error("El correo ya pertenece a otra persona.");
      }
    }

    //--------------------------------------------------
    // Validaciones Usuario
    //--------------------------------------------------

    const usuarioExistente = await Usuario.findOne({
      where: {
        username: usuario.username,
      },
      transaction,
    });

    if (usuarioExistente) {
      throw new Error("El nombre de usuario ya existe.");
    }

    const emailUsuario = await Usuario.findOne({
      where: {
        email: usuario.email,
      },
      transaction,
    });

    if (emailUsuario) {
      throw new Error("El correo del usuario ya existe.");
    }

    //--------------------------------------------------
    // Validar Roles
    //--------------------------------------------------

    let rolesDB = [];

    if (roles.length > 0) {

      rolesDB = await Roles.findAll({
        where: {
          nombre: roles,
          estado: true,
        },
        transaction,
      });

      if (rolesDB.length !== roles.length) {

        const encontrados = rolesDB.map(r => r.nombre);

        const faltantes = roles.filter(
          r => !encontrados.includes(r)
        );

        throw new Error(
          `Los siguientes roles no existen: ${faltantes.join(", ")}`
        );
      }

    }

    //--------------------------------------------------
    // Crear Persona
    //--------------------------------------------------

    const nuevaPersona = await Persona.create(
      persona,
      { transaction }
    );

    //--------------------------------------------------
    // Hash Password
    //--------------------------------------------------
    const passwordHash = await bcrypt.hash(
      usuario.password,
      10
    );

    //--------------------------------------------------
    // Crear Usuario
    //--------------------------------------------------
    const nuevoUsuario = await Usuario.create(
      {
        ...usuario,
        id_persona: nuevaPersona.id_persona,
        password: passwordHash,
      },
      {
        transaction,
      }
    );

    //--------------------------------------------------
    // Asignar Roles
    //--------------------------------------------------
    if (rolesDB.length > 0) {

      await UsuarioRol.bulkCreate(

        rolesDB.map((rol) => ({
          id_usuario: nuevoUsuario.id_usuario,
          id_rol: rol.id_rol,
        })),

        {
          transaction,
        }

      );

    }

    //--------------------------------------------------
    // Commit
    //--------------------------------------------------
    await transaction.commit();

    //--------------------------------------------------
    // Retornar Usuario
    //--------------------------------------------------
    return await Usuario.findByPk(
      nuevoUsuario.id_usuario,
      {
        attributes: {
          exclude: ["password"],
        },

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
            attributes: [
              "id_rol",
              "nombre",
              "descripcion",
              "estado",
            ],
          },
        ],
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