const userService = require('../services/userService')

exports.signup = async (req, res) => {
  try {
    const user = await userService.signup(req.body)
    res.status(201).json({ message: 'Signup successful', user })
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
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
    res.status(error.status || 500).json({ error: error.message })
  }
}

exports.info = async (req, res) => {
  try {
    // const user = req.user
    const user = await userService.getInfo(req.body)
    res.status(200).json(user)

    /* res.status(200).json({
      username: user.username,
      email: user.email,
      businesses: user.businesses || null,
      invoices: user.invoices || null
    }) */
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message })
  }
}
