const mongoose = require('mongoose')

const invoiceSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: false
  },
  invoiceNo: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  productDetail: {
    type: String,
    required: true
  },
  productFee: {
    type: String,
    required: true
  },
  productGst: {
    type: String,
    required: true
  },
  productTotal: {
    type: String,
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: false
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: false
  },
  extraInfo: {
    type: String,
    required: false
  }
})
const Invoice = mongoose.model('Invoice', invoiceSchema)

module.exports = Invoice
