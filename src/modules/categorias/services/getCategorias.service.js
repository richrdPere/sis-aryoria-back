const db = require("../../../database/models");
const { Op } = require("sequelize");

const { Categoria } = db;

const getCategorias = async (query) => {
  // ==========================================================
  // PAGINACIÓN
  // ==========================================================
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.max(parseInt(query.limit) || 10, 1);

  const offset = (page - 1) * limit;

  // ==========================================================
  // FILTROS
  // ==========================================================
  const where = {};

  // Empresa
  if (query.id_empresa) {
    where.id_empresa = query.id_empresa;
  }

  // Tipo
  if (query.tipo) {
    where.tipo = query.tipo.trim().toUpperCase();
  }

  // Estado
  if (query.estado !== undefined) {
    where.estado =
      query.estado.toString().toLowerCase() === "true";
  }

  // Búsqueda
  if (query.search) {
    const search = query.search.trim();

    if (search) {
      where.nombre = {
        [Op.like]: `%${search}%`,
      };
    }
  }

  // ==========================================================
  // CONSULTA
  // ==========================================================
  const { rows, count } =
    await Categoria.findAndCountAll({
      where,

      order: [
        ["nombre", "ASC"],
      ],

      offset,
      limit,
    });

  // ==========================================================
  // PAGINACIÓN
  // ==========================================================
  const totalPages = Math.ceil(count / limit);

  const hasNextPage =
    page < totalPages;

  const hasPreviousPage =
    page > 1;

  // ==========================================================
  // RESPONSE
  // ==========================================================
  return {
    items: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    },
  };
};

module.exports = getCategorias;