const db = require("../../../database/models");

// Modelos
const {
    Movimiento,
    Empresa,
    Categoria,
    Subcategoria,
    PeriodoContable,
    Usuario,
} = db;

const registerMovimiento = async (data) => {
    const {
        id_empresa,
        id_categoria,
        id_subcategoria,
        id_cuenta,
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

    // ==========================================================
    // VALIDACIONES OBLIGATORIAS
    // ==========================================================
    if (!id_empresa) {
        throw new Error("Debe indicar la empresa.");
    }

    if (!id_categoria) {
        throw new Error("Debe indicar la categoría.");
    }

    if (!id_subcategoria) {
        throw new Error("Debe indicar la subcategoría.");
    }

    if (!id_usuario) {
        throw new Error("Debe indicar el usuario.");
    }

    if (!id_periodo) {
        throw new Error("Debe indicar el período contable.");
    }

    if (!tipo) {
        throw new Error("Debe indicar el tipo de movimiento.");
    }

    if (!fecha) {
        throw new Error("Debe indicar la fecha.");
    }

    if (!descripcion || !descripcion.toString().trim()) {
        throw new Error("Debe indicar la descripción.");
    }

    if (monto == null || Number(monto) <= 0) {
        throw new Error("El monto debe ser mayor a cero.");
    }

    // ==========================================================
    // NORMALIZAR DATOS
    // ==========================================================
    const tipoMovimiento = tipo.toString().trim().toUpperCase();

    const estadoMovimiento = (estado ?? "PAGADO")
        .toString()
        .trim()
        .toUpperCase();

    if (!["INGRESO", "EGRESO"].includes(tipoMovimiento)) {
        throw new Error("El tipo debe ser INGRESO o EGRESO.");
    }

    if (!["PENDIENTE", "PAGADO", "ANULADO"].includes(estadoMovimiento)) {
        throw new Error(
            "El estado debe ser PENDIENTE, PAGADO o ANULADO."
        );
    }

    // ==========================================================
    // EMPRESA
    // ==========================================================
    const empresa = await Empresa.findByPk(id_empresa);

    if (!empresa) {
        throw new Error("Empresa no encontrada.");
    }

    // ==========================================================
    // USUARIO
    // ==========================================================
    const usuario = await Usuario.findByPk(id_usuario);

    if (!usuario) {
        throw new Error("Usuario no encontrado.");
    }

    // ==========================================================
    // CATEGORÍA
    // ==========================================================
    const categoria = await Categoria.findOne({
        where: {
            id_categoria,
            id_empresa,
            estado: true,
        },
    });

    if (!categoria) {
        throw new Error(
            "La categoría no existe, no pertenece a la empresa o está inactiva."
        );
    }

    if (categoria.tipo !== tipoMovimiento) {
        throw new Error(
            "El tipo del movimiento no coincide con el tipo de la categoría."
        );
    }

    // ==========================================================
    // SUBCATEGORÍA
    // ==========================================================
    const subcategoria = await Subcategoria.findOne({
        where: {
            id_subcategoria,
            id_categoria,
            id_empresa,
            estado: true,
        },
    });

    if (!subcategoria) {
        throw new Error(
            "La subcategoría no existe, no pertenece a la categoría seleccionada o está inactiva."
        );
    }

    // ==========================================================
    // PERÍODO CONTABLE
    // ==========================================================
    const periodo = await PeriodoContable.findOne({
        where: {
            id_periodo,
            id_empresa,
        },
    });

    if (!periodo) {
        throw new Error("Período contable no encontrado.");
    }

    if (periodo.estado !== "ABIERTO") {
        throw new Error(
            "El período contable se encuentra cerrado."
        );
    }

    // ==========================================================
    // VALIDAR FECHA DEL MOVIMIENTO
    // ==========================================================
    const fechaMovimiento = new Date(`${fecha}T00:00:00`);

    const fechaInicio = new Date(
        `${periodo.fecha_inicio}T00:00:00`
    );

    const fechaFin = new Date(
        `${periodo.fecha_fin}T23:59:59`
    );

    if (Number.isNaN(fechaMovimiento.getTime())) {
        throw new Error("La fecha del movimiento no es válida.");
    }

    if (
        fechaMovimiento < fechaInicio ||
        fechaMovimiento > fechaFin
    ) {
        throw new Error(
            "La fecha del movimiento no pertenece al período contable."
        );
    }

    // ==========================================================
    // CREAR MOVIMIENTO
    // ==========================================================
    const movimiento = await Movimiento.create({
        id_empresa,
        id_categoria,
        id_subcategoria,
        id_cuenta: id_cuenta ?? null,
        id_usuario,
        id_periodo,
        tipo: tipoMovimiento,
        fecha,
        descripcion: descripcion.trim(),
        monto: Number(monto),
        observacion: observacion?.toString().trim() || null,
        comprobante: comprobante?.toString().trim() || null,
        estado: estadoMovimiento,
        activo: true,
    });

    return movimiento;
};

module.exports = registerMovimiento;