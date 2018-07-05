const Expense = require('../data/Expense')
const Product = require('../data/Product')
const User = require('../data/User')
const Category = require('../data/Category')
const dateHelpers = require('../utilities/dateHelpers')

module.exports = {
  createExpenseGET: (req, res) => {
    let currentUser = req.user.id
    let todayDate = dateHelpers.getTodayDateWithoutTime(new Date())

    Product
      .find({'author': currentUser})
      .then(products => {
        Category
          .find({'author': currentUser})
          .then(categories => {
            res.render('expenses/createExpenses', {
              products: products,
              availableProducts: products.length > 0,
              availableCategories: categories.length > 0,
              categories: categories,
              noAvailable: products.length === 0,
              todayDate: todayDate
            })
          })
      })
  },

  createExpensePOST: (req, res) => {
    let reqBody = req.body
    let expenseMadedOn = reqBody.date
    let convertedDate = new Date(expenseMadedOn)
    let expenseDescription = reqBody.description
    let needed = (reqBody.needed === 'true')
    let authorOfExpense = req.user.id
    let expenseProduct = reqBody.product
    let expenseExists = false
    let todayDate = dateHelpers.getTodayDateWithoutTime(new Date())
    let category = reqBody.category

    Expense
      .find({'date': convertedDate})
      .then(foundExpense => {
        if (foundExpense.length > 0) {
          expenseExists = true
          res.render('expenses/createExpenses', {
            expenseExists: expenseExists,
            errorDescription: 'You have created expense note for this date.  You can edit the old one, or delete current for creating new',
            todayDate: todayDate

          })
        } else {
          // if (category === 'noavailable') {
          //   res.render('expenses/createExpenses', {
          //     expenseExists: expenseExists,
          //     errorDescription: 'You must create a category. Just follow the link bellow',
          //     todayDate: todayDate

          //   })

          //   return
          // }

          Category
            .find({'author': authorOfExpense})
            .then(categories => {
              if (categories.length === 0) {
                res.render('expenses/createExpenses', {
                  expenseExists: expenseExists,
                  errorDescription: 'You must create a category. Just follow the link bellow',
                  todayDate: todayDate
                })

                return
              }

              Product
                .findById(expenseProduct)
                .then(firstProduct => {
                  Expense
                    .create({
                      user: authorOfExpense,
                      date: convertedDate,
                      products: expenseProduct,
                      description: expenseDescription,
                      isItAbsolutelyNeeded: needed,
                      todayDate: todayDate,
                      totalDayExpense: firstProduct.price

                    })
                    .then(expense => {
                      Product
                          .findById(expenseProduct)
                          .then(product => {
                            product.expenses.push(expense._id)
                            product.save()

                            User
                              .findById(authorOfExpense)
                              .then(user => {
                                let ifThisExpensetExists = user.expenses.indexOf(expense._id)

                                if (ifThisExpensetExists < 0) {
                                  user.expenses.push(expense._id)
                                  user.save()
                                } else {
                                  res.locals.globalError = 'This product already exists'
                                }

                                Category
                                    .findById(category)
                                    .then(category => {
                                      category.expenses.push(expense._id)
                                      category.save()
                                      let checkCategoryExists = expense.categories.indexOf(category._id)
                                      if (checkCategoryExists < 0) {
                                        expense.categories.push(category._id)
                                        expense.save()
                                      }
                                    })
                              })

                            res.redirect('/')
                          })
                    })
                })
            })
        }
      })
  },

  getExpensesFromDateToDateGET: (req, res) => {
    let today = dateHelpers.getTodayDateWithoutTime(new Date())
    let userId = req.user.id
    today = new Date(today)

    Expense
     .findOne({'user': userId, 'date': today})
     .then(todayExpense => {
       res.render('expenses/selectExpensesDates', {
         todayExpense: todayExpense
       })
     })
  },

  getExpensesFromPeriodGET: (req, res) => {
    if (!req.query.dateFrom) {
      res.locals.globalError = 'from date field cannot be empty'
      res.render('expenses/selectExpensesDates', {
        globalError: res.locals.globalError
      })
      return
    }

    if (!req.query.dateTo) {
      res.locals.globalError = 'end of period field cannot be empty'
      res.render('expenses/selectExpensesDates', {
        globalError: res.locals.globalError
      })
      return
    }

    let dateTo = new Date(req.query.dateTo)
    let dateFrom = new Date(req.query.dateFrom)
    let page = parseInt(req.query.page) || 1
    let pageSize = 10
    let formattedDate = ''
    let sortAsc = req.query.sortAsc
    // console.log(dateTo)

    if (sortAsc) {
      Expense
      .find({'date': {'$gte': dateFrom, '$lte': dateTo}})
      .sort('date')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then(expenses => {
        expenses.forEach(expense => {
          formattedDate = dateHelpers.getTodayDateWithoutTime(expense.date)
          expense.formattedDate = formattedDate
        })

        res.render('expenses/listExpenses', {
          expenses: expenses,
          dateTo: req.query.dateTo,
          dateFrom: req.query.dateFrom,
          hasPrevPage: page > 1,
          hasNextPage: expenses.length > 0,
          prevPage: page - 1,
          nextPage: page + 1
        })
      })
    } else {
      Expense
        .find({'date': {'$gte': dateFrom, '$lte': dateTo}})
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .then(expenses => {
          expenses.forEach(expense => {
            formattedDate = dateHelpers.getTodayDateWithoutTime(expense.date)
            expense.formattedDate = formattedDate
          })

          res.render('expenses/listExpenses', {
            expenses: expenses,
            dateTo: req.query.dateTo,
            dateFrom: req.query.dateFrom,
            hasPrevPage: page > 1,
            hasNextPage: expenses.length > 0,
            prevPage: page - 1,
            nextPage: page + 1
          })
        })
    }
  },

  getExpenseOnDate: (req, res) => {
    if (!req.query.date) {
      res.locals.globalError = 'Date field cannot be empty'
      res.render('expenses/selectExpensesDates', {
        globalError: res.locals.globalError
      })
      return
    }
    let date = new Date(req.query.date)

    Expense
      .findOne({'date': date})
      .populate('products')
      .then(expense => {
        // console.log(expense)
        res.render('expenses/oneDateExpense', {
          expense: expense
        })
      })
  },

  expenseDetailsById: (req, res) => {
    let expenseId = req.query.id
    let userId = req.user.id
    // let expenseSumForAllProducts = 0

    Expense
    .findById(expenseId)
    .populate('products')
    .populate('categories')
    .then(expense => {
      Product
          .find({'author': userId})
          .populate('products')
          .then(products => {
            // console.log(expense.categories)

            // expense.products.forEach(product => {
            //   let expense = Number(product.price)
            //   expenseSumForAllProducts += expense
            // })

            Category
              .find({'author': userId})
              .then(categories => {
                res.render('expenses/expenseDetails', {
                  expense: expense,
                  products: products,
                  availableProducts: products.length > 0,
                  availableCategories: categories.length > 0,
                  categories: categories
                  // totalExpense: expenseSumForAllProducts
                })
              })
          })
    })
  },

  seeAllExpenses: (req, res) => {
    let page = parseInt(req.query.page) || 1
    let pageSize = 10
    let formattedDate = ''
    let sortAsc = req.query.sortAsc

    if (sortAsc) {
      Expense
      .find({})
      .sort('date')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then(expenses => {
        for (let expense of expenses) {
          formattedDate = dateHelpers.getTodayDateWithoutTime(expense.date)
          expense.formattedDate = formattedDate
        }

        res.render('expenses/seeAllExpenses', {
          expenses: expenses,
          hasPrevPage: page > 1,
          hasNextPage: expenses.length > 0,
          prevPage: page - 1,
          nextPage: page + 1
        })
      })
    } else {
      Expense
        .find({})
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .then(expenses => {
          for (let expense of expenses) {
            formattedDate = dateHelpers.getTodayDateWithoutTime(expense.date)
            expense.formattedDate = formattedDate
          }

          res.render('expenses/seeAllExpenses', {
            expenses: expenses,
            hasPrevPage: page > 1,
            hasNextPage: expenses.length > 0,
            prevPage: page - 1,
            nextPage: page + 1
          })
        })
    }
  },

  thisMonthExpenses: (req, res) => {
    let startDate = dateHelpers.getThisMonthDateBegin(new Date())
    let endMonth = dateHelpers.getCurrentMonth(new Date())
    let totalExpenseSum = 0

    let startDateConv = new Date(startDate)
    let endMonthConv = new Date(endMonth)

    // let promises = []

    Expense
      .find({'date': {'$gte': startDateConv, '$lte': endMonthConv}})
      // .find({'date': {'$gte': new Date(startDate), '$lte': new Date(endMonth)}})
      // .populate('products')
      .then(expenses => {
        // for (let expense of expenses) {
        //   for (let productId of expense.products) {
        //     let promise = Product.findById(productId)
        //     promises.push(promise)
        //   }
        // }

        // Promise.all(promises)
        //                .then(data => {
        //                  for (let product of data) {
        //                    totalExpenseSum += Number(product.price)
        //                  }

        //                  res.render('expenses/thisMonthExpenses', {
        //                    expenses: expenses,
        //                    totalExpenseSum: totalExpenseSum,
        //                    startDate: startDate,
        //                    endMonth: endMonth
        //                  })
        //                })

        for (let expense of expenses) {
          totalExpenseSum += Number(expense.totalDayExpense)
        }

        res.render('expenses/thisMonthExpenses', {
          expenses: expenses,
          totalExpenseSum: totalExpenseSum,
          startDate: startDate,
          endMonth: endMonth
        })
      })
        // expenses.products.forEach(product => {
        //   totalExpenseSum += Number(product.price)
        // })

    // console.log(startDate)
    // console.log(endMonth)
  },

  editExpenseByIdGET: (req, res) => {
    let expenseId = req.query.id
    let dateFormatted = ''

    Expense
      .findById(expenseId)
      .populate('products')
      .then(expense => {
        dateFormatted = dateHelpers.getTodayDateWithoutTime(expense.date)

        res.render('expenses/editExpense', {
          expense: expense,
          dateFormatted: dateFormatted,
          availableProducts: expense.products.length > 0,
          products: expense.products
        })
      })
  },

  editExpenseByIdPOST: (req, res) => {
    let expenseId = req.query.id
    let reqBody = req.body

    let dateConv = new Date(reqBody.date)
    let editedDescription = reqBody.description
    let editedIsItAbsolutelyNeeded = reqBody.needed

    Expense
      .findById(expenseId)
      .then(expense => {
        expense.date = dateConv
        expense.description = editedDescription
        expense.isItAbsolutelyNeeded = editedIsItAbsolutelyNeeded
        expense.save()
        res.redirect('/editExpense?id=' + expenseId)
      })
  },

  deleteExpenseByIdGET: (req, res) => {
    let expenseId = req.query.id
    let user = req.user.id

    Expense
      .findById(expenseId)
      .populate('products')
      .populate('categories')
      .then(deletedExpense => {
        for (let product of deletedExpense.products) {
          let posOfExpenseId = product.expenses.indexOf(expenseId)

          if (posOfExpenseId > -1) {
            product.expenses.splice(posOfExpenseId, 1)
            product.save()
          }
        }

        for (let category of deletedExpense.categories) {
          Category
            .findById(category._id)
            .then(category => {
              let elPosToRemove = category.expenses.indexOf(expenseId)
              if (elPosToRemove > -1) {
                category.expenses.splice(elPosToRemove, 1)
                category.save()
              }
            })
        }

        User
        .findById(user)
        .then(user => {
          let expensePos = user.expenses.indexOf(deletedExpense._id)
          if (expensePos > -1) {
            user.expenses.splice(expensePos, 1)
            user.save()
          } else {
            res.locals.globalError = 'Not found such expense..'
          }
        })
      })

    Expense
        .findByIdAndRemove(expenseId)
        .then(delExpense => {
          res.redirect('/seeAllExpenses')
        })
  },

  searchExpenseByKeyword: (req, res) => {
    let keyword = req.query.keyword
    let formattedDate = ''
    let page = parseInt(req.query.page) || 1
    let pageSize = 15
    let sortAsc = req.query.sortAsc

    if (sortAsc) {
      Expense
      .find({$text: {$search: keyword}})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then(expenses => {
        expenses.forEach(expense => {
          formattedDate = dateHelpers.getTodayDateWithoutTime(expense.date)
          expense.formattedDate = formattedDate
        })

        res.render('expenses/searchExpenseByKeyword', {
          expenses: expenses,
          keyword: keyword,
          hasPrevPage: page > 1,
          hasNextPage: expenses.length > 0,
          prevPage: page - 1,
          nextPage: page + 1
        })
      })
    } else {
      Expense
        .find({$text: {$search: keyword}})
        .sort('-date')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .then(expenses => {
          expenses.forEach(expense => {
            formattedDate = dateHelpers.getTodayDateWithoutTime(expense.date)
            expense.formattedDate = formattedDate
          })

          res.render('expenses/searchExpenseByKeyword', {
            expenses: expenses,
            keyword: keyword,
            hasPrevPage: page > 1,
            hasNextPage: expenses.length > 0,
            prevPage: page - 1,
            nextPage: page + 1
          })
        })
    }
  }

}
