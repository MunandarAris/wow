const bcrypt  = require('bcrypt');

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    const salt = await bcrypt.genSalt(10);
    const id = Math.floor(Math.random() * 100000000)

    await queryInterface.bulkInsert('users', [{
      id,
      email: 'admin@gmail.com',
      password: await bcrypt.hash('admin098',salt),
      role: 'admin',
      fullName : 'Admin'
    }]);
    

    await queryInterface.bulkInsert('profiles', [{
      idUser : id,
      image : "default.svg",
    }]);

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
