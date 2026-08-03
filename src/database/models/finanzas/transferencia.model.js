const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

const Transferencia = sequelize.define(
    "Transferencia",
    {
        id_transferencia: {
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
        },

        id_usuario: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

        id_cuenta_origen: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

        id_cuenta_destino: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        monto: {
            type: DataTypes.DECIMAL(14, 2),
            allowNull: false,
        },

        descripcion: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        estado: {
            type: DataTypes.ENUM(
                "COMPLETADA",
                "ANULADA"
            ),
            allowNull: false,
            defaultValue: "COMPLETADA",
        },
    },
    {
        tableName: "transferencias",
        timestamps: true,
        paranoid: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
    }
);