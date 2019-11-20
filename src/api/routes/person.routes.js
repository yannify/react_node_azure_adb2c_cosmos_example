const services = require('../services');
const express = require('express');
const router = express.Router();

const models = require('../models');
const { Person, Skill, Knows } = models;

router.get('/person', async (req, res, next) => {
 
  try {
    // TODO:  this comes from request
    const person1 = {
      name: 'John',
      email: 'john@gmail.com',
      age: 24,
      dob: new Date(),
    };

    const person2 = {
      name: 'Jane',
      email: 'jane@gmail.com',
      age: 22,
      dob: new Date(),
    };

    const john = await Person.create(person1);
    const jane = await Person.create(person2);
    var result = await john.createEdge(Knows, { 'since': new Date()}, jane, true);


    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get('/peeps', async (req, res, next) => {
 
  try {
    const result = await Person.findAll({'age': 23});
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get('/person/:id/skills', async (req, res, next) => {

});

module.exports = router;



// const { personService } = services;

// router.get('/person', async (req, res, next) => {
//   // TODO:..
//   try {
//     const result = await personService.createPerson({
//       name: 'fooboo',
//       email: 'foo@gmail.com',
//       age: 24,
//       dob: new Date(),
//     });



//     res.status(200).json(result);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error);
//   }
// });

// router.get('/peeps', async (req, res, next) => {
//   // TODO:..
//   try {
//     const result = await personService.findAll({'age': 23});
//     res.status(200).json(result);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error);
//   }
// });

// router.get('/person/:id/skills', async (req, res, next) => {

// });




// const services = require('../services');
// const express = require('express');
// const router = express.Router();
// const { userService } = services;

// router.get('/users', async (req, res, next) => {
//   try {
//     const users = await userService.getUsers();
//     res.status(200).json(users);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error);
//   }
// });

// // router.post('/users', async (req, res, next) => {
// //   userService.postUser(req, res);
// //   res.status(201).json(req.body);
// // });

// // router.put('/users/:id', async (req, res, next) => {
// //   userService.putUser(req, res);
// //   res.status(200).json(req.body);
// // });

// module.exports = router;
