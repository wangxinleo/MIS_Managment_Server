var express = require('express')
var jwt = require('jwt-simple')
var moment = require('moment')
var router = express.Router()

/* GET home page. */
router.post('/login', (req, res, next) => {
  const { userName, password } = req.body
  if (userName !== 'admin' && password !== '123456') {
    return res.json({
      code: 500,
      msg: '帐户或密码不正确',
    })
  }
  const app = req.app
  const expires = moment().add('days', 7).valueOf()
  const token = jwt.encode(
    {
      user: userName,
      exp: expires,
      permissions: ['admin'],
    },
    app.get('jwtTokenSecret')
  )
  return res.json({
    code: 200,
    msg: '登陆成功',
    data: {
      accessToken: token,
    },
  })
})

router.post('/logout', (req, res, next) => {
  return res.json({
    code: 200,
    msg: '退出登录成功',
  })
})

module.exports = router
