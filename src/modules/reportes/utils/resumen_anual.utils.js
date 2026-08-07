const { convertirNumero } = require("./meses.utils");

/**
 * Construye totales e indicadores generales.
 */
function construirRespuestaResumen({
    id_empresa,
    anio,
    meses,
}) {
    const totalIngresos = convertirNumero(
        meses.reduce(
            (total, mes) =>
                total + mes.total_ingresos,
            0
        )
    );

    const totalEgresos = convertirNumero(
        meses.reduce(
            (total, mes) =>
                total + mes.total_egresos,
            0
        )
    );

    const flujoNetoAnual = convertirNumero(
        totalIngresos - totalEgresos
    );

    const cantidadIngresos = meses.reduce(
        (total, mes) =>
            total + mes.cantidad_ingresos,
        0
    );

    const cantidadEgresos = meses.reduce(
        (total, mes) =>
            total + mes.cantidad_egresos,
        0
    );

    const mesesConPeriodo = meses.filter(
        (mes) => mes.tiene_periodo
    );

    const primerPeriodo =
        mesesConPeriodo[0] ?? null;

    const ultimoPeriodo =
        mesesConPeriodo[
        mesesConPeriodo.length - 1
        ] ?? null;

    const mesMayorIngreso = obtenerMayorMes(
        meses,
        "total_ingresos"
    );

    const mesMayorEgreso = obtenerMayorMes(
        meses,
        "total_egresos"
    );

    return {
        empresa: {
            id_empresa: Number(id_empresa),
        },

        anio,

        resumen: {
            saldo_inicial_anual:
                primerPeriodo?.saldo_inicial ?? 0,

            total_ingresos: totalIngresos,
            total_egresos: totalEgresos,
            flujo_neto_anual: flujoNetoAnual,

            saldo_final_anual:
                ultimoPeriodo?.saldo_final ?? 0,

            cantidad_ingresos: cantidadIngresos,
            cantidad_egresos: cantidadEgresos,

            cantidad_movimientos:
                cantidadIngresos +
                cantidadEgresos,

            periodos_registrados:
                mesesConPeriodo.length,
        },

        indicadores: {
            mes_mayor_ingreso: mesMayorIngreso,
            mes_mayor_egreso: mesMayorEgreso,
        },

        meses,
    };
}

function obtenerMayorMes(meses, campo) {
    const mesesConMonto = meses.filter(
        (mes) => Number(mes[campo]) > 0
    );

    if (mesesConMonto.length === 0) {
        return null;
    }

    const resultado = mesesConMonto.reduce(
        (mayor, actual) =>
            actual[campo] > mayor[campo]
                ? actual
                : mayor
    );

    return {
        mes: resultado.mes,
        nombre: resultado.nombre,
        monto: convertirNumero(resultado[campo]),
    };
}


module.exports = {
    construirRespuestaResumen,
    obtenerMayorMes,
}