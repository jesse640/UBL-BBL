require('dotenv').config()
const User = require('../models/UsersModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')

exports.signup = async (userData) => {
  const { username, email, password } = userData

  // Check for missing fields
  if (!username || !email || !password) throw createError(400, 'Missing fields')

  // check if email is valid
  if (!isValidEmail(email)) throw createError(400, 'Invalid email')

  // Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) throw createError(400, 'User already exists')

  // check valid password
  if (!isValidPassword(password)) {
    throw createError(
      400,
      'Password must be at least 8 characters long, include 1 uppercase, ' +
          '1 number, and 1 special character.'
    )
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create new user
  const user = await User.create({ username, email, password: hashedPassword })
  return user
}

exports.login = async (userData) => {
  const { email, password } = userData

  // Check if user exists
  const user = await User.findOne({ email })
  if (!user) throw createError(400, 'User doesn\'t exist')

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw createError(400, 'Incorrect password')

  // Generate token
  const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' })
  return token
}

exports.getInfo = async (userData) => {
  const { email } = userData
  // Check if user exists
  const user = await User.findOne({ email })
  if (!user) throw createError(400, 'User doesn\'t exist')
  return {
    username: user.username,
    email: user.email,
    businesses: user.businesses,
    invoices: user.invoices
  }
}

/// /////////////// HELPER FUNCTIONS //////////////////////////////////////

// Validates email using a regular expression
function isValidEmail (email) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailPattern.test(email)
}

// Validates password strength
function isValidPassword (password) {
  // Minimum length of 8 characters, at least one uppercase, one number, and one special character
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
  return passwordPattern.test(password)
}
