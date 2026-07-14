const { Op } = require("sequelize");
const db = require("../../../database/models");

// Modelos
const {
    Movimiento,
    Categoria,
    Empresa,
    Usuario,
    PeriodoContable,
} = db;

const getMovimientos = async (query) => {
    let {
        page = 1,
        limit = 10,
        search = "",

        id_empresa,
        id_periodo,
        id_categoria,
        tipo,
        estado,

        fecha_inicio,
        fecha_fin,
    } = query;

    page = Number(page);
    limit = Number(limit);

    if (!id_empresa) {
        throw new Error("El id_empresa es obligatorio para listar movimientos.");
    }

    const offset = (page - 1) * limit;

    const where = {
        id_empresa,
    };

    if (id_periodo) {
        where.id_periodo = id_periodo;
    }

    if (id_categoria) {
        where.id_categoria = id_categoria;
    }

    if (tipo) {
        where.tipo = tipo.toUpperCase();
    }

    if (estado) {
        where.estado = estado.toUpperCase();
    }

    if (fecha_inicio && fecha_fin) {
        where.fecha = {
            [Op.between]: [fecha_inicio, fecha_fin],
        };
    }

    if (search) {
        where.descripcion = {
            [Op.like]: `%${search}%`,
        };
    }

    const { count, rows } = await Movimiento.findAndCountAll({
        where,
        include: [
            {
                model: Empresa,
                as: "empresa",
                attributes: ["id_empresa", "razon_social", "ruc"],
            },
            {
                model: Categoria,
                as: "categoria",
                attributes: ["id_categoria", "nombre", "tipo", "color", "icono"],
            },
            {
                model: Usuario,
                as: "usuario",
                attributes: ["id_usuario", "username", "email"],
            },
            {
                model: PeriodoContable,
                as: "periodoContable",
                attributes: ["id_periodo", "nombre", "anio", "mes", "estado"],
            },
        ],
        order: [
            ["fecha", "DESC"],
            ["created_at", "DESC"],
        ],
        offset,
        limit,
        distinct: true,
    });

    return {
        movimientos: rows,
        pagination: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        }

    };
};

module.exports = getMovimientos;