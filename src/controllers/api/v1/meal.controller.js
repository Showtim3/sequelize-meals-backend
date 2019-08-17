const express = require('express');
const mealRouter = express.Router();
const MealService = require('../../../services/meal.service').MealService;

mealRouter.post('/', async (req,res) => {
    const jwt = req.headers['jwt'];
    const {title,calorie,time,date} = req.body;
    console.log("In controller");
    const sr = await MealService.createMeal(jwt,{title,calorie,time,date});
    res.send(sr);
});


mealRouter.get('/', async (req,res) => {
    res.send("Hello from meal");
});

module.exports = {mealRouter};


