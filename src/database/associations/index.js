module.exports = (db)=>{

    require("./auth.associations")(db);

    require("./personas.associations")(db);

    // require("./clientes.associations")(db);

    // require("./empresas.associations")(db);

    // require("./proyectos.associations")(db);

}