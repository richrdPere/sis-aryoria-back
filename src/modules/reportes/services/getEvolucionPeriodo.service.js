const { fn, col, literal } = require('sequelize');
const db = require("../../../database/models");

// Modelos
const { Movimiento, PeriodoContable } = db


/**
 * Obtiene la evolución diaria de ingresos y egresos
 * de una empresa dentro de un período contable.
 */
const getEvolucionPeriodoService = async ({
  id_empresa,
  id_periodo,
}) => {
  if (!id_empresa) {
    const error = new Error('El id de la empresa es obligatorio.');
    error.statusCode = 400;
    throw error;
  }

  if (!id_periodo) {
    const error = new Error('El id del período es obligatorio.');
    error.statusCode = 400;
    throw error;
  }

  // Verificar que el período exista y pertenezca a la empresa.
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

  /*
   * Agrupar movimientos por día.
   *
   * Se consideran solamente movimientos activos.
   * Si deseas incluir únicamente movimientos PAGADOS,
   * agrega estado: 'PAGADO' en el where.
   */
  const movimientosAgrupados = await Movimiento.findAll({
    where: {
      id_empresa,
      id_periodo,
      activo: true,
    },
    attributes: [
      'fecha',

      [
        fn(
          'SUM',
          literal(`
            CASE
              WHEN tipo = 'INGRESO' THEN monto
              ELSE 0
            END
          `),
        ),
        'ingresos',
      ],

      [
        fn(
          'SUM',
          literal(`
            CASE
              WHEN tipo = 'EGRESO' THEN monto
              ELSE 0
            END
          `),
        ),
        'egresos',
      ],

      [
        fn(
          'COUNT',
          literal(`
            CASE
              WHEN tipo = 'INGRESO' THEN 1
              ELSE NULL
            END
          `),
        ),
        'cantidad_ingresos',
      ],

      [
        fn(
          'COUNT',
          literal(`
            CASE
              WHEN tipo = 'EGRESO' THEN 1
              ELSE NULL
            END
          `),
        ),
        'cantidad_egresos',
      ],

      [
        fn('COUNT', col('id_movimiento')),
        'cantidad_movimientos',
      ],
    ],
    group: ['fecha'],
    order: [['fecha', 'ASC']],
    raw: true,
  });

  let saldoAcumulado = 0;
  let totalIngresos = 0;
  let totalEgresos = 0;
  let totalMovimientos = 0;

  const evolucion = movimientosAgrupados.map((item) => {
    const ingresos = Number(item.ingresos ?? 0);
    const egresos = Number(item.egresos ?? 0);

    const cantidadIngresos = Number(
      item.cantidad_ingresos ?? 0,
    );

    const cantidadEgresos = Number(
      item.cantidad_egresos ?? 0,
    );

    const cantidadMovimientos = Number(
      item.cantidad_movimientos ?? 0,
    );

    const saldoDiario = ingresos - egresos;

    saldoAcumulado += saldoDiario;
    totalIngresos += ingresos;
    totalEgresos += egresos;
    totalMovimientos += cantidadMovimientos;

    return {
      fecha: item.fecha,
      ingresos,
      egresos,
      saldo_diario: saldoDiario,
      saldo_acumulado: saldoAcumulado,
      cantidad_ingresos: cantidadIngresos,
      cantidad_egresos: cantidadEgresos,
      cantidad_movimientos: cantidadMovimientos,
    };
  });

  return {
    periodo,
    resumen: {
      total_ingresos: totalIngresos,
      total_egresos: totalEgresos,
      saldo_periodo: totalIngresos - totalEgresos,
      cantidad_movimientos: totalMovimientos,
      cantidad_dias_con_movimientos: evolucion.length,
    },
    evolucion,
  };
};

module.exports = getEvolucionPeriodoService;