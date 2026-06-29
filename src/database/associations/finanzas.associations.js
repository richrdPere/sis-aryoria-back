module.exports = (db) => {

    /*************************************************************
     * EMPRESA -> CATEGORIAS
     *************************************************************/

    db.Empresa.hasMany(db.Categoria, {
        foreignKey: "id_empresa",
        as: "categorias",
    });

    db.Categoria.belongsTo(db.Empresa, {
        foreignKey: "id_empresa",
        as: "empresa",
    });

    /*************************************************************
     * EMPRESA -> PERIODOS CONTABLES
     *************************************************************/

    db.Empresa.hasMany(db.PeriodoContable, {
        foreignKey: "id_empresa",
        as: "periodosContables",
    });

    db.PeriodoContable.belongsTo(db.Empresa, {
        foreignKey: "id_empresa",
        as: "empresa",
    });

    /*************************************************************
     * EMPRESA -> MOVIMIENTOS
     *************************************************************/

    db.Empresa.hasMany(db.Movimiento, {
        foreignKey: "id_empresa",
        as: "movimientos",
    });

    db.Movimiento.belongsTo(db.Empresa, {
        foreignKey: "id_empresa",
        as: "empresa",
    });

    /*************************************************************
     * CATEGORIA -> MOVIMIENTOS
     *************************************************************/

    db.Categoria.hasMany(db.Movimiento, {
        foreignKey: "id_categoria",
        as: "movimientos",
    });

    db.Movimiento.belongsTo(db.Categoria, {
        foreignKey: "id_categoria",
        as: "categoria",
    });

    /*************************************************************
     * PERIODO CONTABLE -> MOVIMIENTOS
     *************************************************************/

    db.PeriodoContable.hasMany(db.Movimiento, {
        foreignKey: "id_periodo",
        as: "movimientos",
    });

    db.Movimiento.belongsTo(db.PeriodoContable, {
        foreignKey: "id_periodo",
        as: "periodoContable",
    });

    /*************************************************************
     * USUARIO -> MOVIMIENTOS
     *************************************************************/

    db.Usuario.hasMany(db.Movimiento, {
        foreignKey: "id_usuario",
        as: "movimientos",
    });

    db.Movimiento.belongsTo(db.Usuario, {
        foreignKey: "id_usuario",
        as: "usuario",
    });

};