const mongoose = require('mongoose')

const invoiceSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  invoiceId: {
    type: String,
    required: true
  },
  invoiceXML: {
    type: String,
    required: true
  }
})
const InvoiceV2 = mongoose.model('InvoiceV2', invoiceSchema)

module.exports = InvoiceV2
