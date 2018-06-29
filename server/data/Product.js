const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let productSchema = new mongoose.Schema({
  author: {type: ObjectId, ref: 'User'},
  name: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
  price: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
  photo: {type: String, required: REQUIRED_VALIDATION_MESSAGE}
})

let Product = mongoose.model('Product', productSchema)

module.exports = Product
