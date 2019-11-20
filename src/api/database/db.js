const Gremlin = require('gremlin');
const { endpoint, primaryKey, database, container } = require('../config');

const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(`/dbs/${database.id}/colls/${container.id}`, primaryKey);
const client = new Gremlin.driver.Client(
  endpoint, 
  { 
      authenticator,
      traversalsource : "g",
      rejectUnauthorized : true,
      mimeType : "application/vnd.gremlin-v2.0+json"
  }
);

module.exports = client;