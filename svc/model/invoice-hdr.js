module.exports = function (sequelize, DataType) {
  const InvoiceHdr = sequelize.define('InvoiceHdr', {
    invId: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    invSoId: {
      type: DataType.INTEGER
    },
    invFromId: {
      type: DataType.INTEGER
    },
    invBillToId: {
      type: DataType.INTEGER
    },
    invShipToId: {
      type: DataType.INTEGER
    },
    invTotalQty: {
      type: DataType.INTEGER
    },
    invCgstPercentage: {
      type: DataType.INTEGER
    },
    invSgstPercentage: {
      type: DataType.INTEGER
    },
    invIgstPercentage: {
      type: DataType.INTEGER
    },
    invTotalSgst: {
      type: DataType.INTEGER
    },
    invTotalCgst: {
      type: DataType.INTEGER
    },
    invTotalIgst: {
      type: DataType.INTEGER
    },
    invOtherCharges: {
      type: DataType.INTEGER
    },
    invTotal: {
      type: DataType.INTEGER
    },
    invOutstandingAmount: {
      type: DataType.INTEGER
    },
    invSubTotal: {
      type: DataType.INTEGER
    },
    invNumber: {
      type: DataType.STRING
    },
    invMrpNumber: {
      type: DataType.STRING
    },
    invTransporter: {
      type: DataType.STRING
    },
    invTransportMode: {
      type: DataType.STRING
    },
    invFriegth: {
      type: DataType.STRING
    },
    invPackingForwarding: {
      type: DataType.STRING
    },
    invInsurance: {
      type: DataType.STRING
    },
    invDate: {
      type: DataType.DATE
    },
    invDeliveryNoteDate: {
      type: DataType.DATE
    },
    invDeliveryNote: {
      type: DataType.STRING
    },
    invPaymentTerms: {
      type: DataType.STRING
    },
    invMrpDate: {
      type: DataType.DATE
    },
    invDeliveryDate: {
      type: DataType.DATE
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
      tableName: 'invoice_hdr'
    }
  )
  InvoiceHdr.associate = function (models) {
    models.InvoiceHdr.belongsTo(models.BusinessEntity, {
      foreignKey: 'invStatus',
      as: 'statusDesc'
    })
    models.InvoiceHdr.hasMany(models.InvoiceTxn, {
      foreignKey: 'invId',
      as: 'invoiceTxnDetails'
    })
    models.InvoiceHdr.belongsTo(models.SalesOrderHdr, {
      foreignKey: 'invSoId',
      as: 'soHdrDetails'
    })
    models.InvoiceHdr.belongsTo(models.Company, {
      foreignKey: 'invFromId',
      as: 'fromDetails'
    })
    models.InvoiceHdr.belongsTo(models.Company, {
      foreignKey: 'invBillToId',
      as: 'billToDetails'
    })
    models.InvoiceHdr.belongsTo(models.Company, {
      foreignKey: 'invShipToId',
      as: 'shipToDetails'
    })
    models.InvoiceHdr.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'createdByDetails'
    })
    models.InvoiceHdr.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updatedByDetails'
    })
  }
  return InvoiceHdr
}
