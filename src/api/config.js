module.exports = {
  cosmosSqlApi: {
    endpoint: 'https://ym-prototypes-cosmos-sql.documents.azure.com:443/',
    primaryKey: 'o3VbacIISbeWgXLpNa0HXGIE3rq2eUuzeVIoxDm6SmvlLzt3TbmwYcPwcNTthvJnl3yjtMBdrxqTIyej83OpPQ==',
    database: {
      id: 'DataDatabase'
    },
    containers: {
      usersContainer: {
        id: 'UsersContainer',
        partitionKey: { kind: 'Hash', paths: ['/country'] }
      }
    }
  },
  cosmosGremlinApi: {
    endpoint: 'wss://ym-prototypes-cosmos-gremlin.gremlin.cosmos.azure.com:443/',
    primaryKey: 'B9oYZgQYIGtIi9DOFQJZ0Ksdv9LocGF50Pgafve5AgJUQxY7yd6iqiY2w20aJGwr9cwtts1WTZZO0ws1Mi8Jmg==',
    database: {
      id: 'graph-db'
    },
    containers: {
      graphContainer: {
        id: 'thegraph',
        partitionKey: { kind: 'Hash', paths: ['/pk'] }
      }
    }
  },
};


