var express = require('express')

var md5 = require('md5-node')

var fs = require('fs')

// 既可以实现获取表单数据，也可以实现上传图片
var multiparty = require('multiparty')

var Db = require('./modules/db.js')

var app = new express()

// 使用ejs模板引擎
app.set('view engine', 'ejs')

// 配置public目录为静态web服务
app.use(express.static('public'))

app.use('/uploads', express.static('uploads'))

// 设置解析post的中间件, 接受form表单提交的数据
app.use(express.urlencoded({extended: false}))

app.use(express.json())

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

// 自定义中间件，判断用户状态
app.use((req, res, next)=>{

    // 判断是否访问的是login和dologin 防止死循环
    if(req.url == '/login' || req.url == '/doLogin'){

        next()

    }else{

        if(req.session.userinfo && req.session.userinfo.username!= ''){

            // ejs中设置全局数据, 可以在任何模板中使用
            app.locals['userinfo'] = req.session.userinfo
            
            next()

        }else{
            res.redirect('/login')
        }
    }
})

// 设置路由
app.get('/', (req, res)=>{
    res.redirect('/product')
})

app.get('/login', (req, res)=>{
    res.render('login');
})

app.post('/doLogin', (req,res)=>{
    
    
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
            
            // 登录成功后要保存页面信息，使用session
            req.session.userinfo = data[0]
            
            res.redirect('/product')

        }else{
            console.log("login failure")
            res.send("<script>alert('Login failure!');location.href='/login'</script>")
        }

    })
})


app.get('/product', (req, res)=>{

    Db.find('products', {}, (error,data)=>{

        if (error) return console.log(error)

        res.render('product',{

            list:data

        });
    })


})

// 显示增加商品页面
app.get('/productAdd', (req, res)=>{

    res.render('productAdd');

})

app.post('/doProductAdd', (req,res)=>{

    // 获取表单提交过来的数据，以及post过来的图片
    var form = new multiparty.Form()

    form.uploadDir = 'uploads'

    form.parse(req, (err,fields, files)=>{
        
        var title = fields.title[0]
        var price = fields.price[0]
        var shipping = fields.shipping[0]
        var description = fields.description[0]

        var pic = files.pic[0].path

        Db.add('products',{
            title,
            price,
            shipping,
            description,
            pic,
        }, (error, data)=>{

            if(error) return console.log(error)

            res.redirect('/product')

        })
    })
})

app.get('/productEdit', (req, res)=>{

    // 获取id
    var id = req.query.id;

    // 去数据库获取数据, 自增长的id 需要使用ObjectId来获取
    Db.find('products', {_id:new Db.ObjectId(id)}, (err, data)=>{

        res.render('productEdit', {
            list: data[0]
        });

    })
})

app.post('/doProductEdit', (req, res)=>{

    var form = new multiparty.Form()

    form.uploadDir = 'uploads'

    form.parse(req, (err, fields, files)=>{

        var _id = fields._id[0]
        var title = fields.title[0]
        var price = fields.price[0]
        var shipping = fields.shipping[0]
        var description = fields.description[0]
        var pic = fields.pic[0]

        if(files.pic[0].originalFilename){
            
            pic = files.pic[0].path
            
        } else{
            
            fs.unlink(files.pic[0].path, (err, data)=>{

                if(err) return console.log(err)

            })
        }

        Db.update('products', {_id: new Db.ObjectId(_id)}, {

            title,
            price,
            shipping,
            description,
            pic,

        }, (error, data)=>{

            if(error) return console.log(error)

            res.redirect('/product')

        })
    })
})

app.get('/productDelete', (req, res)=>{

    var id = req.query.id

    // delete the uploaded img
    Db.find('products', {_id: new Db.ObjectId(id)}, (error,data)=>{
        
        if(error) return console.log(error)

        if(data[0].pic){

            fs.unlink(data[0].pic,(err, data)=>{
                if(err) return console.log(err)
            })
        }
    })

    // delete the product record
    Db.delete('products', {_id: new Db.ObjectId(id)}, (error, data)=>{

        if(error) return console.log(error)

        res.redirect('/product');
    })

})

app.get('/logout',(req, res)=>{

    // 销毁session
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
        }else{
            res.redirect('/login')
        }
    })

})

app.listen(5002, '127.0.0.1')
