'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      //profile to users (one to one) with belongsTo
      profile.belongsTo(models.users,{
        as : "users",
        foreignKey : {
          name : "idUser"
        }
      })

    }
  };
  profile.init({
    gender: DataTypes.STRING,
    mobilePhone: DataTypes.STRING,
    address: DataTypes.TEXT,
    image: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'profile',
  });
  return profile;
};