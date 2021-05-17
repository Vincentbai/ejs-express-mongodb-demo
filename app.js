var express = require('express')

var app = new express()

// 使用session来保存用户信息
var session = require('express-session')

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000*60*60,
    },
    rolling: true, // 如果用户还在操作，自动更新过期时间
}))

// 引入router模块
var admin = require('./routers/admin')

var index = require('./routers/index')

// 使用ejs模板引擎
app.set('view engine', 'ejs')

// 配置public目录为静态web服务
app.use(express.static('public'))

app.use('/uploads', express.static('uploads'))

app.use('/admin', admin)

app.use('/', index)

app.listen(5002, '127.0.0.1')