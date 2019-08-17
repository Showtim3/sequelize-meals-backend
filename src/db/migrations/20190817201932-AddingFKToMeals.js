'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.addConstraint(
        'Meals', // name of Source model
        ['userId'], // name of the key we're adding
        {
          type: 'FOREIGN KEY',
          name:'FK_users_user_id',
          references: {
            table: 'Users', // name of Target model
            field: 'id', // key in Target model that we're referencing
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.removeColumn(
        'Meals', // name of Source model
        'userId' // key we want to remove
    );

  }
};
