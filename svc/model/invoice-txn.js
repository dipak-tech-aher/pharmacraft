module.exports = function (sequelize, DataType) {
    const InvoiceTxn = sequelize.define('InvoiceTxn', {
      invTxnId: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      invId: {
        type: DataType.INTEGER
      },
      invCatId: {
        type: DataType.INTEGER
      },
      invRecievedQty: {
        type: DataType.INTEGER
      },
      invRate: {
        type: DataType.INTEGER
      },
      invQty: {
        type: DataType.INTEGER
      },
      invTotalRate: {
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
        tableName: 'invoice_txn'
      }
    )
    InvoiceTxn.associate = function (models) {
      models.InvoiceTxn.belongsTo(models.Category, {
        foreignKey: 'invCatId',
        as: 'categoryDetails'
      })
    }
    return InvoiceTxn
  }
  