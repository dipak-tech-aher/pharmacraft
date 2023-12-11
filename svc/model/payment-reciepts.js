module.exports = function (sequelize, DataType) {
  const PaymentReceipts = sequelize.define('PaymentReceipts', {
    prId: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    prType: {
      type: DataType.STRING
    },
    prCId: {
      type: DataType.INTEGER
    },
    prAmount: {
      type: DataType.INTEGER
    },
    prAmountApplied: {
      type: DataType.INTEGER
    },
    prAvailableAmount: {
      type: DataType.INTEGER
    },
    prStatus: {
      type: DataType.STRING
    },
    prActivationStatus: {
      type: DataType.STRING
    },
    prChequeNo: {
      type: DataType.STRING
    },
    prTxnNo: {
      type: DataType.STRING
    },
    createdBy: {
      type: DataType.STRING
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
      tableName: 'payment_reciepts'
    }
  )
  PaymentReceipts.associate = function (models) {
    models.PaymentReceipts.belongsTo(models.BusinessEntity, {
      foreignKey: 'prStatus',
      as: 'statusDesc'
    })
    models.PaymentReceipts.belongsTo(models.Company, {
      foreignKey: 'prCId',
      as: 'companyDetails'
    })
    models.PaymentReceipts.belongsTo(models.BusinessEntity, {
      foreignKey: 'prType',
      as: 'receiptTypeDesc'
    })
    models.PaymentReceipts.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'createdByDetails'
    })
    models.PaymentReceipts.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updatedByDetails'
    })
  }
  return PaymentReceipts
}
