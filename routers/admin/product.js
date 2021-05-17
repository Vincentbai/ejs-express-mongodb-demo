var express = require('express')

var multiparty = require('multiparty')

var fs = require('fs')

// 通过Router实现模块化，创建可以挂载的路由句柄
var router =  express.Router()

var Db = require('../../modules/db.js')

router.get('/', (req,res)=>{

     Db.find('products', {}, (error,data)=>{

        if (error) return console.log(error)

        res.render('admin/product/index',{

            list:data

        });
    })

})

router.get('/add', (req, res)=>{

    res.render('admin/product/add');

})

router.post('/doAdd', (req, res)=>{

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

            res.redirect('/admin/product')

        })
    })

})

router.get('/edit', (req, res)=>{

    // 获取id
    var id = req.query.id;

    // 去数据库获取数据, 自增长的id 需要使用ObjectId来获取
    Db.find('products', {_id:new Db.ObjectId(id)}, (err, data)=>{

        res.render('admin/product/edit', {
            list: data[0]
        });

    })

})

router.post('/doEdit', (req, res)=>{

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

            res.redirect('/admin/product')

        })
    })

})

router.get('/delete', (req, res)=>{

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

        res.redirect('/admin/product');
    })
})


module.exports = router