module.exports = {
  endpoint: '',
  primaryKey: '',
  database: {
    id: 'graph-db'
  },
  container: {
    id: 'thegraph',
    partitionKey: { kind: 'Hash', paths: ['/pk'] }
  }
};


