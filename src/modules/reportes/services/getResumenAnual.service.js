const { Op, fn, col } = require("sequelize");
const db = require("../../../database/models");

// Modelos
const { Movimiento, PeriodoContable } = db;

// Utils
const { crearEstructuraMeses, convertirNumero } = require("../utils/meses.utils");
const { construirRespuestaResumen, obtenerMayorMes } = require("../utils/resumen_anual.utils");


// SERVICE
const getResumenAnualService = async ({ id_empresa, anio }) => {

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
   * 1. Obtener períodos contables del año.
   */
  const periodos = await PeriodoContable.findAll({
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
      id_empresa,
      anio: anioNumerico,

      estado: {
        [Op.ne]: "ANULADO",
      },
    },

    order: [["mes", "ASC"]],
  });

  const meses = crearEstructuraMeses();

  /*
   * Map para localizar rápidamente el mes de cada período.
   */
  const periodoPorId = new Map();

  for (const periodo of periodos) {
    const mes = Number(periodo.mes);

    if (mes < 1 || mes > 12) {
      continue;
    }

    periodoPorId.set(
      String(periodo.id_periodo),
      mes
    );

    const posicionMes = meses[mes - 1];

    posicionMes.id_periodo = Number(periodo.id_periodo);
    posicionMes.periodo = periodo.nombre;
    posicionMes.estado_periodo = periodo.estado;
    posicionMes.saldo_inicial = convertirNumero(periodo.saldo_inicial);
    posicionMes.tiene_periodo = true;
  }

  /*
   * Si no existen períodos, devolvemos los 12 meses en cero.
   */
  if (periodos.length === 0) {
    return construirRespuestaResumen({
      id_empresa,
      anio: anioNumerico,
      meses,
    });
  }

  const idsPeriodos = periodos.map(
    (periodo) => periodo.id_periodo
  );

  /*
   * 2. Agrupar movimientos por período y tipo.
   */
  const movimientosAgrupados =
    await Movimiento.findAll({
      attributes: [
        "id_periodo",
        "tipo",

        [
          fn("SUM", col("monto")),
          "total",
        ],

        [
          fn("COUNT", col("id_movimiento")),
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
      ],

      raw: true,
    });

  /*
   * 3. Colocar cada resultado en su mes.
   */
  for (const registro of movimientosAgrupados) {
    const mes = periodoPorId.get(
      String(registro.id_periodo)
    );

    if (!mes) {
      continue;
    }

    const posicionMes = meses[mes - 1];
    const total = convertirNumero(registro.total);
    const cantidad = Number(registro.cantidad ?? 0);

    if (registro.tipo === "INGRESO") {
      posicionMes.total_ingresos = total;
      posicionMes.cantidad_ingresos = cantidad;
    }

    if (registro.tipo === "EGRESO") {
      posicionMes.total_egresos = total;
      posicionMes.cantidad_egresos = cantidad;
    }
  }

  /*
   * 4. Calcular flujo neto, saldo final y acumulados.
   */
  let ingresosAcumulados = 0;
  let egresosAcumulados = 0;

  let ultimoSaldoFinal = 0;
  let existeSaldoAnterior = false;

  for (const mes of meses) {
    if (
      mes.tiene_periodo &&
      existeSaldoAnterior &&
      mes.saldo_inicial === 0
    ) {
      /*
       * Esto no modifica la BD.
       * Solo completa la salida cuando el saldo inicial
       * todavía no fue almacenado correctamente.
       */
      mes.saldo_inicial = ultimoSaldoFinal;
    }

    mes.flujo_neto = convertirNumero(
      mes.total_ingresos -
      mes.total_egresos
    );

    mes.saldo_final = convertirNumero(
      mes.saldo_inicial +
      mes.flujo_neto
    );

    mes.cantidad_movimientos =
      mes.cantidad_ingresos +
      mes.cantidad_egresos;

    ingresosAcumulados = convertirNumero(
      ingresosAcumulados +
      mes.total_ingresos
    );

    egresosAcumulados = convertirNumero(
      egresosAcumulados +
      mes.total_egresos
    );

    mes.ingresos_acumulados =
      ingresosAcumulados;

    mes.egresos_acumulados =
      egresosAcumulados;

    mes.flujo_acumulado =
      convertirNumero(
        ingresosAcumulados -
        egresosAcumulados
      );

    if (mes.tiene_periodo) {
      ultimoSaldoFinal = mes.saldo_final;
      existeSaldoAnterior = true;
    }
  }

  return construirRespuestaResumen({
    id_empresa,
    anio: anioNumerico,
    meses,
  });
}


module.exports = getResumenAnualService;
