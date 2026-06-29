const { Op } = require("sequelize");
const db = require("../../../database/models");

// Modelos 
const { Empresa } = db;

const listarEmpresas = async ({
    page = 1,
    limit = 10,
    search = "",
}) => {
    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;

    const where = {};

    if (search) {
        where[Op.or] = [
            {
                razon_social: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                nombre_comercial: {
                    [Op.like]: `%${search}%`,
                },
            },
            {
                ruc: {
                    [Op.like]: `%${search}%`,
                },
            },
        ];
    }

    const { rows, count } = await Empresa.findAndCountAll({
        where,
        limit,
        offset,
        order: [["created_at", "DESC"]],
    });

    return {
        empresas: rows,
        pagination: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        },
    };
};

module.exports = listarEmpresas;