const db = require("../../../database/models");

// Modelos
const { Categoria } = db;

const updateCategoria = async (id_categoria, body) => {

  const categoria = await Categoria.findByPk(id_categoria);

  if (!categoria) {
    throw new Error("La categoría no existe.");
  }

  const {
    nombre,
    tipo,
    descripcion,
    color,
    icono,
    estado,
  } = body;

  await categoria.update({

    nombre: nombre ?? categoria.nombre,

    tipo: tipo ?? categoria.tipo,

    descripcion: descripcion ?? categoria.descripcion,

    color: color ?? categoria.color,

    icono: icono ?? categoria.icono,

    estado: estado ?? categoria.estado,

  });

  return categoria;

};

module.exports = updateCategoria;