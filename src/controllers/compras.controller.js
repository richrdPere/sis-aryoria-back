const { Compra, Categoria } = require("../models");
const { Op } = require("sequelize");


// =====================================
// CREAR COMPRA
// =====================================
const crearCompra = async (req, res) => {
    try {
        const { descripcion, monto, fecha, id_categoria } = req.body;

        if (!monto || !fecha) {
            return res.status(400).json({
                message: "Monto y fecha son obligatorios",
            });
        }

        const compra = await Compra.create({
            descripcion,
            monto,
            fecha,
            id_categoria,
            id_empresa: req.usuario.id_empresa,
        });

        res.status(201).json(compra);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear compra" });
    }
};



// =====================================
// OBTENER TODAS (PAGINADO + FILTROS)
// =====================================
const obtenerCompras = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            fecha_inicio,
            fecha_fin,
            id_categoria
        } = req.query;

        const offset = (page - 1) * limit;

        const where = {
            id_empresa: req.usuario.id_empresa,
        };

        //  búsqueda por descripción
        if (search) {
            where.descripcion = {
                [Op.like]: `%${search}%`,
            };
        }

        //  filtro por rango de fechas
        if (fecha_inicio && fecha_fin) {
            where.fecha = {
                [Op.between]: [fecha_inicio, fecha_fin],
            };
        }

        //  filtro por categoría
        if (id_categoria) {
            where.id_categoria = id_categoria;
        }

        const { count, rows } = await Compra.findAndCountAll({
            where,
            include: [
                {
                    model: Categoria,
                    as: "categoria",
                    attributes: ["id_categoria", "nombre"],
                },
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["fecha", "DESC"]],
        });

        res.json({
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit),
            data: rows,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener compras" });
    }
};



// =====================================
// OBTENER POR ID
// =====================================
const obtenerCompraPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const compra = await Compra.findOne({
            where: {
                id_compra: id,
                id_empresa: req.usuario.id_empresa,
            },
            include: [
                {
                    model: Categoria,
                    as: "categoria",
                },
            ],
        });

        if (!compra) {
            return res.status(404).json({
                message: "Compra no encontrada",
            });
        }

        res.json(compra);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener compra" });
    }
};



// =====================================
// ACTUALIZAR
// =====================================
const actualizarCompra = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion, monto, fecha, id_categoria } = req.body;

        const compra = await Compra.findOne({
            where: {
                id_compra: id,
                id_empresa: req.usuario.id_empresa,
            },
        });

        if (!compra) {
            return res.status(404).json({
                message: "Compra no encontrada",
            });
        }

        await compra.update({
            descripcion: descripcion ?? compra.descripcion,
            monto: monto ?? compra.monto,
            fecha: fecha ?? compra.fecha,
            id_categoria: id_categoria ?? compra.id_categoria,
        });

        res.json(compra);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar compra" });
    }
};



// =====================================
// ELIMINAR
// =====================================
const eliminarCompra = async (req, res) => {
    try {
        const { id } = req.params;

        const compra = await Compra.findOne({
            where: {
                id_compra: id,
                id_empresa: req.usuario.id_empresa,
            },
        });

        if (!compra) {
            return res.status(404).json({
                message: "Compra no encontrada",
            });
        }

        await compra.destroy();

        res.json({
            message: "Compra eliminada correctamente",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar compra" });
    }
};


module.exports = {
    crearCompra,
    obtenerCompras,
    obtenerCompraPorId,
    actualizarCompra,
    eliminarCompra,
};