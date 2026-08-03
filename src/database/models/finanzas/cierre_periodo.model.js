const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

const CierrePeriodo = sequelize.define(
    "CierrePeriodo",
    {
        id_cierre: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },

        id_empresa: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

        id_periodo: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: true,
        },

        id_usuario: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

        saldo_inicial: {
            type: DataTypes.DECIMAL(14, 2),
            allowNull: false,
        },

        total_ingresos: {
            type: DataTypes.DECIMAL(14, 2),
            allowNull: false,
        },

        total_egresos: {
            type: DataTypes.DECIMAL(14, 2),
            allowNull: false,
        },

        saldo_final: {
            type: DataTypes.DECIMAL(14, 2),
            allowNull: false,
        },

        total_pendiente_ingreso: {
            type: DataTypes.DECIMAL(14, 2),
            allowNull: false,
            defaultValue: 0,
        },

        total_pendiente_egreso: {
            type: DataTypes.DECIMAL(14, 2),
            allowNull: false,
            defaultValue: 0,
        },

        fecha_cierre: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },

        observacion: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: "cierres_periodo",
        timestamps: true,
        updatedAt: false,
        createdAt: "created_at",
    }
);