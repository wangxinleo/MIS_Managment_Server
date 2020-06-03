var express = require('express')
var jwt = require('jwt-simple')
var router = express.Router()

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

router.post('/info', function (req, res, next) {
  const { accessToken } = req.body
  const app = req.app
  if (accessToken) {
    try {
      var decoded = jwt.decode(accessToken, app.get('jwtTokenSecret'))
      if (decoded.exp <= Date.now()) {
        res.end('Access token has expired', 400)
      }
    } catch (err) {
      return next()
    }
  } else {
    next()
  }
  let permissions = decoded.permissions
  let userName = decoded.user
  // if ('admin-accessToken' === accessToken) {
  //   permissions = ['admin']
  //   userName = 'admin'
  // }
  // if ('editor-accessToken' === accessToken) {
  //   permissions = ['editor']
  //   userName = 'editor'
  // }
  // if ('test-accessToken' === accessToken) {
  //   permissions = ['admin', 'editor', 'test']
  //   userName = 'test'
  // }
  return res.json({
    code: 200,
    msg: 'success',
    data: {
      permissions,
      userName,
      avatar: 'handleRandomImage(50, 50)',
    },
  })
})

module.exports = router
