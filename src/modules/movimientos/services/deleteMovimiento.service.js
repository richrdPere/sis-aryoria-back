const db = require("../../../database/models");

// Modelos
const { Movimiento, PeriodoContable } = db;

const deleteMovimiento = async (id) => {

    // Buscar movimiento
    const movimiento = await Movimiento.findByPk(id);

    if (!movimiento) {
        throw new Error("Movimiento no encontrado.");
    }

    // Verificar período contable
    const periodo = await PeriodoContable.findByPk(
        movimiento.id_periodo
    );

    if (!periodo) {
        throw new Error("El período contable no existe.");
    }

    if (periodo.estado !== "ABIERTO") {
        throw new Error(
            "No se pueden eliminar movimientos de un período cerrado."
        );
    }

    await movimiento.destroy();

    return true;
};

module.exports = deleteMovimiento;