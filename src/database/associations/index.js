module.exports = (db) => {

    // - Auth
    require("./auth.associations")(db);

    // - Empresas
    require("./empresas.associations")(db);

    // - Finanzas
    require("./finanzas.associations")(db);

    // require("./clientes.associations")(db);

    // require("./empresas.associations")(db);

    // require("./proyectos.associations")(db);

}