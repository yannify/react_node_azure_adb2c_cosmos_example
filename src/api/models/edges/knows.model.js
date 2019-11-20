const g = require('../../database/gremlin-orm');

const Knows = g.defineEdge('knows', {
  since: {
    type: g.DATE
  }
});

module.exports = Knows;