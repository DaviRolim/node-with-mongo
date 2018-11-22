const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db

const startDB = async callback => {
    try {
        const client = await MongoClient.connect('mongodb+srv://davirolim:davi1234@cluster0-mkoaq.mongodb.net/shop?retryWrites=true')
        _db = client.db()
        callback()
    } catch (error) {
        console.log(error);
    }
}

const getDb = () => {
    if (_db) {
        return _db
    }
    throw 'No database found!'
}

module.exports = {
    startDB,
    getDb
}