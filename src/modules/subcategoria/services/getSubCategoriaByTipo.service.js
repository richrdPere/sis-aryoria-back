const db = require("../../../database/models");

// Modelos
const { Subcategoria, Categoria } = db;



const getSubcategoriasByTipoService = async ({ id_empresa, tipo, }) => {
  
  const tipoNormalizado = tipo
    ?.toString()
    .trim()
    .toUpperCase();

  if (!["INGRESO", "EGRESO"].includes(tipoNormalizado)) {
    throw new Error(
      "El tipo debe ser INGRESO o EGRESO."
    );
  }

  const subcategorias = await Subcategoria.findAll({
    attributes: [
      "id_subcategoria",
      "id_empresa",
      "id_categoria",
      "nombre",
      "descripcion",
      "es_predeterminada",
      "orden",
      "estado",
    ],

    include: [
      {
        model: Categoria,
        as: "categoria",

        attributes: [
          "id_categoria",
          "nombre",
          "tipo",
          "color",
          "icono",
        ],

        required: true,

        where: {
          id_empresa,
          tipo: tipoNormalizado,
          estado: true,
        },
      },
    ],

    where: {
      id_empresa,
      estado: true,
    },

    order: [
      [
        {
          model: Categoria,
          as: "categoria",
        },
        "nombre",
        "ASC",
      ],
      ["orden", "ASC"],
      ["nombre", "ASC"],
    ],
  });

  return subcategorias;
};

module.exports = getSubcategoriasByTipoService;