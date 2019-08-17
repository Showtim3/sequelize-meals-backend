const express = require('express');
const userRouter = express.Router();
const UserService = require('../../../services/user.service').UserService;

userRouter.post('/register', async (req, res) => {
    const {name, email, password, role,calorieGoal} = req.body;
    const sr = await UserService.register({name,email,password,role,calorieGoal});
    res.send(sr)
});

userRouter.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const sr = await UserService.login({email,password});
    res.send(sr)
});

userRouter.get('/logout', async (req,res) => {
    const jwt = req.headers['jwt'];
    const sr = await UserService.logout(jwt);
    res.send(sr);
});

userRouter.get('/details', async (req,res) => {
    const jwt = req.headers['jwt'];
    const sr = await UserService.getUser(jwt,null);
    res.send(sr);
});

userRouter.get('/:id', async(req,res) => {
    const jwt = req.headers['jwt'];
    const userId = req.params.id;
    const sr = await UserService.getUser(jwt,userId);
    res.send(sr);
});

userRouter.get('/', async (req,res) => {
    const jwt = req.headers['jwt'];
    const sr = await UserService.getUsers(jwt);
    res.send(sr);
});

userRouter.post('/', async (req,res) => {
    const jwt = req.headers['jwt'];
    const userId = req.params.id;
    const {name,email,calorieGoal,role, password} = req.body;
    const sr = await UserService.createUser(jwt, {name,email,calorieGoal,role,password});
    res.send(sr);
});

userRouter.put('/:id', async (req,res) => {
    const jwt = req.headers['jwt'];
    const userId = req.params.id;
    const {name,email,calorieGoal,role} = req.body;
    const sr = await UserService.updateUser(jwt,userId, {name,email,calorieGoal,role});
    res.send(sr);
});

userRouter.delete('/:id', async (req,res) => {
    const jwt = req.headers['jwt'];
    const userId = req.params.id;
    const sr = await UserService.deleteUser(jwt,userId);
    res.send(sr);
});

module.exports = {userRouter};


