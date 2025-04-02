require('dotenv').config()
const User = require('../models/UsersModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.signup = async (userData) => {
  const { username, email, password } = userData

  // Check for missing fields
  if (!username || !email || !password) throw new Error('Missing fields')

  // check if email is valid
  if (!isValidEmail(email)) throw new Error('Invalid email')

  // Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) throw new Error('User already exists')

  const existingUsername = await User.findOne({ username })
  if (existingUsername) throw new Error('Username already exists')

  // check valid password
  if (!isValidPassword(password)) {
    throw new Error(
      'Password must be at least 8 characters long, include 1 uppercase, ' +
          '1 number, and 1 special character.'
    )
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create new user
  await User.create({ username, email, password: hashedPassword })
  return { username, email }
}

exports.login = async (userData) => {
  const { email, password } = userData

  // Check if user exists
  const user = await User.findOne({ email })
  if (!user) throw new Error('User doesn\'t exist')

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error('Incorrect password')

  // Generate token
  const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' })

  return token
}

exports.putInfo = async (userData) => {
  let { email, newusername, newemail, newpassword } = userData

  // checks if user exists
  const user = await User.findOne({ email })
  if (!user) throw new Error('User doesn\'t exist')

  if (newusername == null && newemail == null && newpassword == null) throw new Error('No user info changed')

  if (newusername != null) {
    // error checking
    if (user.username === newusername) throw new Error('New username should not be current username')

    const username = newusername
    const existingUsername = await User.findOne({ username })
    if (existingUsername) throw new Error('Username already exists')
    // updating username
    await User.updateOne({ email: user.email }, { $set: { username: newusername } })
  }

  if (newpassword != null) {
    // error checking
    const isMatch = await bcrypt.compare(newpassword, user.password)
    if (isMatch) throw new Error('New password should not be current password')

    if (!isValidPassword(newpassword)) {
      throw new Error(
        'Password must be at least 8 characters long, include 1 uppercase, ' +
            '1 number, and 1 special character.'
      )
    }
    // updating password
    const hashedPassword = await bcrypt.hash(newpassword, 10)
    await User.updateOne({ email: user.email }, { $set: { password: hashedPassword } })
  }

  if (newemail != null) {
    // error checking
    if (user.email === newemail) throw new Error('New email should not be current email')

    email = newemail
    const existingEmail = await User.findOne({ email })
    if (existingEmail) throw new Error('Email is already being used')

    if (!isValidEmail(newemail)) throw new Error('Invalid email')
    // updating uer
    await User.updateOne({ email: user.email }, { $set: { email: newemail } })
  }

  const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' })
  return token
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
