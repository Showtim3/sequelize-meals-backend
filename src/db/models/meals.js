'use strict';

module.exports = (sequelize, DataTypes) => {
 const Meals =   sequelize.define('Meals', {
    calorie: DataTypes.NUMBER,
    title: DataTypes.STRING,
    minCalorie: DataTypes.NUMBER
  }, {
     getterMethods: {
       getMeal(){
         return {
           calorie: this.calorie,
           title: this.title,
           minCalorie: this.minCalorie
         };
       }
     }
   });
  Meals.associate = function(models) {
    // associations can be defined here
  };
  return Meals;
};
