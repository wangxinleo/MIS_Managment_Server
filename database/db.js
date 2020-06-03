// 配置文件
var config = require('./database.config.js')
var sql = require('mssql')

var db = (sqlstr, callback) => {
  sql
    .connect(config)
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
module.exports = db
