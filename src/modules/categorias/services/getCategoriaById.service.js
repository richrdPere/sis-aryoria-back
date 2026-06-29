const db = require("../../../database/models");

// Modelos
const { Categoria, Empresa } = db;

const getCategoriaById = async (id_categoria) => {

  const categoria = await Categoria.findByPk(id_categoria, {

    include: [
      {
        model: Empresa,
        as: "empresa",
        attributes: [
          "id_empresa",
          "razon_social",
          "nombre_comercial",
          "ruc"
        ]
      }
    ]

  });

  if (!categoria) {
    throw new Error("La categoría no existe.");
  }

  return categoria;

};

module.exports = getCategoriaById;