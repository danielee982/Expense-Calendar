var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.json({ msg: "Welcome to Expense Calendar API!" });
});

module.exports = router;
