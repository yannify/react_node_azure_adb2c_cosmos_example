# react_node_azure_adb2c_cosmos_example
Example React, Node, Azure AD B2C CosmosDB

### configuration
##### React Client
..* src/client/src/Config.js
..* appId
..* authority
..* scopes

..* https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-quickstarts-spa
..* https://github.com/microsoftgraph/msgraph-training-reactspa

##### api
..* src/api/config
..* https://github.com/Azure-Samples/azure-cosmos-db-sql-api-nodejs-getting-started/blob/master/app.js

### run the application
terminal 1:
..* cd src/client
..* npm install
..* npm start

terminal 2: 
..* cd src/api 
..* npm install
..* npm start

This is a work in progress...

Sample launch.json
```
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "program": "${workspaceFolder}/src/api/bin/www",
      "env": {
        "COSMOS_ENDPOINT": "wss://yourgremlinendpointhere.gremlin.cosmos.azure.com:443/",
        "COSMOS_PRIMARY_KEY": "CosmosDBPrimayKeyFromAzurePortal",
      }
    }
  ]
}

```


