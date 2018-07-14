const Product = require('../data/Product')
const Expense = require('../data/Expense')
const Category = require('../data/Category')
const User = require('../data/User')

module.exports = {
  createProductGET: (req, res) => {
    let user = req.user.id

    Category
      .find({'author': user})
      .then(categories => {
        res.render('products/createProduct', {
          availableCategories: categories.length > 0,
          categories: categories
        })
      })
  },

  createProductPOST: (req, res) => {
    let reqBody = req.body

    let productName = reqBody.name
    let productPrice = reqBody.price
    let productPhoto = reqBody.photo
    let productAuthor = req.user.id
    let needed = (reqBody.needed === 'true')
    let productDescription = reqBody.description
    let productCategory = reqBody.category

    Category
      .find({'author': productAuthor})
      .then(categories => {
        if (categories.length === 0) {
          res.render('products/createProduct', {
            errorDescription: 'You must create a category. Just follow the link bellow'
          })
        } else {
          Product
              .create({
                author: productAuthor,
                name: productName,
                price: productPrice,
                photo: productPhoto,
                isItAbsolutelyNeeded: needed,
                description: productDescription,
                category: productCategory
              }).then(createdProduct => {
                User
                    .findById(productAuthor)
                    .then(productAuthor => {
                      let ifThisProductExists = productAuthor.products.indexOf(createdProduct._id)

                      if (ifThisProductExists < 0) {
                        productAuthor.products.push(createdProduct._id)
                        productAuthor.save()
                      } else {
                        res.locals.globalError = 'This product already exists'
                      }
                      res.redirect('/')
                    })
              })
        }
      })
  },

  addProductToExpense: (req, res) => {
    let reqBody = req.body
    let productId = reqBody.product
    let expenseId = req.query.id
    let count = Number(reqBody.count)
    let url = '/expenseDetails?id=' + expenseId

    Product
    .findById(productId)
    .then(product => {
      Expense
      .findById(expenseId)
      .then(expense => {
        product.expenses.push(expense._id)
        product.save()

        for (let n = 0; n < count; n++) {
          expense.products.push(productId)
        }

        // let dayExpense = Number(expense.totalDayExpense)
        // dayExpense += Number(product.price)
        // expense.totalDayExpense = '' + dayExpense
        expense.save()
      })
    })

    res.redirect(url)
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
        // expense.save()

        Product
          .findById(productId)
          .then(product => {
            let pos = product.expenses.indexOf(expense._id)
            if (pos > -1) {
              product.expenses.splice(pos, 1)
              product.save()
            }

            // let totalDayExpense = Number(expense.totalDayExpense)
            // totalDayExpense -= Number(product.price)

            // if (totalDayExpense < 0) {
            //   totalDayExpense = 0
            // }

            // expense.totalDayExpense = '' + totalDayExpense
            expense.save()
          })
      })
    res.redirect(url)
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
    let userId = req.user.id

    Category
      .find({'author': userId})
      .then(categories => {
        Product
          .findById(productId)
          .populate('category')
          .then(product => {
            // console.log(product)
            res.render('products/editProduct', {
              product: product,
              categories: categories,
              currentCategory: product.category.name
            })
          })
      })
  },

  editProductPOST: (req, res) => {
    let productId = req.query.product
    let reqBody = req.body
    let editedName = reqBody.name
    let editedPrice = reqBody.price
    let editedPhoto = reqBody.photo
    let editedNeeded = (reqBody.needed === 'true')
    let editedDescription = reqBody.description
    let editedCategory = reqBody.category

    if (editedDescription.length < 1) {
      let productId = req.query.product
      let userId = req.user.id
      let globalError = 'Description field cannot be empty'

      Category
        .find({'author': userId})
        .then(categories => {
          Product
            .findById(productId)
            .populate('category')
            .then(product => {
              // console.log(product)
              res.render('products/editProduct', {
                product: product,
                categories: categories,
                currentCategory: product.category.name,
                globalError: globalError
              })
            })
        })

        return
    }

    Product
      .findById(productId)
      .then(product => {
        product.name = editedName
        product.price = editedPrice
        product.photo = editedPhoto
        product.isItAbsolutelyNeeded = editedNeeded
        product.description = editedDescription
        product.category = editedCategory
        product.save()
      })
    res.redirect('/selectProductForEdit')
  },

  deleteProductByIdGET: (req, res) => {
    let productId = req.query.product
    let user = req.user.id

    Product
      .findByIdAndRemove(productId)
      // .findByIdAndRemove(productId)
      .populate('expenses')
      .then(deletedProduct => {
        let deletedProductId = deletedProduct._id

        for (let expense of deletedProduct.expenses) {
          if (expense.products.indexOf(deletedProductId) > -1) {
            let pos = expense.products.indexOf(deletedProductId)
            expense.products.splice(pos)
            expense.save()
          }
        }

        User
          .findById(user)
          .then(user => {
            let productPos = user.products.indexOf(deletedProduct._id)
            if (productPos > -1) {
              user.products.splice(productPos, 1)
              user.save()
            } else {
              res.locals.globalError = 'Not found such product..'
            }
          })
      })

    res.redirect('/')
  }
}
