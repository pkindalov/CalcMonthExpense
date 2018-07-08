const Category = require('../data/Category')
const User = require('../data/User')
const Expense = require('../data/Expense')
const dateHelpers = require('../utilities/dateHelpers')

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

          Category
          .findById(categoryToAddID)
          .then(category => {
            let ifThisExpenseAlreadyAdded = category.expenses.indexOf(expenseId)
            if (ifThisExpenseAlreadyAdded < 0) {
              category.expenses.push(expenseId)
              category.save()
            }
          })

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
        if (expense) {
          let findPosCat = expense.categories.indexOf(categoryForRemoving)
          expense.categories.splice(findPosCat, 1)
          expense.save()
        }

        Category
          .findById(categoryForRemoving)
          .then(category => {
            if (category) {
              let pos = category.expenses.indexOf(expenseId)
              category.expenses.splice(pos, 1)
              category.save()
            }
          })
      })

    res.redirect(url)
  },

  selectCategoryForEdit: (req, res) => {
    let categoryAuthor = req.user.id

    Category
      .find({'author': categoryAuthor})
      .then(categories => {
        res.render('categories/selectCategoryForEdit', {
          categories: categories
        })
      })
  },

  editCategoryGET: (req, res) => {
    let categoryId = req.query.category

    Category
      .findById(categoryId)
      .then(category => {
        res.render('categories/editCategory', {
          category: category
        })
      })
  },

  editCategoryPOST: (req, res) => {
    let categoryId = req.query.category
    let reqBody = req.body
    let editedName = reqBody.name
    let editedPicture = reqBody.picture

    Category
      .findById(categoryId)
      .then(category => {
        category.name = editedName
        category.picture = editedPicture
        category.save()

        res.redirect('/selectCategoryForEdit')
      })
  },

  deleteCategory: (req, res) => {
    let reqBody = req.body
    let categoryId = reqBody.category
    let userId = req.user.id

    User
      .findById(userId)
      .then(user => {
        let posOfDeletingCategory = user.categories.indexOf(categoryId)
        user.categories.splice(posOfDeletingCategory, 1)
        user.save()
      })

    Category
        .findByIdAndRemove(categoryId)
        .then(deletedCategory => {
          for (let expense of deletedCategory.expenses) {
            Expense
              .findById(expense)
              .then(expense => {
                let delCategoryPos = expense.categories.indexOf(categoryId)
                if (delCategoryPos > -1) {
                  expense.categories.splice(delCategoryPos, 1)
                  expense.save()
                }
              })
          }
        })
    res.redirect('/selectCategoryForEdit')
  },

  showExpensesByCategory: (req, res) => {
    let categoryName = req.query.name
    let user = req.user.id

    Category
      .find({'author': user, 'name': categoryName})
      .populate('expenses')
      .then(categories => {
        // console.log(categories)
        categories.forEach(category => {
          category.expenses.forEach(expense => {
            expense.formattedDate = dateHelpers.getTodayDateWithoutTime(expense.date)
          })
        })

        res.render('categories/listExpensesByCategoryName', {
          categories: categories
        })
      })
  }
}
