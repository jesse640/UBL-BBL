const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const tokenController = require('../controllers/tokenController')

// Define routes
router.post('/signup', userController.signup)
router.post('/login', userController.login)
router.get('/info', tokenController.tokenAuth, userController.info)

module.exports = router
