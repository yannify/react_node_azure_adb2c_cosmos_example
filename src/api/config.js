module.exports = {
  endpoint: process.env.COSMOS_ENDPOINT,
  primaryKey: process.env.COSMOS_PRIMARY_KEY,
  database: {
    id: 'graph-db'
  },
  container: {
    id: 'thegraph',
    partitionKey: { kind: 'Hash', paths: ['/pk'] }
  }
};