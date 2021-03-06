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

mealRouter.get('/:id', async (req,res) => {
    const jwt = req.headers['jwt'];
    const mealId = req.params.id;
    const sr = await MealService.getMeal(jwt,mealId);
    res.send(sr);
});

mealRouter.get('/', async (req,res) => {
    const jwt = req.headers['jwt'];
    const {minCalorie,maxCalorie,minDate,maxDate,minTime,maxTime,limit,offset} = req.body;
    const sr = await MealService.getMeals(jwt,{minCalorie,maxCalorie,minDate,maxDate,minTime,maxTime,limit,offset});
    res.send(sr);
});

mealRouter.put('/:id', async (req,res) => {
    const jwt = req.headers['jwt'];
    const mealId = req.params.id;
    const {title,calorie,time,date} = req.body;
    const sr = await MealService.updateMeal(jwt,mealId,{title,calorie,time,date});
    res.send(sr);
});

mealRouter.delete('/:id', async (req,res) => {
    const jwt = req.headers['jwt'];
    const mealId = req.params.id;
    const sr = await MealService.deleteMeal(jwt,mealId);
    res.send(sr);
});




module.exports = {mealRouter};


