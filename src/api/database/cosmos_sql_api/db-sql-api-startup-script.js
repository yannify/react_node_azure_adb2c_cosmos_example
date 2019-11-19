const client = require('./sql-api-db');
const { cosmosSqlApi } = require('../../config');

/**
 * Create the database if it does not exist
 */
async function createDatabase(databaseId) {
  const { database } = await client.databases.createIfNotExists({
    id: databaseId
  })
  console.log(`Created database:\n${database.id}\n`)
}

/**
 * Read the database definition
 */
async function readDatabase(databaseId) {
  const { resource: databaseDefinition } = await client
    .database(databaseId)
    .read()
  console.log(`Reading database:\n${databaseDefinition.id}\n`)
}

/**
 * Create the container if it does not exist
 */
async function createContainer(databaseId, containerId, partitionKey) {
  const { container } = await client
    .database(databaseId)
    .containers.createIfNotExists(
      { id: containerId, partitionKey },
      { offerThroughput: 400 }
    )
  console.log(`Created container:\n${container.id}\n`)
}

/**
 * Read the container definition
 */
async function readContainer(databaseId, containerId) {
  const { resource: containerDefinition } = await client
    .database(databaseId)
    .container(containerId)
    .read()
  console.log(`Reading container:\n${containerDefinition.id}\n`)
}

async function initialize () {
  await createDatabase(cosmosSqlApi.database.id);
  await readDatabase(cosmosSqlApi.database.id);
  await createContainer(cosmosSqlApi.database.id, cosmosSqlApi.containers['usersContainer'].id, cosmosSqlApi.containers['usersContainer'].partitionKey);
  await readContainer(cosmosSqlApi.database.id, cosmosSqlApi.containers['usersContainer'].id);
}

module.exports = {
  initialize,
};