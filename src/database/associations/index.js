module.exports = (db) => {

    // - Auth
    require("./auth.associations")(db);

    // - Empresas
    require("./empresas.associations")(db);

    // - Finanzas
    require("./finanzas.associations")(db);

    // - Movimientos    
    require("./movimientos.associations")(db);


}