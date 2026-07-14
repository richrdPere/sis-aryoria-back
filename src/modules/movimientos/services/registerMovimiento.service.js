const db = require("../../../database/models");

// Modelos
const {
    Movimiento,
    Empresa,
    Categoria,
    PeriodoContable,
    Usuario,
} = db;

const registerMovimiento = async (data) => {

    const {
        id_empresa,
        id_categoria,
        id_usuario,
        id_periodo,
        tipo,
        fecha,
        descripcion,
        monto,
        observacion,
        comprobante,
        estado,
    } = data;

    // ===============================
    // Validaciones obligatorias
    // ===============================

    if (!id_empresa) {
        throw new Error("Debe indicar la empresa.");
    }

    if (!id_categoria) {
        throw new Error("Debe indicar la categoría.");
    }

    if (!id_usuario) {
        throw new Error("Debe indicar el usuario.");
    }

    if (!id_periodo) {
        throw new Error("Debe indicar el período contable.");
    }

    if (!tipo) {
        throw new Error("Debe indicar el tipo.");
    }

    if (!fecha) {
        throw new Error("Debe indicar la fecha.");
    }

    if (!descripcion) {
        throw new Error("Debe indicar la descripción.");
    }

    if (!monto || Number(monto) <= 0) {
        throw new Error("El monto debe ser mayor a cero.");
    }

    // ===============================
    // Empresa
    // ===============================

    const empresa = await Empresa.findByPk(id_empresa);

    if (!empresa) {
        throw new Error("Empresa no encontrada.");
    }

    // ===============================
    // Usuario
    // ===============================

    const usuario = await Usuario.findByPk(id_usuario);

    if (!usuario) {
        throw new Error("Usuario no encontrado.");
    }

    // ===============================
    // Categoría
    // ===============================

    const categoria = await Categoria.findOne({

        where: {
            id_categoria,
            id_empresa,
        }
    });

    if (!categoria) {
        throw new Error("Categoría no encontrada.");
    }

    if (categoria.tipo !== tipo.toUpperCase()) {

        throw new Error(
            "El tipo del movimiento no coincide con la categoría."
        );

    }

    // ===============================
    // Periodo Contable
    // ===============================

    const periodo = await PeriodoContable.findOne({
        where: {
            id_periodo,
            id_empresa,
        }
    });

    if (!periodo) {
        throw new Error("Período contable no encontrado.");
    }

    if (periodo.estado !== "ABIERTO") {

        throw new Error(
            "El período contable se encuentra cerrado."
        );

    }

    const fechaMovimiento = new Date(fecha);
    if (
        fechaMovimiento < new Date(periodo.fecha_inicio) ||
        fechaMovimiento > new Date(periodo.fecha_fin)
    ) {
        throw new Error(
            "La fecha del movimiento no pertenece al período contable."
        );

    }

    // ===============================
    // Crear Movimiento
    // ===============================
    const movimiento = await Movimiento.create({
        id_empresa,
        id_categoria,
        id_usuario,
        id_periodo,
        tipo: tipo.toUpperCase(),
        fecha,
        descripcion,
        monto,
        observacion,
        comprobante,
        estado: estado ?? "PAGADO",

    });
    return movimiento;

};

module.exports = registerMovimiento;