const Expense = require('../data/Expense')
const Product = require('../data/Product')
const dateHelpers = require('../utilities/dateHelpers')

module.exports = {
  createExpenseGET: (req, res) => {
    let currentUser = req.user.id
    let todayDate = dateHelpers.getTodayDateWithoutTime(new Date())

    Product
      .find({'author': currentUser})
      .then(products => {
        res.render('expenses/createExpenses', {
          products: products,
          availableProducts: products.length > 0,
          noAvailable: products.length === 0,
          todayDate: todayDate
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

                        res.redirect('/')
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
    // console.log(dateTo)

    Expense
      .find({'date': {'$gte': dateFrom, '$lte': dateTo}})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then(expenses => {
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
    .then(expense => {
      Product
          .find({'author': userId})
          .populate('products')
          .then(products => {
            // console.log(products)

            // expense.products.forEach(product => {
            //   let expense = Number(product.price)
            //   expenseSumForAllProducts += expense
            // })

            res.render('expenses/expenseDetails', {
              expense: expense,
              products: products,
              availableProducts: products.length > 0
              // totalExpense: expenseSumForAllProducts
            })
          })
    })
  },

  seeAllExpenses: (req, res) => {
    let page = parseInt(req.query.page) || 1
    let pageSize = 10

    Expense
      .find({})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .then(expenses => {
        res.render('expenses/seeAllExpenses', {
          expenses: expenses,
          hasPrevPage: page > 1,
          hasNextPage: expenses.length > 0,
          prevPage: page - 1,
          nextPage: page + 1
        })
      })
  },

  thisMonthExpenses: (req, res) => {
    let startDate = dateHelpers.getThisMonthDateBegin(new Date())
    let endMonth = dateHelpers.getCurrentMonth(new Date())
    let totalExpenseSum = 0

    let startDateConv = new Date(startDate)
    let endMonthConv = new Date(endMonth)

    let promises = []

    Expense
      .find({'date': {'$gte': startDateConv, '$lte': endMonthConv}})
      // .find({'date': {'$gte': new Date(startDate), '$lte': new Date(endMonth)}})
      // .populate('products')
      .then(expenses => {
        for (let expense of expenses) {
          for (let productId of expense.products) {
            let promise = Product.findById(productId)
            promises.push(promise)
          }
          // Expense
          //     .findOne(expense._id)
          //     .populate('products')
          //     .then(result => {
          //       totalExpenseSum += Number(result.price)
          //     })
        }

        Promise.all(promises)
                       .then(data => {
                        //  console.log(data)
                         for (let product of data) {
                          //  console.log(product.price)
                           totalExpenseSum += Number(product.price)
                         }

                        //  console.log(totalExpenseSum)

                         res.render('expenses/thisMonthExpenses', {
                           expenses: expenses,
                           totalExpenseSum: totalExpenseSum,
                           startDate: startDate,
                           endMonth: endMonth
                         })
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
          dateFormatted: dateFormatted
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

    Expense
      .findByIdAndRemove(expenseId)
      .populate('products')
      .then(deletedExpense => {
        // console.log(deletedExpense.products)
        for (let product of deletedExpense.products) {
          let posOfExpenseId = product.expenses.indexOf(expenseId)
          if (posOfExpenseId > -1) {
            product.expenses.splice(posOfExpenseId, 1)
            product.save()
          }
        }
      })

    res.redirect('/seeAllExpenses')
  }

}
