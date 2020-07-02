var express = require('express')
var router = express.Router()
const db = require('../database/db')

router.post('/getPwdChangeDate', (req, res, next) => {
  const reqData = req.body
  const sql =
    `
	select [UserName],[PasswordChangeDate] from [BPM_UserProfile] where ([PasswordChangeDate] is null or [PasswordChangeDate] = '' ) and [UserName] = '` +
    reqData.username +
    `'
	`
  db.bpm(sql, (result) => {
    if (result.rowsAffected[0] === 0) {
      return res.json({
        username: reqData.username,
        ischange: true,
      })
    } else {
      return res.json({
        username: reqData.username,
        ischange: false,
      })
    }
  })
})

module.exports = router
