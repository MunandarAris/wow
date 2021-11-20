'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class books extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  books.init({
    title: DataTypes.STRING,
    publicationDate: DataTypes.DATE,
    pages: DataTypes.INTEGER,
    author: DataTypes.STRING,
    isbn: DataTypes.INTEGER,
    aboutBook: DataTypes.TEXT,
    bookCover: DataTypes.STRING,
    bookFile: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'books',
  });
  return books;
};