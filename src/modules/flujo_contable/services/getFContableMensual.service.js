const { Op, fn, col } = require("sequelize");
const db = require("../../../database/models");

// Modelos
const { Movimiento, Categoria, Subcategoria, PeriodoContable } = db;

// Utils
const { NOMBRES_MESES, convertirNumero, agruparPorCategoria } = require("../utils/meses.utils");

// SERVICES
const getFlujoContableMensualService = async ({ id_empresa, id_periodo }) => {
  if (!id_empresa) {
    throw new Error(
      "El identificador de la empresa es obligatorio."
    );
  }

  if (!id_periodo) {
    throw new Error(
      "El identificador del período contable es obligatorio."
    );
  }

  const periodo = await PeriodoContable.findOne({
    attributes: [
      "id_periodo",
      "id_empresa",
      "nombre",
      "anio",
      "mes",
      "fecha_inicio",
      "fecha_fin",
      "estado",
      "saldo_inicial",
      "saldo_final",
    ],

    where: {
      id_periodo,
      id_empresa,
    },
  });

  if (!periodo) {
    throw new Error(
      "El período contable no existe o no pertenece a la empresa."
    );
  }

  if (periodo.estado === "ANULADO") {
    throw new Error(
      "No se puede obtener el flujo contable de un período anulado."
    );
  }

  const movimientosAgrupados =
    await Movimiento.findAll({
      attributes: [
        "tipo",
        "id_categoria",
        "id_subcategoria",

        [
          fn("SUM", col("Movimiento.monto")),
          "total",
        ],

        [
          fn(
            "COUNT",
            col("Movimiento.id_movimiento")
          ),
          "cantidad_movimientos",
        ],
      ],

      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: [
            "id_categoria",
            "nombre",
            "tipo",
            "color",
            "icono",
          ],

          required: true,

          where: {
            id_empresa,
          },
        },

        {
          model: Subcategoria,
          as: "subcategoria",
          attributes: [
            "id_subcategoria",
            "nombre",
            "orden",
            "es_predeterminada",
          ],

          required: true,

          where: {
            id_empresa,
          },
        },
      ],

      where: {
        id_empresa,
        id_periodo,
        estado: "PAGADO",
        activo: true,
      },

      group: [
        "Movimiento.tipo",
        "Movimiento.id_categoria",
        "Movimiento.id_subcategoria",

        "categoria.id_categoria",
        "categoria.nombre",
        "categoria.tipo",
        "categoria.color",
        "categoria.icono",

        "subcategoria.id_subcategoria",
        "subcategoria.nombre",
        "subcategoria.orden",
        "subcategoria.es_predeterminada",
      ],

      order: [
        ["tipo", "ASC"],

        [
          { model: Categoria, as: "categoria" },
          "nombre",
          "ASC",
        ],

        [
          {
            model: Subcategoria,
            as: "subcategoria",
          },
          "orden",
          "ASC",
        ],

        [
          {
            model: Subcategoria,
            as: "subcategoria",
          },
          "nombre",
          "ASC",
        ],
      ],
    });

  const detalleIngresos = [];
  const detalleEgresos = [];

  for (const movimiento of movimientosAgrupados) {
    const total = convertirNumero(
      movimiento.getDataValue("total")
    );

    const cantidadMovimientos = Number(
      movimiento.getDataValue(
        "cantidad_movimientos"
      ) ?? 0
    );

    const item = {
      id_categoria: Number(
        movimiento.id_categoria
      ),
      categoria: movimiento.categoria?.nombre ?? "Sin categoría",
      tipo: movimiento.tipo,
      color: movimiento.categoria?.color ?? null,
      icono: movimiento.categoria?.icono ?? null,
      id_subcategoria: Number(movimiento.id_subcategoria),
      subcategoria: movimiento.subcategoria?.nombre ?? "Sin subcategoría",
      orden: movimiento.subcategoria?.orden ?? 0,
      es_predeterminada: movimiento.subcategoria?.es_predeterminada ?? false,
      total,
      cantidad_movimientos: cantidadMovimientos,
    };

    if (movimiento.tipo === "INGRESO") {
      detalleIngresos.push(item);
    }

    if (movimiento.tipo === "EGRESO") {
      detalleEgresos.push(item);
    }
  }

  const totalIngresos = convertirNumero(
    detalleIngresos.reduce(
      (total, item) => total + item.total,
      0
    )
  );

  const totalEgresos = convertirNumero(
    detalleEgresos.reduce(
      (total, item) => total + item.total,
      0
    )
  );

  const cantidadIngresos =
    detalleIngresos.reduce(
      (total, item) =>
        total + item.cantidad_movimientos,
      0
    );

  const cantidadEgresos =
    detalleEgresos.reduce(
      (total, item) =>
        total + item.cantidad_movimientos,
      0
    );

  const saldoInicial = convertirNumero(
    periodo.saldo_inicial
  );

  const flujoNeto = convertirNumero(
    totalIngresos - totalEgresos
  );

  const saldoFinalCalculado = convertirNumero(
    saldoInicial + flujoNeto
  );

  return {
    periodo: {
      id_periodo: Number(
        periodo.id_periodo
      ),

      id_empresa: Number(
        periodo.id_empresa
      ),

      nombre: periodo.nombre,
      anio: Number(periodo.anio),
      mes: Number(periodo.mes),
      nombre_mes: NOMBRES_MESES[
        Number(periodo.mes) - 1
      ] ?? periodo.nombre,

      fecha_inicio: periodo.fecha_inicio,
      fecha_fin: periodo.fecha_fin,
      estado: periodo.estado,
    },

    resumen: {
      saldo_inicial: saldoInicial,
      total_ingresos: totalIngresos,
      total_egresos: totalEgresos,
      flujo_neto: flujoNeto,
      saldo_final_calculado: saldoFinalCalculado,
      saldo_final_registrado: convertirNumero(periodo.saldo_final),
      cantidad_ingresos: cantidadIngresos,
      cantidad_egresos: cantidadEgresos,
      cantidad_movimientos: cantidadIngresos + cantidadEgresos,
    },

    ingresos: {
      categorias: agruparPorCategoria(detalleIngresos),
      detalle: detalleIngresos,
      total: totalIngresos,
      cantidad_movimientos: cantidadIngresos,
    },

    egresos: {
      categorias: agruparPorCategoria(detalleEgresos),
      detalle: detalleEgresos,
      total: totalEgresos,
      cantidad_movimientos: cantidadEgresos,
    },
  };
}


module.exports = getFlujoContableMensualService;