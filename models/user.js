const mongodb = require('mongodb')
const {getDb} = require('../util/database')

const ObjectId = mongodb.ObjectId

class User {
  constructor(username, email, cart, id) {
    this.name = username
    this.email = email
    this.cart = cart
    this._id = new ObjectId(id)
  }

  async save() {
    const db = getDb()
    try {
      await db.collection('users').insertOne(this)
    } catch (error) {
      console.log(error);
    }
  }

  async addToCart(product) {
    const db = getDb()
    try {
      const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString())
      let newQuantity = 1
      const updatedCartItems = [...this.cart.items]

      if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1
        updatedCartItems[cartProductIndex].quantity = newQuantity
      } else {
        updatedCartItems.push({productId: new ObjectId(product._id), quantity: newQuantity})
      }
      const updatedCart = {items: updatedCartItems}
      await db.collection('users').updateOne(
        {_id: this._id},
        {$set: {cart: updatedCart} }
      )
    } catch (error) {
      console.log(error);
    }
  }

  async getCart() {
    const db = getDb()
    const productsIds = this.cart.items.map(i => i.productId)
    const products = await db.collection('products').find({_id: {$in: productsIds}}).toArray()
    return products.map(p => {
      return {...p, quantity: this.cart.items.find(i => {
        return i.productId.toString() === p._id.toString()
      }).quantity}
    })
  }

  async addOrder() {
    const db = getDb()
    try {
      const cartProducts = await this.getCart()
      const order = {
        items: cartProducts,
        user: {
          _id: this._id,
          name: this.name
        }
      }
      await db.collection('orders').insertOne(order)
      this.cart = {items: []}
      await db.collection('users').updateOne(
        {_id: this._id},
        {$set: {cart: {items: [] } } }
      ) 
    } catch (error) {
      console.log(error);
    }

  }

  async getOrders() {
    const db = getDb()
    const orders = await db.collection('orders').find({'user._id': this._id}).toArray()
    return orders
  }

  async deleteItemFromCart(id) {
    const db = getDb()
    try {
      const updatedCartItems = this.cart.items.filter(i => {
        return i.productId.toString() !== id.toString()
      })
      await db.collection('users').updateOne(
        {_id: this._id},
        {$set: {cart: {items: updatedCartItems}} }
      )
    } catch (error) {
      console.log(error);
    }
  }

  static async findById(id) {
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