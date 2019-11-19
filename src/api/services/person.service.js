const models = require('../models');
const { Person } = models;
const util = require('util');

async function createPerson(props) {
  Person.create(props, (err, result) => {
    if (err) {
      var f = 'bar';
    }
    else {
      var z = 'foo';
    }
  });
  // const createPerson = util.promisify(Person.create);
  // await createPerson(props);
}

module.exports = {
  createPerson,
};