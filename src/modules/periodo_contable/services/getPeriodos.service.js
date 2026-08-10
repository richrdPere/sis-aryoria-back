const db = require("../../../database/models");
const { Op } = require("sequelize");

// Modelos
const { PeriodoContable } = db;

const getPeriodosContables = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;

  const where = {};

  // ==========================================================
  // EMPRESA
  // ==========================================================
  if (!query.id_empresa) {
    throw new Error("Debe indicar la empresa.");
  }

  where.id_empresa = query.id_empresa;

  // ==========================================================
  // ESTADO
  // ==========================================================
  if (query.estado) {
    where.estado = query.estado.toUpperCase();
  }

  // ==========================================================
  // AÑO
  // ==========================================================
  if (query.anio) {
    where.anio = query.anio;
  }

  // ==========================================================
  // MES
  // ==========================================================
  if (query.mes) {
    where.mes = query.mes;
  }

  // ==========================================================
  // BÚSQUEDA POR NOMBRE
  // ==========================================================
  if (query.search) {
    where.nombre = {
      [Op.like]: `%${query.search}%`,
    };
  }

  // ==========================================================
  // CONSULTA
  // ==========================================================
  const { rows, count } = await PeriodoContable.findAndCountAll({
    where,
    order: [
      ["anio", "DESC"],
      ["mes", "DESC"],
    ],
    limit,
    offset,
  });

  // ==========================================================
  // PAGINACIÓN
  // ==========================================================
  const totalPages = Math.ceil(count / limit);

  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

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

module.exports = getPeriodosContables;