const Sequelize = require('sequelize');
const config = require('../db/config/config').development;
const User = require('../db/models/user');
const Meal = require('../db/models/meals')
const sequelize = new Sequelize(config);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
        console.error("Unable to connect to the database:", err);
});

const MealService = Meal(sequelize, Sequelize);
const UserService = User(sequelize, Sequelize);
module.exports = {
    MealService,
    UserService
};
