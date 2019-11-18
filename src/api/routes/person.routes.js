const services = require('../services');
const express = require('express');
const router = express.Router();
const { personService } = services;

router.get('/person', async (req, res, next) => {

});

router.get('/person/:id/skills', async (req, res, next) => {

});



module.exports = router;