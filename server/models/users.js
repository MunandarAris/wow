'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      //user to profile (one to one) with hasOne
      users.hasOne(models.profile,{
        as : "profile",
        foreignKey : {
          name : "idUser"
        }
      });

      //user to bookPlaylist (one to one) with hasOne
      // users.hasOne(models.bookplaylists,{
      //   as : "bookPlaylists",
      //   foreignKey : {
      //     name : "idUser"
      //   }
      // });

      //user to transactions (one to many) with hasMany
      users.hasMany(models.transactions,{
        as : "transactions",
        foreignKey : {
          name : "idUser"
        }
      });

    }
  };
  users.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    fullName : DataTypes.STRING,
    role: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};