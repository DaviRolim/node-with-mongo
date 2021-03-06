const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  } catch (error) {
    
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const prodId = req.params.productId;
    const product = await Product.findById(prodId)
    if (!product) {
      return res.redirect('/')
    }
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const products =  await req.user.getCart()
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const product = await Product.findById(prodId)
    await req.user.addToCart(product)
    // const cart = await req.user.getCart()
    // const products = await cart.getProducts({where: { id: prodId } })
    // let product
    // if (products.length > 0) {
    //   product = products[0]
    // }
    // let newQuantity = 1
    // if (product) {
    //   const oldQuantity = await product.cartItem.quantity;
    //   newQuantity = oldQuantity + 1
    // }
    // const prod = await Product.findByPk(prodId)
    // await cart.addProduct(prod, { through: { quantity : newQuantity } })
    res.redirect('/cart')
    } catch (error) {
      console.log(error);
    }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    await req.user.deleteItemFromCart(prodId)
    res.redirect('/cart')
  } catch (error) {
    console.log(error);
  }
};

exports.getOrders = async (req, res, next) => {
  const orders = await req.user.getOrders()
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    orders
  });
};

exports.postOrder = async (req, res, next) => {
  await req.user.addOrder()
  res.redirect('/orders')
}