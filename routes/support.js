var express = require('express')
var router = express.Router()
const db = require('../database/db')
const cheerio = require('cheerio')

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
// 脚本1
router.post('/inputMan', (req, res, next) => {
  const reqData = req.body
  const sql =
    `
		select  WF_FormBody from BPM_MainData where WF_DocNumber = ` +
    reqData.WF_DocNumber +
    `
	`
  db.bpm(sql, (result) => {
    if (result.rowsAffected[0] === 0) {
      // 已修改
      return res.json({
        WF_DocNumber: reqData.WF_DocNumber,
        xmldata: null,
      })
    } else {
      let $ = cheerio.load(result.recordsets[0][0].WF_FormBody)
      let head = '<Items>'
      let body = ''
      let food = '</Items>'
      $('input').each((i, e) => {
        body +=
          '<WFItem name="' +
          $(e).attr('name') +
          '" type="1280">' +
          $(e).val() +
          '</WFItem>'
      })
      $('TEXTAREA').each((i, e) => {
        body +=
          '<WFItem name="' +
          $(e).attr('name') +
          '" type="1280">' +
          $(e).val() +
          '</WFItem>'
      })
      const data = {
        WF_DocNumber: reqData.WF_DocNumber,
        xmldata: head + body + food,
      }
      next(data)
    }
  })
})
router.use('/inputMan', (data, req, res, next) => {
  const sql2 =
    `update BPM_MainData set XmlData='` +
    data.xmldata +
    `' where WF_DocNumber = '` +
    data.WF_DocNumber +
    `'`
  db.bpm(sql2, (result) => {
    return res.json({
      WF_DocNumber: data.WF_DocNumber,
      success: true,
    })
  })
})

function getvalue(value) {
  return value
}
module.exports = router
