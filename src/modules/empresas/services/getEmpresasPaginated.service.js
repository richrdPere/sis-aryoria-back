const { Op } = require("sequelize");
const db = require("../../../database/models");

// Modelos
const { Empresa } = db;

const listarEmpresas = async ({
    id_usuario,
    page = 1,
    limit = 10,
    search = "",
}) => {

    // ============================================================
    // 1. NORMALIZAR PAGINACIÓN
    // ============================================================
    page = Number.parseInt(page, 10);
    limit = Number.parseInt(limit, 10);

    if (!Number.isInteger(page) || page < 1) {
        page = 1;
    }

    if (!Number.isInteger(limit) || limit < 1) {
        limit = 10;
    }

    const offset =
        (page - 1) * limit;

    // ============================================================
    // 2. VALIDAR USUARIO
    // ============================================================
    if (!id_usuario) {
        throw new Error(
            "El usuario es obligatorio."
        );
    }

    // ============================================================
    // 3. FILTROS
    // ============================================================
    const where = {
        id_usuario,
    };

    const searchNormalizado =
        typeof search === "string"
            ? search.trim()
            : "";

    if (searchNormalizado) {
        where[Op.or] = [
            {
                razon_social: {
                    [Op.like]:
                        `%${searchNormalizado}%`,
                },
            },
            {
                nombre_comercial: {
                    [Op.like]:
                        `%${searchNormalizado}%`,
                },
            },
            {
                ruc: {
                    [Op.like]:
                        `%${searchNormalizado}%`,
                },
            },
        ];
    }

    // ============================================================
    // 4. CONSULTA
    // ============================================================
    const {
        rows,
        count,
    } = await Empresa.findAndCountAll({
        where,

        limit,
        offset,

        order: [
            ["created_at", "DESC"],
        ],

        distinct: true,
    });

    // ============================================================
    // 5. RESPONSE
    // ============================================================
    return {
        items: rows,
        pagination: {
            total: count,
            page,
            limit,
            totalPages:
                Math.ceil(
                    count / limit,
                ),
        },
    };
};

module.exports = listarEmpresas;