const bcrypt = require("bcrypt");
const db = require("../../../database/models");

const { Usuario } = db;


// 1er Service - Cambiar contraseña (usuario autenticado)
const changePassword = async (
    id_usuario,
    currentPassword,
    newPassword
) => {

    const usuario = await Usuario.findByPk(id_usuario);

    if (!usuario) {
        throw new Error("Usuario no encontrado.");
    }

    if (!usuario.estado) {
        throw new Error("El usuario está deshabilitado.");
    }

    // ============================
    // Validar contraseña actual
    // ============================
    const passwordValida = await bcrypt.compare(
        currentPassword,
        usuario.password
    );

    if (!passwordValida) {
        throw new Error("La contraseña actual es incorrecta.");
    }

    // ============================
    // Validar nueva contraseña
    // ============================
    if (newPassword.length < 6) {
        throw new Error("La nueva contraseña debe tener al menos 6 caracteres.");
    }

    // ============================
    // Hash nueva contraseña
    // ============================
    usuario.password = await bcrypt.hash(newPassword, 10);

    await usuario.save();

    return {
        message: "Contraseña actualizada correctamente."
    };
};

// 2do Service - Reset de contraseña (admin o sistema), 
//           Sin necesidad de contraseña actual
const resetPassword = async (
    id_usuario,
    newPassword
) => {

    const usuario = await Usuario.findByPk(id_usuario);

    if (!usuario) {
        throw new Error("Usuario no encontrado.");
    }

    if (!usuario.estado) {
        throw new Error("El usuario está deshabilitado.");
    }

    if (newPassword.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres.");
    }

    usuario.password = await bcrypt.hash(newPassword, 10);

    await usuario.save();

    return {
        message: "Contraseña reseteada correctamente."
    };
};

// 3er Service - Verificar contraseña (utilidad interna)
const verifyPassword = async (
    plainPassword,
    hashedPassword
) => {
    return await bcrypt.compare(
        plainPassword,
        hashedPassword
    );
};

// 4to Service - Generar hash de contraseña (utilidad centralizada)
const hashPassword = async (password) => {
    if (!password) {
        throw new Error("La contraseña es requerida.");
    }

    return await bcrypt.hash(password, 10);
};


// 5to Service - Validación básica de fortaleza de contraseña
const validatePasswordStrength = (password) => {

    if (!password) {
        throw new Error("La contraseña es obligatoria.");
    }

    if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres.");
    }

    // opcional: reglas más estrictas
    // if (!/[A-Z]/.test(password)) ...
    // if (!/[0-9]/.test(password)) ...

    return true;
};

module.exports = {
    changePassword,
    resetPassword,
    verifyPassword,
    hashPassword,
    validatePasswordStrength
};