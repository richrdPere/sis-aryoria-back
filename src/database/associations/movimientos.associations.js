// src/database/associations/movimientos.associations.js

module.exports = (db) => {
    /*************************************************************
     * EMPRESA -> CATEGORÍAS
     *************************************************************/
    db.Empresa.hasMany(db.Categoria, {
        foreignKey: {
            name: "id_empresa",
            allowNull: false,
        },
        as: "categorias",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    });

    db.Categoria.belongsTo(db.Empresa, {
        foreignKey: {
            name: "id_empresa",
            allowNull: false,
        },
        as: "empresa",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    });

    /*************************************************************
     * EMPRESA -> SUBCATEGORÍAS
     *************************************************************/
    db.Empresa.hasMany(db.Subcategoria, {
        foreignKey: {
            name: "id_empresa",
            allowNull: false,
        },
        as: "subcategorias",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    });

    db.Subcategoria.belongsTo(db.Empresa, {
        foreignKey: {
            name: "id_empresa",
            allowNull: false,
        },
        as: "empresa",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    });

    /*************************************************************
     * CATEGORÍA -> SUBCATEGORÍAS
     *************************************************************/
    db.Categoria.hasMany(db.Subcategoria, {
        foreignKey: {
            name: "id_categoria",
            allowNull: false,
        },
        as: "subcategorias",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    });

    db.Subcategoria.belongsTo(db.Categoria, {
        foreignKey: {
            name: "id_categoria",
            allowNull: false,
        },
        as: "categoria",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    });

    /*************************************************************
     * EMPRESA -> MOVIMIENTOS
     *************************************************************/
    db.Empresa.hasMany(db.Movimiento, {
        foreignKey: {
            name: "id_empresa",
            allowNull: false,
        },
        as: "movimientos",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    });

    db.Movimiento.belongsTo(db.Empresa, {
        foreignKey: {
            name: "id_empresa",
            allowNull: false,
        },
        as: "empresa",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    });

    /*************************************************************
     * CATEGORÍA -> MOVIMIENTOS
     *************************************************************/
    db.Categoria.hasMany(db.Movimiento, {
        foreignKey: {
            name: "id_categoria",
            allowNull: false,
        },
        as: "movimientos",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    });

    db.Movimiento.belongsTo(db.Categoria, {
        foreignKey: {
            name: "id_categoria",
            allowNull: false,
        },
        as: "categoria",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    });

    /*************************************************************
     * SUBCATEGORÍA -> MOVIMIENTOS
     *************************************************************/
    db.Subcategoria.hasMany(db.Movimiento, {
        foreignKey: {
            name: "id_subcategoria",
            allowNull: true,
        },
        as: "movimientos",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    });

    db.Movimiento.belongsTo(db.Subcategoria, {
        foreignKey: {
            name: "id_subcategoria",
            allowNull: true,
        },
        as: "subcategoria",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    });

    /*************************************************************
     * EMPRESA -> CUENTAS FINANCIERAS
     *************************************************************/
    db.Empresa.hasMany(db.CuentaFinanciera, {
        foreignKey: {
            name: "id_empresa",
            allowNull: false,
        },
        as: "cuentasFinancieras",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    });

    db.CuentaFinanciera.belongsTo(db.Empresa, {
        foreignKey: {
            name: "id_empresa",
            allowNull: false,
        },
        as: "empresa",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    });

    /*************************************************************
     * CUENTA FINANCIERA -> MOVIMIENTOS
     *************************************************************/
    db.CuentaFinanciera.hasMany(db.Movimiento, {
        foreignKey: {
            name: "id_cuenta",
            allowNull: true,
        },
        as: "movimientos",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    });

    db.Movimiento.belongsTo(db.CuentaFinanciera, {
        foreignKey: {
            name: "id_cuenta",
            allowNull: true,
        },
        as: "cuentaFinanciera",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    });

    /*************************************************************
     * PERÍODO CONTABLE -> MOVIMIENTOS
     *************************************************************/
    db.PeriodoContable.hasMany(db.Movimiento, {
        foreignKey: {
            name: "id_periodo",
            allowNull: false,
        },
        as: "movimientos",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    });

    db.Movimiento.belongsTo(db.PeriodoContable, {
        foreignKey: {
            name: "id_periodo",
            allowNull: false,
        },
        as: "periodoContable",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    });

    /*************************************************************
     * USUARIO -> MOVIMIENTOS
     *************************************************************/
    db.Usuario.hasMany(db.Movimiento, {
        foreignKey: {
            name: "id_usuario",
            allowNull: false,
        },
        as: "movimientos",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    });

    db.Movimiento.belongsTo(db.Usuario, {
        foreignKey: {
            name: "id_usuario",
            allowNull: false,
        },
        as: "usuario",
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
    });
};