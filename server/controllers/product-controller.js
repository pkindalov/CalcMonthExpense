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
    let productAuthor = req.user.id

    Product
        .create({
          author: productAuthor,
          name: productName,
          price: productPrice,
          photo: productPhoto
        }).then(
            res.redirect('/')
        )
  }
}
