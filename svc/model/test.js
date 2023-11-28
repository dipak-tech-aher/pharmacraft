module.exports = function (sequelize, DataType) {
  const Test = sequelize.define('Test', {
    tId: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fName: {
      type: DataType.STRING
    },
    lName: {
      type: DataType.STRING
    },
  },
  {
    // timestamps: true,
    underscored: true,
    tableName: 'test'
  }
  )
  Test.associate = function (models) {
  
  }
  return Test
}
