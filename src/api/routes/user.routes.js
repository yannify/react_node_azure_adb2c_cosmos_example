const services = require('../services');
const express = require('express');
const router = express.Router();
const { userService } = services;

router.get('/users', async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// router.post('/users', async (req, res, next) => {
//   userService.postUser(req, res);
//   res.status(201).json(req.body);
// });

// router.put('/users/:id', async (req, res, next) => {
//   userService.putUser(req, res);
//   res.status(200).json(req.body);
// });

module.exports = router;
