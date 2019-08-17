'use strict';

module.exports = (sequelize, DataTypes) => {
 const Meals =   sequelize.define('Meals', {
    calorie: DataTypes.NUMBER,
    title: DataTypes.STRING,
    date: DataTypes.DATE,
    time: DataTypes.TIME,
    userId: DataTypes.NUMBER,
  }, {
     getterMethods: {
     }
   });
  Meals.associate = function(models) {
    // associations can be defined here
      Meals.belongsTo(models.User, {as:'User', foreignKey:'userId'});
  };
  return Meals;
};
