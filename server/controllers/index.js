const home = require('./home-controller')
const users = require('./users-controller')
const products = require('./product-controller')
const expenses = require('./expense-controller')
const categories = require('./category-controller')
const administration = require('./administration-controller')

module.exports = {
  home: home,
  users: users,
  products: products,
  expenses: expenses,
  categories: categories,
  administration: administration
}
