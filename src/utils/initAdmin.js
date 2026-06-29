const bcrypt = require("bcryptjs");

const db = require("../database/models");

const Persona = db.Persona;
const Usuario = db.Usuario;
const Roles = db.Roles;
const UsuarioRol = db.UsuarioRol;

async function crearAdminPorDefecto() {
    try {
        console.log("🔎 Verificando creación automática de usuarios...");

        // -------------------------------------------------------
        // 1. Verificar si ya existe un usuario con rol ADMIN
        // -------------------------------------------------------
        const adminExiste = await Usuario.findOne({
            include: [
                {
                    model: Roles,
                    where: { nombre: "ADMIN" },
                    through: { attributes: [] },
                    as: "roles"
                },
            ],
        });

        if (adminExiste) {
            console.log("✔ Admin ya existe. Saltando creación inicial.");
            return;
        }

        // -------------------------------------------------------
        // 2. Crear o buscar rol ADMIN
        // -------------------------------------------------------
        let adminRol = await Roles.findOne({
            where: { nombre: "ADMIN" },
        });

        if (!adminRol) {
            adminRol = await Roles.create({
                nombre: "ADMIN",
                descripcion: "Administrador del sistema",
                estado: true,
            });
        }

        // -------------------------------------------------------
        // 3. Crear Persona
        // -------------------------------------------------------
        const persona = await Persona.create({
            nombres: "Administrador",
            apellidos: "General",
            documento_identidad: "00000000",
            celular: "999999999",
        });

        // -------------------------------------------------------
        // 4. Crear Usuario
        // -------------------------------------------------------
        const passwordHashed = await bcrypt.hash("123456", 12);

        const usuario = await Usuario.create({
            username: "73081247",
            email: "admin@sistema.com",
            password: passwordHashed,
            estado: true,
            id_persona: persona.id_persona, // ajusta si tu PK tiene otro nombre
        });

        // -------------------------------------------------------
        // 5. Asignar rol al usuario
        // -------------------------------------------------------
        await UsuarioRol.create({
            id_usuario: usuario.id_usuario,
            id_rol: adminRol.id_rol,
        });

        console.log("✔ Admin creado correctamente con rol asignado.");

    } catch (error) {
        console.error("❌ Error creando admin por defecto:", error);
    }
}


module.exports = crearAdminPorDefecto;
