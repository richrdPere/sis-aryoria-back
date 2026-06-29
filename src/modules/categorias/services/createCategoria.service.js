const db = require("../../../database/models");

const { Categoria, Empresa, } = db;


const createCategoria = async (data) => {

  const {
    id_empresa,
    nombre,
    tipo,
    descripcion,
    color,
    icono,
  } = data;

  // Verificar empresa
  const empresa = await Empresa.findByPk(id_empresa);

  if (!empresa) {
    throw new Error("La empresa no existe.");
  }

  // Validar duplicado
  const existe = await Categoria.findOne({
    where: {
      id_empresa,
      nombre,
      tipo,
    },
  });

  if (existe) {
    throw new Error("Ya existe una categoría con ese nombre.");
  }

  // Crear categoría
  const categoria = await Categoria.create({
    id_empresa,
    nombre,
    tipo,
    descripcion,
    color,
    icono,
  });

  return categoria;
};

module.exports = createCategoria;