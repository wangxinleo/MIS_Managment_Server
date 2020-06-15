const express = require('express')
const router = express.Router()
const fs = require('fs')
const multer = require('multer')

router.post(
  '/MISFile',
  multer({
    dest: 'files',
  }).single('file'),
  (req, res, next) => {
    let file = req.file
    //这里修改文件名字，比较随意
    fs.renameSync('./files/' + file.filename, './files/' + file.originalname)
    return res.json({
      code: 200,
      msg: '上传成功!',
    })
  }
)

module.exports = router
