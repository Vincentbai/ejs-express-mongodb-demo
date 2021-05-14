// 连接数据库
var MongoClient = require('mongodb').MongoClient

var ObjectId = require('mongodb').ObjectId

var url = "mongodb://127.0.0.1:27017"

var dbName = "product_manage"

let db

function  __connectDb(callback) {

    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client)=>{

        if (err) return console.log(err)

        callback(client)

    })
}

exports.ObjectId = ObjectId

// 数据库查找
exports.find = function (collectionName, json, callback) {

    __connectDb((client)=>{

        db = client.db(dbName)

        var result = db.collection(collectionName).find(json)

        result.toArray((err, data)=>{

            callback(err,data)

            client.close()
        })

    })
}

// 增加数据
exports.add = function (collectionName, json, callback) {

    __connectDb((client)=>{

        db = client.db(dbName)

        var result = db.collection(collectionName).insertOne(json, (error, data)=>{

            callback(error,data)

            client.close()
        })

    })
}

// 修改数据
exports.update = function (collectionName, orgJson, updateJson, callback) {

    __connectDb((client)=>{

        db = client.db(dbName)

        var result = db.collection(collectionName).updateOne(orgJson, {$set:updateJson},(error,data)=>{

            callback(error,data)

            client.close()
        })

    })
}

// 删除数据

exports.delete = function (collectionName, json, callback) {

    __connectDb((client)=>{

        db = client.db(dbName)

        var result = db.collection(collectionName).deleteOne(json, (error,data)=>{

            callback(error,data)
    
            client.close()
        })

    })
}
