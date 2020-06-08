const express = require('express')
const router = express.Router()
const data = require('../setting/changelog')
router.post('/getFetchData', (req, res, next) => {
  const totalCount = data.length
  return res.json({
    code: 200,
    msg: 'success',
    totalCount: totalCount,
    data: data,
  })
})

module.exports = router
