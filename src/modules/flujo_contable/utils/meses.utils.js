const NOMBRES_MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

/**
 * Convierte los valores DECIMAL de Sequelize a Number.
 */
function convertirNumero(valor) {
  const numero = Number(valor ?? 0);

  if (!Number.isFinite(numero)) {
    return 0;
  }

  return Number(numero.toFixed(2));
}

/**
 * Agrupa filas de subcategorías dentro de sus categorías.
 */
function agruparPorCategoria(detalle) {
  const categoriasMap = new Map();

  for (const item of detalle) {
    const categoriaKey = String(item.id_categoria);

    if (!categoriasMap.has(categoriaKey)) {
      categoriasMap.set(categoriaKey, {
        id_categoria: item.id_categoria,
        categoria: item.categoria,
        tipo: item.tipo,
        color: item.color,
        icono: item.icono,
        total: 0,
        cantidad_movimientos: 0,
        subcategorias: [],
      });
    }

    const categoria = categoriasMap.get(categoriaKey);

    categoria.subcategorias.push({
      id_subcategoria: item.id_subcategoria,
      nombre: item.subcategoria,
      orden: item.orden,
      es_predeterminada: item.es_predeterminada,
      total: item.total,
      cantidad_movimientos: item.cantidad_movimientos,
    });

    categoria.total = convertirNumero(
      categoria.total + item.total
    );

    categoria.cantidad_movimientos +=
      item.cantidad_movimientos;
  }

  return Array.from(categoriasMap.values());
}


module.exports = {
  NOMBRES_MESES,
  convertirNumero,
  agruparPorCategoria
};