const express = require('express');
const app = express();
const PORT = 3000 | process.env.NODE_ENV;
const router = express.Router();
const userRouter = require('../controllers/api/v1/user.controller').userRouter;
const mealRouter = require('../controllers/api/v1/meal.controller').mealRouter;

app.use(express.json());
app.use('/api/v1/user',userRouter);
app.use('/api/v1/meal',mealRouter);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
});
