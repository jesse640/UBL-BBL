const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const tokenController = require('../controllers/tokenAuth')

// Define routes
router.post('/signup', userController.signup)
router.post('/login', userController.login)
router.get('/info', tokenController.tokenAuth, userController.getInfo)
router.put('/info', tokenController.tokenAuth, userController.putInfo)
router.post('/signout', tokenController.tokenAuth, userController.postSignOut)

module.exports = router
