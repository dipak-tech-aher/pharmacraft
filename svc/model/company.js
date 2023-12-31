module.exports = function (sequelize, DataType) {
  const Company = sequelize.define('Company', {
    cId: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cType: {
      type: DataType.STRING
    },
    cName: {
      type: DataType.STRING
    },
    cAddress: {
      type: DataType.STRING
    },
    cPincode: {
      type: DataType.INTEGER
    },
    cState: {
      type: DataType.STRING
    },
    cCountry: {
      type: DataType.STRING
    },
    cPhone: {
      type: DataType.STRING
    },
    cEmail: {
      type: DataType.STRING
    },
    cFax: {
      type: DataType.STRING
    },
    cWebsite: {
      type: DataType.STRING
    },
    cGst: {
      type: DataType.STRING
    },
    cPan: {
      type: DataType.STRING
    },
    cLic: {
      type: DataType.STRING
    },
    cStatus: {
      type: DataType.STRING
    },
    cBankName: {
      type: DataType.STRING
    },
    cAccountNo: {
      type: DataType.STRING
    },
    cBranchName: {
      type: DataType.STRING
    },
    cIfsc: {
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
      tableName: 'company'
    }
  )
  Company.associate = function (models) {
    models.Company.belongsTo(models.BusinessEntity, {
      foreignKey: 'cStatus',
      as: 'statusDesc'
    })
    models.Company.belongsTo(models.BusinessEntity, {
      foreignKey: 'cType',
      as: 'typeDesc'
    })
    models.Company.belongsTo(models.BusinessEntity, {
      foreignKey: 'cCountry',
      as: 'cCountryDesc'
    })
    models.Company.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'createdByDetails'
    })
    models.Company.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updatedByDetails'
    })
  }
  return Company
}
