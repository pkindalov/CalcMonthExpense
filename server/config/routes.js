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

  app.get('/createProduct', auth.isAuthenticated, controllers.products.createProductGET)
  app.post('/createProduct', auth.isAuthenticated, controllers.products.createProductPOST)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not found')
    res.end()
  })
}
