const Product = require('../data/Product')

module.exports = {
  createProductGET: (req, res) => {
    res.render('products/createProduct')
  },

  createProductPOST: (req, res) => {
    let reqBody = req.body

    let productName = reqBody.name
    let productPrice = reqBody.price
    let productPhoto = reqBody.photo

    Product
        .create({
          name: productName,
          price: productPrice,
          photo: productPhoto
        }).then(
            res.redirect('/')
        )
  }
}
