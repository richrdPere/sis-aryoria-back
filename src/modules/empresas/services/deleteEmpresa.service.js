const db = require("../../../database/models");

const { Empresa } = db;

const eliminarEmpresa = async (id_empresa) => {
    const empresa = await Empresa.findByPk(id_empresa);

    if (!empresa) {
        throw new Error("La empresa no existe.");
    }

    await empresa.destroy();

    return true;
};

module.exports = eliminarEmpresa