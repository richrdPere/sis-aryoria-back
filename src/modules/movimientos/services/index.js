const registerMovimientoService = require("./registerMovimiento.service");
const getMovimientosService = require("./getMovimientos.service");
const getMovimientoByIdService = require("./getMovimientoById.service");
const updateMovimientoService = require("./updateMovimiento.service");
const deleteMovimientoService = require("./deleteMovimiento.service");

module.exports = {
  registerMovimientoService,
  getMovimientosService,
  getMovimientoByIdService,
  updateMovimientoService,
  deleteMovimientoService
}