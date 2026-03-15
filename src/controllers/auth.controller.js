const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const sequelize = require("../config/database");

const Usuario = db.Usuario;
const Cliente = db.Cliente;
const Arbitro = db.Arbitro;
const Adjudicador = db.Adjudicador;
const Participe = db.Participe;
const Secretaria = db.Secretaria;


// *************************************************
// 🔹 Confirmar Cuenta
// *************************************************
const confirmar_cuenta = async (req, res) => {
    try {
        const { token } = req.params;
        const usuario = await Usuario.findOne({ where: { verification_token: token } });

        if (!usuario) {
            return res.status(400).json({ message: "Token inválido o expirado." });
        }

        if (usuario.verification_expires < new Date()) {
            return res.status(400).json({ message: "El token ha expirado. Solicita uno nuevo." });
        }

        usuario.correo_verificado = true;
        usuario.verification_token = null;
        usuario.verification_expires = null;
        await usuario.save();

        res.json({ message: "Correo confirmado correctamente. Ya puedes iniciar sesión." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al confirmar la cuenta." });
    }
};



// *************************************************
// 🔹 Registro Unificado
// *************************************************
const registro_usuario = async (req, res) => {
    const transaction = await sequelize.transaction(); //  Inicia transacción
    try {
        const {
            nombre,
            apellidos,
            correo,
            password,
            rol,
            telefono,
            documento_identidad,
            tipo_usuario,
            cargo,
            especialidad,
            experiencia,

        } = req.body;

        // Validar campos
        if (!nombre || !correo || !apellidos) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        // Verificar si el usuario ya existe
        const existe = await Usuario.findOne({ where: { correo }, transaction });
        if (existe) {
            await transaction.rollback();
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        // Verificamos que se haya enviado la contraseña
        if (!password) {
            await transaction.rollback();
            return res.status(400).json({ message: 'No se proporcionó una contraseña', data: null });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 12);

        // Crear usuario
        const nuevoUsuario = await Usuario.create({
            nombre,
            apellidos,
            correo,
            telefono,
            documento_identidad,
            password: hashedPassword,
            rol,
            tipo_usuario: tipo_usuario || "persona_natural",
        }, { transaction });

        // Crear entidad según el rol
        let detalleRol = null;
        switch (rol) {
            case "adjudicador":
                detalleRol = await Adjudicador.create(
                    {
                        usuario_id: nuevoUsuario.id,
                        especialidad,
                        experiencia,
                    },
                    { transaction }
                );
                break;
            case "arbitro":
                detalleRol = await Arbitro.create(
                    {
                        usuario_id: nuevoUsuario.id,
                        especialidad,
                        experiencia,
                    },
                    { transaction }
                );
                break;
            case "secretaria":
                detalleRol = await Secretaria.create(
                    {
                        usuario_id: nuevoUsuario.id,
                        cargo: cargo || "Secretaria General",
                        fecha_ingreso: new Date(),
                    },
                    { transaction }
                );
                break;

            case "staff":
                detalleRol = await Staff.create(
                    {
                        usuario_id: nuevoUsuario.id,
                        cargo,
                        area,
                        fecha_ingreso: new Date(),
                    },
                    { transaction }
                );
                break;
            // Puedes agregar más roles si lo deseas
        }

        // Si todo va bien, confirmar la transacción
        await transaction.commit();


        res.status(201).json({
            message: "Usuario registrado correctamente",
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                apellidos: nuevoUsuario.apellidos,
                correo: nuevoUsuario.correo,
                rol: nuevoUsuario.rol,
                detalle: detalleRol,
            },
        });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error al registrar el usuario" });
    }
};

// *************************************************
// 🔹 Login
// *************************************************
const login_usuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validar campos
        if (!email || !password) {
            return res.status(400).json({ message: "Debe ingresar correo y contraseña" });
        }

        // 2. Buscar usuario
        const usuario = await Usuario.findOne({ where: { email: email } });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // 3. Validar contraseña
        const validPassword = await bcrypt.compare(password, usuario.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }


        //  4. Validar correo verificado
    //    if (!usuario.correo_verificado) {
    //         return res.status(403).json({
    //             message: "Debe confirmar su correo electrónico antes de iniciar sesión",
    //             code: "EMAIL_NOT_VERIFIED"
    //         });
    //     } 


        //  5. Validar estado de la cuenta
        // if (!usuario.estado) {
        //     return res.status(403).json({
        //         message: "Su cuenta se encuentra deshabilitada. Contacte al administrador",
        //         code: "ACCOUNT_DISABLED"
        //     });
        // }

        // 6. Obtener detalles por rol
        let detalles = null;

        switch (usuario.rol) {
            case 'cliente':
                detalles = await Secretaria.findOne({ where: { usuario_id: usuario.id } });
                break;
            case 'empleado':
                detalles = await Arbitro.findOne({ where: { usuario_id: usuario.id } });
                break;
            // puedes agregar más roles si lo necesitas
        }

        // 7. Generar token
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        // 8. Respuesta final
        res.json({
            message: "Inicio de sesión exitoso",
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol,
                foto_perfil: usuario.foto_perfil,
                estado: usuario.estado,
                correo_verificado: usuario.correo_verificado,
                ...(detalles ? { detalles } : {}), // incluye detalles si existen
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al iniciar sesión" });
    }
};


module.exports = {
    confirmar_cuenta,
    registro_usuario,
    login_usuario
};