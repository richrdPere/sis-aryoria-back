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

module.exports = getSubcategoriaByIdService;