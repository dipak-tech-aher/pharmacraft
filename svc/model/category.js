module.exports = function (sequelize, DataType) {
  const Category = sequelize.define('Category', {
    catId: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    catName: {
      type: DataType.STRING
    },
    catHsnSac: {
      type: DataType.STRING
    },
    catSize: {
      type: DataType.STRING
    },
    catNumber: {
      type: DataType.STRING
    },
    catDesc: {
      type: DataType.STRING
    },
    catUnit: {
      type: DataType.STRING
    },
    catStatus: {
      type: DataType.STRING,
      defaultValue: 'AC'
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
      tableName: 'category'
    }
  )
  Category.associate = function (models) {
    models.Category.belongsTo(models.BusinessEntity, {
      foreignKey: 'catStatus',
      as: 'statusDesc'
    })
    models.Category.hasOne(models.Inventory, {
      foreignKey: 'invCatId',
      sourceKey: 'catId',
      as: 'invDetails'
    })
    models.Category.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'createdByDetails'
    })
    models.Category.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updatedByDetails'
    })
  }
  return Category
}
