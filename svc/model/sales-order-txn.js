module.exports = function (sequelize, DataType) {
  const SalesOrderTxn = sequelize.define('SalesOrderTxn', {
    soTxnId: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    soId: {
      type: DataType.INTEGER
    },
    soCatId: {
      type: DataType.INTEGER
    },
    soBilledQty: {
      type: DataType.INTEGER
    },
    soStatus: {
      type: DataType.STRING//OPEN, BILLED
    },
    soRecievedQty: {
      type: DataType.INTEGER
    },
    soRate: {
      type: DataType.INTEGER
    },
    soQty: {
      type: DataType.INTEGER
    },
    soTotalRate: {
      type: DataType.INTEGER
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
      tableName: 'sales_order_txn'
    }
  )
  SalesOrderTxn.associate = function (models) {
    models.SalesOrderTxn.belongsTo(models.Category, {
      foreignKey: 'soCatId',
      as: 'categoryDetails'
    })
  }
  return SalesOrderTxn
}
