const mongoose = require('mongoose')

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let productSchema = new mongoose.Schema({
  name: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
  price: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
  photo: {type: String, required: REQUIRED_VALIDATION_MESSAGE}
})

let Product = mongoose.model('Product', productSchema)

module.exports = Product
