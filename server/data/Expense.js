const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let expenseSchema = new mongoose.Schema({
  user: {type: ObjectId, ref: 'User'},
  date: {type: Date, default: Date.now, required: REQUIRED_VALIDATION_MESSAGE},
  products: [{type: ObjectId, ref: 'Product'}],
  description: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
  isItAbsolutelyNeeded: {type: Boolean, required: REQUIRED_VALIDATION_MESSAGE},
  totalDayExpense: {type: String, required: REQUIRED_VALIDATION_MESSAGE}
})

expenseSchema.index({'$**': 'text'})
let Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense
