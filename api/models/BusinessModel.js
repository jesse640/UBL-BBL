const mongoose = require('mongoose')

const businessSchema = mongoose.Schema({
  busBsb: {
    type: String,
    required: false
  },
  busAccNo: {
    type: String,
    required: false
  },
  busAccName: {
    type: String,
    required: false
  },
  busReference: {
    type: String,
    required: false
  },
  busBpay: {
    type: String,
    required: false
  },
  busName: {
    type: String,
    required: true
  },
  busAbn: {
    type: String,
    required: false
  }
},
{
  timestamps: true
})
const Business = mongoose.model('Business', businessSchema)

module.exports = Business
