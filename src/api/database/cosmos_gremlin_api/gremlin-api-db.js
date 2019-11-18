const Gremlin = require('gremlin');
const { cosmosGremlinApi } = require('../../config');

const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(`/dbs/${cosmosGremlinApi.database.id}/colls/${cosmosGremlinApi.containers['graphContainer'].id}`, cosmosGremlinApi.primaryKey);
const client = new Gremlin.driver.Client(
  config.endpoint, 
  { 
      authenticator,
      traversalsource : "g",
      rejectUnauthorized : true,
      mimeType : "application/vnd.gremlin-v2.0+json"
  }
);

module.exports = client;