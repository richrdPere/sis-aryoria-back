const db = require("../../../database/models");

// Modelos
const {
  Movimiento,
  Categoria,
  Subcategoria,
  PeriodoContable,
} = db;

const updateMovimiento = async (
  idMovimiento,
  idEmpresa,
  body
) => {
  const {
    id_categoria,
    id_subcategoria,
    id_cuenta,
    id_periodo,

    fecha,
    descripcion,
    monto,
    observacion,
    comprobante,

    estado,
    tipo,
  } = body;

  // ==========================================================
  // VALIDACIONES INICIALES
  // ==========================================================
  if (!idMovimiento) {
    throw new Error("Debe indicar el movimiento.");
  }

  if (!idEmpresa) {
    throw new Error("Debe indicar la empresa.");
  }

  // ==========================================================
  // BUSCAR MOVIMIENTO
  // ==========================================================
  const movimiento = await Movimiento.findOne({
    where: {
      id_movimiento: idMovimiento,
      id_empresa: idEmpresa,
      activo: true,
    },
  });

  if (!movimiento) {
    throw new Error(
      "Movimiento no encontrado o no pertenece a la empresa."
    );
  }

  // ==========================================================
  // NORMALIZAR TIPO Y ESTADO
  // ==========================================================
  const tipoMovimiento = tipo
    ? tipo.toString().trim().toUpperCase()
    : movimiento.tipo;

  const estadoMovimiento = estado
    ? estado.toString().trim().toUpperCase()
    : movimiento.estado;

  if (!["INGRESO", "EGRESO"].includes(tipoMovimiento)) {
    throw new Error(
      "El tipo debe ser INGRESO o EGRESO."
    );
  }

  if (
    !["PENDIENTE", "PAGADO", "ANULADO"].includes(
      estadoMovimiento
    )
  ) {
    throw new Error(
      "El estado debe ser PENDIENTE, PAGADO o ANULADO."
    );
  }

  // ==========================================================
  // RESOLVER IDs FINALES
  // ==========================================================
  const categoriaId = id_categoria ?? movimiento.id_categoria;
  const subcategoriaId = id_subcategoria ?? movimiento.id_subcategoria;
  const periodoId = id_periodo ?? movimiento.id_periodo;

  // ==========================================================
  // VALIDAR CATEGORÍA
  // ==========================================================
  const categoria = await Categoria.findOne({
    where: {
      id_categoria: categoriaId,
      id_empresa: idEmpresa,
      estado: true,
    },
  });

  if (!categoria) {
    throw new Error(
      "La categoría no existe, no pertenece a la empresa o está inactiva."
    );
  }

  if (categoria.tipo !== tipoMovimiento) {
    throw new Error(
      "El tipo del movimiento no coincide con el tipo de la categoría."
    );
  }

  // ==========================================================
  // VALIDAR SUBCATEGORÍA
  // ==========================================================
  const subcategoria = await Subcategoria.findOne({
    where: {
      id_subcategoria: subcategoriaId,
      id_categoria: categoriaId,
      id_empresa: idEmpresa,
      estado: true,
    },
  });

  if (!subcategoria) {
    throw new Error(
      "La subcategoría no existe, no pertenece a la categoría seleccionada o está inactiva."
    );
  }

  // ==========================================================
  // VALIDAR PERÍODO
  // ==========================================================
  const periodo = await PeriodoContable.findOne({
    where: {
      id_periodo: periodoId,
      id_empresa: idEmpresa,
    },
  });

  if (!periodo) {
    throw new Error(
      "El período contable no existe o no pertenece a la empresa."
    );
  }

  if (periodo.estado !== "ABIERTO") {
    throw new Error(
      "No se puede modificar un movimiento de un período cerrado."
    );
  }

  // ==========================================================
  // VALIDAR FECHA
  // ==========================================================
  const fechaFinal = fecha ?? movimiento.fecha;

  const fechaMovimiento = new Date(
    `${fechaFinal}T00:00:00`
  );

  const fechaInicio = new Date(
    `${periodo.fecha_inicio}T00:00:00`
  );

  const fechaFin = new Date(
    `${periodo.fecha_fin}T23:59:59`
  );

  if (Number.isNaN(fechaMovimiento.getTime())) {
    throw new Error(
      "La fecha del movimiento no es válida."
    );
  }

  if (
    fechaMovimiento < fechaInicio ||
    fechaMovimiento > fechaFin
  ) {
    throw new Error(
      "La fecha del movimiento no pertenece al período contable."
    );
  }

  // ==========================================================
  // VALIDAR MONTO
  // ==========================================================
  const montoFinal =
    monto ?? movimiento.monto;

  if (
    montoFinal == null ||
    Number(montoFinal) <= 0
  ) {
    throw new Error(
      "El monto debe ser mayor a cero."
    );
  }

  // ==========================================================
  // VALIDAR DESCRIPCIÓN
  // ==========================================================
  const descripcionFinal =
    descripcion ?? movimiento.descripcion;

  if (
    !descripcionFinal ||
    !descripcionFinal.toString().trim()
  ) {
    throw new Error(
      "La descripción del movimiento es obligatoria."
    );
  }

  // ==========================================================
  // ACTUALIZAR
  // ==========================================================
  await movimiento.update({
    id_categoria: categoriaId,
    id_subcategoria: subcategoriaId,
    id_cuenta: id_cuenta !== undefined
      ? id_cuenta
      : movimiento.id_cuenta,
    id_periodo: periodoId,
    tipo: tipoMovimiento,
    fecha: fechaFinal,
    descripcion: descripcionFinal.toString().trim(),
    monto: Number(montoFinal),
    observacion: observacion !== undefined
      ? observacion?.toString().trim() || null
      : movimiento.observacion,
    comprobante: comprobante !== undefined
      ? comprobante?.toString().trim() || null
      : movimiento.comprobante,
    estado: estadoMovimiento,
  });

  return movimiento;
};

module.exports = updateMovimiento;