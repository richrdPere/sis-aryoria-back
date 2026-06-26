const roleService = require("../services/role.service");

/**
 * POST /roles/assign
 * Asignar uno o varios roles a un usuario
 */
const assignRoles = async (req, res, next) => {

    try {

        const { id_usuario, roles } = req.body;

        const result = await roleService.assignRoles(
            id_usuario,
            roles
        );

        return res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (error) {
        next(error);
    }

};

/**
 * DELETE /roles/remove
 * Remover un rol específico de un usuario
 */
const removeRole = async (req, res, next) => {

    try {

        const { id_usuario, id_rol } = req.body;

        const result = await roleService.removeRole(
            id_usuario,
            id_rol
        );

        return res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (error) {
        next(error);
    }

};

/**
 * PUT /roles/sync
 * Reemplazar todos los roles de un usuario
 */
const syncRoles = async (req, res, next) => {

    try {

        const { id_usuario, roles } = req.body;

        const result = await roleService.syncRoles(
            id_usuario,
            roles
        );

        return res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (error) {
        next(error);
    }

};

/**
 * GET /roles/user/:id_usuario
 * Obtener los roles de un usuario
 */
const getUserRoles = async (req, res, next) => {

    try {

        const { id_usuario } = req.params;

        const roles = await roleService.getUserRoles(
            id_usuario
        );

        return res.status(200).json({
            success: true,
            data: roles
        });

    } catch (error) {
        next(error);
    }

};

/**
 * GET /roles
 * Obtener todos los roles del sistema
 */
const getAllRoles = async (req, res, next) => {

    try {

        const roles = await roleService.getAllRoles();

        return res.status(200).json({
            success: true,
            data: roles
        });

    } catch (error) {
        next(error);
    }

};

module.exports = {
    assignRoles,
    removeRole,
    syncRoles,
    getUserRoles,
    getAllRoles
};