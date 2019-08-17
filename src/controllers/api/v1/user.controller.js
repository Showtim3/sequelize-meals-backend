const express = require('express');
const userRouter = express.Router();
const UserService = require('../../../services/user.service').UserService;

userRouter.post('/register', async (req, res) => {
    let {name, email, password, role,calorieGoal} = req.body;
    const sr = await UserService.register({name,email,password,role,calorieGoal});
    res.send(sr)
});

userRouter.post('/login', async (req, res) => {
    let {email, password} = req.body;
    const sr = await UserService.login({email,password});
    res.send(sr)
});

userRouter.get('/', async (req,res) => {
    let jwt = req.headers['jwt'];
    const sr = await UserService.getUsers(jwt);
    res.send(sr);
});

userRouter.get('/logout', async (req,res) => {
    let jwt = req.headers['jwt'];
    const sr = await UserService.logout(jwt);
    res.send(sr);
});

module.exports = {userRouter};


