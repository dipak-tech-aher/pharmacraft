module.exports = function (sequelize, DataType) {
  const PurchaseOrderTxn = sequelize.define('PurchaseOrderTxn', {
    poTxnId: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    poId: {
      type: DataType.INTEGER
    },
    poCatId: {
      type: DataType.INTEGER
    },
    poRecievedQty: {
      type: DataType.INTEGER
    },
    poRate: {
      type: DataType.INTEGER
    },
    poQty: {
      type: DataType.INTEGER
    },
    poCgstPercentage: {
      type: DataType.INTEGER
    },
    poCgst: {
      type: DataType.INTEGER
    },
    poSgst: {
      type: DataType.INTEGER
    },
    poSgstPercentage: {
      type: DataType.INTEGER
    },
    poIgst: {
      type: DataType.INTEGER
    },
    poIgstPercentage: {
      type: DataType.INTEGER
    },
    poTotalRate: {
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
      tableName: 'purchase_order_txn'
    }
  )
  PurchaseOrderTxn.associate = function (models) {
    models.PurchaseOrderTxn.belongsTo(models.Category, {
      foreignKey: 'poCatId',
      as: 'categoryDetails'
    })
  }
  return PurchaseOrderTxn
}
