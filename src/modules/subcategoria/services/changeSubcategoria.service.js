const { Op } = require("sequelize");

const db = require("../../../database/models");

// Modelos
const { Subcategoria, Categoria, Empresa } = db;

// Validadores
const {
    normalizarTexto,
    normalizarId,
    obtenerEmpresaActiva,
    obtenerCategoriaActiva,
    validarNombreDuplicado,
} = require("../validators/subcategoria.validator");

// Service
const changeSubcategoriaEstadoService = async ({
    idEmpresa,
    idSubcategoria,
    estado,
}) => {
    const subcategoria =
        await Subcategoria.findOne({
            where: {
                id_subcategoria: idSubcategoria,
                id_empresa: idEmpresa,
            },
        });

    if (!subcategoria) {
        throw new Error(
            "La subcategoría no existe o no pertenece a la empresa."
        );
    }

    const nuevoEstado =
        estado === true ||
        estado === "true" ||
        estado === 1 ||
        estado === "1";

    await subcategoria.update({
        estado: nuevoEstado,
    });

    return getSubcategoriaByIdService({
        idEmpresa,
        idSubcategoria,
    });
};

module.exports = changeSubcategoriaEstadoService;