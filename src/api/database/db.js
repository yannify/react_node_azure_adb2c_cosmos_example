const cosmos = require('@azure/cosmos');
const { endpoint, key } = require('../config');

const { CosmosClient } = cosmos;
const client = new CosmosClient({ endpoint, key });

module.exports = client;