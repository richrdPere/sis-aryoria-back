const db = require("../../../database/models");

// Modelos
const { PeriodoContable } = db;

const createPeriodoContable = async (body) => {
  const {

    id_empresa,
    nombre,
    anio,
    mes,
    fecha_inicio,
    fecha_fin,
    saldo_inicial,
    observacion

  } = body;

  // Validar fechas
  if (new Date(fecha_inicio) > new Date(fecha_fin)) {
    throw new Error(
      "La fecha de inicio no puede ser mayor a la fecha fin."
    );
  }

  // Verificar que no exista el período
  const existe = await PeriodoContable.findOne({

    where: {
      id_empresa,
      anio,
      mes
    }

  });

  if (existe) {
    throw new Error(
      "Ya existe un período contable para ese mes y año."
    );
  }

  // Crear período
  const periodo = await PeriodoContable.create({
    id_empresa,
    nombre,
    anio,
    mes,
    fecha_inicio,
    fecha_fin,
    saldo_inicial: saldo_inicial ?? 0,
    saldo_final: saldo_inicial ?? 0,
    estado: "ABIERTO",
    observacion
  });

  return periodo;
};

module.exports = createPeriodoContable;