const createPeriodoCService = require("./createPeriodo.service");
const getPeriodosCService = require("./getPeriodos.service");
const getPeriodoCByIdService = require("./getPeriodoById.service");
const updatePeriodoCService = require("./updatePeriodo.service");
const deletePeriodoCService = require("./deletePeriodo.service");
const changeEstadoPeriodoCService = require("./changeEstadoPeriodo.service");

module.exports = {
    createPeriodoCService,
    getPeriodosCService,
    getPeriodoCByIdService,
    updatePeriodoCService,
    deletePeriodoCService,
    changeEstadoPeriodoCService
}