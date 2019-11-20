const express = require('express');
const router = express.Router();

router.use('/', require('./person.routes'));

module.exports = router;