const services = require('../services');
const express = require('express');
const router = express.Router();
const { personService } = services;

router.get('/person', async (req, res, next) => {
  // TODO:..
  try {
    const f = await personService.createPerson({
      name: 'foo',
      age: 23,
      dob: new Date(),
      pk: 'pk'
    });
    res.status(200).json('success');
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }


});

router.get('/person/:id/skills', async (req, res, next) => {

});



module.exports = router;