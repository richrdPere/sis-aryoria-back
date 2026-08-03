module.exports = (db) => {

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

};