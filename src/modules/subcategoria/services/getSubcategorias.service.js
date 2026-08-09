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
const getSubcategoriasService = async ({
    idEmpresa,
    page = 1,
    limit = 10,
    search = "",
    idCategoria = null,
    tipo = null,
    estado = null,
}) => {
    const paginaActual = Math.max(
        Number.parseInt(page, 10) || 1,
        1
    );

    const limiteActual = Math.min(
        Math.max(Number.parseInt(limit, 10) || 10, 1),
        100
    );

    const offset =
        (paginaActual - 1) * limiteActual;

    const whereSubcategoria = {
        id_empresa: idEmpresa,
    };

    const whereCategoria = {
        id_empresa: idEmpresa,
    };

    const textoBusqueda =
        typeof search === "string"
            ? search.trim()
            : "";

    if (textoBusqueda) {
        whereSubcategoria[Op.or] = [
            {
                nombre: {
                    [Op.like]: `%${textoBusqueda}%`,
                },
            },
            {
                descripcion: {
                    [Op.like]: `%${textoBusqueda}%`,
                },
            },
        ];
    }

    const categoriaId =
        normalizarId(idCategoria);

    if (categoriaId) {
        whereSubcategoria.id_categoria =
            categoriaId;
    }

    if (
        tipo &&
        ["INGRESO", "EGRESO"].includes(
            String(tipo).toUpperCase()
        )
    ) {
        whereCategoria.tipo =
            String(tipo).toUpperCase();
    }

    if (
        estado !== null &&
        estado !== undefined &&
        estado !== ""
    ) {
        whereSubcategoria.estado =
            estado === true ||
            estado === "true" ||
            estado === 1 ||
            estado === "1";
    }

    const result =
        await Subcategoria.findAndCountAll({
            where: whereSubcategoria,

            include: [
                {
                    model: Categoria,
                    as: "categoria",
                    required: true,
                    where: whereCategoria,
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

            attributes: [
                "id_subcategoria",
                "id_empresa",
                "id_categoria",
                "nombre",
                "descripcion",
                "es_predeterminada",
                "orden",
                "estado",
                "created_at",
                "updated_at",
            ],

            order: [
                [
                    {
                        model: Categoria,
                        as: "categoria",
                    },
                    "tipo",
                    "ASC",
                ],
                [
                    {
                        model: Categoria,
                        as: "categoria",
                    },
                    "nombre",
                    "ASC",
                ],
                ["orden", "ASC"],
                ["nombre", "ASC"],
            ],

            limit: limiteActual,
            offset,
            distinct: true,
        });

    const totalPages = Math.max(
        Math.ceil(result.count / limiteActual),
        1
    );

    return {
        items: result.rows,
        pagination: {
            total: result.count,
            page: paginaActual,
            limit: limiteActual,
            total_pages: totalPages,
            has_next_page: paginaActual < totalPages,
            has_previous_page: paginaActual > 1,
        },
    };
};


module.exports = getSubcategoriasService;