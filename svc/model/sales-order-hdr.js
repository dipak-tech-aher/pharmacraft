module.exports = function (sequelize, DataType) {
    const SalesOrderHdr = sequelize.define('SalesOrderHdr', {
      soId: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      soFromId: {
        type: DataType.INTEGER
      },
      soToId: {
        type: DataType.INTEGER
      },
      soYetToBillQty: {
        type: DataType.INTEGER
      },
      soBilledQty: {
        type: DataType.INTEGER
      },
      soTotalQty: {
        type: DataType.INTEGER
      },
      soCgstPercentage: {
        type: DataType.INTEGER
      },
      soSgstPercentage: {
        type: DataType.INTEGER
      },
      soIgstPercentage: {
        type: DataType.INTEGER
      },
      soTotalSgst: {
        type: DataType.INTEGER
      },
      soTotalCgst: {
        type: DataType.INTEGER
      },
      soTotalIgst: {
        type: DataType.INTEGER
      },
      soOtherCharges: {
        type: DataType.INTEGER
      },
      soTotal: {
        type: DataType.INTEGER
      },
      soSubTotal: {
        type: DataType.INTEGER
      },
      soNumber: {
        type: DataType.STRING
      },
      soMrpNumber: {
        type: DataType.STRING
      },
      soTransporter: {
        type: DataType.STRING
      },
      soTransportMode: {
        type: DataType.STRING
      },
      soFriegth: {
        type: DataType.STRING
      },
      soPackingForwarding: {
        type: DataType.STRING
      },
      soInsurance: {
        type: DataType.STRING
      },
      soDate: {
        type: DataType.DATE
      },
      soDeliveryNoteDate: {
        type: DataType.DATE
      },
      soDeliveryNote: {
        type: DataType.STRING
      },
      soPaymentTerms: {
        type: DataType.STRING
      },
      soMrpDate: {
        type: DataType.DATE
      },
      soDeliveryDate: {
        type: DataType.DATE
      },
      soStatus: {
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
        tableName: 'sales_order_hdr'
      }
    )
    SalesOrderHdr.associate = function (models) {
      models.SalesOrderHdr.belongsTo(models.BusinessEntity, {
        foreignKey: 'soStatus',
        as: 'statusDesc'
      })
      models.SalesOrderHdr.belongsTo(models.Company, {
        foreignKey: 'soFromId',
        as: 'fromDetails'
      })
      models.SalesOrderHdr.belongsTo(models.Company, {
        foreignKey: 'soToId',
        as: 'toDetails'
      })
      models.SalesOrderHdr.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'createdByDetails'
      })
      models.SalesOrderHdr.belongsTo(models.User, {
        foreignKey: 'updatedBy',
        as: 'updatedByDetails'
      })
      models.SalesOrderHdr.hasMany(models.SalesOrderTxn, {
        foreignKey: 'soId',
        as: 'soTxnDetails'
      })
    }
    return SalesOrderHdr
  }
  