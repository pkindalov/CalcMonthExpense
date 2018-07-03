const encryption = require('../utilities/encryption')
const User = require('mongoose').model('User')
const Expense = require('../data/Expense')
const Product = require('../data/Product')
const dateHelpers = require('../utilities/dateHelpers')
// const errorHandler = require('../utilities/error-handler')

module.exports = {
  registerGet: (req, res) => {
    res.render('users/register')
  },

  registerPost: (req, res) => {
    let reqUser = req.body

    // add validations
    // (if reqUser.username.length < 3)...

    let salt = encryption.generateSalt()
    let hashedPassword = encryption.generateHashedPassword(salt, reqUser.password)

    User.create({
      username: reqUser.username,
      firstName: reqUser.firstName,
      lastName: reqUser.lastName,
      salt: salt,
      hashedPass: hashedPassword
    }).then(user => {
      req.logIn(user, (err, user) => {
        if (err) {
          res.locals.globalError = err
          res.render('users/register', user)
        }

        res.redirect('/')
      })
    })
  },
  loginGet: (req, res) => {
    res.render('users/login')
  },

  loginPost: (req, res) => {
    let reqUser = req.body
    User
      .findOne({ username: reqUser.username }).then(user => {
        if (!user) {
          res.locals.globalError = 'Invalid user data'
          res.render('users/login')
          return
        }

        if (!user.authenticate(reqUser.password)) {
          res.locals.globalError = 'Invalid user data'
          res.render('users/login')
          return
        }

        req.logIn(user, (err, user) => {
          if (err) {
            res.locals.globalError = err
            res.render('users/login')
          }

          res.redirect('/')
        })
      })
  },

  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  },

  getUserProfile: (req, res) => {
    let userId = req.query.profile
    let formattedDate = ''

    Expense
      .find({'user': userId})
      .sort('-date')
      .limit(5)
      .then(expenses => {
        let today = dateHelpers.getTodayDateWithoutTime(new Date())
        today = new Date(today)

        expenses.forEach(expense => {
          formattedDate = dateHelpers.getTodayDateWithoutTime(expense.date)
          expense.formattedDate = formattedDate
        })

        Expense
          .findOne({'user': userId, 'date': today})
          .then(todayExpense => {
            // console.log(todayExpense)

            res.render('users/profile', {
              expenses: expenses,
              todayExpense: todayExpense,
              formattedDate: formattedDate
            })
          })
      })
  },

  userSettingsGET: (req, res) => {
    res.render('users/settings')
  },

  permRemUserAccount: (req, res) => {
    let user = req.user.id

    User
      .findByIdAndRemove(user)
      .then(user => {
        for (let product of user.products) {
          Product
              .findByIdAndRemove(product)
              .then(deletedProduct => {
                for (let expense of user.expenses) {
                  Expense
                      .findByIdAndRemove(expense)
                      .then(

                      )
                }
              })
        }
      })

    res.redirect('/')
  }
}
