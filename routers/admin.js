var express = require('express')

var login = require('./admin/login')
var product = require('./admin/product')
var user = require('./admin/user')
var logout = require('./admin/logout')

// 通过Router实现模块化，创建可以挂载的路由句柄
var router =  express.Router()

// 自定义中间件，判断用户状态
router.use((req, res, next)=>{

    // 判断是否访问的是login和dologin 防止死循环
    if(req.url == '/login' || req.url == '/login/doLogin'){

        next()

    }else{

        if(req.session.userinfo && req.session.userinfo.username!= ''){

            // ejs中设置全局数据, 可以在任何模板中使用
            req.app.locals['userInfo'] = req.session.userinfo
            
            next()

        }else{
            res.redirect('/admin/login')
        }
    }
})

router.use('/login', login)

router.use('/logout', logout)

router.use('/product', product)

router.use('/user', user)


module.exports = router