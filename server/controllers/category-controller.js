const Category = require('../data/Category')
const User = require('../data/User')

module.exports = {
  createCategoryGET: (req, res) => {
    res.render('categories/createCategory')
  },

  createCategoryPOST: (req, res) => {
    let reqBody = req.body
    let categoryAuthor = req.user.id
    let categoryName = reqBody.name
    let categoryPicture = reqBody.picture

    if (!reqBody.picture) {
      categoryPicture = 'No image uploaded for this category'
    }

    Category
        .create({
          name: categoryName,
          picture: categoryPicture,
          author: categoryAuthor,
          expenses: []
        }).then(newCategory => {
          User
                .findById(categoryAuthor)
                .then(user => {
                  user.categories.push(newCategory._id)
                  user.save()
                })

          res.redirect('/createExpense')
        })
  }
}
