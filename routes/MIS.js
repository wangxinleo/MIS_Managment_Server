const express = require('express')
const router = express.Router()
const db = require('../database/db')
const fxp = require('../middleware/fxp')
// 处理需要查询的字段
function jointSql(empData) {
  let slotSql = ''
  const length = empData.length
  empData.forEach((item, index) => {
    if (index == 0) {
      slotSql += `(Subject like '%` + item + `%' `
    } else if (index < length) {
      slotSql += `or Subject like '%` + item + `%' `
    }
  })
  slotSql += ')'

  return slotSql
}

router.post('/getEmpData', (req, res, next) => {
  const reqData = req.body
  reqData.empText = reqData.empText.filter((el) => {
    return el !== ''
  })
  // 处理需要查询的字段
  const slotSql = jointSql(reqData.empText)
  const sql =
    `
	select top ` +
    reqData.pageSize +
    ` WF_DocUNID,WF_ProcessUNID,WF_AddName,WF_ProcessName,WF_DocNumber,WF_DocCreated,Subject,COUNT(1) OVER() AS total,XmlData from [BPM_ArchivedData] 
	where WF_DocNumber not in
(select top ` +
    (reqData.page - 1) * reqData.pageSize +
    ` WF_DocNumber from [BPM_ArchivedData]
where WF_ProcessName like '%MIS权限申请流程%' and
	` +
    slotSql +
    `
order by WF_DocCreated desc)
	and WF_ProcessName like '%MIS权限申请流程%' 
	and ` +
    slotSql +
    `
order by WF_DocCreated desc
	`
  db(sql, (result) => {
    if (result.recordset.length === 0) {
      return res.json({
        code: 204,
        msg: 'OA权限申请记录:查询无数据',
        data: [],
      })
    }
    // xml转json
    result.recordset.forEach((item) => {
      let obj = {}
      const xml2json = fxp(item.XmlData)
      item.XmlData = xml2json.Items.WFItem
      item.XmlData.forEach((item) => {
        obj[item.name] = item.value
      })
      item.XmlData = obj
    })
    return res.json({
      code: 200,
      msg: 'success',
      page: reqData.page,
      pageSize: reqData.pageSize,
      searchHistroy: reqData.empText,
      totalCount: result.recordset[0].total,
      data: result.recordset,
    })
  })
})

module.exports = router
