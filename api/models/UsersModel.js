const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  businesses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: false
  }]
},
{
  timestamps: true
})

const Users = mongoose.model('Users', UserSchema)

module.exports = Users
