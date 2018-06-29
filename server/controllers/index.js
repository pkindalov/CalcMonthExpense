const home = require('./home-controller')
const users = require('./users-controller')
const products = require('./product-controller')
const expenses = require('./expense-controller')

module.exports = {
  home: home,
  users: users,
  products: products,
  expenses: expenses
}
