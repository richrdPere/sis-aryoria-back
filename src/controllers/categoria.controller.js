const { Categoria } = require("../models");
const { Op } = require("sequelize");

// ===============================
// CREAR CATEGORIA
// ===============================
const crearCategoria = async (req, res) => {
  try {
    const { nombre, tipo } = req.body;

    if (!nombre || !tipo) {
      return res.status(400).json({
        message: "Nombre y tipo son obligatorios",
      });
    }

    const categoria = await Categoria.create({
      nombre,
      tipo,
      id_empresa: req.usuario.id_empresa,
    });

    res.status(201).json(categoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear categoría" });
  }
};



// ===============================
// OBTENER TODAS (PAGINADO + BUSQUEDA)
// ===============================
const obtenerCategorias = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", tipo } = req.query;

    const offset = (page - 1) * limit;

    const where = {
      id_empresa: req.usuario.id_empresa,
    };

    if (search) {
      where.nombre = {
        [Op.like]: `%${search}%`,
      };
    }

    if (tipo) {
      where.tipo = tipo;
    }

    const { count, rows } = await Categoria.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    res.json({
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: rows,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener categorías" });
  }
};



// ===============================
// OBTENER POR ID
// ===============================
const obtenerCategoriaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findOne({
      where: {
        id_categoria: id,
        id_empresa: req.usuario.id_empresa,
      },
    });

    if (!categoria) {
      return res.status(404).json({
        message: "Categoría no encontrada",
      });
    }

    res.json(categoria);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener categoría" });
  }
};



// ===============================
// ACTUALIZAR CATEGORIA
// ===============================
const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, tipo } = req.body;

    const categoria = await Categoria.findOne({
      where: {
        id_categoria: id,
        id_empresa: req.usuario.id_empresa,
      },
    });

    if (!categoria) {
      return res.status(404).json({
        message: "Categoría no encontrada",
      });
    }

    await categoria.update({
      nombre: nombre ?? categoria.nombre,
      tipo: tipo ?? categoria.tipo,
    });

    res.json(categoria);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar categoría" });
  }
};



// ===============================
// ELIMINAR CATEGORIA
// ===============================
const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findOne({
      where: {
        id_categoria: id,
        id_empresa: req.usuario.id_empresa,
      },
    });

    if (!categoria) {
      return res.status(404).json({
        message: "Categoría no encontrada",
      });
    }

    await categoria.destroy();

    res.json({
      message: "Categoría eliminada correctamente",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar categoría" });
  }
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  eliminarCategoria,
};