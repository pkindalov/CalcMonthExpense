const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let productSchema = new mongoose.Schema({
  author: {type: ObjectId, ref: 'User'},
  expenses: [{type: ObjectId, ref: 'Expense'}],
  name: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
  price: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
  photo: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
  
  description: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
  isItAbsolutelyNeeded: {type: Boolean, required: REQUIRED_VALIDATION_MESSAGE},
  category: {type: ObjectId, ref: 'Category'}
})

let Product = mongoose.model('Product', productSchema)

module.exports = Product
