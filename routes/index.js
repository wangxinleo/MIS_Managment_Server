var express = require('express')
var router = express.Router()

/* GET home page. */
router.post('/login', function (req, res, next) {
  console.dir(req.body)
  res.json(req.body)
})

module.exports = router
