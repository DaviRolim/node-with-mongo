const mongodb = require('mongodb')
const {getDb} = require('../util/database')

const ObjectId = mongodb.ObjectId

class User {
  constructor(username, email) {
    this.name = username
    this.email = email
  }

  async save() {
    const db = getDb()
    try {
      await db.collection('users').insertOne(this)
    } catch (error) {
      console.log(error);
    }
  }

  static findById(id) {
    const db = getDb()
    try {
      const user = await db.collection('users').findOne({_id: new ObjectId(id)})
      return user
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = User