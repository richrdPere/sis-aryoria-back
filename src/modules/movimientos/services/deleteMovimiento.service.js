const db = require("../../../database/models");

// Modelos
const {
    Movimiento,
    PeriodoContable,
} = db;

const deleteMovimiento = async (
    idMovimiento,
    idEmpresa
) => {
    // ==========================================================
    // VALIDACIONES
    // ==========================================================
    if (!idMovimiento) {
        throw new Error("Debe indicar el movimiento.");
    }

    if (!idEmpresa) {
        throw new Error("Debe indicar la empresa.");
    }

    // ==========================================================
    // BUSCAR MOVIMIENTO
    // ==========================================================
    const movimiento = await Movimiento.findOne({
        where: {
            id_movimiento: idMovimiento,
            id_empresa: idEmpresa,
            activo: true,
        },
    });

    if (!movimiento) {
        throw new Error(
            "Movimiento no encontrado o no pertenece a la empresa."
        );
    }

    // ==========================================================
    // VERIFICAR PERÍODO CONTABLE
    // ==========================================================
    const periodo = await PeriodoContable.findOne({
        where: {
            id_periodo: movimiento.id_periodo,
            id_empresa: idEmpresa,
        },
    });

    if (!periodo) {
        throw new Error(
            "El período contable no existe o no pertenece a la empresa."
        );
    }

    if (periodo.estado !== "ABIERTO") {
        throw new Error(
            "No se pueden eliminar movimientos de un período cerrado."
        );
    }

    // ==========================================================
    // ELIMINAR
    // ==========================================================
    await movimiento.destroy();

    return true;
};

module.exports = deleteMovimiento;