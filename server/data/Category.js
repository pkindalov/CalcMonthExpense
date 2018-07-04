const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let categorySchema = new mongoose.Schema({
  name: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
  picture: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
  author: {type: ObjectId, ref: 'User'},
  expenses: [{type: ObjectId, ref: 'Expense'}]

})

let Category = mongoose.model('Category', categorySchema)

module.exports = Category
