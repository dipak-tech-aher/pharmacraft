module.exports = function (sequelize, DataType) {
  const PurchaseOrderHdr = sequelize.define('PurchaseOrderHdr', {
    poId: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    poFromId: {
      type: DataType.INTEGER
    },
    poToId: {
      type: DataType.INTEGER
    },
    poTotalQty: {
      type: DataType.INTEGER
    },
    poTotalSgst: {
      type: DataType.INTEGER
    },
    poTotalCgst: {
      type: DataType.INTEGER
    },
    poTotalIgst: {
      type: DataType.INTEGER
    },
    poTotal: {
      type: DataType.INTEGER
    },
    poSubTotal: {
      type: DataType.INTEGER
    },
    poNumber: {
      type: DataType.STRING
    },
    poMrpNumber: {
      type: DataType.STRING
    },
    poTransporter: {
      type: DataType.STRING
    },
    poTransportMode: {
      type: DataType.STRING
    },
    poFriegth: {
      type: DataType.STRING
    },
    poPackingForwarding: {
      type: DataType.STRING
    },
    poInsurance: {
      type: DataType.STRING
    },
    poDate: {
      type: DataType.DATE
    },
    poMrpDate: {
      type: DataType.DATE
    },
    poDeliveryDate: {
      type: DataType.DATE
    },
    poStatus: {
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
      tableName: 'purchase_order_hdr'
    }
  )
  PurchaseOrderHdr.associate = function (models) {
    models.PurchaseOrderHdr.belongsTo(models.BusinessEntity, {
      foreignKey: 'poStatus',
      as: 'statusDesc'
    })
    models.PurchaseOrderHdr.belongsTo(models.Company, {
      foreignKey: 'poFromId',
      as: 'fromDetails'
    })
    models.PurchaseOrderHdr.belongsTo(models.Company, {
      foreignKey: 'poToId',
      as: 'toDetails'
    })
    models.PurchaseOrderHdr.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'createdByDetails'
    })
    models.PurchaseOrderHdr.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updatedByDetails'
    })
    models.PurchaseOrderHdr.hasMany(models.PurchaseOrderTxn, {
      foreignKey: 'poId',
      as: 'poTxnDetails'
    })
  }
  return PurchaseOrderHdr
}
