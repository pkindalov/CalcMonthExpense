const Category = require('../data/Category')
const User = require('../data/User')
const Expense = require('../data/Expense')

module.exports = {
  createCategoryGET: (req, res) => {
    res.render('categories/createCategory')
  },

  createCategoryPOST: (req, res) => {
    let reqBody = req.body
    let categoryAuthor = req.user.id
    let categoryName = reqBody.name
    let categoryPicture = reqBody.picture

    if (!reqBody.picture) {
      categoryPicture = 'No image uploaded for this category'
    }

    Category
        .create({
          name: categoryName,
          picture: categoryPicture,
          author: categoryAuthor,
          expenses: []
        }).then(newCategory => {
          User
                .findById(categoryAuthor)
                .then(user => {
                  user.categories.push(newCategory._id)
                  user.save()
                })

          res.redirect('/createExpense')
        })
  },

  addCategoryToExpense: (req, res) => {
    let expenseId = req.query.id
    let reqBody = req.body
    let categoryToAddID = reqBody.category
    let url = '/expenseDetails?id=' + expenseId

    Expense
      .findById(expenseId)
      .then(expense => {
        let ifThisCategoryAlreadyAdded = expense.categories.indexOf(categoryToAddID)
        if (ifThisCategoryAlreadyAdded < 0) {
          expense.categories.push(categoryToAddID)
          expense.save()
          res.redirect(url)
        } else {
          // console.log('we are here')
          let error = 'This category is already added to this expense'
          res.render('home/index', {
            globalError: error
          })
        }
      })
  },

  removeCategoryFromExpense: (req, res) => {
    let expenseId = req.query.id
    let reqBody = req.body
    let categoryForRemoving = reqBody.category
    let url = '/expenseDetails?id=' + expenseId

    Expense
      .findById(expenseId)
      .then(expense => {
        let findPosCat = expense.categories.indexOf(categoryForRemoving)
        expense.categories.splice(findPosCat, 1)
        expense.save()
      })

    res.redirect(url)
  }
}
