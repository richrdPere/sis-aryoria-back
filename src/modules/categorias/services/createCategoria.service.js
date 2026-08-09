const db = require("../../../database/models");

// Modelos
const {
  Categoria,
  Empresa,
} = db;

const createCategoria = async (data) => {

  const {
    id_empresa,
    nombre,
    tipo,
    naturaleza = "OTRO",
    descripcion,
    color,
    icono,
  } = data;

  // ============================================================
  // 1. VALIDAR EMPRESA
  // ============================================================
  const empresa = await Empresa.findByPk(id_empresa);

  if (!empresa) {
    throw new Error("La empresa no existe.");
  }

  // ============================================================
  // 2. NORMALIZAR DATOS
  // ============================================================
  const nombreNormalizado = typeof nombre === "string"
    ? nombre.trim()
    : nombre;

  const tipoNormalizado = typeof tipo === "string"
    ? tipo.trim().toUpperCase()
    : tipo;

  const naturalezaNormalizada = typeof naturaleza === "string"
    ? naturaleza.trim().toUpperCase()
    : naturaleza;

  // ============================================================
  // 3. VALIDACIONES
  // ============================================================
  if (!nombreNormalizado) {
    throw new Error(
      "El nombre de la categoría es obligatorio."
    );
  }

  const tiposPermitidos = [
    "INGRESO",
    "EGRESO",
  ];

  if (!tiposPermitidos.includes(tipoNormalizado)) {
    throw new Error(
      "El tipo de categoría debe ser INGRESO o EGRESO."
    );
  }

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
  // 4. VALIDAR COHERENCIA TIPO / NATURALEZA
  // ============================================================
  if (
    naturalezaNormalizada === "VENTA" &&
    tipoNormalizado !== "INGRESO"
  ) {
    throw new Error(
      "Una categoría de naturaleza VENTA debe ser de tipo INGRESO."
    );
  }

  if (
    naturalezaNormalizada === "COMPRA" &&
    tipoNormalizado !== "EGRESO"
  ) {
    throw new Error(
      "Una categoría de naturaleza COMPRA debe ser de tipo EGRESO."
    );
  }

  // ============================================================
  // 5. VALIDAR DUPLICADO
  // ============================================================
  const existe = await Categoria.findOne({
    where: {
      id_empresa,
      nombre: nombreNormalizado,
      tipo: tipoNormalizado,
    },
  });

  if (existe) {
    throw new Error(
      "Ya existe una categoría con ese nombre para este tipo."
    );
  }

  // ============================================================
  // 6. CREAR CATEGORÍA
  // ============================================================
  const categoria = await Categoria.create({
    id_empresa,
    nombre: nombreNormalizado,
    tipo: tipoNormalizado,
    naturaleza: naturalezaNormalizada,
    descripcion: typeof descripcion === "string"
      ? descripcion.trim() || null
      : descripcion ?? null,
    color: typeof color === "string"
      ? color.trim() || null
      : color ?? null,
    icono: typeof icono === "string"
      ? icono.trim() || null
      : icono ?? null,
  });

  return categoria;
};

module.exports = createCategoria;