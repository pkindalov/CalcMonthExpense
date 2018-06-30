const Product = require('../data/Product')
const Expense = require('../data/Expense')

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
  },

  removeProductFromExpense: (req, res) => {
    let expenseId = req.query.id
    let reqBody = req.body
    let productId = reqBody.product
    let url = '/expenseDetails?id=' + expenseId

    Expense
      .findById(expenseId)
      .then(expense => {
        let productPos = expense.products.indexOf(productId)
        if (productPos > -1) {
          expense.products.splice(productPos, 1)
        }
        expense.save()

        res.redirect(url)
      })
  },

  selectProductForEdit: (req, res) => {
    let author = req.user.id

    Product
        .find({'author': author})
        .then(products => {
          // console.log(products)
          res.render('products/selectProductForEdit', {
            products: products
          })
        })
  },

  editProductGET: (req, res) => {
    let productId = req.query.product

    Product
      .findById(productId)
      .then(product => {
        res.render('products/editProduct', {
          product: product
        })
      })
  },

  editProductPOST: (req, res) => {
    let productId = req.query.product
    let reqBody = req.body
    let editedName = reqBody.name
    let editedPrice = reqBody.price
    let editedPhoto = reqBody.photo

    Product
      .findById(productId)
      .then(product => {
        product.name = editedName
        product.price = editedPrice
        product.photo = editedPhoto
        product.save()

        res.redirect('/selectProductForEdit')
      })
  }
}
