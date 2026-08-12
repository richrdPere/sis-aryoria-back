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
const deleteSubcategoriaService = async ({
    idEmpresa,
    idSubcategoria,
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

    const totalMovimientos =
        await db.Movimiento.count({
            where: {
                id_empresa: idEmpresa,
                id_subcategoria: idSubcategoria,
            },
        });

    if (totalMovimientos > 0) {
        throw new Error(
            "No se puede eliminar la subcategoría porque tiene movimientos asociados. Puede desactivarla."
        );
    }

    await subcategoria.destroy();

    return {
        id_subcategoria:
            Number(idSubcategoria),
        eliminado: true,
    };
};


module.exports = deleteSubcategoriaService;