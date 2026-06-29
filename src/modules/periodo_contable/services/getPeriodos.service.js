const db = require("../../../database/models");
const { Op } = require("sequelize");

// Modelos
const { PeriodoContable } = db;

const getPeriodosContables = async (query) => {

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const where = {};

    // Empresa (obligatorio)
    if (!query.id_empresa) {
        throw new Error("Debe indicar la empresa.");
    }

    where.id_empresa = query.id_empresa;

    // Estado
    if (query.estado) {
        where.estado = query.estado.toUpperCase();
    }

    // Año
    if (query.anio) {
        where.anio = query.anio;
    }

    // Mes
    if (query.mes) {
        where.mes = query.mes;
    }

    // Nombre
    if (query.search) {
        where.nombre = {

            [Op.like]: `%${query.search}%`
        };
    }

    const { rows, count } = await PeriodoContable.findAndCountAll({
        where,
        order: [

            ["anio", "DESC"],
            ["mes", "DESC"]
        ],
        limit,
        offset
    });

    return {
        periodos: rows,
        pagination: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)

        }
    };
};

module.exports = getPeriodosContables;