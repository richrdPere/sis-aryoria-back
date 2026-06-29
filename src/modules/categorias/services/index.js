const createCategoriaService = require("./createCategoria.service");
const getCategoriasService = require("./getCategorias.service");
const getCategoriaByIdService = require("./getCategoriaById.service");
const getCategoriaByTipoService = require("./getCategoriaByTipo.service");
const updateCategoriaService = require("./updateCategoria.service");
const deleteCategoriaService = require("./deleteCategoria.service");


module.exports = {
    createCategoriaService,
    getCategoriasService,
    getCategoriaByIdService,
    getCategoriaByTipoService,
    updateCategoriaService,
    deleteCategoriaService
}