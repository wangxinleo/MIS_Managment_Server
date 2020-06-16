const mysql = require('mysql')
// 配置
// var config = {
//   server: '172.18.8.20',
//   database: 'bpm',
//   user: 'ds',
//   password: 'Pw123456',
//   port: 1433,
// }

const bpm = 'mssql://ds:Pw123456@172.18.8.20/bpm'
const sso = 'mssql://ds:Pw123456@172.18.8.20/sso'
const archive = mysql.createConnection({
  host: '172.18.8.15',
  user: 'root',
  password: 'admin',
  database: 'archive',
})
module.exports.bpm = bpm
module.exports.sso = sso
module.exports.archive = archive
