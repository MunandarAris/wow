'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      publicationDate: {
        type: Sequelize.DATEONLY
      },
      pages: {
        type: Sequelize.INTEGER
      },
      author: {
        type: Sequelize.STRING
      },
      isbn: {
        type: Sequelize.INTEGER
      },
      aboutBook: {
        type: Sequelize.TEXT
      },
      bookCover: {
        type: Sequelize.STRING
      },
      bookFile: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue : Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue : Sequelize.fn('now')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('books');
  }
};