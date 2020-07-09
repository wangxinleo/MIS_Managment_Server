// 配置文件
var config = require('./database.config.js')
var sql = require('mssql')
var mysql = require('mysql')

var bpm = (sqlstr, callback) => {
  sql
    .connect(config.bpm)
    .then(function () {
      return sql.query(sqlstr)
    })
    .then((result) => {
      sql.close()
      callback(result)
    })
    .catch((error) => {
      sql.close()
      console.log(error)
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

var archive = (sqlstr, callback) => {
  const sql = mysql.createConnection(config.archive)
  sql.connect()
  sql.query(sqlstr, (error, result, fileds) => {
    if (error) {
      console.log(error)
      sql.end()
    }
    callback(result)
    sql.end()
  })
}

module.exports.bpm = bpm
module.exports.sso = sso
module.exports.archive = archive
