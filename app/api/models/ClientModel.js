const mongoose = require('mongoose')

const clientSchema = mongoose.Schema({
  recepientName: {
    type: String,
    required: true
  },
  recepientAbn: { // Should be max 11 integers when implementing
    type: String,
    required: false
  },
  recepientAddress: {
    type: String,
    required: false
  }
},
{
  timestamps: true
})
const Client = mongoose.model('Client', clientSchema)

module.exports = Client
