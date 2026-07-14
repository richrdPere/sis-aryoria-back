const db = require("../../../database/models");

// Modulos
const {
    Movimiento,
    Categoria,
    PeriodoContable,
} = db;

const updateMovimiento = async (id, body) => {

    const {

        id_categoria,
        id_periodo,
        fecha,
        descripcion,
        monto,
        observacion,
        comprobante,
        estado,
        tipo,

    } = body;

    const movimiento = await Movimiento.findByPk(id);

    if (!movimiento) {
        throw new Error("Movimiento no encontrado.");
    }

    // Validar categoría
    if (id_categoria) {

        const categoria = await Categoria.findByPk(id_categoria);

        if (!categoria) {
            throw new Error("La categoría no existe.");
        }

        if (tipo && categoria.tipo !== tipo) {
            throw new Error(
                "El tipo del movimiento no coincide con el tipo de la categoría."
            );
        }
    }

    // Validar período
    if (id_periodo) {

        const periodo = await PeriodoContable.findByPk(id_periodo);

        if (!periodo) {
            throw new Error("El período contable no existe.");
        }

        if (periodo.estado !== "ABIERTO") {
            throw new Error(
                "No se puede modificar un movimiento de un período cerrado."
            );
        }

    }

    await movimiento.update({

        id_categoria: id_categoria ?? movimiento.id_categoria,
        id_periodo: id_periodo ?? movimiento.id_periodo,

        fecha: fecha ?? movimiento.fecha,
        descripcion: descripcion ?? movimiento.descripcion,
        monto: monto ?? movimiento.monto,
        observacion: observacion ?? movimiento.observacion,
        comprobante: comprobante ?? movimiento.comprobante,
        estado: estado ?? movimiento.estado,
        tipo: tipo ?? movimiento.tipo,

    });

    return movimiento;

};

module.exports = updateMovimiento;