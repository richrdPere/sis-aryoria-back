// src/modules/reportes/utils/meses.util.js

const MESES = [
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

function obtenerNombreMes(numeroMes) {
  return MESES[numeroMes - 1] ?? "Mes desconocido";
}

function crearEstructuraMeses() {
  return MESES.map((nombre, index) => ({
    mes: index + 1,
    nombre,

    id_periodo: null,
    periodo: null,
    estado_periodo: null,

    saldo_inicial: 0,
    total_ingresos: 0,
    total_egresos: 0,
    flujo_neto: 0,
    saldo_final: 0,

    ingresos_acumulados: 0,
    egresos_acumulados: 0,
    flujo_acumulado: 0,

    cantidad_ingresos: 0,
    cantidad_egresos: 0,
    cantidad_movimientos: 0,

    tiene_periodo: false,
  }));
}

function convertirNumero(value) {
  const numero = Number(value ?? 0);

  return Number.isFinite(numero)
    ? Number(numero.toFixed(2))
    : 0;
}

module.exports = {
  MESES,
  obtenerNombreMes,
  crearEstructuraMeses,
  convertirNumero,
};