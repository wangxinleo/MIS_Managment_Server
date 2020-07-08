var express = require('express')
var router = express.Router()
const db = require('../database/db')

// 获取OA系统修改密码记录
router.get('/getPwdChangeDate', (req, res, next) => {
  const reqData = req.query
  reqData.username = decodeURI(reqData.username)
  const sql =
    `
	select [UserName],[PasswordChangeDate] from [BPM_UserProfile] where ([PasswordChangeDate] is not null or [PasswordChangeDate] <> '' ) and [UserName] = '` +
    reqData.username +
    `'
	`
  db.bpm(sql, (result) => {
    if (result.rowsAffected[0] === 0) {
      // 已修改
      return res.jsonp({
        username: reqData.username,
        ischange: false,
      })
    } else {
      // 未修改
      return res.jsonp({
        username: reqData.username,
        ischange: true,
      })
    }
  })
})

module.exports = router
