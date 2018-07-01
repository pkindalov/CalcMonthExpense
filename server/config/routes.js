const controllers = require('../controllers')
const auth = require('../config/auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)
  app.get('/about', auth.isAuthenticated, controllers.home.about)

  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', controllers.users.logout)
  app.get('/users', auth.isAuthenticated, controllers.users.getUserProfile)

  app.get('/createProduct', auth.isAuthenticated, controllers.products.createProductGET)
  app.post('/createProduct', auth.isAuthenticated, controllers.products.createProductPOST)
  app.post('/removeProductForExpense', auth.isAuthenticated, controllers.products.removeProductFromExpense)
  app.get('/selectProductForEdit', auth.isAuthenticated, controllers.products.selectProductForEdit)
  app.get('/editProduct', auth.isAuthenticated, controllers.products.editProductGET)
  app.post('/editProduct', auth.isAuthenticated, controllers.products.editProductPOST)
  app.post('/addProductToExpense', auth.isAuthenticated, controllers.products.addProductToExpense)
  app.get('/deleteProduct', auth.isAuthenticated, controllers.products.deleteProductByIdGET)

  app.get('/createExpense', auth.isAuthenticated, controllers.expenses.createExpenseGET)
  app.post('/createExpense', auth.isAuthenticated, controllers.expenses.createExpensePOST)
  app.get('/getExpensesPeriod', auth.isAuthenticated, controllers.expenses.getExpensesFromDateToDateGET)
  app.get('/searchExpenses', auth.isAuthenticated, controllers.expenses.getExpensesFromPeriodGET)
  app.get('/expenseForDay', auth.isAuthenticated, controllers.expenses.getExpenseOnDate)
  app.get('/expenseDetails', auth.isAuthenticated, controllers.expenses.expenseDetailsById)
  app.get('/seeAllExpenses', auth.isAuthenticated, controllers.expenses.seeAllExpenses)
  app.get('/thisMonthBalance', auth.isAuthenticated, controllers.expenses.thisMonthExpenses)
  app.get('/editExpense', auth.isAuthenticated, controllers.expenses.editExpenseByIdGET)
  app.post('/editExpense', auth.isAuthenticated, controllers.expenses.editExpenseByIdPOST)
  app.get('/deleteExpense', auth.isAuthenticated, controllers.expenses.deleteExpenseByIdGET)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not found')
    res.end()
  })
}
