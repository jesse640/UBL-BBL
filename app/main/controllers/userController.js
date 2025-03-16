const userService = require('../services/userService')
const User = require('../models/UsersModel')

exports.signup = async (req, res) => {
  try {
    const user = await userService.signup(req.body)
    res.status(201).json({ message: 'Signup successful', user })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const token = await userService.login(req.body)
    res.cookie('token', token, {
      httpOnly: true
    })
    res.status(200).json({ message: 'Login successful' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// helper function to get user info from token
const getUserFromToken = async (req, res) => {
  try {
    const userId = req.user.userId
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    const user = await User.findById(userId)

    return user
  } catch (error) {
    res.status(400).json({ error: error.message })
    return null
  }
}

exports.getInfo = async (req, res) => {
  try {
    const user = await getUserFromToken(req, res)
    if (!user) return

    res.status(200).json({
      username: user.username,
      email: user.email,
      businesses: user.businesses || null,
      invoices: user.invoices || null
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.putInfo = async (req, res) => {
  try {
    const user = await User.getUserFromToken(req, res)

    const userData = { email: user.email, ...req.body }
    const token = await userService.putInfo(userData)
    res.cookie('token', token, {
      httpOnly: true
    })
    res.status(200).json({ message: 'Successfully updated user info' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.postSignOut = async (req, res) => {
  try {
    const userId = req.user.userId
    if (!userId) return res.status(401).json({ message: 'Unauthorised' })

    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10),
      httpOnly: true
    })
    res.status(200).json({ message: 'Logged out' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
