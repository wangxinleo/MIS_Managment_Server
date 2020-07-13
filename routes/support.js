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
// BPM_MainData数据恢复脚本
router.post('/inputMan', (req, res, next) => {
  const reqData = req.body.list
  reqData.forEach((element) => {
    const sql =
      `
		select  WF_FormBody from BPM_MainData where WF_DocNumber = ` +
      element.WF_DocNumber +
      `
	`
    db.bpm(sql, (result) => {
      if (result.rowsAffected[0] === 0) {
        // 已修改
        return res.json({
          WF_DocNumber: element.WF_DocNumber,
          xmldata: null,
        })
      } else {
        let $ = cheerio.load(result.recordsets[0][0].WF_FormBody)
        let head = '<Items>'
        let body = ''
        let food = '</Items>'
        $('input').each((i, e) => {
          const type = $(e).attr('type')
          const checked = $(e).attr('checked')
          if (type === 'checkbox' || type === 'radio') {
            if (checked) {
              body +=
                '<WFItem name="' +
                $(e).attr('name') +
                '" type="1280">' +
                $(e).val() +
                '</WFItem>'
            }
          } else {
            let value = $(e).val()
            if (value === undefined) {
              value = ''
            }
            body +=
              '<WFItem name="' +
              $(e).attr('name') +
              '" type="1280">' +
              value +
              '</WFItem>'
          }
        })
        $('TEXTAREA').each((i, e) => {
          let value = $(e).val()
          if (value === undefined) {
            value = ''
          }
          body +=
            '<WFItem name="' +
            $(e).attr('name') +
            '" type="1280">' +
            value +
            '</WFItem>'
        })
        $('select').each((i, e) => {
          body +=
            '<WFItem name="' +
            $(e).attr('name') +
            '" type="1280">' +
            $('select option[selected]').text() +
            '</WFItem>'
        })
        const data = {
          WF_DocNumber: element.WF_DocNumber,
          xmldata: head + body + food,
        }
        console.log(data)
        const sql2 =
          `update BPM_MainData set XmlData='` +
          data.xmldata +
          `' where WF_DocNumber = '` +
          data.WF_DocNumber +
          `'`
        db.bpm(sql2, (result) => {
          console.log(data.WF_DocNumber + ' 修改完毕')
        })
      }
    })
  })
  return res.json({ success: '修改完成' })
})
// router.use('/inputMan', (data, req, res, next) => {
//   const sql2 =
//     `update BPM_MainData set XmlData='` +
//     data.xmldata +
//     `' where WF_DocNumber = '` +
//     data.WF_DocNumber +
//     `'`
//   return res.json(data)
//   db.bpm(sql2, (result) => {
//     return res.json({
//       WF_DocNumber: data.WF_DocNumber,
//       success: true,
//     })
//   })
// })

function getvalue(value) {
  return value
}
module.exports = router
