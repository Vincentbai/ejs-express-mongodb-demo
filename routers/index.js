var express = require('express')

// 通过Router实现模块化，创建可以挂载的路由句柄
var router =  express.Router()

router.get('/', (req,res)=>{

    res.send('index')

})

router.get('/user', (req, res)=>{

    res.send('user')

})

router.get('/product', (req, res)=>{

    res.send('product 页面')

})

module.exports = router