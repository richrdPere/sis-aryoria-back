const db = require("../../../database/models");

// Modelos
const { PeriodoContable, Movimiento } = db;


const deletePeriodoContable = async (
  idPeriodo,
  idEmpresa
) => {

  if (!idPeriodo) {
    throw new Error("Debe indicar el período contable.");
  }

  if (!idEmpresa) {
    throw new Error("Debe indicar la empresa.");
  }

  const periodo = await PeriodoContable.findOne({
    where: {
      id_periodo: idPeriodo,
      id_empresa: idEmpresa,
    },
  });

  if (!periodo) {
    throw new Error("Período contable no encontrado.");
  }

  // Verificar si existen movimientos
  const cantidadMovimientos = await Movimiento.count({
    where: {
      id_periodo: idPeriodo,
    },
  });

  if (cantidadMovimientos > 0) {
    throw new Error(
      "No se puede eliminar el período porque contiene movimientos registrados."
    );
  }
  await periodo.destroy();
  return true;
};

module.exports = deletePeriodoContable;