'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bookPlaylists extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
       
      //bookPlaylists to users (one to one) with belongsTo
      bookPlaylists.belongsTo(models.users,{
        as : "user",
        foreignKey : {
          name : "idUser"
        }
      });

      bookPlaylists.belongsTo(models.books,{
        as : "book",
        foreignKey : {
          name : "idBook"
        }
      });

    }
  };
  bookPlaylists.init({
    idUser: DataTypes.INTEGER,
    idBook: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'bookPlaylists',
  });
  return bookPlaylists;
};