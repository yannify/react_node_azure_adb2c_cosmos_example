const models = require('../models');
const { Person } = models;
const util = require('util');

async function createPerson(props) {
  const createPerson = util.promisify(Person.create);
  await createPerson(props);
}