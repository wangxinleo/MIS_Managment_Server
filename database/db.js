// 配置文件
var config = require('./database.config.js')
var sql = require('mssql')

var bpm = (sqlstr, callback) => {
  sql
    .connect(config.bpm)
    .then(function () {
      return sql.query(sqlstr)
    })
    .then((result) => {
      callback(result)
      sql.close()
    })
    .catch((error) => {
      console.log(error)
      sql.close()
    })
}

var sso = (sqlstr, callback) => {
  sql
    .connect(config.sso)
    .then(function () {
      return sql.query(sqlstr)
    })
    .then((result) => {
      callback(result)
      sql.close()
    })
    .catch((error) => {
      console.log(error)
      sql.close()
    })
}

module.exports.bpm = bpm
module.exports.sso = sso
