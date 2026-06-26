const db = require("../../../database/models");

const {
    Usuario,
    Rol,
    UsuarioRol
} = db;

/**
 * Asignar roles a un usuario
 */
const assignRoles = async (id_usuario, roles = []) => {

    const usuario = await Usuario.findByPk(id_usuario);

    if (!usuario) {
        throw new Error("Usuario no encontrado.");
    }

    if (!usuario.estado) {
        throw new Error("El usuario está deshabilitado.");
    }

    const rolesDB = await Rol.findAll({
        where: {
            nombre: roles,
            estado: true
        }
    });

    if (rolesDB.length === 0) {
        throw new Error("No se encontraron roles válidos.");
    }

    const data = rolesDB.map((rol) => ({
        id_usuario,
        id_rol: rol.id_rol
    }));

    await UsuarioRol.bulkCreate(data);

    return {
        message: "Roles asignados correctamente."
    };
};

/**
 * Remover un rol específico de un usuario
 */
const removeRole = async (id_usuario, id_rol) => {

    const deleted = await UsuarioRol.destroy({
        where: {
            id_usuario,
            id_rol
        }
    });

    if (!deleted) {
        throw new Error("El usuario no tenía ese rol asignado.");
    }

    return {
        message: "Rol removido correctamente."
    };
};

/**
 * Reemplazar roles del usuario (sync total)
 */
const syncRoles = async (id_usuario, roles = []) => {

    const usuario = await Usuario.findByPk(id_usuario);

    if (!usuario) {
        throw new Error("Usuario no encontrado.");
    }

    const rolesDB = await Rol.findAll({
        where: {
            nombre: roles,
            estado: true
        }
    });

    const transaction = await db.sequelize.transaction();

    try {

        // eliminar roles actuales
        await UsuarioRol.destroy({
            where: { id_usuario },
            transaction
        });

        // insertar nuevos roles
        const data = rolesDB.map((rol) => ({
            id_usuario,
            id_rol: rol.id_rol
        }));

        await UsuarioRol.bulkCreate(data, { transaction });

        await transaction.commit();

        return {
            message: "Roles sincronizados correctamente."
        };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/**
 * Obtener roles de un usuario
 */
const getUserRoles = async (id_usuario) => {

    const usuario = await Usuario.findByPk(id_usuario, {
        include: [
            {
                model: Rol,
                as: "roles",
                through: {
                    attributes: []
                }
            }
        ]
    });

    if (!usuario) {
        throw new Error("Usuario no encontrado.");
    }

    return usuario.roles;
};

/**
 * Obtener todos los roles del sistema
 */
const getAllRoles = async () => {

    return await Rol.findAll({
        where: {
            estado: true
        },
        order: [["nombre", "ASC"]]
    });
};

module.exports = {
    assignRoles,
    removeRole,
    syncRoles,
    getUserRoles,
    getAllRoles
};