const { Op, fn, col } = require("sequelize");
const db = require("../../../database/models");

// Modelos
const { Movimiento, Categoria, Subcategoria, PeriodoContable } = db;

// Utils
const { NOMBRES_MESES, convertirNumero, agruparPorCategoria } = require("../utils/meses.utils");


// SERVICE
const getFlujoContableAnualService = async ({ id_empresa, anio, }) => {
  if (!id_empresa) {
    throw new Error(
      "El identificador de la empresa es obligatorio."
    );
  }

  const anioNumerico = Number(anio);

  if (
    !Number.isInteger(anioNumerico) ||
    anioNumerico < 2000 ||
    anioNumerico > 2100
  ) {
    throw new Error(
      "El año indicado no es válido."
    );
  }

  /*
   * 1. Obtener períodos del año.
   */
  const periodos = await PeriodoContable.findAll({
    attributes: [
      "id_periodo",
      "nombre",
      "anio",
      "mes",
      "estado",
      "saldo_inicial",
      "saldo_final",
    ],

    where: {
      id_empresa,
      anio: anioNumerico,

      estado: {
        [Op.ne]: "ANULADO",
      },
    },

    order: [["mes", "ASC"]],
  });

  const periodoPorId = new Map();

  for (const periodo of periodos) {
    periodoPorId.set(
      String(periodo.id_periodo),
      Number(periodo.mes)
    );
  }

  /*
   * 2. Consultar todas las categorías y conceptos activos.
   *
   * Esto permite mostrar filas en cero aunque no existan
   * movimientos registrados.
   */
  const subcategorias = await Subcategoria.findAll({
    attributes: [
      "id_subcategoria",
      "id_empresa",
      "id_categoria",
      "nombre",
      "orden",
      "es_predeterminada",
      "estado",
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
          estado: true,
        },
      },
    ],

    where: {
      id_empresa,
      estado: true,
    },

    order: [
      [
        {
          model: Categoria,
          as: "categoria",
        },
        "tipo",
        "ASC",
      ],

      [
        {
          model: Categoria,
          as: "categoria",
        },
        "nombre",
        "ASC",
      ],

      ["orden", "ASC"],
      ["nombre", "ASC"],
    ],
  });

  /*
   * 3. Inicializar cada concepto con 12 meses en cero.
   */
  const conceptosMap = new Map();

  for (const subcategoria of subcategorias) {
    conceptosMap.set(
      String(
        subcategoria.id_subcategoria
      ),
      {
        id_categoria: Number(subcategoria.id_categoria),
        categoria: subcategoria.categoria.nombre,
        tipo: subcategoria.categoria.tipo,
        color: subcategoria.categoria.color ?? null,
        icono: subcategoria.categoria.icono ?? null,
        id_subcategoria: Number(subcategoria.id_subcategoria),
        concepto: subcategoria.nombre,
        orden: Number(subcategoria.orden ?? 0),
        es_predeterminada: Boolean(subcategoria.es_predeterminada),

        meses: NOMBRES_MESES.map(
          (nombre, index) => ({
            mes: index + 1,
            nombre,
            total: 0,
            cantidad_movimientos: 0,
          })
        ),

        total_anual: 0,

        cantidad_movimientos: 0,
      }
    );
  }

  /*
   * 4. Agrupar movimientos por período, tipo y subcategoría.
   */
  if (periodos.length > 0) {
    const idsPeriodos = periodos.map(
      (periodo) =>
        periodo.id_periodo
    );

    const movimientos =
      await Movimiento.findAll({
        attributes: [
          "id_periodo",
          "tipo",
          "id_subcategoria",

          [
            fn("SUM", col("monto")),
            "total",
          ],

          [
            fn(
              "COUNT",
              col("id_movimiento")
            ),
            "cantidad",
          ],
        ],

        where: {
          id_empresa,

          id_periodo: {
            [Op.in]: idsPeriodos,
          },

          estado: "PAGADO",
          activo: true,
        },

        group: [
          "id_periodo",
          "tipo",
          "id_subcategoria",
        ],

        raw: true,
      });

    for (const movimiento of movimientos) {
      const concepto = conceptosMap.get(
        String(
          movimiento.id_subcategoria
        )
      );

      if (!concepto) {
        continue;
      }

      const mes = periodoPorId.get(
        String(
          movimiento.id_periodo
        )
      );

      if (!mes || mes < 1 || mes > 12) {
        continue;
      }

      const total = convertirNumero(
        movimiento.total
      );

      const cantidad = Number(movimiento.cantidad ?? 0);

      concepto.meses[mes - 1].total = total;

      concepto.meses[
        mes - 1
      ].cantidad_movimientos = cantidad;

      concepto.total_anual = convertirNumero(
        concepto.total_anual +
        total
      );

      concepto.cantidad_movimientos += cantidad;
    }
  }

  /*
   * 5. Separar ingresos y egresos.
   */
  const conceptos = Array.from(
    conceptosMap.values()
  );

  const ingresos = conceptos.filter(
    (item) =>
      item.tipo === "INGRESO"
  );

  const egresos = conceptos.filter(
    (item) =>
      item.tipo === "EGRESO"
  );

  /*
   * 6. Totales por cada mes.
   */
  const totalesMensuales =
    NOMBRES_MESES.map(
      (nombre, index) => {
        const totalIngresos =
          convertirNumero(
            ingresos.reduce(
              (total, concepto) =>
                total +
                concepto.meses[index]
                  .total,
              0
            )
          );

        const totalEgresos =
          convertirNumero(
            egresos.reduce(
              (total, concepto) =>
                total +
                concepto.meses[index]
                  .total,
              0
            )
          );

        return {
          mes: index + 1,
          nombre,

          total_ingresos:
            totalIngresos,

          total_egresos:
            totalEgresos,

          flujo_neto:
            convertirNumero(
              totalIngresos -
              totalEgresos
            ),
        };
      }
    );

  /*
   * 7. Agregar saldos por período.
   */
  for (const periodo of periodos) {
    const mes = Number(
      periodo.mes
    );

    if (mes < 1 || mes > 12) {
      continue;
    }

    const resumenMes =
      totalesMensuales[mes - 1];

    resumenMes.id_periodo =
      Number(
        periodo.id_periodo
      );

    resumenMes.periodo =
      periodo.nombre;

    resumenMes.estado_periodo =
      periodo.estado;

    resumenMes.saldo_inicial =
      convertirNumero(
        periodo.saldo_inicial
      );

    resumenMes.saldo_final =
      convertirNumero(
        resumenMes.saldo_inicial +
        resumenMes.flujo_neto
      );
  }

  /*
   * 8. Completar meses sin período.
   */
  for (const mes of totalesMensuales) {
    mes.id_periodo ??= null;
    mes.periodo ??= null;
    mes.estado_periodo ??= null;
    mes.saldo_inicial ??= 0;
    mes.saldo_final ??= 0;
  }

  const totalIngresosAnual =
    convertirNumero(
      ingresos.reduce(
        (total, item) =>
          total +
          item.total_anual,
        0
      )
    );

  const totalEgresosAnual =
    convertirNumero(
      egresos.reduce(
        (total, item) =>
          total +
          item.total_anual,
        0
      )
    );

  return {
    empresa: {
      id_empresa: Number(
        id_empresa
      ),
    },

    anio: anioNumerico,

    resumen: {
      total_ingresos:
        totalIngresosAnual,

      total_egresos:
        totalEgresosAnual,

      flujo_neto_anual:
        convertirNumero(
          totalIngresosAnual -
          totalEgresosAnual
        ),

      periodos_registrados:
        periodos.length,

      conceptos_ingreso:
        ingresos.length,

      conceptos_egreso:
        egresos.length,
    },

    meses: totalesMensuales,

    ingresos: {
      conceptos: ingresos,
      total_anual:
        totalIngresosAnual,
    },

    egresos: {
      conceptos: egresos,
      total_anual:
        totalEgresosAnual,
    },
  };
}

module.exports = getFlujoContableAnualService;