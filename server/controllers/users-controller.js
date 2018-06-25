const encryption = require('../utilities/encryption')
const User = require('mongoose').model('User')
// const Thread = require('mongoose').model('Thread')
const errorHandler = require('../utilities/error-handler')

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

  getUserProfil: (req, res) => {
    // let userName = req.params.username
    let id = req.user.id
    let pageSize = 2
    let page = parseInt(req.query.page) || 1
    // console.log(id)

    // Thread
    //           .find({'author': ObjectId('id')})
    //           .then(thread => {
    //             console.log(thread)
    //             User
    //                     .findById(id)
    //                     .then(user => {
    //                       res.render('users/profil', {
    //                         thread: thread,
    //                         user: user
    //                       })
    //                     })
    //           })

    User
          .findById(id)
          .then(user => {
            Thread
                        .find({'author': id})
                        .sort({'date': -1})
                        .populate('answers')
                        .skip((page - 1) * pageSize)
                        .limit(pageSize)
                        // .populate('answers')
                        .then(thread => {
                          // console.log(thread)
                          res.render('users/profil', {
                            thread: thread,
                            user: user,
                            hasPrev: page > 1,
                            hasNext: thread.length > 0,
                            nextPage: page + 1,
                            prevPage: page - 1
                          })
                        })
          })
          .catch(err => {
            let errMessage = errorHandler.handleMongooseError(err)
            console.log(errMessage)
          })

    // User
    //       .find({'username': userName})
    //       .then(user => {
    //         res.render('users/profil', {
    //           user: user
    //         })
    //       })
    //       .catch(err => {
    //         let errMessage = errorHandler.handleMongooseError(err)
    //         console.log(errMessage)
    //       })
  }
}
