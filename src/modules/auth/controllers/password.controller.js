const passwordService = require("../services/password.service");

/**
 * PATCH /auth/change-password
 * Usuario autenticado
 */
const changePassword = async (req, res, next) => {

    try {

        const { currentPassword, newPassword } = req.body;

        const result = await passwordService.changePassword(
            req.user.id_usuario,
            currentPassword,
            newPassword
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
 * PATCH /auth/reset-password/:id
 * Solo ADMIN o SUPER_ADMIN
 */
const resetPassword = async (req, res, next) => {

    try {

        const { id } = req.params;
        const { newPassword } = req.body;

        const result = await passwordService.resetPassword(
            id,
            newPassword
        );

        return res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (error) {
        next(error);
    }

};

module.exports = {
    changePassword,
    resetPassword
};