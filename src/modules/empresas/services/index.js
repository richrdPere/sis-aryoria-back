const newEmpresaService = require("./newEmpresa.service");
const getEmpresasService = require("./getEmpresasPaginated.service");
const updateEmpresaService = require("./updateEmpresa.service");
const deleteEmpresaService = require("./deleteEmpresa.service");
const getEmpresaByIdService = require("./getEmpresaById.service");

module.exports = {
    newEmpresaService,
    getEmpresasService,
    updateEmpresaService,
    deleteEmpresaService,
    getEmpresaByIdService
};