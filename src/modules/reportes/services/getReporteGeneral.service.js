const { fn, col, literal } = require('sequelize');
const db = require("../../../database/models");

// Modelos
const { Movimiento, Categoria, PeriodoContable } = db;


/**
 * Obtiene el reporte general de una empresa
 * dentro de un período contable.
 */
const getReporteGeneralService = async ({
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
   * =====================================================
   * 1. RESUMEN GENERAL
   * =====================================================
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

  for (const item of resumenRaw) {
    const total = Number(item.total ?? 0);
    const cantidad = Number(item.cantidad ?? 0);
    const promedio = Number(item.promedio ?? 0);

    if (item.tipo === 'INGRESO') {
      totalIngresos = total;
      cantidadIngresos = cantidad;
      promedioIngresos = promedio;
    }

    if (item.tipo === 'EGRESO') {
      totalEgresos = total;
      cantidadEgresos = cantidad;
      promedioEgresos = promedio;
    }
  }

  const saldoInicial = Number(
    periodo.saldo_inicial ?? 0,
  );

  const saldoMovimiento =
    totalIngresos - totalEgresos;

  const saldoFinalCalculado =
    saldoInicial + saldoMovimiento;

  /*
   * =====================================================
   * 2. REPORTE POR CATEGORÍAS
   * =====================================================
   */
  const categoriasRaw = await Movimiento.findAll({
    where: whereMovimiento,

    attributes: [
      'id_categoria',
      'tipo',

      [
        fn('SUM', col('monto')),
        'total',
      ],

      [
        fn(
          'COUNT',
          col('Movimiento.id_movimiento'),
        ),
        'cantidad_movimientos',
      ],

      [
        fn('AVG', col('monto')),
        'promedio_movimiento',
      ],
    ],

    include: [
      {
        model: Categoria,
        as: 'categoria',
        attributes: [
          'id_categoria',
          'nombre',
          'tipo',
          'descripcion',
          'color',
          'icono',
        ],
        required: false,
      },
    ],

    group: [
      'Movimiento.id_categoria',
      'Movimiento.tipo',
      'categoria.id_categoria',
      'categoria.nombre',
      'categoria.tipo',
      'categoria.descripcion',
      'categoria.color',
      'categoria.icono',
    ],

    order: [
      [literal('total'), 'DESC'],
    ],

    raw: true,
    nest: true,
  });

  const categorias = categoriasRaw.map((item) => {
    const total = Number(item.total ?? 0);

    const cantidadMovimientos = Number(
      item.cantidad_movimientos ?? 0,
    );

    const promedioMovimiento = Number(
      item.promedio_movimiento ?? 0,
    );

    const totalDelTipo =
      item.tipo === 'INGRESO'
        ? totalIngresos
        : totalEgresos;

    const porcentaje =
      totalDelTipo > 0
        ? (total / totalDelTipo) * 100
        : 0;

    return {
      id_categoria: Number(item.id_categoria),
      tipo: item.tipo,

      categoria: {
        id_categoria:
          Number(item.categoria?.id_categoria) ||
          Number(item.id_categoria),

        nombre:
          item.categoria?.nombre ??
          'Sin categoría',

        tipo:
          item.categoria?.tipo ??
          item.tipo,

        descripcion:
          item.categoria?.descripcion ?? null,

        color:
          item.categoria?.color ??
          '#9E9E9E',

        icono:
          item.categoria?.icono ??
          'category',
      },

      total,

      porcentaje: Number(
        porcentaje.toFixed(2),
      ),

      cantidad_movimientos:
        cantidadMovimientos,

      promedio_movimiento: Number(
        promedioMovimiento.toFixed(2),
      ),
    };
  });

  /*
   * =====================================================
   * 3. EVOLUCIÓN DIARIA
   * =====================================================
   */
  const evolucionRaw = await Movimiento.findAll({
    where: whereMovimiento,

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
        fn(
          'COUNT',
          col('id_movimiento'),
        ),
        'cantidad_movimientos',
      ],
    ],

    group: ['fecha'],

    order: [
      ['fecha', 'ASC'],
    ],

    raw: true,
  });

  let saldoAcumulado = saldoInicial;

  const evolucion = evolucionRaw.map((item) => {
    const ingresos = Number(
      item.ingresos ?? 0,
    );

    const egresos = Number(
      item.egresos ?? 0,
    );

    const saldoDiario =
      ingresos - egresos;

    saldoAcumulado += saldoDiario;

    return {
      fecha: item.fecha,
      ingresos,
      egresos,
      saldo_diario: saldoDiario,
      saldo_acumulado: saldoAcumulado,

      cantidad_ingresos: Number(
        item.cantidad_ingresos ?? 0,
      ),

      cantidad_egresos: Number(
        item.cantidad_egresos ?? 0,
      ),

      cantidad_movimientos: Number(
        item.cantidad_movimientos ?? 0,
      ),
    };
  });

  /*
   * =====================================================
   * 4. ÚLTIMOS MOVIMIENTOS
   * =====================================================
   */
  const ultimosMovimientosRaw =
    await Movimiento.findAll({
      where: whereMovimiento,

      attributes: [
        'id_movimiento',
        'id_empresa',
        'id_categoria',
        'id_usuario',
        'id_periodo',
        'tipo',
        'fecha',
        'descripcion',
        'monto',
        'observacion',
        'comprobante',
        'estado',
        'activo',
        'created_at',
        'updated_at',
      ],

      include: [
        {
          model: Categoria,
          as: 'categoria',
          attributes: [
            'id_categoria',
            'nombre',
            'tipo',
            'color',
            'icono',
          ],
          required: false,
        },
      ],

      order: [
        ['fecha', 'DESC'],
        ['created_at', 'DESC'],
      ],

      limit: 10,
    });

  const ultimosMovimientos =
    ultimosMovimientosRaw.map((movimiento) => {
      const item = movimiento.toJSON();

      return {
        ...item,
        monto: Number(item.monto ?? 0),
      };
    });

  /*
   * =====================================================
   * 5. RESULTADO FINAL
   * =====================================================
   */
  return {
    periodo: {
      ...periodo,
      saldo_inicial: saldoInicial,
      saldo_final: Number(
        periodo.saldo_final ??
        saldoFinalCalculado,
      ),
    },

    resumen: {
      total_ingresos: totalIngresos,
      total_egresos: totalEgresos,

      saldo_movimientos: saldoMovimiento,
      saldo_inicial: saldoInicial,

      saldo_final_calculado:
        saldoFinalCalculado,

      cantidad_ingresos:
        cantidadIngresos,

      cantidad_egresos:
        cantidadEgresos,

      cantidad_movimientos:
        cantidadIngresos +
        cantidadEgresos,

      promedio_ingresos: Number(
        promedioIngresos.toFixed(2),
      ),

      promedio_egresos: Number(
        promedioEgresos.toFixed(2),
      ),

      cantidad_categorias:
        categorias.length,

      cantidad_categorias_ingreso:
        categorias.filter(
          (item) =>
            item.tipo === 'INGRESO',
        ).length,

      cantidad_categorias_egreso:
        categorias.filter(
          (item) =>
            item.tipo === 'EGRESO',
        ).length,

      cantidad_dias_con_movimientos:
        evolucion.length,
    },

    categorias,

    categorias_ingreso:
      categorias.filter(
        (item) =>
          item.tipo === 'INGRESO',
      ),

    categorias_egreso:
      categorias.filter(
        (item) =>
          item.tipo === 'EGRESO',
      ),

    evolucion,

    ultimos_movimientos:
      ultimosMovimientos,
  };
};

module.exports = getReporteGeneralService;