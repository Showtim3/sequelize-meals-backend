const express = require('express');
const userRouter = express.Router();
const UserService = require('../../../services/user.service').UserService;
const ServiceResponse = require('../../../lib/service.response').ServiceResponse;

userRouter.post('/register', async (req, res) => {
    let {name, email, password, calorieGoal} = req.body;
    const sr = await UserService.register({name,email,password,calorieGoal});
    res.send(sr);
});

module.exports = {userRouter};


