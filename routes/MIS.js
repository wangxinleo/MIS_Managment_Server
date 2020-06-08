const express = require('express')
const router = express.Router()
const db = require('../database/db')

router.post('/getEmpData', (req, res, next) => {
  let reqData = req.body
  for (const [key, value] of Object.entries(reqData)) {
    console.log(key, value)
  }
  // const sql = `
  // select top 1000 * from [BPM_ArchivedData] where
  // (Subject like '%832104%'
  // or Subject like '%8321%'
  // or Subject like '%李文林%'
  // )and WF_ProcessName like '%MIS权限申请流程%'
  // order by WF_DocCreated desc
  // `
  // console.dir()
  // db(sql, (result) => {})
  return res.json({
    code: 200,
    msg: 'success',
    totalCount: 0,
    data: reqData,
  })
})

module.exports = router
