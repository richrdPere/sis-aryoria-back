const Venta = require("../models/ventas.model");

// ===============================
// CREAR VENTA
// ===============================
const createVenta = async (req, res) => {
    try {
        const { descripcion, monto, fecha } = req.body;

        const nuevaVenta = await Venta.create({
            descripcion,
            monto,
            fecha,
        });

        return res.status(201).json(nuevaVenta);
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear la venta",
            error: error.message,
        });
    }
};

// ===============================
// OBTENER TODAS (PAGINADO + BUSQUEDA)
// ===============================
const getVentas = async (req, res) => {
    try {
        const ventas = await Venta.findAll();
        return res.status(200).json(ventas);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener las ventas",
            error: error.message,
        });
    }
};


// ===============================
// OBTENER POR ID
// ===============================
const getVentaById = async (req, res) => {
    try {
        const { id } = req.params;

        const venta = await Venta.findByPk(id);

        if (!venta) {
            return res.status(404).json({
                message: "Venta no encontrada",
            });
        }

        return res.status(200).json(venta);
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener la venta",
            error: error.message,
        });
    }
};


// ===============================
// ACTUALIZAR VENTA
// ===============================
const updateVenta = async (req, res) => {
    try {
        const { id } = req.params;

        const venta = await Venta.findByPk(id);

        if (!venta) {
            return res.status(404).json({
                message: "Venta no encontrada",
            });
        }

        await venta.update(req.body);

        return res.status(200).json({
            message: "Venta actualizada correctamente",
            venta,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar la venta",
            error: error.message,
        });
    }
};

// ===============================
// ELIMINAR VENTA
// ===============================
const deleteVenta = async (req, res) => {
    try {
        const { id } = req.params;

        const venta = await Venta.findByPk(id);

        if (!venta) {
            return res.status(404).json({
                message: "Venta no encontrada",
            });
        }

        await venta.destroy();

        return res.status(200).json({
            message: "Venta eliminada correctamente",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar la venta",
            error: error.message,
        });
    }
};

module.exports = {
    createVenta,
    getVentas,
    getVentaById,
    updateVenta,
    deleteVenta,
};