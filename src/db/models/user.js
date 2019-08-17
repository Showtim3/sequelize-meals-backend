'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    role: {
      type:DataTypes.ENUM,
      values: ['admin', 'manager','regular']
    },
    email: DataTypes.STRING,
    calorieGoal: DataTypes.INTEGER,
  }, {
    getterMethods: {
      getUser(){
        const userObj = {
          name: this.name,
        };
        return userObj;
      }
    }
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
