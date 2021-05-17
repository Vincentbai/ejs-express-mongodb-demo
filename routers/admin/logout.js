var express = require('express')

var md5 = require('md5-node')

var Db = require('../../modules/db.js')

// 通过Router实现模块化，创建可以挂载的路由句柄
var router =  express.Router()

// 设置解析post的中间件, 接受form表单提交的数据
router.use(express.urlencoded({extended: false}))

router.use(express.json())

router.get('/',(req, res)=>{

    // 销毁session
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
        }else{
            res.redirect('/admin/login')
        }
    })
})

module.exports = router