var jwt = require('jwt-simple')

module.exports = function (req, res, next) {
  var token =
    (req.body && req.body.access_token) ||
    (req.query && req.query.access_token) ||
    req.header['x-access-token']
}
