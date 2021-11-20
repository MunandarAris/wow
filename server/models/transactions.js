'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      //transaction to user (one to one) belongsTo
      transactions.belongsTo(models.users,{
        as : "user",
        foreignKey : {
          name : "idUser"
        }
      });

    }
  };
  transactions.init({
    idUser: DataTypes.INTEGER,
    proofTransaction: DataTypes.STRING,
    remainingActive: DataTypes.INTEGER,
    accountNumber: DataTypes.INTEGER,
    statusUser: DataTypes.STRING,
    timeApprove: DataTypes.STRING,
    statusPayment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transactions',
  });
  return transactions;
};