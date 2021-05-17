var express = require('express')

// 通过Router实现模块化，创建可以挂载的路由句柄
var router =  express.Router()

router.get('/', (req,res)=>{

    res.send('user 首页')

})

router.post('/add', (req, res)=>{

    res.send('显示增加用户页面')

})


module.exports = router