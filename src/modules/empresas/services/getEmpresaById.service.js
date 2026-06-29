const db = require("../../../database/models");

const { Empresa } = db

const obtenerEmpresaPorId = async (id_empresa) => {
    const empresa = await Empresa.findByPk(id_empresa);

    if (!empresa) {
        throw new Error("La empresa no existe.");
    }

    return empresa;
};

module.exports = obtenerEmpresaPorId