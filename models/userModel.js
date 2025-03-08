const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      requried: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    }
    // ,
    // invoices: [
    //   {
    //     type: mongoose.Schema.Types.invoiceNo,
    //     ref: 'Invoice'
    //   }
    // ]
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', userSchema)

module.exports = User
