const { Egreso, Categoria } = require("../models");
const { Op } = require("sequelize");


// =====================================
// CREAR EGRESO
// =====================================
const crearEgreso = async (req, res) => {
  try {
    const { descripcion, monto, fecha, id_categoria } = req.body;

    if (!monto || !fecha) {
      return res.status(400).json({
        message: "Monto y fecha son obligatorios",
      });
    }

    const egreso = await Egreso.create({
      descripcion,
      monto,
      fecha,
      id_categoria,
      id_empresa: req.usuario.id_empresa,
    });

    res.status(201).json(egreso);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear egreso" });
  }
};



// =====================================
// OBTENER TODOS (PAGINADO + FILTROS)
// =====================================
const obtenerEgresos = async (req, res) => {
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

    // 🔎 búsqueda
    if (search) {
      where.descripcion = {
        [Op.like]: `%${search}%`,
      };
    }

    // 📅 rango de fechas
    if (fecha_inicio && fecha_fin) {
      where.fecha = {
        [Op.between]: [fecha_inicio, fecha_fin],
      };
    }

    // 🏷 filtro por categoría
    if (id_categoria) {
      where.id_categoria = id_categoria;
    }

    const { count, rows } = await Egreso.findAndCountAll({
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
    res.status(500).json({ message: "Error al obtener egresos" });
  }
};



// =====================================
// OBTENER POR ID
// =====================================
const obtenerEgresoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const egreso = await Egreso.findOne({
      where: {
        id_egreso: id,
        id_empresa: req.usuario.id_empresa,
      },
      include: [
        {
          model: Categoria,
          as: "categoria",
        },
      ],
    });

    if (!egreso) {
      return res.status(404).json({
        message: "Egreso no encontrado",
      });
    }

    res.json(egreso);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener egreso" });
  }
};



// =====================================
// ACTUALIZAR
// =====================================
const actualizarEgreso = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, monto, fecha, id_categoria } = req.body;

    const egreso = await Egreso.findOne({
      where: {
        id_egreso: id,
        id_empresa: req.usuario.id_empresa,
      },
    });

    if (!egreso) {
      return res.status(404).json({
        message: "Egreso no encontrado",
      });
    }

    await egreso.update({
      descripcion: descripcion ?? egreso.descripcion,
      monto: monto ?? egreso.monto,
      fecha: fecha ?? egreso.fecha,
      id_categoria: id_categoria ?? egreso.id_categoria,
    });

    res.json(egreso);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar egreso" });
  }
};



// =====================================
// ELIMINAR
// =====================================
const eliminarEgreso = async (req, res) => {
  try {
    const { id } = req.params;

    const egreso = await Egreso.findOne({
      where: {
        id_egreso: id,
        id_empresa: req.usuario.id_empresa,
      },
    });

    if (!egreso) {
      return res.status(404).json({
        message: "Egreso no encontrado",
      });
    }

    await egreso.destroy();

    res.json({
      message: "Egreso eliminado correctamente",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar egreso" });
  }
};

module.exports = {
  crearEgreso,
  obtenerEgresos,
  obtenerEgresoPorId,
  actualizarEgreso,
  eliminarEgreso,
};