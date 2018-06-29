const Expense = require('../data/Expense')
const Product = require('../data/Product')
const dateHelpers = require('../utilities/dateHelpers')

module.exports = {
  createExpenseGET: (req, res) => {
    let currentUser = req.user.id

    Product
      .find({'author': currentUser})
      .then(products => {
        res.render('expenses/createExpenses', {
          products: products,
          availableProducts: products.length > 0,
          noAvailable: products.length === 0
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

    Expense
      .create({
        user: authorOfExpense,
        date: convertedDate,
        products: expenseProduct,
        description: expenseDescription,
        isItAbsolutelyNeeded: needed
      })
      .then(
        res.redirect('/')
      )
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

    Expense
    .findById(expenseId)
    .populate('products')
    .then(expense => {
      // console.log(expense)
      res.render('expenses/expenseDetails', {
        expense: expense
      })
    })
  }

}
