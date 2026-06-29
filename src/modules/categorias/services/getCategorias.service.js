const db = require("../../../database/models");
const { Op } = require("sequelize");

const { Categoria } = db;

const getCategorias = async (query) => {

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;

  const where = {};

  // Empresa
  if (query.id_empresa) {
    where.id_empresa = query.id_empresa;
  }

  // Tipo
  if (query.tipo) {
    where.tipo = query.tipo.toUpperCase();
  }

  // Estado
  if (query.estado !== undefined) {
    where.estado = query.estado === "true";
  }

  // Búsqueda
  if (query.search) {
    where.nombre = {
      [Op.like]: `%${query.search}%`
    };
  }

  const { rows, count } = await Categoria.findAndCountAll({

    where,

    order: [
      ["nombre", "ASC"]
    ],

    offset,

    limit,

  });

  return {
    categorias: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    }
  };
};

module.exports = getCategorias;