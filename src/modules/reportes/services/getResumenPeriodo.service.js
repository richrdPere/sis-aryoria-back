const { fn, col } = require('sequelize');
const db = require("../../../database/models");

// Modelos
const { Movimiento, PeriodoContable } = db;


/**
 * Obtiene el resumen financiero de una empresa
 * dentro de un período contable.
 */
const getResumenPeriodoService = async ({
    id_empresa,
    id_periodo,
}) => {
    if (!id_empresa) {
        const error = new Error(
            'El id de la empresa es obligatorio.',
        );

        error.statusCode = 400;
        throw error;
    }

    if (!id_periodo) {
        const error = new Error(
            'El id del período es obligatorio.',
        );

        error.statusCode = 400;
        throw error;
    }

    /*
     * Verificar que el período exista
     * y que pertenezca a la empresa.
     */
    const periodo = await PeriodoContable.findOne({
        where: {
            id_periodo,
            id_empresa,
        },

        attributes: [
            'id_periodo',
            'id_empresa',
            'nombre',
            'anio',
            'mes',
            'fecha_inicio',
            'fecha_fin',
            'estado',
            'saldo_inicial',
            'saldo_final',
        ],

        raw: true,
    });

    if (!periodo) {
        const error = new Error(
            'El período contable no existe o no pertenece a la empresa.',
        );

        error.statusCode = 404;
        throw error;
    }

    const whereMovimiento = {
        id_empresa,
        id_periodo,
        activo: true,
    };

    /*
     * Si deseas considerar solamente movimientos pagados:
     *
     * whereMovimiento.estado = 'PAGADO';
     */

    const resumenRaw = await Movimiento.findAll({
        where: whereMovimiento,

        attributes: [
            'tipo',

            [
                fn('SUM', col('monto')),
                'total',
            ],

            [
                fn('COUNT', col('id_movimiento')),
                'cantidad',
            ],

            [
                fn('AVG', col('monto')),
                'promedio',
            ],

            [
                fn('MIN', col('monto')),
                'monto_minimo',
            ],

            [
                fn('MAX', col('monto')),
                'monto_maximo',
            ],
        ],

        group: ['tipo'],

        raw: true,
    });

    let totalIngresos = 0;
    let totalEgresos = 0;

    let cantidadIngresos = 0;
    let cantidadEgresos = 0;

    let promedioIngresos = 0;
    let promedioEgresos = 0;

    let ingresoMinimo = 0;
    let ingresoMaximo = 0;

    let egresoMinimo = 0;
    let egresoMaximo = 0;

    for (const item of resumenRaw) {
        const tipo = item.tipo?.toString().toUpperCase();

        const total = Number(item.total ?? 0);
        const cantidad = Number(item.cantidad ?? 0);
        const promedio = Number(item.promedio ?? 0);
        const montoMinimo = Number(item.monto_minimo ?? 0);
        const montoMaximo = Number(item.monto_maximo ?? 0);

        if (tipo === 'INGRESO') {
            totalIngresos = total;
            cantidadIngresos = cantidad;
            promedioIngresos = promedio;
            ingresoMinimo = montoMinimo;
            ingresoMaximo = montoMaximo;
        }

        if (tipo === 'EGRESO') {
            totalEgresos = total;
            cantidadEgresos = cantidad;
            promedioEgresos = promedio;
            egresoMinimo = montoMinimo;
            egresoMaximo = montoMaximo;
        }
    }

    const saldoInicial = Number(
        periodo.saldo_inicial ?? 0,
    );

    const saldoMovimientos =
        totalIngresos - totalEgresos;

    const saldoFinalCalculado =
        saldoInicial + saldoMovimientos;

    const cantidadMovimientos =
        cantidadIngresos + cantidadEgresos;

    /*
     * Guardamos la fecha actual para indicar
     * cuándo se calculó el resumen.
     */
    const fechaGeneracion =
        new Date().toISOString();

    return {
        periodo: {
            id_periodo: Number(periodo.id_periodo),
            id_empresa: Number(periodo.id_empresa),
            nombre: periodo.nombre,
            anio: Number(periodo.anio),
            mes: Number(periodo.mes),
            fecha_inicio: periodo.fecha_inicio,
            fecha_fin: periodo.fecha_fin,
            estado: periodo.estado,
            saldo_inicial: saldoInicial,

            /*
             * Puede ser null mientras el período esté abierto.
             */
            saldo_final: periodo.saldo_final != null
                ? Number(periodo.saldo_final)
                : null,
        },

        resumen: {
            total_ingresos: totalIngresos,
            total_egresos: totalEgresos,

            saldo_movimientos: saldoMovimientos,
            saldo_inicial: saldoInicial,
            saldo_final_calculado: saldoFinalCalculado,

            cantidad_ingresos: cantidadIngresos,
            cantidad_egresos: cantidadEgresos,
            cantidad_movimientos: cantidadMovimientos,

            promedio_ingresos: Number(
                promedioIngresos.toFixed(2),
            ),

            promedio_egresos: Number(
                promedioEgresos.toFixed(2),
            ),

            ingreso_minimo: ingresoMinimo,
            ingreso_maximo: ingresoMaximo,

            egreso_minimo: egresoMinimo,
            egreso_maximo: egresoMaximo,

            tiene_movimientos:
                cantidadMovimientos > 0,
        },

        generado_en: fechaGeneracion,
    };
};

module.exports = getResumenPeriodoService;