const db = require("../../../database/models");

// Modelos
const { Categoria, Empresa } = db;

const getCategoriasByTipo = async (tipo, id_empresa) => {

  if (!tipo) {
    throw new Error("Debe especificar el tipo de categoría.");
  }

  const categorias = await Categoria.findAll({

    where: {
      tipo: tipo.toUpperCase(),
      id_empresa,
      estado: true,
    },

    include: [
      {
        model: Empresa,
        as: "empresa",
        attributes: [
          "id_empresa",
          "razon_social",
          "nombre_comercial"
        ]
      }
    ],

    order: [
      ["nombre", "ASC"]
    ]

  });
  return categorias;
};

module.exports = getCategoriasByTipo;