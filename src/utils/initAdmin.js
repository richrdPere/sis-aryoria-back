const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuarios.model");


async function crearAdminPorDefecto() {
    try {
        console.log(" Verificando creación automática de usuarios...");

        // -------------------------------------------------------------------
        // 1. ADMINISTRADOR
        // -------------------------------------------------------------------
        const adminExiste = await Usuario.findOne({ where: { rol: "admin" } });

        if (adminExiste) {
            console.log("✔ Admin ya existe. Saltando creación inicial.");
            return;
        }

        // Crear password segura
        const passwordHashed = await bcrypt.hash("123456", 12);

        await Usuario.create({
            nombre: "Administrador",
            apellidos: "General",
            email: "admin@sistema.com",
            username: "administrador",
            password: passwordHashed,
            celular: "999999999",
            documento_identidad: "00000000",
            estado: true,
            rol: "admin",
        });

        console.log("✔ Admin creado automáticamente.");

    } catch (error) {
        console.error("❌ Error creando admin por defecto:", error);
    }
}



module.exports = crearAdminPorDefecto;
