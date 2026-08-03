const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/database");

const Presupuesto = sequelize.define(
    "Presupuesto",
    {
        id_presupuesto: {
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

        id_categoria: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

        id_subcategoria: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },

        monto_presupuestado: {
            type: DataTypes.DECIMAL(14, 2),
            allowNull: false,
        },

        porcentaje_alerta: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 80,
        },

        observacion: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        estado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        tableName: "presupuestos",
        timestamps: true,
        paranoid: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",

        indexes: [
            {
                name: "uq_presupuesto_periodo_categoria_subcategoria",
                unique: true,
                fields: [
                    "id_periodo",
                    "id_categoria",
                    "id_subcategoria",
                ],
            },
        ],
    }
);