var express = require('express');
var router = express.Router();
const db = require('../config/db')

/* GET users listing. */
router.get('/a', function (req, res, next) {
  // db.query("CALL `p_user_Add`(2)", [], function (res, fie) {
  //   console.log(res)
  // })
  res.send('respond with a resource');
});

module.exports = router;
