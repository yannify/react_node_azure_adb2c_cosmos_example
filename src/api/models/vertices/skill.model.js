const g = require('../../database/gremlin-orm');

const Skill = g.define('skill', {
  name: {
    type: g.STRING  
  },
  type: {
    type: g.STRING
  } 
});

module.exports = Skill;