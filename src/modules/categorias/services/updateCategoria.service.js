const db = require("../../../database/models");

// Modelos
const { Categoria } = db;

const updateCategoria = async (
  id_categoria,
  body
) => {
  // ============================================================
  // 1. BUSCAR CATEGORÍA
  // ============================================================
  const categoria =
    await Categoria.findByPk(id_categoria);

  if (!categoria) {
    throw new Error(
      "La categoría no existe."
    );
  }

  // ============================================================
  // 2. EXTRAER DATOS
  // ============================================================
  const {
    nombre,
    tipo,
    naturaleza,
    descripcion,
    color,
    icono,
    estado,
  } = body;

  // ============================================================
  // 3. NORMALIZAR VALORES
  // ============================================================

  const nombreNormalizado = nombre !== undefined
    ? typeof nombre === "string"
      ? nombre.trim()
      : nombre
    : categoria.nombre;

  const tipoNormalizado = tipo !== undefined
    ? typeof tipo === "string"
      ? tipo.trim().toUpperCase()
      : tipo
    : categoria.tipo;

  const naturalezaNormalizada = naturaleza !== undefined
    ? typeof naturaleza === "string"
      ? naturaleza.trim().toUpperCase()
      : naturaleza
    : categoria.naturaleza;

  // ============================================================
  // 4. VALIDAR NOMBRE
  // ============================================================
  if (!nombreNormalizado) {
    throw new Error(
      "El nombre de la categoría es obligatorio."
    );
  }

  // ============================================================
  // 5. VALIDAR TIPO
  // ============================================================
  const tiposPermitidos = [
    "INGRESO",
    "EGRESO",
  ];

  if (
    !tiposPermitidos.includes(
      tipoNormalizado
    )
  ) {
    throw new Error(
      "El tipo de categoría debe ser INGRESO o EGRESO."
    );
  }

  // ============================================================
  // 6. VALIDAR NATURALEZA
  // ============================================================
  const naturalezasPermitidas = [
    "VENTA",
    "COMPRA",
    "OTRO",
  ];

  if (
    !naturalezasPermitidas.includes(
      naturalezaNormalizada
    )
  ) {
    throw new Error(
      "La naturaleza debe ser VENTA, COMPRA u OTRO."
    );
  }

  // ============================================================
  // 7. VALIDAR COHERENCIA TIPO / NATURALEZA
  // ============================================================
  if (naturalezaNormalizada === "VENTA" && tipoNormalizado !== "INGRESO") {
    throw new Error(
      "Una categoría de naturaleza VENTA debe ser de tipo INGRESO."
    );
  }

  if (naturalezaNormalizada === "COMPRA" && tipoNormalizado !== "EGRESO") {
    throw new Error(
      "Una categoría de naturaleza COMPRA debe ser de tipo EGRESO."
    );
  }

  // ============================================================
  // 8. VALIDAR DUPLICADO
  // ============================================================
  const categoriaDuplicada =
    await Categoria.findOne({
      where: {
        id_empresa: categoria.id_empresa,
        nombre: nombreNormalizado,
        tipo: tipoNormalizado,
      },
    });

  if (
    categoriaDuplicada &&
    Number(
      categoriaDuplicada.id_categoria
    ) !== Number(id_categoria)
  ) {
    throw new Error(
      "Ya existe una categoría con ese nombre para este tipo."
    );
  }

  // ============================================================
  // 9. ACTUALIZAR CATEGORÍA
  // ============================================================
  await categoria.update({
    nombre: nombreNormalizado,
    tipo: tipoNormalizado,
    naturaleza: naturalezaNormalizada,
    descripcion: descripcion !== undefined
      ? typeof descripcion === "string"
        ? descripcion.trim() || null
        : descripcion
      : categoria.descripcion,

    color: color !== undefined
      ? typeof color === "string"
        ? color.trim() || null
        : color
      : categoria.color,

    icono: icono !== undefined
      ? typeof icono === "string"
        ? icono.trim() || null
        : icono
      : categoria.icono,

    estado: estado !== undefined
      ? estado
      : categoria.estado,
  });

  return categoria;
};

module.exports = updateCategoria;