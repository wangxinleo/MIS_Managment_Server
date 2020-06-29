var createError = require('http-errors')
// var compression = require('compression')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
// 路由路径
var indexRouter = require('./routes/index')
var usersRouter = require('./routes/user')
var processEchartsRouter = require('./routes/processEcharts')
var changelogRouter = require('./routes/changelog')
var MISRouter = require('./routes/MIS')
var uploadRouter = require('./routes/upload')

var app = express()

//后端添加请求头解决跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '172.18.8.169')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type,accessToken ,Content-Length, Authorization, Accept,X-Requested-With'
  )
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('X-Powered-By', ' 3.2.1')
  next()
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
// 设置token密钥
app.set('jwtTokenSecret', 'xJCnfKONV')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// app.use(compression())
app.use(express.static(path.join(__dirname, 'public/dist')))
// 路由注册
app.use('/api', indexRouter)
app.use('/api/user', usersRouter)
app.use('/api/processEcharts', processEchartsRouter)
app.use('/api/changelog', changelogRouter)
app.use('/api/MIS', MISRouter)
app.use('/api/private/v1/upload', uploadRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
