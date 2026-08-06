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
const getSubcategoriasByCategoriaService =
    async ({
        idEmpresa,
        idCategoria,
        incluirInactivas = false,
    }) => {
        await obtenerCategoriaActiva({
            idEmpresa,
            idCategoria,
        });

        const where = {
            id_empresa: idEmpresa,
            id_categoria: idCategoria,
        };

        if (!incluirInactivas) {
            where.estado = true;
        }

        return Subcategoria.findAll({
            where,
            attributes: [
                "id_subcategoria",
                "id_empresa",
                "id_categoria",
                "nombre",
                "descripcion",
                "es_predeterminada",
                "orden",
                "estado",
            ],
            order: [
                ["orden", "ASC"],
                ["nombre", "ASC"],
            ],
        });
    };

/**
 * Obtener subcategoría por ID.
 */
const getSubcategoriaByIdService = async ({
    idEmpresa,
    idSubcategoria,
}) => {
    const subcategoria =
        await Subcategoria.findOne({
            where: {
                id_subcategoria: idSubcategoria,
                id_empresa: idEmpresa,
            },

            include: [
                {
                    model: Categoria,
                    as: "categoria",
                    attributes: [
                        "id_categoria",
                        "id_empresa",
                        "nombre",
                        "tipo",
                        "descripcion",
                        "color",
                        "icono",
                        "estado",
                    ],
                },
            ],
        });

    if (!subcategoria) {
        throw new Error(
            "La subcategoría no existe o no pertenece a la empresa."
        );
    }

    return subcategoria;
};


module.exports = getSubcategoriasByCategoriaService;