const _ = require("lodash");
const client = require('../database/db');
const { database, containers } = require('../config');
const container = client.database(database.id).container(containers['usersContainer'].id);
const schemas = require('../schemas');
const { userSchema } = schemas;

class User {
  constructor(data) {
    this.data = this.sanitize(data);
  }

  sanitize(data) {
    data = data || {};
    schema = userSchema;
    return _.pick(_.defaults(data, schema), _.keys(schema));
  }

  async save() {

  }

  // static methods used at the class level
  static async find() {
    // query to return all items
    const querySpec = {
      query: 'SELECT * FROM root r WHERE r.country = @country',
      parameters: [
        {
          name: '@country',
          value: 'usa'
        }
      ]
    }

    const { resources: results } = await container.items.query(querySpec).fetchAll();
    return results;
  }

  static async findById() {
    // implement find
  }
}

module.exports = User;