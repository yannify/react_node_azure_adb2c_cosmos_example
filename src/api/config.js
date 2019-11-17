module.exports = {
  endpoint: '',
  key: '',
  database: {
    id: 'DataDatabase'
  },
  containers: {
    usersContainer : {
      id: 'UsersContainer',
      partitionKey: { kind: 'Hash', paths: ['/country'] }
    }
  }
};