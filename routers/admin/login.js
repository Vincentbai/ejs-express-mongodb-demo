var express = require('express')

var md5 = require('md5-node')

var Db = require('../../modules/db.js')

// 通过Router实现模块化，创建可以挂载的路由句柄
var router =  express.Router()

// 设置解析post的中间件, 接受form表单提交的数据
router.use(express.urlencoded({extended: false}))

router.use(express.json())

router.get('/', (req,res)=>{

    res.render('admin/login');

})

router.post('/doLogin', (req, res)=>{

    // 1. 获取查询数据，对密码进行 md5 加密
    var username = req.body.username
    var password = md5(req.body.password)

    // 2. 连接数据库模块查询数据
    Db.find('users', {
        username: username,
        password: password,
    }, (error,data)=>{

        if (error) return console.log(error)

        if(data.length>0){

            console.log("login successfully")
            
            // 登录成功后要保存页面信息，使用session req.app 是在请求全局范围中
            req.session.userinfo = data[0]
            
            res.redirect('/admin/product')

        }else{
            console.log("login failure")
            res.send("<script>alert('Login failure!');location.href='/admin/login'</script>")
        }
    })
})

router.get('/logout',(req, res)=>{

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