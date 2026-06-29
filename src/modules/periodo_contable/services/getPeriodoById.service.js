const db = require("../../../database/models");

// Modelos 
const { PeriodoContable } = db;

const getPeriodoContableById = async (idPeriodo, idEmpresa) => {

    if (!idPeriodo) {
        throw new Error("Debe indicar el id del período contable.");
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

    return periodo;
};

module.exports = getPeriodoContableById;