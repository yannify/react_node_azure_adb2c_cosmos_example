const g = require('../../database/gremlin_orm/gremlin-orm');

const Uses = g.defineEdge('uses', {
  expert: {
    type: g.BOOLEAN
  },
  since: {
    type: g.DATE
  }
});

module.exports = Uses;