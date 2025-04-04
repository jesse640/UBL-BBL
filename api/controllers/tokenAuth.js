const jwt = require('jsonwebtoken')

exports.tokenAuth = (req, res, next) => {
  const token = req.cookies.token // takes token out of cookie

  if (token == null) {
    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) // verifies token
    req.user = decoded
    next()
  } catch (error) {
    res.clearCookie('token')
    return res.status(403).json({ message: 'Invalid or expired token provided' })
  }
}
