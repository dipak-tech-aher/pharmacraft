module.exports = function (sequelize, DataType) {
  const Payments = sequelize.define('Payments', {
    pId: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pPrId: {
      type: DataType.INTEGER
    },
    pReceiptAmount: {
      type: DataType.INTEGER
    },
    pCId: {
      type: DataType.INTEGER
    },
    pInvId: {
      type: DataType.INTEGER
    },
    pAmount: {
      type: DataType.INTEGER
    },
    pStatus: {
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
      tableName: 'payments'
    }
  )
  Payments.associate = function (models) {
    models.Payments.belongsTo(models.BusinessEntity, {
      foreignKey: 'pStatus',
      as: 'statusDesc'
    })
    models.Payments.belongsTo(models.BusinessEntity, {
      foreignKey: 'pPrId',
      as: 'receiptDesc'
    })
    models.Payments.belongsTo(models.BusinessEntity, {
      foreignKey: 'pCId',
      as: 'companyDetails'
    })
    models.Payments.belongsTo(models.BusinessEntity, {
      foreignKey: 'pInvId',
      as: 'invoiceDetails'
    })
    models.Payments.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'createdByDetails'
    })
    models.Payments.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updatedByDetails'
    })
  }
  return Payments
}
