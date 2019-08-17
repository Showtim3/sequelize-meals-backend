const express = require('express');
const app = express();
const PORT = 3000 | process.env.NODE_ENV;
const mealRouter = express.Router();


mealRouter.get('/', (req,res) => {
    res.send("Hello World from mealRouter");
});

module.exports = {mealRouter};


