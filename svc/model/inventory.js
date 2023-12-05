module.exports = function (sequelize, DataType) {
  const Inventory = sequelize.define('Inventory', {
    invId: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    invCompanyId: {
      type: DataType.INTEGER
    },
    invCatId: {
      type: DataType.INTEGER
    },
    invQty: {
      type: DataType.INTEGER
    },
    invStatus: {
      type: DataType.STRING
    },
    createdBy: {
      type: DataType.INTEGER
    },
    createdAt: {
      type: DataType.DATE
    },
    updatedBy: {
      type: DataType.INTEGER
    },
    updatedAt: {
      type: DataType.DATE
    }
  },
    {
      timestamps: true,
      underscored: true,
      tableName: 'inventory'
    }
  )
  Inventory.associate = function (models) {
    models.Inventory.belongsTo(models.BusinessEntity, {
      foreignKey: 'invStatus',
      as: 'statusDesc'
    })
    models.Inventory.belongsTo(models.Company, {
      foreignKey: 'invCompanyId',
      as: 'companyDetails'
    })
    models.Inventory.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'createdByDetails'
    })
    models.Inventory.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updatedByDetails'
    })
  }
  return Inventory
}
