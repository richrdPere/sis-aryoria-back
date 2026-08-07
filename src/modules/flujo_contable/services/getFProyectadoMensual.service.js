const { Op, fn, col } = require("sequelize");
const db = require("../../../database/models");

// Modelos
const { Movimiento, Categoria, Subcategoria, PeriodoContable } = db;

// Utils
const { NOMBRES_MESES, convertirNumero, agruparPorCategoria } = require("../utils/meses.utils");


// SERVICES
const getFlujoProyectadoMensualService = async ({ id_empresa, id_periodo }) => {

  const periodo = await PeriodoContable.findOne({
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
      "No se puede obtener el flujo de un período anulado."
    );
  }

  const resumen = await Movimiento.findAll({
    attributes: [
      "tipo",
      "estado",

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
      id_periodo,

      estado: {
        [Op.in]: [
          "PAGADO",
          "PENDIENTE",
        ],
      },

      activo: true,
    },

    group: [
      "tipo",
      "estado",
    ],

    raw: true,
  });

  const resultado = {
    ingresos: {
      pagados: 0,
      pendientes: 0,
      total_proyectado: 0,
      cantidad_pagados: 0,
      cantidad_pendientes: 0,
    },

    egresos: {
      pagados: 0,
      pendientes: 0,
      total_proyectado: 0,
      cantidad_pagados: 0,
      cantidad_pendientes: 0,
    },
  };

  for (const item of resumen) {
    const grupo =
      item.tipo === "INGRESO"
        ? resultado.ingresos
        : resultado.egresos;

    const total = convertirNumero(
      item.total
    );

    const cantidad = Number(
      item.cantidad ?? 0
    );

    if (item.estado === "PAGADO") {
      grupo.pagados = total;
      grupo.cantidad_pagados =
        cantidad;
    }

    if (item.estado === "PENDIENTE") {
      grupo.pendientes = total;
      grupo.cantidad_pendientes =
        cantidad;
    }
  }

  resultado.ingresos.total_proyectado =
    convertirNumero(
      resultado.ingresos.pagados +
      resultado.ingresos.pendientes
    );

  resultado.egresos.total_proyectado =
    convertirNumero(
      resultado.egresos.pagados +
      resultado.egresos.pendientes
    );

  const saldoInicial = convertirNumero(
    periodo.saldo_inicial
  );

  const flujoReal = convertirNumero(
    resultado.ingresos.pagados -
    resultado.egresos.pagados
  );

  const flujoProyectado = convertirNumero(
    resultado.ingresos.total_proyectado -
    resultado.egresos.total_proyectado
  );

  return {
    periodo: {
      id_periodo: Number(periodo.id_periodo),
      nombre: periodo.nombre,
      anio: Number(periodo.anio),
      mes: Number(periodo.mes),
      estado: periodo.estado,
    },
    saldo_inicial: saldoInicial,
    ingresos: resultado.ingresos,
    egresos: resultado.egresos,
    flujo_real: flujoReal,
    flujo_proyectado: flujoProyectado,
    saldo_final_real: convertirNumero(saldoInicial + flujoReal),
    saldo_final_proyectado: convertirNumero(saldoInicial + flujoProyectado),
  };
}

module.exports = getFlujoProyectadoMensualService;