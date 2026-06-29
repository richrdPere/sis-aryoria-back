const db = require("../../../database/models");

// Modelos
const { PeriodoContable } = db;

const updatePeriodoContable = async (
    idPeriodo,
    idEmpresa,
    data
) => {

    if (!idPeriodo) {
        throw new Error("Debe indicar el período contable.");
    }

    if (!idEmpresa) {
        throw new Error("Debe indicar la empresa.");
    }

    const periodo = await PeriodoContable.findOne({
        where: {
            id_periodo: idPeriodo,
            id_empresa: idEmpresa,
        },
    });

    if (!periodo) {
        throw new Error("Período contable no encontrado.");
    }

    // Validar mes
    if (data.mes) {

        if (data.mes < 1 || data.mes > 12) {
            throw new Error("El mes debe estar entre 1 y 12.");
        }

    }

    // Validar año
    if (data.anio) {

        if (data.anio < 2000) {
            throw new Error("El año no es válido.");
        }

    }

    // Validar rango de fechas
    if (data.fecha_inicio && data.fecha_fin) {

        if (new Date(data.fecha_inicio) > new Date(data.fecha_fin)) {
            throw new Error("La fecha de inicio no puede ser mayor que la fecha de fin.");
        }

    }

    await periodo.update({
        nombre: data.nombre ?? periodo.nombre,
        anio: data.anio ?? periodo.anio,
        mes: data.mes ?? periodo.mes,
        fecha_inicio: data.fecha_inicio ?? periodo.fecha_inicio,
        fecha_fin: data.fecha_fin ?? periodo.fecha_fin,
        estado: data.estado ?? periodo.estado,
        saldo_inicial: data.saldo_inicial ?? periodo.saldo_inicial,
        saldo_final: data.saldo_final ?? periodo.saldo_final,
        observacion: data.observacion ?? periodo.observacion,
    });

    return periodo;
};

module.exports = updatePeriodoContable;