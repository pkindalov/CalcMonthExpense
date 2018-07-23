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
  app.get('/settings', auth.isAuthenticated, controllers.users.userSettingsGET)
  app.get('/permRemoveAccount', auth.isAuthenticated, controllers.users.permRemUserAccount)

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
  
  app.get('/expenseDetailsByIdAjax', auth.isAuthenticated, controllers.expenses.expenseDetailsByIdAjax)

  app.get('/seeAllExpenses', auth.isAuthenticated, controllers.expenses.seeAllExpenses)
  app.get('/thisMonthBalance', auth.isAuthenticated, controllers.expenses.thisMonthExpenses)
  app.get('/getThisMonthBalanceAjax', auth.isAuthenticated, controllers.expenses.getThisMonthBalanceAjax)
  app.get('/editExpense', auth.isAuthenticated, controllers.expenses.editExpenseByIdGET)
  app.post('/editExpense', auth.isAuthenticated, controllers.expenses.editExpenseByIdPOST)
  app.get('/deleteExpense', auth.isAuthenticated, controllers.expenses.deleteExpenseByIdGET)
  app.get('/findExpByKeyword', auth.isAuthenticated, controllers.expenses.searchExpenseByKeyword)
  app.get('/deleteExpensesByPeriod', auth.isAuthenticated, controllers.expenses.deleteExpensesByAPeriod)
  app.post('/deleteExpensesByPeriod', auth.isAuthenticated, controllers.expenses.deleteExpensesByAPeriodPOST)
  app.get('/deleteExpensesFrom', auth.isAuthenticated, controllers.expenses.deleteAllExpensesFromDateToNow)
  app.post('/deleteExpensesFrom', auth.isAuthenticated, controllers.expenses.deleteAllExpensesFromDateToNowPOST)
  app.get('/deleteExpensesCurrentDateToPast', auth.isAuthenticated, controllers.expenses.deleteAllExpensesFromNowToAllPast)
  app.post('/deleteExpensesCurrentDateToPast', auth.isAuthenticated, controllers.expenses.deleteAllExpensesFromNowToAllPastPOST)

  app.get('/showExpensesWithCategory', auth.isAuthenticated, controllers.categories.showExpensesByCategory)

  app.get('/createCategory', auth.isAuthenticated, controllers.categories.createCategoryGET)
  app.post('/createCategory', auth.isAuthenticated, controllers.categories.createCategoryPOST)
  app.post('/addCategoryToExpense', auth.isAuthenticated, controllers.categories.addCategoryToExpense)
  app.post('/removeCategoryForExpense', auth.isAuthenticated, controllers.categories.removeCategoryFromExpense)
  app.get('/selectCategoryForEdit', auth.isAuthenticated, controllers.categories.selectCategoryForEdit)
  app.get('/editCategory', auth.isAuthenticated, controllers.categories.editCategoryGET)
  app.post('/editCategory', auth.isAuthenticated, controllers.categories.editCategoryPOST)
  app.post('/deleteCategory', auth.isAuthenticated, controllers.categories.deleteCategory)

  //admininistration routes
  app.get('/administration', auth.isInRole('Admin'), controllers.administration.administrationGET)
  app.get('/administrationAJAX', auth.isInRole('Admin'), controllers.administration.administrationAJAX)
  app.get('/showAllAdmins', auth.isInRole('Admin'), controllers.administration.showAdminUsersAJAX)
  app.get('/listUsersNotAdmins', auth.isInRole('Admin'), controllers.administration.listAllUsersNotAdmins)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not found')
    res.end()
  })
}
