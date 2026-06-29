const db = require("../../../database/models");

// Modelos
const { PeriodoContable, Movimiento } = db;

const ESTADOS = [
    "ABIERTO",
    "CERRADO",
    "BLOQUEADO"
];


const changeEstadoPeriodoContable = async (
    idPeriodo,
    idEmpresa,
    nuevoEstado
) => {

    if (!idPeriodo) {
        throw new Error("Debe indicar el período.");
    }

    if (!idEmpresa) {
        throw new Error("Debe indicar la empresa.");
    }

    nuevoEstado = nuevoEstado.toUpperCase();

    if (!ESTADOS.includes(nuevoEstado)) {
        throw new Error("Estado no válido.");
    }

    const periodo = await PeriodoContable.findOne({
        where: {
            id_periodo: idPeriodo,
            id_empresa: idEmpresa
        }
    });

    if (!periodo) {
        throw new Error("Período contable no encontrado.");
    }

    if (periodo.estado === nuevoEstado) {
        throw new Error(
            `El período ya se encuentra ${nuevoEstado}.`
        );
    }

    /*
    ---------------------------------------
    No permitir salir de BLOQUEADO
    ---------------------------------------
    */

    if (
        periodo.estado === "BLOQUEADO"
    ) {

        throw new Error(
            "El período está bloqueado."
        );

    }

    /*
    ---------------------------------------
    Si se cierra un período
    ---------------------------------------
    */

    if (
        nuevoEstado === "CERRADO"
    ) {

        const movimientosPendientes =
            await Movimiento.count({

                where: {
                    id_periodo: idPeriodo,
                    estado: "PENDIENTE"
                }

            });

        if (movimientosPendientes > 0) {

            throw new Error(
                "No puede cerrar un período con movimientos pendientes."
            );

        }

    }

    periodo.estado = nuevoEstado;
    await periodo.save();
    return periodo;

};

module.exports = changeEstadoPeriodoContable;